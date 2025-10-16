export default async function createBoardCall(name) {
  console.log('this is the name from board', name);
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/createboard`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // 👈 add this
      },
      body: JSON.stringify({
        name,
        collection: 1,
      }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    return { success: false, data: error };
  }
}
