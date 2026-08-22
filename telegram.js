export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const BOT_TOKEN = "8944196822:AAGDquXXicOQ7L1vOm6txW6h8h_p-_4wuVI";
    const CHAT_ID = "8878957420";

    let message = "📩 پیام جدید:\n";
    for (const key in data) {
      message += `${key}: ${data[key]}\n`;
    }

    const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      })
    });

    res.status(200).json({ status: "sent" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
