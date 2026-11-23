export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    console.log('Ключ виден серверу:', !!process.env.GIGACHAT_CLIENT_ID); 
    const response = await fetch(''https://api.giga.chat/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': req.headers['rquid'] || crypto.randomUUID(),
        'Authorization': `Basic ${process.env.GIGACHAT_CLIENT_ID}`
      },
      body: 'scope=GIGACHAT_API_PERS'
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка oauth' });
  }
}