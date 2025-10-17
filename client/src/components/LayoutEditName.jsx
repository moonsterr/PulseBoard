import { useState } from 'react';

export default function EditName({ setToggle, id, name: canvasName, setData }) {
  const [name, setName] = useState(canvasName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault(); // prevent page reload
    if (!name.trim()) return setError('Name cannot be empty');

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/collection/${id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newName: name }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to rename canvas');
      } else {
        // update parent state
        setData((prev) =>
          prev.map((canvas) =>
            canvas.id === id ? { ...canvas, name } : canvas
          )
        );
        setToggle(false);
      }
    } catch (err) {
      console.error(err);
      setError('Server error, please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        e.stopPropagation();
        setToggle(false);
      }}
    >
      <form
        className="modal-form"
        onClick={(e) => e.stopPropagation()} // prevent overlay click from closing
        onSubmit={handleSubmit}
      >
        <h2>Edit Scene Name</h2>
        <div className="form-inputs">
          <div className="form-group">
            <label htmlFor="name">Scene Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter scene name"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
