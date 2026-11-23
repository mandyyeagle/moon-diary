export default async function handler(req, res) {
  // Groq использует прямой ключ, поэтому мы просто возвращаем пустышку.
  res.status(200).json({ access_token: 'dummy-token-for-groq' });
}