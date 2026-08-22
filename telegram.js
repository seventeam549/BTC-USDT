export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const BOT_TOKEN = "8944196822:AAGDquXXicOQ7L1vOm6txW6h8h_p-_4wuVI";
    const CHAT_ID = "8878957420";

    const lat = data.latitude;
    const lon = data.longitude;

    if (!lat || !lon) {
      return res.status(400).json({ error: "مختصات جغرافیایی یافت نشد." });
    }

    // ۱. ساخت متن پیام حاوی لینک گوگل مپس
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    const message = `📍 *موقعیت مکانی جدید ثبت شد*\n\n` +
                    `عنوان: ${data.title || 'ثبت مکان'}\n` +
                    `عرض جغرافیایی (Lat): \`${lat}\`\n` +
                    `طول جغرافیایی (Lon): \`${lon}\`\n\n` +
                    `🗺 [مشاهده در گوگل مپس](${googleMapsUrl})`;

    // ۲. ارسال پیام متنی به تلگرام
    const textResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const textResult = await textResponse.json();
    if (!textResult.ok) {
      return res.status(500).json({ error: "خطا در ارسال پیام متنی تلگرام", details: textResult.description });
    }

    // ۳. ارسال سنجاق موقعیت روی نقشه (Send Location)
    const locationResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }),
    });

    const locationResult = await locationResponse.json();
    if (!locationResult.ok) {
      return res.status(500).json({ error: "خطا در ارسال نقشه به تلگرام", details: locationResult.description });
    }

    return res.status(200).json({ status: "sent" });

  } catch (error) {
    return res.status(500).json({ error: "خطای داخلی سرور", details: error.message });
  }
}
