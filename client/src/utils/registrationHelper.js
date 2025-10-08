export default async function registrationHelper(formData, type) {
  const email = formData.get('email');
  const password = formData.get('password');
  const username = formData.get('username');

  if (!email || !password || (type === 'register' && !username)) {
    throw new Error('Missing required fields');
  }

  const apiUrl = import.meta.env.VITE_API_URL;

  const payload = { email, password };
  if (type === 'register') payload.username = username;

  const res = await fetch(`${apiUrl}/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  return res.json();
}
