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

import { useEffect } from "react";

function App() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);

  const [previousScreen, setPreviousScreen] =
    useState("dashboard");

  useEffect(() => {
    const savedUser = localStorage.getItem("iris_user");
    const token = localStorage.getItem("iris_token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const navigateTo = (newScreen) => {
    setPreviousScreen(screen);
    setScreen(newScreen);
  };

  const goBack = () => {
    setScreen(previousScreen);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("iris_token");
    localStorage.removeItem("iris_user");
    setUser(null);
    setScreen("login");
  };

  return (
    <>
      {screen === "splash" && (
        <Splash
          onFinish={() => {
            const token = localStorage.getItem("iris_token");
            if (token) {
              setScreen("dashboard");
            } else {
              setScreen("login");
            }
          }}
        />
      )}

      {screen === "login" && (
        <Login
          onLogin={handleLogin}
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