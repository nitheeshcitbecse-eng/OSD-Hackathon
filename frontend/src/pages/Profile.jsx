import {
  ArrowLeft,
  Home,
  Monitor,
  CreditCard,
  CircleHelp,
  Info,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Pencil,
} from "lucide-react";

function Profile({ setScreen }) {
  const options = [
    [Home, "Home Information", "My Home"],
    [Monitor, "Connected Devices", "3 Devices"],
    [CreditCard, "Subscription", "Premium"],
    [CircleHelp, "Help & Support", ""],
    [Info, "About AI Guardian", "v1.0.0"],
  ];

  return (
    <div className="web-page">
      <header className="inner-web-header">
        <div className="inner-title">
          <button onClick={() => setScreen("dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>My Profile</h1>
            <p>Manage your account and subscription</p>
          </div>
        </div>
      </header>

      <main className="profile-web-content">
        <section className="profile-web-card">
          <div className="profile-web-top">
            <div className="profile-web-avatar">
              👨
            </div>

            <div className="profile-web-details">
              <h2>Nitheesh S</h2>
              <p>nitheesh@example.com</p>
              <span>+91 98765 43210</span>

              <div className="premium-badge">
                <ShieldCheck size={15} />
                Premium Member
              </div>
            </div>

            <button className="edit-profile-button">
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </section>

        <section className="profile-settings-panel">
          {options.map(([Icon, title, value], index) => (
            <div className="profile-web-row" key={index}>
              <div className="profile-option-icon">
                <Icon size={20} />
              </div>

              <strong>{title}</strong>

              {value && <span>{value}</span>}

              <ChevronRight size={18} />
            </div>
          ))}
        </section>

        <button
          className="profile-logout-button"
          onClick={() => setScreen("login")}
        >
          <LogOut size={19} />
          Logout from AI Guardian
        </button>
      </main>
    </div>
  );
}

export default Profile;