export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Ти агрономічний AI-асистент AgroDoctor AI. Відповідай українською мовою. Тема: технології захисту рослин. Питання користувача: ${message}`
    })
  });

  const data = await response.json();
  res.status(200).json({ answer: data.output_text });
}
