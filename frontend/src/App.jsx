import { useState } from "react";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveCamera from "./pages/LiveCamera";
import Alerts from "./pages/Alerts";
import Emergency from "./pages/Emergency";
import CriticalAlert from "./pages/CriticalAlert";
import ActivityHistory from "./pages/ActivityHistory";
import FamilyFaces from "./pages/FamilyFaces";
import EmergencyContacts from "./pages/EmergencyContacts";
import SettingsPage from "./pages/SettingsPage";
import Profile from "./pages/Profile";

function App() {
  const [screen, setScreen] = useState("splash");

  const [previousScreen, setPreviousScreen] =
    useState("dashboard");

  const navigateTo = (newScreen) => {
    setPreviousScreen(screen);
    setScreen(newScreen);
  };

  const goBack = () => {
    setScreen(previousScreen);
  };

  return (
    <>
      {screen === "splash" && (
        <Splash
          onFinish={() => setScreen("login")}
        />
      )}

      {screen === "login" && (
        <Login
          onLogin={() => setScreen("dashboard")}
        />
      )}

      {screen === "dashboard" && (
        <Dashboard setScreen={navigateTo} />
      )}

      {screen === "live" && (
        <LiveCamera
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "alerts" && (
        <Alerts
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "emergency" && (
        <Emergency
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "critical" && (
        <CriticalAlert
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "history" && (
        <ActivityHistory
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "family" && (
        <FamilyFaces
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "contacts" && (
        <EmergencyContacts
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "settings" && (
        <SettingsPage
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}

      {screen === "profile" && (
        <Profile
          setScreen={navigateTo}
          goBack={goBack}
        />
      )}
    </>
  );
}

export default App;