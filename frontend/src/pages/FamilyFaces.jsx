import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Search,
  UserCheck,
} from "lucide-react";

function FamilyFaces({ setScreen }) {
  const family = [
    ["👨", "Dad", "Rajesh Kumar", "Authorized", "12 Jul 2026"],
    ["👩", "Mom", "Priya Kumar", "Authorized", "10 Jul 2026"],
    ["👩", "Sister", "Ananya Kumar", "Authorized", "08 Jul 2026"],
    ["👨", "Me", "Nitheesh S", "Authorized", "01 Jul 2026"],
  ];

  return (
    <div className="web-page">
      <header className="inner-web-header">
        <div className="inner-title">
          <button onClick={() => setScreen("dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Family Faces</h1>
            <p>Manage people recognized by AI Guardian</p>
          </div>
        </div>

        <button className="primary-web-button">
          <Plus size={18} />
          Add Family Member
        </button>
      </header>

      <main className="inner-web-content">
        <div className="family-summary-grid">
          <div className="summary-card">
            <UserCheck size={28} />
            <div>
              <span>AUTHORIZED FACES</span>
              <strong>4 Members</strong>
            </div>
          </div>

          <div className="summary-card">
            <span>AI RECOGNITION</span>
            <strong className="green-text">Active</strong>
            <p>Face detection is running</p>
          </div>
        </div>

        <div className="web-list-toolbar">
          <div className="web-search-box">
            <Search size={18} />
            <input placeholder="Search family members..." />
          </div>
        </div>

        <section className="web-card-grid">
          {family.map((person, index) => (
            <div className="family-web-card" key={index}>
              <button className="card-menu-button">
                <MoreVertical size={19} />
              </button>

              <div className="family-web-avatar">
                {person[0]}
              </div>

              <h3>{person[1]}</h3>
              <p>{person[2]}</p>

              <span className="authorized-badge">
                {person[3]}
              </span>

              <small>Added {person[4]}</small>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default FamilyFaces;