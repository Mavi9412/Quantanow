const express = require('express');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Declare secrets for Firebase Secret Manager access
const ELEVENLABS_API_KEY_SECRET = defineSecret('ELEVENLABS_API_KEY');
const AGENT_ID_SECRET = defineSecret('AGENT_ID');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many demo requests. Please try again in a minute.' }
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Skip static files when running as a function
if (!process.env.FUNCTION_TARGET) {
  app.use(express.static(path.join(__dirname, '..')));
}

// Sanitize user input
const clean = (str) => String(str || '').replace(/[<>"'\/\\]/g, '').slice(0, 300);

app.get(['/api', '/api/'], (_req, res) => {
  res.json({ status: 'ok', message: 'QuantaNow AI Agent Backend is running' });
});

// POST endpoint — handles both /api/start-demo and /start-demo
app.post(['/api/start-demo', '/start-demo'], limiter, async (req, res) => {
  console.log(`\n[${new Date().toISOString()}] POST /api/start-demo`);
  try {
    // Fall back to local .env values when running locally
    const AGENT_ID = process.env.AGENT_ID || AGENT_ID_SECRET.value();
    const API_KEY = process.env.ELEVENLABS_API_KEY || ELEVENLABS_API_KEY_SECRET.value();

    if (!AGENT_ID || !API_KEY) {
      console.error('  Missing AGENT_ID or ELEVENLABS_API_KEY');
      return res.status(500).json({ error: 'Server configuration error: missing API credentials' });
    }

    const shop_name    = clean(req.body.shop_name);
    const business_type = clean(req.body.business_type);
    const purpose      = clean(req.body.purpose);

    if (!shop_name || !business_type || !purpose) {
      return res.status(400).json({ error: 'Business name, type, and purpose are required.' });
    }

    const tone         = clean(req.body.tone)         || 'friendly';
    const opening_line = clean(req.body.opening_line) || `Welcome to ${shop_name}! How can I help you today?`;

    console.log(`  Config: shop="${shop_name}", type="${business_type}", tone="${tone}"`);

    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      {
        method: 'GET',
        headers: { 'xi-api-key': API_KEY }
      }
    );

    if (!signedUrlResponse.ok) {
      const err = await signedUrlResponse.json().catch(() => ({}));
      console.error('  ElevenLabs signed URL error:', err);
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
    console.error(`  Server error:`, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET fallback for signed URL
app.get('/api/get-signed-url', limiter, async (_req, res) => {
  try {
    const AGENT_ID = process.env.AGENT_ID || AGENT_ID_SECRET.value();
    const API_KEY = process.env.ELEVENLABS_API_KEY || ELEVENLABS_API_KEY_SECRET.value();
    if (!AGENT_ID || !API_KEY) return res.status(500).json({ error: 'Server configuration error' });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      { method: 'GET', headers: { 'xi-api-key': API_KEY } }
    );

    if (!response.ok) return res.status(response.status).json({ error: 'Failed to get signed URL' });
    const data = await response.json();
    res.json({ signed_url: data.signed_url });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Local dev server
if (process.env.NODE_ENV !== 'production' && !process.env.FUNCTION_TARGET) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  QuantaNow AI Agent backend running on port ${PORT}\n  Open: http://localhost:${PORT}/ai-agents.html\n`);
  });
}

// Export as Firebase Function v2 with secret bindings
exports.api = onRequest(
  { secrets: [ELEVENLABS_API_KEY_SECRET, AGENT_ID_SECRET] },
  app
);
