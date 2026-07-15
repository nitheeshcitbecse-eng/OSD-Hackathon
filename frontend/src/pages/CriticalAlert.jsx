import {
  ShieldAlert,
  Phone,
  Users,
  Siren,
  X,
  MapPin,
  Camera,
  Clock,
} from "lucide-react";

function CriticalAlert({ setScreen }) {
  return (
    <div className="critical-web-page">
      <div className="critical-web-background">
        <div className="critical-web-modal">
          <button
            className="critical-web-close"
            onClick={() => setScreen("dashboard")}
          >
            <X size={21} />
          </button>

          <div className="critical-web-heading">
            <div className="critical-web-icon">
              <ShieldAlert size={38} />
            </div>

            <div>
              <h1>CRITICAL SECURITY ALERT</h1>
              <p>Immediate attention required</p>
            </div>
          </div>

          <div className="critical-web-grid">
            <section className="critical-camera-section">
              <div className="critical-camera-header">
                <Camera size={18} />
                Front Door Camera
              </div>

              <div className="critical-web-image">
                <div className="critical-person-box">
                  <span>UNKNOWN PERSON · 96%</span>
                  <div>👤</div>
                </div>
              </div>
            </section>

            <section className="critical-information">
              <h2>Unknown Person Detected</h2>

              <p>
                AI Guardian has detected an unauthorized person
                near your home.
              </p>

              <div className="critical-info-row">
                <MapPin size={19} />

                <div>
                  <span>LOCATION</span>
                  <strong>Front Door</strong>
                </div>
              </div>

              <div className="critical-info-row">
                <ShieldAlert size={19} />

                <div>
                  <span>CONFIDENCE LEVEL</span>
                  <strong>96% AI Confidence</strong>
                </div>
              </div>

              <div className="critical-info-row">
                <Clock size={19} />

                <div>
                  <span>DETECTED AT</span>
                  <strong>Today, 10:42 PM</strong>
                </div>
              </div>

              <div className="critical-countdown-panel">
                <span>
                  Emergency actions automatically start in
                </span>

                <strong>00:27</strong>

                <p>
                  Police and emergency contacts will be notified
                </p>
              </div>
            </section>
          </div>

          <div className="critical-web-actions">
            <button
              className="critical-police"
              onClick={() => setScreen("emergency")}
            >
              <Phone size={19} />
              Call Police
            </button>

            <button className="critical-family">
              <Users size={19} />
              Notify Family
            </button>

            <button
              className="critical-false"
              onClick={() => setScreen("dashboard")}
            >
              <Siren size={19} />
              Mark as False Alarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CriticalAlert;