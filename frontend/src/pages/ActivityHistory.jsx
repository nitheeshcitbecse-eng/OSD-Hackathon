import {
  ArrowLeft,
  CalendarDays,
  Download,
  Search,
} from "lucide-react";

function ActivityHistory({ setScreen }) {
  const activities = [
    {
      icon: "👤",
      title: "Unknown Person Detected",
      place: "Front Door",
      date: "14 July 2026",
      time: "10:42 PM",
      status: "Alert",
    },
    {
      icon: "🌙",
      title: "Suspicious Activity",
      place: "Backyard",
      date: "14 July 2026",
      time: "09:15 PM",
      status: "Alert",
    },
    {
      icon: "📷",
      title: "Motion Detected",
      place: "Living Room",
      date: "14 July 2026",
      time: "08:45 PM",
      status: "Recorded",
    },
    {
      icon: "👨",
      title: "Authorized Person",
      place: "Front Door",
      date: "13 July 2026",
      time: "06:30 PM",
      status: "Safe",
    },
    {
      icon: "📷",
      title: "Motion Detected",
      place: "Garage",
      date: "13 July 2026",
      time: "02:15 PM",
      status: "Recorded",
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
            <h1>Activity History</h1>
            <p>
              View previous security activities and events
            </p>
          </div>
        </div>

        <button className="export-button">
          <Download size={17} />
          Export History
        </button>
      </header>

      <main className="inner-web-content">
        <div className="history-toolbar">
          <div className="web-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search activities..."
            />
          </div>

          <button className="history-date-button">
            <CalendarDays size={17} />
            01 Jul 2026 - 14 Jul 2026
          </button>
        </div>

        <section className="history-table-panel">
          <div className="history-table-heading">
            <span>ACTIVITY</span>
            <span>LOCATION</span>
            <span>DATE</span>
            <span>TIME</span>
            <span>STATUS</span>
          </div>

          {activities.map((activity, index) => (
            <div
              className="desktop-history-row"
              key={index}
            >
              <div className="history-activity">
                <div className="desktop-alert-image">
                  {activity.icon}
                </div>

                <strong>{activity.title}</strong>
              </div>

              <span>{activity.place}</span>

              <span>{activity.date}</span>

              <span>{activity.time}</span>

              <strong
                className={`history-${activity.status.toLowerCase()}`}
              >
                {activity.status}
              </strong>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ActivityHistory;