const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load .env only in local dev (App Hosting injects env vars automatically)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Serve static site files from the project root
app.use(express.static(path.join(__dirname, '..')));

// Sanitize user input
const clean = (str) => String(str || '').replace(/[<>"'\/\\]/g, '').slice(0, 300);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many demo requests. Please try again in a minute.' }
});

// Health check
app.get('/api', (_req, res) => {
  res.json({ status: 'ok', message: 'QuantaNow AI Agent Backend is running' });
});

// POST /api/start-demo — returns ElevenLabs signed URL + prompt overrides
app.post('/api/start-demo', limiter, async (req, res) => {
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

// GET /api/summary/:conversationId — returns transcript summary from ElevenLabs
app.get('/api/summary/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  const API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: missing API key' });
  }

  console.log(`[${new Date().toISOString()}] GET /api/summary/${conversationId}`);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
      { method: 'GET', headers: { 'xi-api-key': API_KEY } }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: 'Failed to fetch summary', details: err });
    }

    const data = await response.json();
    
    // ElevenLabs provides the summary in the 'analysis' object
    const summary = data.analysis?.transcript_summary || 'No summary available for this call.';
    
    res.json({ conversationId, summary });

  } catch (error) {
    console.error('Summary fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch call summary' });
  }
});

// Fallback: serve HTML pages by name, or index.html
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const cleanPath = req.path === '/' ? 'index.html' : req.path;
  const filePath = cleanPath.endsWith('.html') ? cleanPath : `${cleanPath}.html`;
  const absolutePath = path.join(__dirname, '..', filePath);
  res.sendFile(absolutePath, (err) => {
    if (err) res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
});

// Start server — required by Cloud Run / App Hosting
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ QuantaNow backend running on port ${PORT}`);
});
