export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': req.headers['rquid'] || crypto.randomUUID(),
        'Authorization': `Basic ${process.env.VITE_GIGACHAT_CLIENT_ID}`
      },
      body: 'scope=GIGACHAT_API_PERS'
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка oauth' });
  }
}