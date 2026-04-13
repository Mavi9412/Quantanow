const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 8080;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many demo requests. Please try again in a minute.' }
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Serve static site files from the project root
app.use(express.static(path.join(__dirname, '..')));

// Sanitize user input
const clean = (str) => String(str || '').replace(/[<>"'\/\\]/g, '').slice(0, 300);

app.get('/api', (_req, res) => {
  res.json({ status: 'ok', message: 'QuantaNow AI Agent Backend is running' });
});

// POST /api/start-demo — returns ElevenLabs signed URL + prompt overrides
app.post(['/api/start-demo', '/start-demo'], limiter, async (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /api/start-demo`);
  try {
    const AGENT_ID = process.env.AGENT_ID;
    const API_KEY  = process.env.ELEVENLABS_API_KEY;

    if (!AGENT_ID || !API_KEY) {
      console.error('Missing AGENT_ID or ELEVENLABS_API_KEY');
      return res.status(500).json({ error: 'Server configuration error: missing API credentials' });
    }

    const shop_name     = clean(req.body.shop_name);
    const business_type = clean(req.body.business_type);
    const purpose       = clean(req.body.purpose);

    if (!shop_name || !business_type || !purpose) {
      return res.status(400).json({ error: 'Business name, type, and purpose are required.' });
    }

    const tone         = clean(req.body.tone)         || 'friendly';
    const opening_line = clean(req.body.opening_line) || `Welcome to ${shop_name}! How can I help you today?`;

    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      { method: 'GET', headers: { 'xi-api-key': API_KEY } }
    );

    if (!signedUrlResponse.ok) {
      const err = await signedUrlResponse.json().catch(() => ({}));
      console.error('ElevenLabs error:', err);
      return res.status(signedUrlResponse.status).json({ error: 'Failed to get signed URL', details: err });
    }

    const { signed_url } = await signedUrlResponse.json();

    res.json({
      signed_url,
      overrides: {
        agent: {
          prompt: {
            prompt: `You are an AI voice assistant for ${shop_name}.
Business type: ${business_type}.
Main purpose: ${purpose}.
Speak in a ${tone} tone.
Rules:
- Keep the entire conversation under 60 seconds
- Speak clearly — this is a voice call, not text
- Stay focused on what ${shop_name} offers
- Be concise and natural sounding
- Do not make up information not given to you`
          },
          firstMessage: opening_line
        }
      }
    });

  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback: serve specific .html files or index.html for unmatched routes
app.get('*', (req, res) => {
  // 1. Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  // 2. Determine target file (e.g., /services -> services.html)
  const cleanPath = req.path === '/' ? 'index.html' : req.path;
  const filePath = cleanPath.endsWith('.html') ? cleanPath : `${cleanPath}.html`;
  const absolutePath = path.join(__dirname, '..', filePath);

  // 3. Try to send the file, fallback to index.html if it doesn't exist
  res.sendFile(absolutePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, '..', 'index.html'));
    }
  });
});

// App Hosting (Cloud Run) requires the app to start its own server and listen on PORT
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  ✅ QuantaNow AI Agent backend running on port ${PORT}
  🚀 Mode: STANDALONE (App Hosting)
    `);
});
