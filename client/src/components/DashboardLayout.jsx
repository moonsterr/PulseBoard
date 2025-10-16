import { useState, useEffect } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaSearch,
  FaCog,
  FaUsers,
  FaLock,
  FaPlus,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import demo_profile from '../assets/demo-profile.jpeg';
import { MdDashboard } from 'react-icons/md';
import { Outlet } from 'react-router';
import Banner from './Banner';
import CreateCollection from './CreateCollection';
import Spinner from './Spinner';
import DropdownMenu from './DropdownMenu';
import { handleDeleteCollection } from '../utils/deletePost';

export default function DashboardLayout() {
  const [toggle, setToggle] = useState(false);
  const [toggleCollection, setCollectionToggle] = useState(false);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({ username: 'loading...' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ error: false, data: null });
  const [collectionData, setCollectionData] = useState([]);
  const [collectionLoading, setCollectionLoading] = useState(true);

  async function handleSubmit(formdata) {
    const username = formdata.get('username');
    const oldUsername = userData.username;
    if (username.length < 4) return;
    setUserData({ username: 'Updating...' });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!data.success) {
        setError({ error: true, data: data.data });
      }
      setUserData({ username });
    } catch (error) {
      console.log(error);
      setError({
        error: true,
        data: 'Something went wrong on our end or your wifi connection is weak',
      });
      setUserData({ username: oldUsername });
    }
  }

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

  // New useEffect to fetch collections
  useEffect(() => {
    async function getCollections() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/getcollections`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        const data = await res.json();
        setCollectionData(data);
      } catch (error) {
        console.log('Error fetching collections:', error);
      } finally {
        setCollectionLoading(false);
      }
    }
    getCollections();
  }, []);

  async function handleDelete(id) {
    await handleDeleteCollection(id);
  }

  return (
    <div className="dashboard">
      {error.error && (
        <div className="banner-card-component">
          <Banner
            type="error"
            heading="Update Failed"
            description={`${
              error.data === 'username' ? 'username already exists' : error.data
            }`}
          />
        </div>
      )}
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
                  onClick={() => setToggle((prev) => !prev)}
                />
              ) : (
                <FaArrowDown
                  className="sidebar-icon"
                  onClick={() => setToggle((prev) => !prev)}
                />
              )}
            </div>
          </div>
          {toggle && (
            <div className="profile-hidden">
              <form action={handleSubmit}>
                <div className="profile-hidden-field">
                  <label htmlFor="username">Username</label>
                  <input type="text" id="username" name="username" />
                </div>
                <button>Update</button>
              </form>
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
            <div
              className="collections-icon"
              onClick={() => setCollectionToggle(true)}
            >
              <FaPlus className="sidebar-icon" />
              {toggleCollection && (
                <CreateCollection
                  setCollectionData={setCollectionData}
                  setToggle={setCollectionToggle}
                />
              )}
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
            {collectionLoading && <Spinner />}

            {collectionData.length > 0 &&
              collectionData.map((collection) => (
                <NavLink
                  key={collection.id}
                  to={`${collection.id}`}
                  className={({ isActive }) =>
                    `sidebar-tab sidebar-collection ${
                      isActive ? 'sidebar-active' : ''
                    }`
                  }
                >
                  <p>{collection.name}</p>
                  <DropdownMenu
                    id={collection.id}
                    handleDelete={handleDelete}
                  />
                </NavLink>
              ))}
          </div>
        </div>
      </div>

      <Outlet
        context={{ data, loading, collectionData, setData, setCollectionData }}
      />
    </div>
  );
}
