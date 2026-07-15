import { useState } from "react";
import { api } from "../api";

import {
  Eye,
  EyeOff,
  ScanEye,
  ShieldCheck,
  LockKeyhole,
  User,
  Mail,
} from "lucide-react";

import SecurityBackground from "../components/SecurityBackground";

function Login({ onLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const data = await api.auth.signup(name, email, password);
        localStorage.setItem("iris_token", data.token);
        localStorage.setItem("iris_user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        const data = await api.auth.login(email, password);
        localStorage.setItem("iris_token", data.token);
        localStorage.setItem("iris_user", JSON.stringify(data.user));
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="iris-login-page">
      <SecurityBackground />

      <section className="iris-login-brand">
        <div className="login-brand-content">
          <div className="login-iris-symbol">
            <div className="login-symbol-ring"></div>

            <ScanEye size={70} />
          </div>

          <h1>IRIS</h1>

          <h2>
            Intelligent Recognition
            <br />
            & Intrusion System
          </h2>

          <p>
            Intelligent recognition, surveillance and
            intrusion monitoring for modern security.
          </p>

          <div className="login-features">
            <div>
              <ShieldCheck size={20} />
              <span>Real-time AI Protection</span>
            </div>

            <div>
              <ScanEye size={20} />
              <span>Intelligent Face Recognition</span>
            </div>

            <div>
              <LockKeyhole size={20} />
              <span>Secure Intrusion Detection</span>
            </div>
          </div>
        </div>
      </section>

      <section className="iris-login-section">
        <div
          className={`iris-login-card ${
            authMode === "signup"
              ? "signup-card-active"
              : ""
          }`}
        >
          <div className="iris-auth-tabs">
            <button
              type="button"
              className={
                authMode === "login"
                  ? "iris-auth-active"
                  : ""
              }
              onClick={() => setAuthMode("login")}
            >
              LOGIN
            </button>

            <button
              type="button"
              className={
                authMode === "signup"
                  ? "iris-auth-active"
                  : ""
              }
              onClick={() => setAuthMode("signup")}
            >
              SIGN UP
            </button>
          </div>

          <div
            key={authMode}
            className="iris-auth-form-animation"
          >
            <div className="login-card-heading">
              <span>
                {authMode === "login"
                  ? "SECURE ACCESS"
                  : "NEW IDENTITY"}
              </span>

              <h2>
                {authMode === "login"
                  ? "Welcome Back"
                  : "Create Account"}
              </h2>

              <p>
                {authMode === "login"
                  ? "Sign in to access your IRIS dashboard"
                  : "Register your identity with IRIS"}
              </p>
            </div>

            {error && (
              <div className="iris-error-banner" style={{ color: "#ff4a4a", fontSize: "14px", marginBottom: "15px", textAlign: "center", fontWeight: "bold" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {authMode === "signup" && (
                <>
                  <label>Full Name</label>

                  <div className="iris-auth-input">
                    <User size={17} />

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <label>Email Address</label>

              <div className="iris-auth-input">
                <Mail size={17} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label>Password</label>

              <div className="iris-auth-input">
                <LockKeyhole size={17} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {authMode === "signup" && (
                <>
                  <label>Confirm Password</label>

                  <div className="iris-auth-input">
                    <LockKeyhole size={17} />

                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {authMode === "login" && (
                <div className="login-options">
                  <label className="remember-login">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button type="button">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="iris-login-button"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "Processing..."
                    : authMode === "login"
                    ? "Access IRIS"
                    : "Create IRIS Account"}
                </span>

                <div className="button-scan"></div>
              </button>
            </form>

            <div className="login-security-status">
              <span></span>
              ENCRYPTED SECURE CONNECTION
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;