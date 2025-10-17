import { useState } from 'react';
import drawImg from '../assets/draw.svg';
import g from '../assets/g.svg';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import Banner from '../components/Banner.jsx';
import registrationHelper from '../utils/registrationHelper';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function errorHelper(errorCode) {
    if (errorCode === 'email') {
      return {
        heading: 'The email you entered is already in use',
        description:
          'Somebody has already used this email before, you can request an email change or use a different email',
      };
    } else if (errorCode === 'shortEmail') {
      return {
        heading: 'Email too short',
        description: 'Email must be at least 3 characters long.',
      };
    } else if (errorCode === 'shortUsername') {
      return {
        heading: 'Username too short',
        description: 'Username must be at least 3 characters long.',
      };
    } else if (errorCode === 'shortPassword') {
      return {
        heading: 'Password too short',
        description: 'Password must be at least 8 characters long.',
      };
    } else {
      return {
        heading: 'Internal server error',
        description:
          'There was an unexpected error on our part, try again later.',
      };
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();

    // Client-side validation
    if (email.length < 3) {
      setError('shortEmail');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (username.length < 3) {
      setError('shortUsername');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (password.length < 8) {
      setError('shortPassword');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const data = await registrationHelper(formData, 'register');

    if (!data.success) {
      setError(data.data);
      setTimeout(() => setError(''), 3000);
    } else {
      navigate('/');
    }
  }

  return (
    <main>
      <div className="registration-page">
        <div className="registration-page-overlay">
          <div className="overlay-img">
            <img src={drawImg} alt="Image of the drawing app" />
          </div>
        </div>
        <div className="registration-page-register">
          {error && (
            <div className="banner-card-component">
              <Banner
                type="error"
                heading={errorHelper(error).heading}
                description={errorHelper(error).description}
              />
            </div>
          )}
          <div className="account">
            <div className="account-details">
              <h1>Create Account</h1>
              <p>Enter your credentials and get ready to explore!</p>
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-field">
                  <div className="form-field-icon">
                    <FaEnvelope className="icon" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                  />
                </div>
                <div className="form-field">
                  <div className="form-field-icon">
                    <FaUser className="icon" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Username"
                  />
                </div>
                <div className="form-field">
                  <div className="form-field-icon">
                    <FaLock className="icon" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Password"
                  />
                </div>
                <button type="submit" className="registration-button">
                  Create account
                </button>
              </form>
              <button
                type="button"
                className="registration-button google"
                onClick={() => {
                  window.location.href = `${
                    import.meta.env.VITE_API_URL
                  }/auth/google`;
                }}
              >
                <img style={{ width: '25px', height: '25px' }} src={g} alt="" />
                Register with Google
              </button>

              <h4>
                Have an account? <Link to="../signin">Login now</Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
