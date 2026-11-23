export default async function handler(req, res) {
  // Groq не требует отдельного получения токена, ключ используется напрямую.
  // Оставляем заглушку, чтобы не ломать логику на клиенте.
  res.status(200).json({ access_token: 'dummy-token' });
}