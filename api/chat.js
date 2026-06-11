export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Дозволено тільки POST-запити." });
  }

  try {
    const { message } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(200).json({
        answer: "Помилка: OPENROUTER_API_KEY не знайдено у Vercel."
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://doctoragro-github-io.vercel.app",
        "X-Title": "AgroDoctor AI"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: "Ти AgroDoctor AI — професійний агрономічний консультант. Відповідай українською мовою, практично і по суті."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const answer =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "OpenRouter не повернув відповідь.";

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(200).json({
      answer: "Серверна помилка: " + error.message
    });
  }
}
