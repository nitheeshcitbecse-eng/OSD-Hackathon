import { useContext, useState, useEffect } from "react";
import { api } from "../api";
import {
  ArrowLeft,
  ChevronRight,
  Bell,
  Camera,
  Shield,
  Moon,
} from "lucide-react";

import { ThemeContext } from "../context/ThemeContext";

function SettingsPage({ setScreen, goBack }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    alertSensitivity: 80,
    nightMode: false,
    autoEmergencyTimer: 10,
    sirenVolume: 100,
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  const loadSettings = async () => {
    try {
      const data = await api.settings.get();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettingField = async (field, value) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    setSaveStatus("Saving...");
    try {
      await api.settings.update({ [field]: value });
      setSaveStatus("Saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      console.error("Failed to save setting:", err);
      setSaveStatus("Error saving");
    }
  };

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
            <h1 style={{ margin: 0, fontSize: "24px" }}>Settings</h1>
            <p style={{ margin: "5px 0 0", color: "#8a8f98", fontSize: "14px" }}>Configure your AI Guardian preferences</p>
          </div>
        </div>

        {saveStatus && (
          <span style={{ fontSize: "14px", color: saveStatus === "Error saving" ? "#ff4a4a" : "#4aff7a", fontWeight: "bold" }}>
            {saveStatus}
          </span>
        )}
      </header>

      {loading ? (
        <div style={{ color: "#8a8f98", textAlign: "center", padding: "40px" }}>Loading preferences...</div>
      ) : (
        <main className="settings-web-content" style={{ display: "flex", flexDirection: "column", gap: "25px", maxWidth: "600px" }}>
          <SettingsSection
            icon={<Shield />}
            title="Security Settings"
            description="Configure AI detection and security controls"
          >
            <div className="setting-web-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111116", border: "1px solid #22222a", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
              <div>
                <strong style={{ display: "block" }}>Alert Sensitivity ({settings.alertSensitivity}%)</strong>
                <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#8a8f98" }}>Control how sensitive AI detection should be</p>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.alertSensitivity}
                onChange={(e) => updateSettingField("alertSensitivity", parseInt(e.target.value))}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="setting-web-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111116", border: "1px solid #22222a", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
              <div>
                <strong style={{ display: "block" }}>Night Mode Monitoring</strong>
                <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#8a8f98" }}>Increase monitoring sensitivity at night automatically</p>
              </div>
              <label className="switch" style={{ position: "relative", display: "inline-block", width: "44px", height: "24px" }}>
                <input
                  type="checkbox"
                  checked={settings.nightMode}
                  onChange={(e) => updateSettingField("nightMode", e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="slider" style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: settings.nightMode ? "#ff4a4a" : "#444",
                  transition: ".4s",
                  borderRadius: "24px"
                }}></span>
              </label>
            </div>

            <div className="setting-web-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111116", border: "1px solid #22222a", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
              <div>
                <strong style={{ display: "block" }}>Auto Emergency Countdown ({settings.autoEmergencyTimer}s)</strong>
                <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#8a8f98" }}>Seconds to cancel emergency action before sirens/SMS trigger</p>
              </div>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.autoEmergencyTimer}
                onChange={(e) => updateSettingField("autoEmergencyTimer", parseInt(e.target.value) || 10)}
                style={{ width: "60px", background: "#0a0a0f", border: "1px solid #444", color: "#fff", padding: "5px", borderRadius: "5px", textAlign: "center" }}
              />
            </div>

            <div className="setting-web-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111116", border: "1px solid #22222a", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
              <div>
                <strong style={{ display: "block" }}>Siren Alarm Volume ({settings.sirenVolume}%)</strong>
                <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#8a8f98" }}>Set the master volume for home security alarms</p>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sirenVolume}
                onChange={(e) => updateSettingField("sirenVolume", parseInt(e.target.value))}
                style={{ cursor: "pointer" }}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={<Moon />}
            title="Appearance"
            description="Customize the AI Guardian interface"
          >
            <ThemeToggle
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          </SettingsSection>
        </main>
      )}
    </div>
  );
}

function SettingsSection({ icon, title, description, children }) {
  return (
    <section className="settings-web-section" style={{ background: "#111116", border: "1px solid #22222a", padding: "20px", borderRadius: "12px" }}>
      <div className="settings-section-header" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "1px solid #22222a", paddingBottom: "10px" }}>
        <div className="settings-section-icon" style={{ color: "#ff4a4a" }}>
          {icon}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>{title}</h2>
          <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#8a8f98" }}>{description}</p>
        </div>
      </div>
      <div className="settings-web-rows">
        {children}
      </div>
    </section>
  );
}

function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <div className="setting-web-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
      <div>
        <strong style={{ display: "block" }}>Dark Mode</strong>
        <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#8a8f98" }}>Switch between dark and light interface</p>
      </div>

      <label className="switch" style={{ position: "relative", display: "inline-block", width: "44px", height: "24px" }}>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleTheme}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span className="slider" style={{
          position: "absolute",
          cursor: "pointer",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: darkMode ? "#ff4a4a" : "#444",
          transition: ".4s",
          borderRadius: "24px"
        }}></span>
      </label>
    </div>
  );
}

export default SettingsPage;