import { useState } from 'react';
// import //   FaSearch,
//   FaGear,
//   FaPeopleGroup,
//   FaLock,
//   FaArrowDown,
//   FaArrowRight,
//   FaFileCirclePlus,
//   FaPlus,
// 'react-icons/fa';
import {
  FaArrowDown,
  FaArrowUp,
  FaSearch,
  FaCog,
  FaUsers,
  FaLock,
  FaPlus,
} from 'react-icons/fa';
import { NavLink } from 'react-router';
import demo_profile from '../assets/demo-profile.jpeg';
import { MdDashboard } from 'react-icons/md';
import { Outlet } from 'react-router';
import { useEffect } from 'react';
export default function DashboardLayout() {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({ username: 'loading...' });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getCanvases() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/canvases`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setLoading(false);
      setData(data.data);
    }
    getCanvases();
  }, []);
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getuser`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setUserData(data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, []);
  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="profile-shown">
            <div className="profile-shown-details">
              <div className="profile-image">
                <img src={demo_profile} alt="" />
              </div>
              <h3>{userData.username}</h3>
            </div>
            <div className="details-icon">
              {toggle ? (
                <FaArrowUp
                  className="sidebar-icon"
                  onClick={() => setToggle((prevToggle) => !prevToggle)}
                />
              ) : (
                <FaArrowDown
                  className="sidebar-icon"
                  onClick={() => setToggle((prevToggle) => !prevToggle)}
                />
              )}
            </div>
          </div>
          {toggle && (
            <div className="profile-hidden">
              <div className="profile-hidden-field">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" />
              </div>
              <button>Update </button>
            </div>
          )}
        </div>
        <div className="sidebar-tabs">
          <div className="sidebar-tab search-tab">
            <FaSearch className="sidebar-icon" />
            <input type="text" placeholder="Quick search" />
          </div>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `sidebar-tab ${isActive ? 'sidebar-active' : ''}`
            }
          >
            <MdDashboard className="sidebar-icon" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            to="/dashboard/team"
            className={({ isActive }) =>
              `sidebar-tab ${isActive ? 'sidebar-active' : ''}`
            }
          >
            <FaCog className="sidebar-icon" />
            <p>Team Members</p>
          </NavLink>
        </div>

        <div className="collections">
          <div className="collections-header">
            <h3>Collections</h3>
            <div className="collections-icon">
              <FaPlus className="sidebar-icon" />
            </div>
          </div>
          <div className="sidebar-tabs">
            <NavLink
              to="/collections/private"
              className={({ isActive }) =>
                `sidebar-tab special-tab ${isActive ? 'sidebar-active' : ''}`
              }
            >
              <FaLock className="sidebar-icon" />
              Private
            </NavLink>

            <NavLink
              to="/collections/rocket"
              className={({ isActive }) =>
                `sidebar-tab ${isActive ? 'sidebar-active' : ''}`
              }
            >
              <span>🚀</span>
              <p>Rocket Diagram</p>
            </NavLink>
          </div>
        </div>
      </div>
      <Outlet context={{ data, loading }} />
    </div>
  );
}
