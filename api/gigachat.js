export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Эта строчка покажет в логах Vercel, видит ли сервер ключ
    console.log('ПРОВЕРКА GROQ КЛЮЧА:', process.env.GROQ_API_KEY ? 'КЛЮЧ ЕСТЬ' : 'КЛЮЧА НЕТ');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Отличная бесплатная модель
        messages: req.body.messages,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    console.log('ОТВЕТ ОТ GROQ:', data); // Посмотрим, что реально приходит

    res.status(200).json(data);
  } catch (error) {
    console.error('Ошибка Groq:', error);
    res.status(500).json({ error: 'Ошибка Groq' });
  }
}