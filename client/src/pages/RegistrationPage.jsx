import { useState } from 'react';
import drawImg from '../assets/draw.svg';
import g from '../assets/g.svg';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router';
import registrationHelper from '../utils/registrationHelper';
import Banner from '../components/Banner.jsx';
import { useNavigate } from 'react-router';

export default function RegistrationPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  function errorHelper(error) {
    if (error === 'email') {
      return {
        heading: 'Email is incorrect or not found',
        description:
          'The email you entered was incorrect or not found, enter another email or create an account.',
      };
    } else if (error === 'password') {
      return {
        heading: 'The password is incorrect.',
        description:
          'The password you entered is incorrect, try a different password or create a new account.',
      };
    } else {
      return {
        heading: 'Internal server error',
        description:
          'There was an unexpected error on our part, try again later.',
      };
    }
  }
  async function handleSubmit(formData) {
    const data = await registrationHelper(formData, 'login');
    if (!data.success) {
      setError(data.data);
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
              <form action={handleSubmit} className="registration-form">
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
                  Login with google
                </button>
              </form>
              <h4>
                Dont have an account? <Link to="../create">Sign up now</Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
