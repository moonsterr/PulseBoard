import { useState } from 'react';
import drawImg from '../assets/draw.svg';
import g from '../assets/g.svg';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import registrationHelper from '../utils/registrationHelper';
import Banner from '../components/Banner.jsx';

export default function RegistrationPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function errorHelper(errorCode) {
    if (errorCode === 'email') {
      return {
        heading: 'Email is incorrect or not found',
        description:
          'The email you entered was incorrect or not found. Enter another email or create an account.',
      };
    } else if (errorCode === 'password') {
      return {
        heading: 'The password is incorrect.',
        description:
          'The password you entered is incorrect. Try a different password or create a new account.',
      };
    } else if (errorCode === 'shortEmail') {
      return {
        heading: 'Email too short',
        description: 'Email must be at least 3 characters long.',
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
          'There was an unexpected error on our part. Try again later.',
      };
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    // client-side validation
    if (email.length < 3) {
      setError('shortEmail');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (password.length < 8) {
      setError('shortPassword');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const data = await registrationHelper(formData, 'login');

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
          <div className="account">
            {error && (
              <div className="banner-card-component">
                <Banner
                  type="error"
                  heading={errorHelper(error).heading}
                  description={errorHelper(error).description}
                />
              </div>
            )}
            <div className="account-details">
              <h1>Log in</h1>
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
                  Login
                </button>
                <button
                  type="button"
                  className="registration-button google"
                  onClick={() => {
                    window.location.href = `${
                      import.meta.env.VITE_API_URL
                    }/auth/google`;
                  }}
                >
                  <img
                    style={{ width: '25px', height: '25px' }}
                    src={g}
                    alt=""
                  />
                  Login with Google
                </button>
              </form>
              <h4>
                Don't have an account? <Link to="../create">Sign up now</Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
