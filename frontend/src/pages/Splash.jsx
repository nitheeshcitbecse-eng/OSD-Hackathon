import { Shield, Eye } from "lucide-react";

function Splash({ onFinish }) {
  return (
    <div className="mobile-screen splash-screen">
      <div className="logo-box">
        <div className="shield-logo">
          <Shield size={100} strokeWidth={1.8} />
          <Eye className="eye-icon" size={45} />
        </div>

        <h1>AI GUARDIAN</h1>

        <p>
          Intelligent Intrusion Detection &<br />
          Emergency Response
        </p>
      </div>

      <div className="splash-bottom">
        <p>Your Safety, Our Priority</p>

        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>

        <span>Loading...</span>

        <button className="continue-btn" onClick={onFinish}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Splash;