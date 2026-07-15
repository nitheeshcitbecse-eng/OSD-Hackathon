import { useContext } from "react";

import {
  ArrowLeft,
  ChevronRight,
  Bell,
  Camera,
  Shield,
  Moon,
} from "lucide-react";

import { ThemeContext } from "../context/ThemeContext";

function SettingsPage({ setScreen }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="web-page">
      <header className="inner-web-header">
        <div className="inner-title">
          <button onClick={() => setScreen("dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Settings</h1>

            <p>
              Configure your AI Guardian preferences
            </p>
          </div>
        </div>
      </header>

      <main className="settings-web-content">
        <SettingsSection
          icon={<Shield />}
          title="Security Settings"
          description="Configure AI detection and security controls"
        >
          <SettingRow
            title="Alert Sensitivity"
            description="Control how sensitive AI detection should be"
            value="Medium"
          />

          <SettingRow
            title="Night Mode"
            description="Increase monitoring sensitivity at night"
            value="10:00 PM - 06:00 AM"
          />

          <SettingRow
            title="Auto Emergency Timer"
            description="Time before emergency actions start"
            value="30 seconds"
          />
        </SettingsSection>

        <SettingsSection
          icon={<Bell />}
          title="Notifications"
          description="Manage how AI Guardian notifies you"
        >
          <ToggleSetting
            title="Push Notifications"
            description="Receive security alerts in real time"
          />

          <ToggleSetting
            title="Vibration"
            description="Vibrate when critical alerts are detected"
          />

          <ToggleSetting
            title="Loud Alarm"
            description="Play loud sound during critical emergencies"
          />
        </SettingsSection>

        <SettingsSection
          icon={<Camera />}
          title="Camera Settings"
          description="Manage cameras and video quality"
        >
          <SettingRow
            title="Camera Management"
            description="Add, remove or configure cameras"
          />

          <SettingRow
            title="Video Quality"
            description="Configure live stream video quality"
            value="1080p High"
          />
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
    </div>
  );
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="settings-web-section">
      <div className="settings-section-header">
        <div className="settings-section-icon">
          {icon}
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="settings-web-rows">
        {children}
      </div>
    </section>
  );
}

function SettingRow({ title, description, value }) {
  return (
    <div className="setting-web-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <div className="setting-web-value">
        {value && <span>{value}</span>}
        <ChevronRight size={18} />
      </div>
    </div>
  );
}

function ToggleSetting({ title, description }) {
  return (
    <div className="setting-web-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <label className="switch">
        <input type="checkbox" defaultChecked />

        <span className="slider"></span>
      </label>
    </div>
  );
}

function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <div className="setting-web-row">
      <div>
        <strong>Dark Mode</strong>

        <p>
          Switch between dark and light interface
        </p>
      </div>

      <label className="switch">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleTheme}
        />

        <span className="slider"></span>
      </label>
    </div>
  );
}

export default SettingsPage;