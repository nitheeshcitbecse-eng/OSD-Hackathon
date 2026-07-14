import "../styles/Splash.css";
import { useNavigate } from "react-router-dom";

function Splash() {
    const navigate = useNavigate();
  return (
    <div className="splash-container">

      <div className="logo-circle">
        🛡️
      </div>

      <h1 className="title">
        AI Guardian
      </h1>

      <p className="subtitle">
        Protecting Your Loved Ones
      </p>

      <button
  className="start-btn"
  onClick={() => navigate("/login")}
>
        Get Started
      </button>

    </div>
  );
}

export default Splash;