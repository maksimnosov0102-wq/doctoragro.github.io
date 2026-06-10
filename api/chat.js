export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Ти AgroDoctor AI.

Ти професійний агрономічний консультант.

Відповідай українською мовою.

Спеціалізація:
- соняшник
- кукурудза
- пшениця
- сорго
- хвороби рослин
- шкідники
- гербіциди
- фунгіциди
- інсектициди
- технології захисту рослин

Питання користувача:

${message}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Не вдалося отримати відповідь.";

    res.status(200).json({
      answer
    });

  } catch (error) {

    res.status(500).json({
      answer: "Помилка сервера.",
      error: error.message
    });

  }

}
