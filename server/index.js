const express = require('express');
const functions = require('firebase-functions');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.AGENT_ID || !process.env.ELEVENLABS_API_KEY) {
  console.warn('⚠️ WARNING: AGENT_ID or ELEVENLABS_API_KEY is missing from .env');
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'QuantaNow AI Agent Backend is running' });
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many demo requests. Please try again in a minute.' }
});

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Sanitize user input
const clean = (str) => String(str || '').replace(/[<>"'\/\\]/g, '').slice(0, 300);

// POST endpoint — receives form data, sends overrides to ElevenLabs, returns signed URL
app.post('/api/start-demo', limiter, async (req, res) => {
  console.log(`\n[${new Date().toISOString()}] POST /api/start-demo`);
  console.log('  Body:', JSON.stringify(req.body, null, 2));
  try {
    const AGENT_ID = process.env.AGENT_ID;
    const API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!AGENT_ID || !API_KEY) {
      console.error('  ❌ Missing AGENT_ID or ELEVENLABS_API_KEY');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const shop_name    = clean(req.body.shop_name);
    const business_type = clean(req.body.business_type);
    const purpose      = clean(req.body.purpose);

    if (!shop_name || !business_type || !purpose) {
      console.warn('  ⚠️ Missing required fields');
      return res.status(400).json({ error: 'Business name, type, and purpose are required.' });
    }

    const tone         = clean(req.body.tone)         || 'friendly';
    const opening_line = clean(req.body.opening_line) || `Welcome to ${shop_name}! How can I help you today?`;

    console.log(`  ✅ Config: shop="${shop_name}", type="${business_type}", tone="${tone}"`);
    console.log('  📡 Requesting signed URL from ElevenLabs...');

    // Step 1: Get signed URL
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      {
        method: 'GET',
        headers: { 'xi-api-key': API_KEY }
      }
    );

    console.log(`  ElevenLabs response status: ${signedUrlResponse.status}`);

    if (!signedUrlResponse.ok) {
      const err = await signedUrlResponse.json().catch(() => ({}));
      console.error('  ❌ ElevenLabs signed URL error:', err);
      return res.status(signedUrlResponse.status).json({ error: 'Failed to get signed URL', details: err });
    }

    const { signed_url } = await signedUrlResponse.json();
    console.log('  ✅ Signed URL received, sending to client');

    // Return signed URL + the override config to the frontend
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
    console.error(`  ❌ Server error:`, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Keep GET endpoint as fallback
app.get('/api/get-signed-url', limiter, async (_req, res) => {
  try {
    const AGENT_ID = process.env.AGENT_ID;
    const API_KEY = process.env.ELEVENLABS_API_KEY;
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

// 0.0.0.0 is used for Cloud Run, but for Firebase Functions we export the app
if (process.env.NODE_ENV !== 'production' && !process.env.FUNCTION_NAME) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  ✅ QuantaNow AI Agent backend running on port ${PORT}
  🚀 Open: http://localhost:${PORT}/ai-agents.html
    `);
  });
}

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
