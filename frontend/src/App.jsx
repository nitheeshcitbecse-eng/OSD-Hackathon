import { useState } from "react";
import CriticalAlert from "./pages/CriticalAlert";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveCamera from "./pages/LiveCamera";
import Alerts from "./pages/Alerts";
import Emergency from "./pages/Emergency";
import ActivityHistory from "./pages/ActivityHistory";
import FamilyFaces from "./pages/FamilyFaces";
import EmergencyContacts from "./pages/EmergencyContacts";
import SettingsPage from "./pages/SettingsPage";
import Profile from "./pages/Profile";

function App() {
  const [screen, setScreen] = useState("splash");

  return (

    <div className="app-container">
      {screen === "splash" && (
        <Splash onFinish={() => setScreen("login")} />
      )}

      {screen === "login" && (
        <Login onLogin={() => setScreen("dashboard")} />
      )}

      {screen === "dashboard" && <Dashboard setScreen={setScreen} />}
      {screen === "live" && <LiveCamera setScreen={setScreen} />}
      {screen === "alerts" && <Alerts setScreen={setScreen} />}
      {screen === "emergency" && <Emergency setScreen={setScreen} />}
      {screen === "history" && <ActivityHistory setScreen={setScreen} />}
      {screen === "family" && <FamilyFaces setScreen={setScreen} />}
      {screen === "contacts" && <EmergencyContacts setScreen={setScreen} />}
      {screen === "settings" && <SettingsPage setScreen={setScreen} />}
      {screen === "profile" && <Profile setScreen={setScreen} />}
      {screen === "critical" && (
  <CriticalAlert setScreen={setScreen} />
)}
    </div>
  );
}

export default App;