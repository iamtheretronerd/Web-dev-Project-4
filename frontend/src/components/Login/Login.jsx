import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../styles/login.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const errorRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    passwordInputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    announceToScreenReader("Logging in, please wait...");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        announceToScreenReader("Login successful! Redirecting...");
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
      announceToScreenReader(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const announceToScreenReader = (message) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.setAttribute("class", styles.srOnly);
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && error) {
      setError("");
      emailInputRef.current?.focus();
    }
  };

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div className={styles.splitContainer} onKeyDown={handleKeyDown}>
      <nav aria-label="Skip links" className={styles.skipLinks}>
        <a href="/login" className={styles.skipLink}>
          Skip to login form
        </a>
        <a href="/signup" className={styles.skipLink}>
          Skip to sign up
        </a>
      </nav>

      <aside className={styles.heroSection} aria-label="About LEVEL UP">
        <div className={styles.heroContent}>
          <header className={styles.heroHeader}>
            <h1 className={styles.heroLogo}>LEVEL UP</h1>
            <p className={styles.heroTagline}>Transform Your Potential</p>
          </header>

          <section className={styles.heroMain} aria-labelledby="hero-title">
            <h2 id="hero-title" className={styles.heroTitle}>
              Your Personal Growth
              <br />
              <span className={styles.srOnly}> </span>
              Management System
            </h2>
            <p className={styles.heroDescription}>
              LEVEL UP is a comprehensive platform designed to help you
              organize, track, and achieve your personal and professional goals.
              Transform your ambitions into actionable plans and see real
              progress every day.
            </p>
          </section>

          <section
            className={styles.whatWeDoSection}
            aria-labelledby="what-we-do-title"
          >
            <h3 id="what-we-do-title" className={styles.sectionTitle}>
              What LEVEL UP Helps You Do
            </h3>

            <article className={styles.benefitItem}>
              <h4>Organize Your Goals</h4>
              <p>
                Create a clear roadmap for what you want to achieve. Break down
                big dreams into manageable steps and keep everything in one
                place.
              </p>
            </article>

            <article className={styles.benefitItem}>
              <h4>Track Your Progress</h4>
              <p>
                Monitor your journey with intuitive tracking tools. See how far
                you've come and stay motivated as you move toward your
                objectives.
              </p>
            </article>

            <article className={styles.benefitItem}>
              <h4>Build Consistent Habits</h4>
              <p>
                Develop the daily routines that lead to success. Our system
                helps you stay accountable and maintain momentum over time.
              </p>
            </article>

            <article className={styles.benefitItem}>
              <h4>Measure What Matters</h4>
              <p>
                Get insights into your performance and identify areas for
                improvement. Data-driven feedback helps you make better
                decisions about where to focus your energy.
              </p>
            </article>
          </section>

          <section className={styles.whySection} aria-labelledby="why-title">
            <h3 id="why-title" className={styles.sectionTitle}>
              Why Choose LEVEL UP?
            </h3>
            <p className={styles.whyText}>
              Whether you're working on personal development, career growth,
              fitness goals, or learning new skills, LEVEL UP provides the
              structure and motivation you need to succeed. Our platform adapts
              to your unique journey, helping you stay focused and achieve
              meaningful results.
            </p>
          </section>

          <footer className={styles.heroFooter}>
            <p>
              <small>© 2025 LEVEL UP. All rights reserved.</small>
            </p>
          </footer>
        </div>
      </aside>

      <main className={styles.loginSection} role="main" aria-label="Login">
        <div className={styles.loginContainer}>
          <section
            className={styles.authCard}
            aria-labelledby="login-title"
            aria-describedby="login-subtitle"
          >
            <header>
              <h2 id="login-title" className={styles.title}>
                Welcome Back
              </h2>
              <p id="login-subtitle" className={styles.subtitle}>
                Sign in to continue your journey
              </p>
            </header>

            <form
              id="login-form"
              onSubmit={handleSubmit}
              className={styles.form}
              aria-label="Login form"
              noValidate
            >
              {error && (
                <div
                  ref={errorRef}
                  id="login-error"
                  className={styles.error}
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                  tabIndex={-1}
                >
                  <span className={styles.srOnly}>Error: </span>
                  {error}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="email" id="email-label">
                  Email
                  <span className={styles.srOnly}> (required)</span>
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={
                    error ? "login-error email-hint" : "email-hint"
                  }
                  aria-labelledby="email-label"
                />
                <span id="email-hint" className={styles.srOnly}>
                  Enter your registered email address
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" id="password-label">
                  Password
                  <span className={styles.srOnly}> (required)</span>
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={
                      error
                        ? "login-error password-hint password-toggle-hint"
                        : "password-hint password-toggle-hint"
                    }
                    aria-labelledby="password-label"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword
                        ? "Hide password, password is currently visible"
                        : "Show password, password is currently hidden"
                    }
                    aria-pressed={showPassword}
                    aria-controls="password"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <span id="password-hint" className={styles.srOnly}>
                  Enter your account password
                </span>
                <span id="password-toggle-hint" className={styles.srOnly}>
                  Use the button at the end of this field to show or hide your
                  password
                </span>
              </div>

              <button
                ref={submitButtonRef}
                type="submit"
                className={styles.submitButton}
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}
                aria-describedby="submit-hint"
              >
                {loading ? (
                  <>
                    <span className={styles.srOnly}>Please wait, </span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
              <span id="submit-hint" className={styles.srOnly}>
                {loading
                  ? "Login in progress, please wait"
                  : "Press Enter or click to log in to your account"}
              </span>
            </form>

            <p className={styles.switchText} id="signup-link">
              Don't have an account?{" "}
              <Link
                to="/signup"
                aria-label="Create a new account - go to sign up page"
              >
                Sign up
              </Link>
            </p>
          </section>
        </div>
      </main>

      <div
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
        id="live-announcements"
      />
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
