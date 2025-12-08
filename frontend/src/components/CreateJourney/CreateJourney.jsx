import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/createJourney.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function CreateJourney({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skill: "",
    level: "Beginner",
    timeCommitment: "15 mins/day",
    goal: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const [showLevelTooltip, setShowLevelTooltip] = useState(false);

  const skillInputRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    skillInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
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
    setLoading(true);
    announceToScreenReader("Creating your journey, please wait...");

    try {
      const userId = user?._id || user?.id || user?.userId || null;
      if (!userId) {
        throw new Error(
          "Unable to determine your user ID. Please log out and log back in.",
        );
      }
      const response = await fetch(`${API_URL}/api/gameData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId.toString(),
          skill: formData.skill,
          level: formData.level,
          timeCommitment: formData.timeCommitment,
          goal: formData.goal,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create journey");
      }
      if (data.success) {
        announceToScreenReader(
          "Journey created! Starting your first challenge...",
        );
        navigate(`/game?id=${data.gameDataId}`);
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
      skillInputRef.current?.focus();
    }
  };

  const InfoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  return (
    <div className={styles.pageWrapper} onKeyDown={handleKeyDown}>
      <nav aria-label="Skip links" className={styles.skipLinks}>
        <a href="#journey-form" className={styles.skipLink}>
          Skip to journey form
        </a>
      </nav>

      <main
        className={styles.container}
        role="main"
        aria-label="Create journey"
      >
        <section
          className={styles.card}
          aria-labelledby="journey-title"
          aria-describedby="journey-subtitle"
        >
          <header>
            <h1 id="journey-title" className={styles.title}>
              Create Your Journey
            </h1>
            <p id="journey-subtitle" className={styles.subtitle}>
              Define your starting point and we'll generate quests for you
            </p>
          </header>

          {error && (
            <div
              ref={errorRef}
              id="journey-error"
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

          <form
            id="journey-form"
            onSubmit={handleSubmit}
            className={styles.form}
            aria-label="Create journey form"
            noValidate
          >
            <div className={styles.inputGroup}>
              <label htmlFor="skill" id="skill-label">
                Skill
                <span className={styles.srOnly}> (required)</span>
              </label>
              <input
                ref={skillInputRef}
                type="text"
                id="skill"
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                required
                placeholder="e.g. Cooking, Guitar, Chess"
                autoComplete="off"
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={
                  error ? "journey-error skill-hint" : "skill-hint"
                }
                aria-labelledby="skill-label"
              />
              <span id="skill-hint" className={styles.inputHint}>
                Enter any skill you want to learn or improve
              </span>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="level" id="level-label">
                  Experience Level
                  <span className={styles.srOnly}> (required)</span>
                </label>
                <div className={styles.tooltipWrapper}>
                  <button
                    type="button"
                    className={styles.infoButton}
                    onMouseEnter={() => setShowLevelTooltip(true)}
                    onMouseLeave={() => setShowLevelTooltip(false)}
                    onFocus={() => setShowLevelTooltip(true)}
                    onBlur={() => setShowLevelTooltip(false)}
                    aria-label="More info about experience level"
                    aria-expanded={showLevelTooltip}
                    aria-describedby="level-tooltip"
                  >
                    <InfoIcon />
                  </button>
                  {showLevelTooltip && (
                    <div
                      id="level-tooltip"
                      className={styles.tooltip}
                      role="tooltip"
                    >
                      Your experience level helps the AI generate challenges
                      appropriate for your current abilities.
                    </div>
                  )}
                </div>
              </div>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                aria-required="true"
                aria-labelledby="level-label"
                aria-describedby="level-hint"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <span id="level-hint" className={styles.inputHint}>
                Select your current skill level
              </span>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="timeCommitment" id="time-label">
                  Time Commitment
                </label>
                <div className={styles.tooltipWrapper}>
                  <button
                    type="button"
                    className={styles.infoButton}
                    onMouseEnter={() => setShowTimeTooltip(true)}
                    onMouseLeave={() => setShowTimeTooltip(false)}
                    onFocus={() => setShowTimeTooltip(true)}
                    onBlur={() => setShowTimeTooltip(false)}
                    aria-label="More info about time commitment"
                    aria-expanded={showTimeTooltip}
                    aria-describedby="time-tooltip"
                  >
                    <InfoIcon />
                  </button>
                  {showTimeTooltip && (
                    <div
                      id="time-tooltip"
                      className={styles.tooltip}
                      role="tooltip"
                    >
                      This helps the AI generate challenges that fit your
                      schedule. Shorter times mean smaller, focused tasks.
                    </div>
                  )}
                </div>
              </div>
              <select
                id="timeCommitment"
                name="timeCommitment"
                value={formData.timeCommitment}
                onChange={handleChange}
                aria-labelledby="time-label"
                aria-describedby="time-hint"
              >
                <option value="15 mins/day">15 mins/day</option>
                <option value="30 mins/day">30 mins/day</option>
                <option value="1 hour/day">1 hour/day</option>
                <option value="2 hours/week">2 hours/week</option>
              </select>
              <span id="time-hint" className={styles.inputHint}>
                How much time can you dedicate to practice?
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="goal" id="goal-label">
                Personal Goal
                <span className={styles.optionalBadge}>(Optional)</span>
              </label>
              <input
                type="text"
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="E.g. Cook 5 healthy meals"
                autoComplete="off"
                aria-labelledby="goal-label"
                aria-describedby="goal-hint"
              />
              <span id="goal-hint" className={styles.inputHint}>
                A specific goal helps tailor challenges to your objectives
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
                  Creating...
                </>
              ) : (
                "Start Journey"
              )}
            </button>
            <span id="submit-hint" className={styles.srOnly}>
              {loading
                ? "Journey creation in progress, please wait"
                : "Press Enter or click to start your learning journey"}
            </span>
          </form>
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

export default CreateJourney;

CreateJourney.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};
