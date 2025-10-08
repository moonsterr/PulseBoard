import Header from '../components/Header';
import hero_img from '../assets/whiteboard-hero.jpg'; // replace with your screenshot/asset
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <Header />
      <section className="hero">
        {/* Floating Background Shapes */}
        <div className="floating-shapes"></div>

        <div className="hero-container">
          <div className="hero-content">
            {/* Left Section */}
            <div className="hero-text">
              <div className="hero-headline">
                <h1>
                  <span className="text-accent">Unleash</span>{' '}
                  <span className="text-foreground">your</span>
                  <br />
                  <span className="text-primary">Creativity</span>
                </h1>
                <p className="hero-subtext">
                  Collaborate, brainstorm, and create together.
                </p>
              </div>

              <div className="hero-cta">
                <button
                  className="btn-hero"
                  onClick={() => navigate('/dashboard')}
                >
                  Start Drawing Free
                  <svg
                    className="arrow-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>

              <div className="hero-features">
                <div className="feature-item">
                  <svg
                    className="check-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 
                      0 01-1.414 0l-4-4a1 1 0 
                      011.414-1.414L8 12.586l7.293-7.293a1 
                      1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Free forever</span>
                </div>
                <div className="feature-item">
                  <svg
                    className="check-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 
                      0 01-1.414 0l-4-4a1 1 0 
                      011.414-1.414L8 12.586l7.293-7.293a1 
                      1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No sign-up required</span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="hero-image">
              <div className="image-container">
                <div className="image-glow"></div>
                <div className="image-wrapper">
                  <img
                    src={hero_img}
                    alt="PulseBoard whiteboard interface"
                    className="hero-img"
                  />

                  {/* Floating UI elements */}
                  <div className="floating-ui-top">
                    <div className="ui-content">
                      <div className="status-dot"></div>
                      <span className="ui-text">3 collaborators</span>
                    </div>
                  </div>

                  <div className="floating-ui-bottom">
                    <div className="ui-content">
                      <svg
                        className="edit-icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 
                          112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 
                          5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                      <span className="ui-text">Auto-save on</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
