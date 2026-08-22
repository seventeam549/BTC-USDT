export default async function handler(req, res) {
  // همیشه هدر JSON را تنظیم می‌کنیم
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const BOT_TOKEN = "8947494572:AAGWviC7WYN2SJn0MV3RnQFfmUjSGP4wSec";
    const CHAT_ID = "8878957420";

    const lat = data.latitude;
    const lon = data.longitude;

    if (!lat || !lon) {
      return res.status(400).json({ error: "مختصات جغرافیایی ارسال نشده است." });
    }

    // ۱. ارسال پیام متنی + لینک گوگل مپس
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    const message = `📍 *موقعیت مکانی جدید ثبت شد*\n\n` +
                    `عنوان: ${data.title || 'ثبت مکان'}\n` +
                    `عرض جغرافیایی: \`${lat}\`\n` +
                    `طول جغرافیایی: \`${lon}\`\n\n` +
                    `🗺 [مشاهده روی نقشه گوگل](${googleMapsUrl})`;

    const textRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const textResult = await textRes.json();
    if (!textResult.ok) {
      return res.status(500).json({ error: "خطا از سمت تلگرام", details: textResult.description });
    }

    // ۲. ارسال سنجاق نقشه (sendLocation)
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }),
    });

    return res.status(200).json({ status: "sent" });

  } catch (error) {
    return res.status(500).json({ error: "خطای داخلی سرور", details: error.message });
  }
}
