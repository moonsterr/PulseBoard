import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authenticationHelper from '../utils/authenticationHelper';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 0);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const isAutho = await authenticationHelper();
      setIsAuthorized(isAutho);
    }
    checkAuth();
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="logo special-class">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 
                1.18 6.88L12 17.77l-6.18 3.25L7 
                14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <span className="logo-text">PulseBoard</span>
          </div>

          {/* Nav Links */}
          <div className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            <FaGithub
              className="icon"
              onClick={() =>
                window.open('https://github.com/moonsterr/Sync-Board', '_blank')
              }
            />
            {!isAuthorized && (
              <button className="btn-ghost" onClick={() => navigate('/signin')}>
                Sign In
              </button>
            )}
            {isAuthorized && (
              <button
                className="btn-ghost"
                onClick={async () => {
                  await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                    method: 'POST',
                    credentials: 'include',
                  });
                  setIsAuthorized(false);
                }}
              >
                Logout
              </button>
            )}
            <button
              className="btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Create Board
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
