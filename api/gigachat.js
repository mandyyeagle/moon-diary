
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY не найден');
      return res.status(500).json({ error: 'Не настроен ключ Groq' });
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: req.body.messages,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Ошибка ответа Groq:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Ошибка Groq:', error);
    return res.status(500).json({ error: 'Ошибка соединения с Groq' });
  }
}
