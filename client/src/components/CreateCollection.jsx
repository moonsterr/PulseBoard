import { useState } from 'react';
import Spinner from './Spinner';

export default function CreateCollection({ setToggle }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload
    if (!name.trim()) return; // no empty searches

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/createcollection`,
        {
          method: 'post',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert('Something went wrong');
        return;
      }
    } catch (error) {
      alert(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setToggle(false)}>
      <form
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit} // ✅ use onSubmit, not action
      >
        <h2>Add Collection</h2>
        <div className="form-inputs">
          <div className="form-group">
            <label htmlFor="name">Collection name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name"
            />
          </div>
        </div>

        {/* <div className="collection-add-container">
          {loading && <Spinner size={50} />}
          {!loading &&
            users.map((user) => (
              <TeamCollectionCard key={user.id} name={user.username} id={user.id} />
            ))}
        </div> */}

        <button type="submit" className="submit-btn" disabled={loading}>
          Create Collection
        </button>
      </form>
    </div>
  );
}
