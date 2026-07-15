import { useState, useEffect } from "react";
import { api } from "../api";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Search,
} from "lucide-react";

function ActivityHistory({ setScreen, goBack }) {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const data = await api.alerts.getAll();
      setActivities(data);
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((a) =>
    (a.location || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.riskLevel || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="web-page" style={{ padding: "30px", minHeight: "100vh", color: "#fff", background: "#0a0a0f" }}>
      <header className="inner-web-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div className="inner-title" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button 
            onClick={goBack}
            style={{ background: "none", border: "none", color: "#8a8f98", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <ArrowLeft size={24} />
          </button>

          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>Activity History</h1>
            <p style={{ margin: "5px 0 0", color: "#8a8f98", fontSize: "14px" }}>View previous security activities and events</p>
          </div>
        </div>

        <button className="export-button" style={{ background: "#ff4a4a", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
          <Download size={17} />
          Export History
        </button>
      </header>

      <main className="inner-web-content">
        <div className="history-toolbar" style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", gap: "15px", flexWrap: "wrap" }}>
          <div className="web-search-box" style={{ position: "relative", display: "flex", alignItems: "center", minWidth: "260px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", color: "#8a8f98" }} />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", background: "#111116", border: "1px solid #22222a", borderRadius: "8px", padding: "10px 10px 10px 38px", color: "#fff", fontSize: "14px" }}
            />
          </div>

          <button className="history-date-button" style={{ background: "#111116", border: "1px solid #22222a", color: "#fff", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <CalendarDays size={17} />
            Live Database
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#8a8f98", textAlign: "center", padding: "40px" }}>Loading activity logs...</div>
        ) : (
          <section className="history-table-panel" style={{ background: "#111116", border: "1px solid #22222a", borderRadius: "12px", overflow: "hidden" }}>
            <div className="history-table-heading" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", padding: "15px 20px", background: "#171721", borderBottom: "1px solid #22222a", color: "#8a8f98", fontSize: "12px", fontWeight: "bold" }}>
              <span>ACTIVITY</span>
              <span>LOCATION</span>
              <span>DATE</span>
              <span>TIME</span>
              <span>STATUS</span>
            </div>

            {filteredActivities.length === 0 ? (
              <div style={{ padding: "45px", textAlign: "center", color: "#8a8f98" }}>
                No activities logged in the security database.
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  className="desktop-history-row"
                  key={activity.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
                    padding: "15px 20px",
                    borderBottom: "1px solid #22222a",
                    alignItems: "center",
                  }}
                >
                  <div className="history-activity" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="desktop-alert-image" style={{ width: "35px", height: "35px", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
                      {activity.imageUrl ? (
                        <img src={activity.imageUrl} alt="Alert" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        "📷"
                      )}
                    </div>
                    <strong>{activity.riskLevel === "critical" ? "Critical Security Breach" : "Intrusion Detection Alert"}</strong>
                  </div>

                  <span style={{ color: "#e1e1e6" }}>{activity.location || "Monitored Area"}</span>

                  <span style={{ color: "#8a8f98" }}>{new Date(activity.timestamp).toLocaleDateString()}</span>

                  <span style={{ color: "#8a8f98" }}>{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  <strong
                    className={`history-${activity.resolved ? "safe" : "alert"}`}
                    style={{
                      color: activity.resolved ? "#4aff7a" : "#ff4a4a",
                      textTransform: "capitalize",
                    }}
                  >
                    {activity.resolved ? "Resolved" : "Active Alert"}
                  </strong>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default ActivityHistory;