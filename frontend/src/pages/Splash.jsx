import { useEffect, useState } from "react";

function Splash({ onFinish }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setLeaving(true);
    }, 3800);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`iris-cinematic ${leaving ? "cinematic-exit" : ""}`}>
      <div className="cyber-grid"></div>

      <div className="scan-beam"></div>

      <div className="corner corner-tl"></div>
      <div className="corner corner-tr"></div>
      <div className="corner corner-bl"></div>
      <div className="corner corner-br"></div>

      <div className="system-code code-left">
        <span>IRIS://CORE</span>
        <span>VISION MODULE ACTIVE</span>
        <span>FACIAL MATRIX READY</span>
      </div>

      <div className="system-code code-right">
        <span>NODE 07</span>
        <span>SECURE CONNECTION</span>
        <span>STATUS 100%</span>
      </div>

      <main className="iris-cinematic-content">
        <div className="iris-scanner">
          <div className="scanner-orbit orbit-one">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="scanner-orbit orbit-two"></div>

          <div className="scanner-orbit orbit-three"></div>

          <div className="iris-core">
            <div className="iris-eye">
              <div className="iris-pupil"></div>
            </div>

            <div className="recognition-point point-one"></div>
            <div className="recognition-point point-two"></div>
            <div className="recognition-point point-three"></div>
            <div className="recognition-point point-four"></div>
          </div>

          <div className="scanner-line"></div>
        </div>

        <div className="system-online">
          <span className="online-dot"></span>
          IDENTITY CORE ONLINE
        </div>

        <h1 className="iris-word">
          <span>I</span>
          <span>R</span>
          <span>I</span>
          <span>S</span>
        </h1>

        <p className="iris-full-name">
          INTELLIGENT RECOGNITION
          <b> / </b>
          INTRUSION SYSTEM
        </p>

        <div className="initialization-bar">
          <div className="initialization-progress"></div>
        </div>

        <div className="initialization-text">
          <span>SCANNING ENVIRONMENT</span>
          <span>SECURE</span>
        </div>
      </main>
    </div>
  );
}

export default Splash;