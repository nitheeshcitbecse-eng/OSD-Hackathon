import {
  ArrowLeft,
  Mic,
  Volume2,
  Camera,
  Home,
  Bell,
  History,
  Settings,
  Video,
  Square,
} from "lucide-react";

function LiveCamera({ setScreen }) {
  return (
    <div className="mobile-screen live-screen">
      <header className="page-header">
        <ArrowLeft onClick={() => setScreen("dashboard")} />
        <h3>Front Door Camera⌄</h3>
        <span className="live-text">● LIVE</span>
      </header>

      <div className="camera-feed">
        <div className="detected-person">
          <span>Unknown Person</span>
          <div className="person-body">👤</div>
        </div>
      </div>

      <div className="camera-controls">
        <button><Mic /></button>
        <button><Volume2 /></button>

        <button className="record-btn">
          <Square size={22} />
        </button>

        <button><Camera /></button>
        <button><Mic /></button>
      </div>

      <nav className="bottom-nav">
        <div onClick={() => setScreen("dashboard")}>
          <Home />
          <span>Home</span>
        </div>

        <div className="nav-active">
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

export default LiveCamera;