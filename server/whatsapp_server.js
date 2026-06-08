require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const Twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

let twilioClient;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

app.post('/api/send-whatsapp', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) return res.status(400).json({ error: 'phone y message son requeridos.' });

  const digits = (phone || '').toString().replace(/\D/g, '');
  let to = digits;
  if (digits.length === 10) to = `57${digits}`;

  if (twilioClient) {
    try {
      const result = await twilioClient.messages.create({
        from: TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${to}`,
        body: message
      });
      return res.json({ success: true, provider: 'twilio', data: result });
    } catch (error) {
      return res.status(500).json({ error: error.message, provider: 'twilio', details: error });
    }
  }

  if (!PHONE_ID || !TOKEN) {
    return res.status(500).json({ error: 'Faltan credenciales de WhatsApp en el servidor.' });
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data, provider: 'whatsapp-cloud' });
    return res.json({ success: true, provider: 'whatsapp-cloud', data });
  } catch (err) {
    return res.status(500).json({ error: err.message, provider: 'whatsapp-cloud' });
  }
});

app.listen(PORT, () => {
  console.log(`Message server listening on port ${PORT}`);
});
