import demo_profile from '../assets/demo-profile.jpeg';
import { FaPlus } from 'react-icons/fa';

export default function TeamMemberCard({ name, onAuthorize }) {
  return (
    <div className="team-member-card">
      <div className="team-profile-profile">
        <div className="team-profile">
          <img src={demo_profile} alt="Profile" />
        </div>
        <h3>{name}</h3>
      </div>
      <div className="team-profile-button">
        <FaPlus className="add-member-button" onClick={onAuthorize} />
      </div>
    </div>
  );
}
