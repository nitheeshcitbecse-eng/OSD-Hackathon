import {
  Home,
  Video,
  Bell,
  History,
  Settings,
} from "lucide-react";

function Alerts({ setScreen }) {
  const alerts = [
    {
      icon: "👤",
      title: "Unknown Person",
      place: "Front Door",
      details: "10:42 PM · Confidence: 96%",
      level: "High",
    },
    {
      icon: "🌙",
      title: "Suspicious Activity",
      place: "Backyard",
      details: "09:15 PM · Confidence: 78%",
      level: "Medium",
    },
    {
      icon: "📷",
      title: "Motion Detected",
      place: "Living Room",
      details: "08:45 PM · Confidence: 60%",
      level: "Low",
    },
    {
      icon: "👤",
      title: "Unknown Person",
      place: "Garage",
      details: "Yesterday, 11:30 PM",
      level: "High",
    },
  ];

  return (
    <div className="mobile-screen alerts-screen">
      <header className="alerts-header">
        <h2>Alerts</h2>
      </header>

      <div className="alert-filters">
        <button className="filter-active">All</button>
        <button>High</button>
        <button>Medium</button>
        <button>Low</button>
      </div>

      <main className="alerts-content">
        {alerts.map((alert, index) => (
          <div className="full-alert-card" key={index}>
            <div className="alert-thumbnail">
              {alert.icon}
            </div>

            <div className="full-alert-info">
              <h4>{alert.title}</h4>
              <p>{alert.place}</p>
              <span>{alert.details}</span>
            </div>

            <span className={`level ${alert.level.toLowerCase()}`}>
              {alert.level}
            </span>
          </div>
        ))}
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

        <div className="nav-active">
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

export default Alerts;