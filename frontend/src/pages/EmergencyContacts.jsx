import {
  ArrowLeft,
  ShieldAlert,
  Phone,
  Users,
  MapPin,
  Siren,
  Radio,
} from "lucide-react";

function Emergency({ setScreen }) {
  return (
    <div className="web-page emergency-web-page">
      <header className="inner-web-header">
        <div className="inner-title">
          <button onClick={() => setScreen("dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Emergency Response</h1>
            <p>Immediate security and emergency assistance</p>
          </div>
        </div>

        <div className="emergency-status">
          <ShieldAlert size={18} />
          Emergency Center
        </div>
      </header>

      <main className="emergency-web-content">
        <section className="emergency-main-panel">
          <div className="emergency-web-icon">
            <ShieldAlert size={55} />
          </div>

          <h1>Need Immediate Help?</h1>

          <p>
            Activate emergency response to immediately notify
            authorities and your emergency contacts.
          </p>

          <button className="web-big-emergency">
            <Siren size={35} />
            <div>
              <strong>EMERGENCY</strong>
              <span>Click to activate emergency response</span>
            </div>
          </button>

          <div className="emergency-info">
            <Radio size={18} />

            <span>
              Your live camera feed and current location will be
              shared automatically.
            </span>
          </div>
        </section>

        <section className="emergency-actions-panel">
          <h2>Quick Emergency Actions</h2>

          <p>
            Choose an action for immediate assistance
          </p>

          <div className="emergency-web-grid">
            <button className="police-action">
              <Phone size={27} />

              <div>
                <strong>Call Police</strong>
                <span>Contact local police immediately</span>
              </div>
            </button>

            <button>
              <Users size={27} />

              <div>
                <strong>Notify Family</strong>
                <span>Alert all emergency contacts</span>
              </div>
            </button>

            <button>
              <MapPin size={27} />

              <div>
                <strong>Share Location</strong>
                <span>Send your real-time location</span>
              </div>
            </button>

            <button className="siren-action">
              <Siren size={27} />

              <div>
                <strong>Activate Siren</strong>
                <span>Trigger the home security alarm</span>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Emergency;