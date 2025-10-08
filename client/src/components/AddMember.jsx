import { useState } from 'react';
import TeamMemberCard from './TeamMemberCard';
import Spinner from './Spinner';

export default function AddMember({ setToggle }) {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload
    if (!name.trim()) return; // no empty searches

    try {
      setLoading(true);
      setUsers([]);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/queryusers?name=${encodeURIComponent(
          name
        )}`,
        {
          credentials: 'include',
        }
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

  return (
    <div className="modal-overlay" onClick={() => setToggle(false)}>
      <form
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit} // ✅ use onSubmit, not action
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
              <TeamMemberCard key={user.id} name={user.username} id={user.id} />
            ))}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
    </div>
  );
}
