Message Server for PET-Humboldt
================================

This small Node.js server can send messages using Twilio WhatsApp or the WhatsApp Cloud API.

Setup
-----

1. Copy `.env.example` to `.env` and set the values.

Option 1: Twilio WhatsApp Sandbox (recommended for quick testing)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
PORT=3000
```

Option 2: WhatsApp Cloud API (Meta)
```
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_long_lived_access_token_here
PORT=3000
```

2. Install dependencies and run:

```bash
cd server
npm install
npm start
```

API
---

POST /api/send-whatsapp
Content-Type: application/json

Body:
{
  "phone": "573001234567",
  "message": "Texto a enviar"
}

Response: JSON with Twilio or WhatsApp Cloud API response.

Notes
-----
- Twilio is easier for quick testing and can send WhatsApp messages through the sandbox number.
- If Twilio variables are present, the server will use Twilio first. Otherwise it falls back to WhatsApp Cloud API.
- For local testing the frontend should call `http://localhost:3000/api/send-whatsapp`.
