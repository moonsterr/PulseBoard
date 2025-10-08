import DashboardHeading from '../components/dashboardHeading';
import { FaUserCog, FaUserPlus } from 'react-icons/fa';
import AddMember from '../components/AddMember';
import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import demo_img from '../assets/demo-profile.jpeg'; // placeholder

function Team() {
  const [toggle, setToggle] = useState(false);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [authorizedBy, setAuthorizedBy] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuthorizedBy = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/checkAuthorized`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (data.success) {
          setAuthorizedBy(data.data);
        } else {
          setAuthorizedBy([]);
          console.log(data);
        }
      } catch (err) {
        console.error('Error fetching authorized by:', err);
        setAuthorizedBy([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchAuthorizedUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/authorized`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setAuthorizedUsers(data.data);
        } else {
          setAuthorizedUsers([]);
        }
      } catch (err) {
        console.error('Error fetching authorized users:', err);
        setAuthorizedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorizedBy();
    fetchAuthorizedUsers();
  }, []);

  return (
    <div className="dashboard-page">
      <DashboardHeading
        iconImg={FaUserCog}
        heading={'Team Members'}
        description={'This is all of your team members'}
      />

      <div className="create-scene">
        <button className="add-member-btn" onClick={() => setToggle(true)}>
          <FaUserPlus className="dashboard-icon" />
          Add Team Member
        </button>
      </div>

      {/* People you authorized */}
      <div className="dashboard-scenes">
        <div className="dashboard-scenes-header">
          <h2>People you have authorized</h2>
        </div>
        {loading && <Spinner />}
        {!loading && (
          <div className="team-grid">
            {authorizedUsers.map((user) => (
              <div key={user.id} className="team-card">
                <img src={demo_img} alt={user.username} className="team-img" />
                <span className="team-name">{user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* People who authorized you */}
      <div className="dashboard-scenes">
        <div className="dashboard-scenes-header">
          <h2>People who have authorized you</h2>
        </div>
        {loading && <Spinner />}
        {!loading && (
          <div className="team-grid">
            {authorizedBy.map((user) => (
              <div key={user.id} className="team-card">
                <img src={demo_img} alt={user.username} className="team-img" />
                <span className="team-name">{user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {toggle && <AddMember setToggle={setToggle} />}
    </div>
  );
}

export default Team;
