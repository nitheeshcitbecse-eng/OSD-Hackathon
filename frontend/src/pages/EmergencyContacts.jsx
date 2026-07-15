import { useState, useEffect } from "react";
import { api } from "../api";
import {
  ArrowLeft,
  Phone,
  User,
  Plus,
  Trash2,
  Check,
  ShieldAlert,
  Mail,
} from "lucide-react";

function EmergencyContacts({ setScreen, goBack }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadContacts = async () => {
    try {
      const data = await api.contacts.getAll();
      setContacts(data);
    } catch (err) {
      console.error("Failed to load contacts:", err);
      setError("Failed to load emergency contacts");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!name || !phoneNumber) return;
    setLoading(true);
    setError("");
    try {
      const newContact = await api.contacts.create({
        name,
        phoneNumber,
        email: email || null,
        notifyOnCritical,
      });
      setContacts([...contacts, newContact]);
      setName("");
      setPhoneNumber("");
      setEmail("");
      setNotifyOnCritical(true);
    } catch (err) {
      setError(err.message || "Failed to add contact");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    setError("");
    try {
      await api.contacts.delete(id);
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete contact");
    }
  };

  const handleToggleNotify = async (contact) => {
    try {
      const updated = await api.contacts.update(contact.id, {
        notifyOnCritical: !contact.notifyOnCritical,
      });
      setContacts(contacts.map((c) => (c.id === contact.id ? updated : c)));
    } catch (err) {
      setError("Failed to update notification settings");
    }
  };

  return (
    <div className="web-page emergency-web-page" style={{ padding: "30px", minHeight: "100vh", color: "#fff", background: "#0a0a0f" }}>
      <header className="inner-web-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div className="inner-title" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button 
            onClick={goBack}
            style={{ background: "none", border: "none", color: "#8a8f98", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <ArrowLeft size={24} />
          </button>

          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>Emergency Contacts</h1>
            <p style={{ margin: "5px 0 0", color: "#8a8f98", fontSize: "14px" }}>Manage immediate notification contacts</p>
          </div>
        </div>

        <div className="emergency-status" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255, 74, 74, 0.15)", border: "1px solid #ff4a4a", padding: "8px 12px", borderRadius: "20px", color: "#ff4a4a", fontSize: "14px", fontWeight: "bold" }}>
          <ShieldAlert size={18} />
          Response Team
        </div>
      </header>

      {error && (
        <div style={{ color: "#ff4a4a", background: "rgba(255, 74, 74, 0.1)", border: "1px solid #ff4a4a", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Left: Add Contact Form */}
        <section style={{ background: "#111116", border: "1px solid #22222a", padding: "25px", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "20px", borderBottom: "1px solid #22222a", paddingBottom: "10px" }}>Add Emergency Contact</h2>
          
          <form onSubmit={handleAddContact} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#8a8f98", marginBottom: "8px" }}>Full Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={18} style={{ position: "absolute", left: "12px", color: "#8a8f98" }} />
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: "100%", background: "#0a0a0f", border: "1px solid #22222a", borderRadius: "8px", padding: "12px 12px 12px 40px", color: "#fff", fontSize: "14px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#8a8f98", marginBottom: "8px" }}>Phone Number</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Phone size={18} style={{ position: "absolute", left: "12px", color: "#8a8f98" }} />
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{ width: "100%", background: "#0a0a0f", border: "1px solid #22222a", borderRadius: "8px", padding: "12px 12px 12px 40px", color: "#fff", fontSize: "14px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#8a8f98", marginBottom: "8px" }}>Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={18} style={{ position: "absolute", left: "12px", color: "#8a8f98" }} />
                <input
                  type="email"
                  placeholder="Enter email address (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", background: "#0a0a0f", border: "1px solid #22222a", borderRadius: "8px", padding: "12px 12px 12px 40px", color: "#fff", fontSize: "14px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
              <input
                type="checkbox"
                id="notifyOnCritical"
                checked={notifyOnCritical}
                onChange={(e) => setNotifyOnCritical(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label htmlFor="notifyOnCritical" style={{ fontSize: "14px", cursor: "pointer" }}>Notify on Critical Intrusion Alerts</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: "#ff4a4a", border: "none", color: "#fff", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "0.2s" }}
            >
              <Plus size={18} />
              {loading ? "Adding..." : "Add Contact"}
            </button>
          </form>
        </section>

        {/* Right: Contact List */}
        <section style={{ background: "#111116", border: "1px solid #22222a", padding: "25px", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "20px", borderBottom: "1px solid #22222a", paddingBottom: "10px" }}>Emergency Contact Registry</h2>
          
          {contacts.length === 0 ? (
            <div style={{ color: "#8a8f98", padding: "40px", textAlign: "center" }}>
              No emergency contacts registered yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {contacts.map((contact) => (
                <div key={contact.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0f", border: "1px solid #22222a", padding: "15px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{ background: "rgba(255, 74, 74, 0.1)", color: "#ff4a4a", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "16px" }}>{contact.name}</strong>
                      <span style={{ color: "#8a8f98", fontSize: "14px", display: "block" }}>{contact.phoneNumber}</span>
                      {contact.email && <span style={{ color: "#8a8f98", fontSize: "12px", display: "block", marginTop: "2px" }}>{contact.email}</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <button
                      onClick={() => handleToggleNotify(contact)}
                      style={{
                        background: contact.notifyOnCritical ? "rgba(74, 255, 122, 0.15)" : "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${contact.notifyOnCritical ? "#4aff7a" : "#444"}`,
                        color: contact.notifyOnCritical ? "#4aff7a" : "#8a8f98",
                        padding: "6px 12px",
                        borderRadius: "15px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {contact.notifyOnCritical && <Check size={12} />}
                      Notify Email
                    </button>

                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      style={{ background: "none", border: "none", color: "#ff4a4a", cursor: "pointer", padding: "5px" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmergencyContacts;