export default async function authenticationHelper() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (data.success) {
    return true;
  } else {
    return false;
  }
}
