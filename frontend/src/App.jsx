import { useState } from "react";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveCamera from "./pages/LiveCamera";
import Alerts from "./pages/Alerts";
import Emergency from "./pages/Emergency";

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

      {screen === "dashboard" && (
        <Dashboard setScreen={setScreen} />
      )}

      {screen === "live" && (
        <LiveCamera setScreen={setScreen} />
      )}

      {screen === "alerts" && (
        <Alerts setScreen={setScreen} />
      )}

      {screen === "emergency" && (
        <Emergency setScreen={setScreen} />
      )}
    </div>
  );
}

export default App;