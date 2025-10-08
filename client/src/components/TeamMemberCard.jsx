import { FaPlus } from 'react-icons/fa';
import demo_profile from '../assets/demo-profile.jpeg';

function TeamMemberCard({ name, id }) {
  async function handleClick() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addAuthorized`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // so authMiddleware can read cookies/session
        body: JSON.stringify({ id }), // backend expects req.body.id
      });

      const data = await res.json();
      if (!data.success) {
        alert('Failed to authorize user');
      } else {
        alert(`Successfully authorized ${name}`);
      }
    } catch (err) {
      console.error('Error adding authorized user:', err);
      alert('Something went wrong');
    }
  }

  return (
    <div className="team-member-card">
      <div className="team-profile-profile">
        <div className="team-profile">
          <img src={demo_profile} alt="Profile" />
        </div>
        <h3>{name}</h3>
      </div>
      <div className="team-profile-button">
        <FaPlus className="add-member-button" onClick={handleClick} />
      </div>
    </div>
  );
}

export default TeamMemberCard;
