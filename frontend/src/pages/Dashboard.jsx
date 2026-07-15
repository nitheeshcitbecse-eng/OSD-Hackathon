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
            <strong>Nitheesh S</strong>
            <span>Premium User</span>
          </div>

          <LogOut
            size={19}
            onClick={() => setScreen("login")}
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
              Nitheesh S
            </button>

          </div>

        </header>


        <main className="website-content">

          <div className="website-status-grid">

            <div className="web-status-card secure-web-card">

              <div>
                <span>SECURITY STATUS</span>
                <h2>Home Secure</h2>
                <p>All systems are active</p>
              </div>

              <ShieldCheck size={55} />

            </div>


            <div className="web-status-card">

              <div>
                <span>AI STATUS</span>
                <h2 className="green-text">
                  Running
                </h2>
                <p>Real-time monitoring active</p>
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
                <p>All cameras active</p>
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


              <div
                className="web-alert-row"
                onClick={() => setScreen("critical")}
              >

                <div className="web-alert-image">
                  👤
                </div>

                <div className="web-alert-info">
                  <h3>Unknown Person</h3>
                  <p>Front Door</p>
                </div>

                <span>Today, 10:42 PM</span>

                <strong className="web-high">
                  High
                </strong>

              </div>


              <div className="web-alert-row">

                <div className="web-alert-image">
                  🌙
                </div>

                <div className="web-alert-info">
                  <h3>Suspicious Activity</h3>
                  <p>Backyard</p>
                </div>

                <span>Today, 09:15 PM</span>

                <strong className="web-medium">
                  Medium
                </strong>

              </div>


              <div className="web-alert-row">

                <div className="web-alert-image">
                  📷
                </div>

                <div className="web-alert-info">
                  <h3>Motion Detected</h3>
                  <p>Living Room</p>
                </div>

                <span>Today, 08:45 PM</span>

                <strong className="web-low">
                  Low
                </strong>

              </div>

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