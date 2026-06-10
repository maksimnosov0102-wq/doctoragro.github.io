export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Дозволено тільки POST-запити." });
  }

  try {
    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        answer: "Помилка: GEMINI_API_KEY не знайдено у Vercel."
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
                  text: `Ти AgroDoctor AI — агрономічний консультант українською мовою. 
Відповідай практично, по темі захисту рослин: хвороби, шкідники, гербіциди, фунгіциди, інсектициди, соняшник, кукурудза, пшениця, сорго.

Питання користувача: ${message}`
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
      data?.error?.message ||
      "Gemini не повернув текстову відповідь.";

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(200).json({
      answer: "Помилка сервера: " + error.message
    });
  }
}
