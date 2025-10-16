export const handleDelete = async (canvasId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/canvas/${canvasId}`,
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
      return true;
      // Optionally, refresh the canvas list or navigate away
    } else {
      console.error('Error deleting canvas:', data.data);
      alert(`Failed to delete: ${data.data}`);
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error');
    return false;
  }
};
export const handleDeleteCollection = async (collectionId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/collection/${collectionId}`,
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
      console.log('Deleted collection:', data.message);
      alert('Collection and its canvases deleted successfully!');
      return true;
      // Optionally, refresh the collection list or navigate away
    } else {
      console.error('Error deleting collection:', data.message);
      alert(`Failed to delete: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error');
    return false;
  }
};
