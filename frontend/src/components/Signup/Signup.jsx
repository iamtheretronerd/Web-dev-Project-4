import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "../../styles/signup.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Signup({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const nameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    confirmPasswordInputRef.current?.focus();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    announceToScreenReader("Creating your account, please wait...");

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profileImage: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(
            formData.name,
          )}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (data.success) {
        announceToScreenReader("Account created! Logging you in...");
        const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginResponse.json();
        if (loginData.success) {
          onLogin(loginData.user);
        }
      }
    } catch (err) {
      setError(err.message);
      announceToScreenReader(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && error) {
      setError("");
      nameInputRef.current?.focus();
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
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div className={styles.pageWrapper} onKeyDown={handleKeyDown}>
      <nav aria-label="Skip links" className={styles.skipLinks}>
        <a href="#signup-form" className={styles.skipLink}>
          Skip to signup form
        </a>
        <a href="#login-link" className={styles.skipLink}>
          Skip to login
        </a>
      </nav>

      <main className={styles.authContainer} role="main" aria-label="Sign up">
        <section
          className={styles.authCard}
          aria-labelledby="signup-title"
          aria-describedby="signup-subtitle"
        >
          <header>
            <h1 id="signup-title" className={styles.title}>
              Join LevelUp!
            </h1>
            <p id="signup-subtitle" className={styles.subtitle}>
              Start your skill mastery journey today
            </p>
          </header>

          <form
            id="signup-form"
            onSubmit={handleSubmit}
            className={styles.form}
            aria-label="Sign up form"
            noValidate
          >
            {error && (
              <div
                ref={errorRef}
                id="signup-error"
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
              <label htmlFor="name" id="name-label">
                Full Name
                <span className={styles.srOnly}> (required)</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                autoComplete="name"
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={
                  error ? "signup-error name-hint" : "name-hint"
                }
                aria-labelledby="name-label"
              />
              <span id="name-hint" className={styles.srOnly}>
                Enter your full name as you would like it displayed
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" id="email-label">
                Email
                <span className={styles.srOnly}> (required)</span>
              </label>
              <input
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
                  error ? "signup-error email-hint" : "email-hint"
                }
                aria-labelledby="email-label"
              />
              <span id="email-hint" className={styles.srOnly}>
                Enter a valid email address for your account
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" id="password-label">
                Password
                <span className={styles.srOnly}>
                  {" "}
                  (required, minimum 6 characters)
                </span>
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
                  placeholder="Create a password (min 6 characters)"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={
                    error
                      ? "signup-error password-hint password-requirements"
                      : "password-hint password-requirements"
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
                Create a secure password for your account
              </span>
              <span id="password-requirements" className={styles.srOnly}>
                Password must be at least 6 characters long
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" id="confirm-password-label">
                Confirm Password
                <span className={styles.srOnly}> (required)</span>
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  ref={confirmPasswordInputRef}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={
                    error
                      ? "signup-error confirm-password-hint"
                      : "confirm-password-hint"
                  }
                  aria-labelledby="confirm-password-label"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password, password is currently visible"
                      : "Show confirm password, password is currently hidden"
                  }
                  aria-pressed={showConfirmPassword}
                  aria-controls="confirmPassword"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <span id="confirm-password-hint" className={styles.srOnly}>
                Re-enter your password to confirm it matches
              </span>
            </div>

            <button
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
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
            <span id="submit-hint" className={styles.srOnly}>
              {loading
                ? "Account creation in progress, please wait"
                : "Press Enter or click to create your account"}
            </span>
          </form>

          <p className={styles.switchText} id="login-link">
            Already have an account?{" "}
            <Link to="/login" aria-label="Go to login page">
              Login
            </Link>
          </p>
        </section>
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

export default Signup;

Signup.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
