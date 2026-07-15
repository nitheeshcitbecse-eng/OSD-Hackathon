import {
  Menu,
  Bell,
  ShieldCheck,
  Camera,
  Home,
  History,
  Settings,
  Activity,
  Siren
} from "lucide-react";

function Dashboard() {
  return (
    <div className="mobile-screen dashboard-screen">
      <header className="dashboard-header">
        <Menu size={24} />

        <h3>My Home⌄</h3>

        <Bell size={23} />
      </header>

      <main className="dashboard-content">
        <div className="secure-card">
          <div>
            <h2>Home Secure</h2>
            <p>All systems are active</p>
          </div>

          <ShieldCheck size={45} />
        </div>

        <div className="status-card">
          <div>
            <span>AI Status</span>
            <p>Running</p>
          </div>

          <Activity size={70} />
        </div>

        <div className="camera-card">
          <Camera size={35} />

          <div>
            <span>Connected Cameras</span>
            <p>3 Cameras Active</p>
          </div>

          <span>›</span>
        </div>

        <div className="recent-title">
          <h3>Recent Alerts</h3>
          <span>View All</span>
        </div>

        <div className="alert-card">
          <div className="alert-image">👤</div>

          <div className="alert-info">
            <h4>Unknown Person</h4>
            <p>Front Door</p>
          </div>

          <span className="time">10:42 PM</span>

          <span className="high">High</span>
        </div>

        <div className="alert-card">
          <div className="alert-image">📷</div>

          <div className="alert-info">
            <h4>Motion Detected</h4>
            <p>Backyard</p>
          </div>

          <span className="time">08:15 PM</span>

          <span className="low">Low</span>
        </div>

        <button className="emergency-btn">
          <Siren size={21} />
          Emergency
        </button>
      </main>

      <nav className="bottom-nav">
        <div className="nav-active">
          <Home />
          <span>Home</span>
        </div>

        <div>
          <Camera />
          <span>Live</span>
        </div>

        <div>
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

export default Dashboard;