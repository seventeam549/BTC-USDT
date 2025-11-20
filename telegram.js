export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const BOT_TOKEN = "7851461640:AAFtIgSsotn-BdkVbXqCEOoSMWsQBJDZTfg";
    const CHAT_ID = "7570861617";

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
