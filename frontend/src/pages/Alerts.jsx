import { useState, useEffect } from "react";
import { api } from "../api";
import {
  ArrowLeft,
  Search,
  Bell,
  CheckCircle,
} from "lucide-react";

function Alerts({ setScreen, goBack }) {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const data = await api.alerts.getAll();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id, e) => {
    e.stopPropagation();
    try {
      const updated = await api.alerts.resolve(id);
      setAlerts(alerts.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      (a.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.riskLevel || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesSeverity =
      severityFilter === "all" ||
      (a.riskLevel || "").toLowerCase() === severityFilter.toLowerCase();
    
    return matchesSearch && matchesSeverity;
  });

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
            <h1 style={{ margin: 0, fontSize: "24px" }}>Security Alerts</h1>
            <p style={{ margin: "5px 0 0", color: "#8a8f98", fontSize: "14px" }}>Review AI detected security activities</p>
          </div>
        </div>

        <div className="alerts-header-icon" style={{ display: "flex", alignItems: "center", gap: "8px", background: unresolvedCount > 0 ? "rgba(255, 74, 74, 0.15)" : "rgba(74, 255, 122, 0.15)", border: `1px solid ${unresolvedCount > 0 ? '#ff4a4a' : '#4aff7a'}`, padding: "8px 15px", borderRadius: "20px", color: unresolvedCount > 0 ? "#ff4a4a" : "#4aff7a", fontSize: "14px", fontWeight: "bold" }}>
          <Bell size={18} />
          <span>{unresolvedCount} Active Alerts</span>
        </div>
      </header>

      <main className="inner-web-content">
        <div className="web-alert-toolbar" style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", gap: "15px", flexWrap: "wrap" }}>
          <div className="web-search-box" style={{ position: "relative", display: "flex", alignItems: "center", minWidth: "260px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", color: "#8a8f98" }} />
            <input
              type="text"
              placeholder="Search alerts by location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", background: "#111116", border: "1px solid #22222a", borderRadius: "8px", padding: "10px 10px 10px 38px", color: "#fff", fontSize: "14px" }}
            />
          </div>

          <div className="web-alert-filters" style={{ display: "flex", gap: "8px" }}>
            {["all", "critical", "high", "medium", "low"].map((level) => (
              <button
                key={level}
                onClick={() => setSeverityFilter(level)}
                style={{
                  background: severityFilter === level ? "#ff4a4a" : "#111116",
                  border: `1px solid ${severityFilter === level ? "#ff4a4a" : "#22222a"}`,
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  textTransform: "capitalize",
                  fontWeight: severityFilter === level ? "bold" : "normal",
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ color: "#8a8f98", textAlign: "center", padding: "40px" }}>Loading security alerts...</div>
        ) : (
          <section className="alerts-table-panel" style={{ background: "#111116", border: "1px solid #22222a", borderRadius: "12px", overflow: "hidden" }}>
            <div className="alerts-table-heading" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr", padding: "15px 20px", background: "#171721", borderBottom: "1px solid #22222a", color: "#8a8f98", fontSize: "12px", fontWeight: "bold" }}>
              <span>DETECTION</span>
              <span>LOCATION</span>
              <span>DATE & TIME</span>
              <span>CONFIDENCE</span>
              <span>SEVERITY</span>
              <span>ACTION</span>
            </div>

            {filteredAlerts.length === 0 ? (
              <div style={{ padding: "45px", textAlign: "center", color: "#8a8f98" }}>
                No alerts match the selected filters.
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  className="desktop-alert-row"
                  key={alert.id}
                  onClick={() => alert.riskLevel === "critical" && setScreen("critical")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
                    padding: "15px 20px",
                    borderBottom: "1px solid #22222a",
                    alignItems: "center",
                    cursor: alert.riskLevel === "critical" ? "pointer" : "default",
                    background: alert.resolved ? "transparent" : "rgba(255, 74, 74, 0.03)",
                  }}
                >
                  <div className="desktop-alert-detection" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="desktop-alert-image" style={{ width: "35px", height: "35px", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
                      {alert.imageUrl ? (
                        <img src={alert.imageUrl} alt="Alert" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        "👤"
                      )}
                    </div>
                    <strong>{alert.riskLevel === "critical" ? "Emergency Alarm Triggered" : "Person Detected"}</strong>
                  </div>

                  <span style={{ color: "#e1e1e6" }}>{alert.location || "Monitored Area"}</span>

                  <span style={{ color: "#8a8f98" }}>
                    {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <span style={{ color: "#8a8f98" }}>{alert.confidenceScore ? `${alert.confidenceScore.toFixed(0)}%` : "N/A"}</span>

                  <strong className={`web-${alert.riskLevel || 'medium'}`} style={{ textTransform: "capitalize" }}>
                    {alert.riskLevel}
                  </strong>

                  <div>
                    {alert.resolved ? (
                      <span style={{ color: "#4aff7a", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}>
                        <CheckCircle size={14} /> Resolved
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleResolve(alert.id, e)}
                        style={{
                          background: "rgba(255, 74, 74, 0.1)",
                          border: "1px solid #ff4a4a",
                          color: "#ff4a4a",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                          transition: "0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#ff4a4a";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255, 74, 74, 0.1)";
                          e.currentTarget.style.color = "#ff4a4a";
                        }}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Alerts;