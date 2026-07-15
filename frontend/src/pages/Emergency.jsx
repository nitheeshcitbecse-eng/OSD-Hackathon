import { useEffect, useState } from "react";
import "./Emergency.css";
import { api } from "../api";
import {
  ArrowLeft,
  Phone,
  Users,
  MapPin,
  Siren,
  ShieldAlert,
  PhoneOff,
} from "lucide-react";

function Emergency({ setScreen, goBack }) {
  const [calling, setCalling] = useState(false);
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    let timer;

    if (calling) {
      timer = setInterval(() => {
        setCallTime((time) => time + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [calling]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const startCall = async () => {
    setCallTime(0);
    setCalling(true);
    try {
      // Get current position if browser supports it
      let lat = 12.9716; // default Bangalore coordinates for simulator
      let lon = 77.5946;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            api.emergency.activate({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              triggeredBy: "IRIS Web Console",
            });
          },
          (err) => {
            api.emergency.activate({
              latitude: lat,
              longitude: lon,
              triggeredBy: "IRIS Web Console (GPS Blocked)",
            });
          }
        );
      } else {
        await api.emergency.activate({
          latitude: lat,
          longitude: lon,
          triggeredBy: "IRIS Web Console (No GPS Support)",
        });
      }
    } catch (err) {
      console.error("Failed to activate emergency trigger:", err);
    }
  };

  const endCall = () => {
    setCalling(false);
    setCallTime(0);
  };

  return (
    <div className="iris-emergency-page">
      <div className="emergency-red-glow"></div>
      <div className="emergency-scan-overlay"></div>

      <header className="emergency-web-header">
        <button
          className="iris-back-button"
          onClick={goBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Emergency Response</h1>
          <p>IRIS rapid security response system</p>
        </div>

        <div className="emergency-system-live">
          <span></span>
          RESPONSE SYSTEM ACTIVE
        </div>
      </header>

      <main className="emergency-web-content">
        <section className="emergency-main-panel">
          <div className="emergency-alert-status">
            <ShieldAlert size={18} />
            <span>EMERGENCY RESPONSE READY</span>
          </div>

          <div className="emergency-core-wrapper">
            <div className="emergency-wave wave-one"></div>
            <div className="emergency-wave wave-two"></div>
            <div className="emergency-wave wave-three"></div>

            <div className="emergency-rotating-ring"></div>

            <button
              className="emergency-core-button"
              onClick={startCall}
            >
              <Siren size={43} />

              <strong>EMERGENCY</strong>

              <span>Tap to Call Police</span>
            </button>
          </div>

          <h2>Immediate Response</h2>

          <p className="emergency-description">
            Activate IRIS emergency protocol to contact
            authorities and secure your monitored location.
          </p>

          <div className="emergency-security-line">
            <span></span>
            LOCATION AND LIVE SECURITY DATA READY
          </div>
        </section>

        <section className="emergency-actions-panel">
          <h2>Emergency Actions</h2>

          <div className="emergency-action-grid">
            <button
              className="emergency-action-card police-action"
              onClick={startCall}
            >
              <div className="emergency-action-icon">
                <Phone size={25} />
              </div>

              <strong>Call Police</strong>

              <span>Contact emergency services</span>
            </button>

            <button className="emergency-action-card">
              <div className="emergency-action-icon">
                <Users size={25} />
              </div>

              <strong>Notify Family</strong>

              <span>Alert emergency contacts</span>
            </button>

            <button className="emergency-action-card">
              <div className="emergency-action-icon">
                <MapPin size={25} />
              </div>

              <strong>Share Location</strong>

              <span>Transmit live location</span>
            </button>

            <button className="emergency-action-card siren-action">
              <div className="emergency-action-icon">
                <Siren size={25} />
              </div>

              <strong>Activate Siren</strong>

              <span>Enable security alarm</span>
            </button>
          </div>

          <div className="emergency-response-status">
            <span className="response-status-dot"></span>

            <div>
              <strong>IRIS RESPONSE NETWORK</strong>

              <p>All emergency systems operational</p>
            </div>
          </div>
        </section>
      </main>

      {calling && (
        <div className="iris-calling-overlay">
          <div className="calling-background-pulse"></div>
          <div className="calling-scan-line"></div>

          <div className="calling-content">
            <div className="calling-status-text">
              IRIS EMERGENCY PROTOCOL
            </div>

            <div className="calling-phone-animation">
              <div className="call-wave call-wave-one"></div>
              <div className="call-wave call-wave-two"></div>
              <div className="call-wave call-wave-three"></div>

              <div className="calling-phone-core">
                <Phone size={47} />
              </div>
            </div>

            <h1>CALLING POLICE</h1>

            <div className="calling-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <p>Emergency communication channel active</p>

            <strong className="call-timer">
              {formatTime(callTime)}
            </strong>

            <div className="calling-data">
              <span>LOCATION SHARING ACTIVE</span>
              <span>LIVE FEED ENCRYPTED</span>
              <span>IRIS RESPONSE ACTIVE</span>
            </div>

            <button
              className="end-emergency-call"
              onClick={endCall}
            >
              <PhoneOff size={23} />
              END CALL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Emergency;