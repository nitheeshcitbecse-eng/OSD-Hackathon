import { useState, useEffect } from "react";
import { api } from "../api";
import {
  ShieldCheck,
  Camera,
  Home,
  History,
  Settings,
  Activity,
  Siren,
  Video,
  Users,
  Phone,
  UserCircle,
  Bell,
  Shield,
  LogOut,
} from "lucide-react";

function Dashboard({ setScreen }) {
  const [alerts, setAlerts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState({ name: "Nitheesh S", email: "" });

  useEffect(() => {
    // Get user details
    const savedUser = localStorage.getItem("iris_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Fetch alerts & settings
    const loadData = async () => {
      try {
        const fetchedAlerts = await api.alerts.getAll();
        setAlerts(fetchedAlerts);
      } catch (err) {
        console.error("Failed to load alerts:", err);
      }
      try {
        const fetchedSettings = await api.settings.get();
        setSettings(fetchedSettings);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    loadData();
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("iris_token");
    localStorage.removeItem("iris_user");
    setScreen("login");
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const isSecure = activeAlerts.length === 0;

  return (
    <div className="website-dashboard">

      <aside className="website-sidebar">

        <div className="website-logo">
          <Shield size={35} />
          <div>
            <h2>IRIS</h2>
            <span>Intelligent Recognition & Intrusion System</span>
          </div>
        </div>

        <div className="sidebar-menu">

          <button className="sidebar-active">
            <Home />
            Dashboard
          </button>

          <button onClick={() => setScreen("live")}>
            <Video />
            Live Camera
          </button>

          <button onClick={() => setScreen("alerts")}>
            <Bell />
            Alerts
          </button>

          <button onClick={() => setScreen("history")}>
            <History />
            Activity History
          </button>

          <button onClick={() => setScreen("family")}>
            <Users />
            Family Faces
          </button>

          <button onClick={() => setScreen("contacts")}>
            <Phone />
            Emergency Contacts
          </button>

          <button onClick={() => setScreen("settings")}>
            <Settings />
            Settings
          </button>

        </div>

        <div className="sidebar-profile">

          <UserCircle size={40} />

          <div>
            <strong>{user.name}</strong>
            <span>Premium User</span>
          </div>

          <LogOut
            size={19}
            style={{ cursor: "pointer" }}
            onClick={handleLogoutClick}
          />

        </div>

      </aside>


      <section className="website-main">

        <header className="website-header">

          <div>
            <h1>Security Dashboard</h1>
            <p>
              Monitor and protect your home with AI Guardian
            </p>
          </div>

          <div className="header-actions">

            <button
              className="notification-button"
              onClick={() => setScreen("critical")}
            >
              <Bell size={21} />
              <span></span>
            </button>

            <button
              className="profile-button"
              onClick={() => setScreen("profile")}
            >
              <UserCircle size={23} />
              {user.name}
            </button>

          </div>

        </header>


        <main className="website-content">

          <div className="website-status-grid">

            <div className={`web-status-card ${isSecure ? 'secure-web-card' : ''}`} style={!isSecure ? { background: 'linear-gradient(135deg, rgba(255, 74, 74, 0.2) 0%, rgba(20, 20, 25, 0.9) 100%)', border: '1px solid #ff4a4a' } : {}}>

              <div>
                <span>SECURITY STATUS</span>
                <h2>{isSecure ? "Home Secure" : "Breach Alert"}</h2>
                <p>{isSecure ? "All systems are active" : `${activeAlerts.length} unresolved issue(s)`}</p>
              </div>

              <ShieldCheck size={55} style={!isSecure ? { color: '#ff4a4a' } : {}} />

            </div>


            <div className="web-status-card">

              <div>
                <span>AI STATUS</span>
                <h2 className="green-text">
                  Running
                </h2>
                <p>Sensitivity: {settings?.alertSensitivity || 80}%</p>
              </div>

              <Activity
                className="green-text"
                size={55}
              />

            </div>


            <div
              className="web-status-card clickable"
              onClick={() => setScreen("live")}
            >

              <div>
                <span>CONNECTED CAMERAS</span>
                <h2>3 Cameras</h2>
                <p>All feeds active</p>
              </div>

              <Camera
                className="blue-text"
                size={55}
              />

            </div>

          </div>


          <div className="website-dashboard-grid">

            <section className="web-panel">

              <div className="web-panel-header">

                <div>
                  <h2>Recent Alerts</h2>
                  <p>
                    Latest security activities detected
                  </p>
                </div>

                <button
                  onClick={() => setScreen("alerts")}
                >
                  View All
                </button>

              </div>

              {alerts.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#8a8f98" }}>
                  No security alerts detected.
                </div>
              ) : (
                alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="web-alert-row"
                    onClick={() => {
                      if (alert.riskLevel === 'critical') {
                        setScreen("critical");
                      } else {
                        setScreen("alerts");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="web-alert-image" style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#1c1d24" }}>
                      {alert.imageUrl ? (
                        <img src={alert.imageUrl} alt="Alert" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        alert.riskLevel === "critical" ? "🚨" : "👤"
                      )}
                    </div>

                    <div className="web-alert-info">
                      <h3>{alert.riskLevel === "critical" ? "Critical Intrusion" : "Person Detected"}</h3>
                      <p>{alert.location || "Monitored Area"}</p>
                    </div>

                    <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                    <strong className={`web-${alert.riskLevel || 'medium'}`} style={{ textTransform: "capitalize" }}>
                      {alert.riskLevel}
                    </strong>
                  </div>
                ))
              )}

            </section>


            <section className="web-panel quick-panel">

              <div className="web-panel-header">

                <div>
                  <h2>Quick Actions</h2>
                  <p>Access important security controls</p>
                </div>

              </div>


              <button
                onClick={() => setScreen("live")}
              >
                <Video />
                <div>
                  <strong>Live Camera</strong>
                  <span>View real-time footage</span>
                </div>
              </button>


              <button
                onClick={() => setScreen("family")}
              >
                <Users />
                <div>
                  <strong>Family Faces</strong>
                  <span>Manage authorized people</span>
                </div>
              </button>


              <button
                onClick={() => setScreen("contacts")}
              >
                <Phone />
                <div>
                  <strong>Emergency Contacts</strong>
                  <span>Manage emergency contacts</span>
                </div>
              </button>


              <button
                className="web-emergency-button"
                onClick={() => setScreen("emergency")}
              >
                <Siren />
                Emergency
              </button>

            </section>

          </div>

        </main>

      </section>

    </div>
  );
}

export default Dashboard;