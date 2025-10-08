export const handleDelete = async (canvasId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/canvas/${canvasId}`,
      {
        method: 'DELETE',
        credentials: 'include', // send cookies for auth
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('Deleted canvas:', data.data);
      alert('Canvas deleted successfully!');
      // Optionally, refresh the canvas list or navigate away
    } else {
      console.error('Error deleting canvas:', data.data);
      alert(`Failed to delete: ${data.data}`);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error');
  }
};
