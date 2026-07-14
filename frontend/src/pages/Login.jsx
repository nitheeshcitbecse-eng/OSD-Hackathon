import { useState } from "react";
import { Eye } from "lucide-react";

function Login({ onLogin }) {
  const [tab, setTab] = useState("login");

  return (
    <div className="mobile-screen login-screen">
      <div className="login-content">
        <h1>Welcome Back!</h1>
        <p className="subtitle">
          {tab === "login" ? "Login to continue" : "Create your account"}
        </p>

        <div className="auth-tabs">
          <button
            className={tab === "login" ? "active-tab" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>

          <button
            className={tab === "register" ? "active-tab" : ""}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        <label>Email / Phone</label>

        <input
          type="text"
          placeholder="Enter email or phone"
        />

        <label>Password</label>

        <div className="password-box">
          <input
            type="password"
            placeholder="Enter your password"
          />

          <Eye size={18} />
        </div>

        {tab === "login" && (
          <p className="forgot">Forgot Password?</p>
        )}

        <button className="login-btn" onClick={onLogin}>
          {tab === "login" ? "Login" : "Register"}
        </button>

        <p className="continue-text">or continue with</p>

        <div className="social-login">
          <button className="google-btn">G</button>
          <button className="apple-btn">●</button>
        </div>
      </div>

      <p className="register-text">
        {tab === "login"
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default Login;