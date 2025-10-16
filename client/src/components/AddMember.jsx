import { useState } from 'react';
import Spinner from './Spinner';
import TeamMemberCard from './TeamMemberCard';

export default function AddMember({ setToggle, setAuthorizedUsers }) {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setUsers([]);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/queryusers?name=${encodeURIComponent(
          name
        )}`,
        { credentials: 'include' }
      );

      const data = await res.json();
      if (!data.success) {
        alert('Something went wrong');
        return;
      }

      setUsers(data.data || []);
    } catch (error) {
      alert(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (userId, username) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addAuthorized`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // so authMiddleware can read cookies/session
        body: JSON.stringify({ id: userId }), // backend expects req.body.id
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Could not authorize user');
        return;
      }

      // Update locally without reload
      setAuthorizedUsers((prev) => [...prev, { id: userId, username }]);

      setTimeout(() => setToggle(false), 50);
    } catch (error) {
      console.error('Authorize error:', error);
      alert('Something went wrong while authorizing');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setToggle(false)}>
      <form
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>Add Member</h2>
        <div className="form-inputs">
          <div className="form-group">
            <label htmlFor="name">Member name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
            />
          </div>
        </div>

        <div className="member-add-container">
          {loading && <Spinner size={50} />}
          {!loading &&
            users.map((user) => (
              <TeamMemberCard
                key={user.id}
                name={user.username}
                id={user.id}
                onAuthorize={() => handleAuthorize(user.id, user.username)}
              />
            ))}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
    </div>
  );
}
