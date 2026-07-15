import { useState, useEffect } from "react";
import { api } from "../api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  UserCheck,
  X,
  Upload,
} from "lucide-react";

const IMAGE_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
];

function FamilyFaces({ setScreen, goBack }) {
  const [faces, setFaces] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const response = await api.upload.image(file);
      setImageUrl(response.imageUrl);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const loadFaces = async () => {
    try {
      const data = await api.familyFaces.getAll();
      setFaces(data);
    } catch (err) {
      console.error("Failed to load faces:", err);
      setError("Failed to load family members");
    }
  };

  useEffect(() => {
    loadFaces();
  }, []);

  const handleAddFace = async (e) => {
    e.preventDefault();
    if (!name || !imageUrl) return;
    setLoading(true);
    setError("");
    try {
      const newFace = await api.familyFaces.create({
        name,
        imageUrl,
      });
      setFaces([newFace, ...faces]);
      setName("");
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || "Failed to register family face");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFace = async (id) => {
    setError("");
    try {
      await api.familyFaces.delete(id);
      setFaces(faces.filter((f) => f.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete face record");
    }
  };

  const filteredFaces = faces.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
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
            <h1 style={{ margin: 0, fontSize: "24px" }}>Family Faces</h1>
            <p style={{ margin: "5px 0 0", color: "#8a8f98", fontSize: "14px" }}>Manage people recognized by AI Guardian</p>
          </div>
        </div>

        <button 
          className="primary-web-button" 
          onClick={() => setShowAddForm(true)}
          style={{ background: "#ff4a4a", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}
        >
          <Plus size={18} />
          Register Face
        </button>
      </header>

      {error && (
        <div style={{ color: "#ff4a4a", background: "rgba(255, 74, 74, 0.1)", border: "1px solid #ff4a4a", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <main className="inner-web-content">
        <div className="family-summary-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div className="summary-card" style={{ background: "#111116", border: "1px solid #22222a", padding: "20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "15px" }}>
            <UserCheck size={28} style={{ color: "#ff4a4a" }} />
            <div>
              <span style={{ fontSize: "12px", color: "#8a8f98", textTransform: "uppercase" }}>AUTHORIZED FACES</span>
              <strong style={{ display: "block", fontSize: "20px" }}>{faces.length} Members</strong>
            </div>
          </div>

          <div className="summary-card" style={{ background: "#111116", border: "1px solid #22222a", padding: "20px", borderRadius: "12px" }}>
            <span style={{ fontSize: "12px", color: "#8a8f98", textTransform: "uppercase" }}>AI RECOGNITION</span>
            <strong className="green-text" style={{ display: "block", fontSize: "20px", color: "#4aff7a" }}>Active</strong>
            <p style={{ margin: "5px 0 0", color: "#8a8f98", fontSize: "12px" }}>Face detection engine running</p>
          </div>
        </div>

        <div className="web-list-toolbar" style={{ marginBottom: "20px" }}>
          <div className="web-search-box" style={{ position: "relative", display: "flex", alignItems: "center", maxWidth: "300px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", color: "#8a8f98" }} />
            <input 
              placeholder="Search family members..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", background: "#111116", border: "1px solid #22222a", borderRadius: "8px", padding: "10px 10px 10px 38px", color: "#fff", fontSize: "14px" }}
            />
          </div>
        </div>

        <section className="web-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px" }}>
          {filteredFaces.map((person) => (
            <div 
              className="family-web-card" 
              key={person.id}
              style={{ position: "relative", background: "#111116", border: "1px solid #22222a", padding: "25px", borderRadius: "12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
            >
              <button 
                onClick={() => handleDeleteFace(person.id)}
                style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#8a8f98", cursor: "pointer", transition: "0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ff4a4a"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#8a8f98"}
              >
                <Trash2 size={16} />
              </button>

              <div 
                className="family-web-avatar"
                style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", border: "2px solid #ff4a4a", marginBottom: "10px" }}
              >
                <img src={person.imageUrl} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              <h3 style={{ margin: 0, fontSize: "18px" }}>{person.name}</h3>

              <span 
                className="authorized-badge"
                style={{ background: "rgba(74, 255, 122, 0.15)", border: "1px solid #4aff7a", color: "#4aff7a", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
              >
                Authorized
              </span>

              <small style={{ color: "#8a8f98", fontSize: "11px", marginTop: "5px" }}>
                Added {new Date(person.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </section>
      </main>

      {/* Add Face Dialog Modal */}
      {showAddForm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#111116", border: "1px solid #22222a", width: "400px", padding: "30px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "18px", margin: 0 }}>Register New Face</h2>
              <button onClick={() => setShowAddForm(false)} style={{ background: "none", border: "none", color: "#8a8f98", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddFace} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", color: "#8a8f98", marginBottom: "8px" }}>Name / Label</label>
                <input
                  type="text"
                  placeholder="e.g. Sister, John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: "100%", background: "#0a0a0f", border: "1px solid #22222a", borderRadius: "8px", padding: "12px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", color: "#8a8f98", marginBottom: "8px" }}>Profile Photo</label>
                
                {/* Upload Image Section */}
                <div style={{
                  border: "2px dashed #22222a",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center",
                  background: "#0a0a0f",
                  marginBottom: "15px",
                  cursor: "pointer",
                  position: "relative"
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0,
                      cursor: "pointer",
                      width: "100%"
                    }}
                  />
                  <Upload size={24} style={{ color: "#8a8f98", marginBottom: "5px" }} />
                  <p style={{ margin: 0, fontSize: "12px", color: "#8a8f98" }}>
                    {uploading ? "Uploading to Cloudinary..." : "Click or drag image to upload"}
                  </p>
                  {uploadError && (
                    <p style={{ margin: "5px 0 0", fontSize: "11px", color: "#ff4a4a" }}>{uploadError}</p>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "15px 0 10px", color: "#8a8f98", fontSize: "12px" }}>
                  <div style={{ flex: 1, height: "1px", background: "#22222a" }}></div>
                  <span>OR CHOOSE PRESET</span>
                  <div style={{ flex: 1, height: "1px", background: "#22222a" }}></div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  {IMAGE_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(url)}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: imageUrl === url ? "3px solid #ff4a4a" : "1px solid #444",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <img src={url} alt="Preset" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Or enter custom Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  style={{ width: "100%", background: "#0a0a0f", border: "1px solid #22222a", borderRadius: "8px", padding: "12px", color: "#fff", fontSize: "12px" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ background: "#ff4a4a", border: "none", color: "#fff", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "0.2s", marginTop: "10px" }}
              >
                {loading ? "Registering..." : "Add to Registry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FamilyFaces;