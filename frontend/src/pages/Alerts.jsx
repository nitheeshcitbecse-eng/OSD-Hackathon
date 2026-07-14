import {
  ArrowLeft,
  Search,
  Filter,
  Bell,
} from "lucide-react";

function Alerts({ setScreen }) {
  const alerts = [
    {
      icon: "👤",
      title: "Unknown Person",
      place: "Front Door",
      time: "Today, 10:42 PM",
      confidence: "96%",
      level: "High",
    },
    {
      icon: "🌙",
      title: "Suspicious Activity",
      place: "Backyard",
      time: "Today, 09:15 PM",
      confidence: "78%",
      level: "Medium",
    },
    {
      icon: "📷",
      title: "Motion Detected",
      place: "Living Room",
      time: "Today, 08:45 PM",
      confidence: "60%",
      level: "Low",
    },
    {
      icon: "👤",
      title: "Unknown Person",
      place: "Garage",
      time: "Yesterday, 11:30 PM",
      confidence: "91%",
      level: "High",
    },
    {
      icon: "📷",
      title: "Motion Detected",
      place: "Front Door",
      time: "Yesterday, 07:20 PM",
      confidence: "65%",
      level: "Low",
    },
  ];

  return (
    <div className="web-page">
      <header className="inner-web-header">
        <div className="inner-title">
          <button onClick={() => setScreen("dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Security Alerts</h1>
            <p>Review AI detected security activities</p>
          </div>
        </div>

        <div className="alerts-header-icon">
          <Bell size={21} />
          <span>5 New Alerts</span>
        </div>
      </header>

      <main className="inner-web-content">
        <div className="web-alert-toolbar">
          <div className="web-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search alerts..."
            />
          </div>

          <div className="web-alert-filters">
            <button className="web-filter-active">
              All
            </button>

            <button>High</button>
            <button>Medium</button>
            <button>Low</button>

            <button className="filter-icon-button">
              <Filter size={17} />
              Filter
            </button>
          </div>
        </div>

        <section className="alerts-table-panel">
          <div className="alerts-table-heading">
            <span>DETECTION</span>
            <span>LOCATION</span>
            <span>DATE & TIME</span>
            <span>CONFIDENCE</span>
            <span>SEVERITY</span>
          </div>

          {alerts.map((alert, index) => (
            <div
              className="desktop-alert-row"
              key={index}
              onClick={() =>
                alert.level === "High" &&
                setScreen("critical")
              }
            >
              <div className="desktop-alert-detection">
                <div className="desktop-alert-image">
                  {alert.icon}
                </div>

                <strong>{alert.title}</strong>
              </div>

              <span>{alert.place}</span>

              <span>{alert.time}</span>

              <span>{alert.confidence}</span>

              <strong
                className={`web-${alert.level.toLowerCase()}`}
              >
                {alert.level}
              </strong>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Alerts;