import {
  ArrowLeft,
  ShieldAlert,
  Phone,
  Users,
  MapPin,
  Siren,
  Home,
  Video,
  Bell,
  History,
  Settings,
} from "lucide-react";

function Emergency({ setScreen }) {
  return (
    <div className="mobile-screen emergency-screen">
      <header className="page-header">
        <ArrowLeft onClick={() => setScreen("dashboard")} />
        <h3>Emergency</h3>
        <ShieldAlert />
      </header>

      <main className="emergency-content">
        <button className="big-emergency">
          <strong>EMERGENCY</strong>
          <span>Tap to Call Police</span>
        </button>

        <div className="emergency-grid">
          <button>
            <Phone />
            <span>Call Police</span>
          </button>

          <button>
            <Users />
            <span>Notify Family</span>
          </button>

          <button>
            <MapPin />
            <span>Share Location</span>
          </button>

          <button>
            <Siren />
            <span>Activate Siren</span>
          </button>
        </div>

        <p className="emergency-note">
          Your location and live feed will be
          <br />
          shared immediately.
        </p>
      </main>

      <nav className="bottom-nav">
        <div onClick={() => setScreen("dashboard")}>
          <Home />
          <span>Home</span>
        </div>

        <div onClick={() => setScreen("live")}>
          <Video />
          <span>Live</span>
        </div>

        <div onClick={() => setScreen("alerts")}>
          <Bell />
          <span>Alerts</span>
        </div>

        <div>
          <History />
          <span>History</span>
        </div>

        <div>
          <Settings />
          <span>Settings</span>
        </div>
      </nav>
    </div>
  );
}

export default Emergency;