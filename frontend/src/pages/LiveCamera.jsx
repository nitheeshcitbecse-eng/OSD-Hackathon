import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ShieldAlert,
} from "lucide-react";

function LiveCamera({ setScreen, goBack }) {
  const [recognitionState, setRecognitionState] =
    useState("known");

  useEffect(() => {
    const recognitionTimer = setInterval(() => {
      setRecognitionState((currentState) =>
        currentState === "known"
          ? "unknown"
          : "known"
      );
    }, 4500);

    return () => clearInterval(recognitionTimer);
  }, []);

  const isKnown = recognitionState === "known";

  return (
    <div className="iris-live-page">
      <header className="iris-live-header">
        <button
          className="iris-back-button"
          onClick={goBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Live Recognition</h1>
          <p>Front Door Camera • AI Monitoring</p>
        </div>

        <div className="iris-live-status">
          <span></span>
          LIVE
        </div>
      </header>

      <main className="iris-camera-workspace">
        <section className="iris-camera-feed">
          <div className="iris-camera-placeholder">
            <Camera size={70} />

            <p>FRONT DOOR CAMERA</p>

            <span>
              AI visual recognition stream active
            </span>
          </div>

          <div
            className={`recognition-box ${
              isKnown
                ? "recognition-known"
                : "recognition-unknown"
            }`}
          >
            <span className="recognition-corner corner-one"></span>
            <span className="recognition-corner corner-two"></span>
            <span className="recognition-corner corner-three"></span>
            <span className="recognition-corner corner-four"></span>

            <div className="recognition-scan-line"></div>

            <div className="iris-recognition-eye">
              <div className="recognition-iris">
                <div className="recognition-pupil"></div>
              </div>
            </div>

            <div className="recognition-result">
              {isKnown ? (
                <div className="known-check-animation">
                  <Check size={23} strokeWidth={3} />
                </div>
              ) : (
                <div className="unknown-alert-animation">
                  <ShieldAlert size={21} />
                </div>
              )}

              <div>
                <strong>
                  {isKnown
                    ? "KNOWN PERSON"
                    : "UNKNOWN PERSON"}
                </strong>

                <small>
                  {isKnown
                    ? "Identity verified"
                    : "Identity not recognized"}
                </small>
              </div>
            </div>
          </div>

          <div className="camera-hud camera-hud-left">
            <span>IRIS://VISION_01</span>
            <span>FACE MATRIX ACTIVE</span>
            <span>DEPTH SCAN ENABLED</span>
          </div>

          <div className="camera-hud camera-hud-right">
            <span>
              CONFIDENCE {isKnown ? "98.4%" : "76.2%"}
            </span>

            <span>
              STATUS {isKnown ? "VERIFIED" : "ANALYZING"}
            </span>
          </div>
        </section>

        <aside className="iris-recognition-panel">
          <span className="recognition-panel-label">
            RECOGNITION ENGINE
          </span>

          <h2>
            {isKnown
              ? "Identity Verified"
              : "Unrecognized Identity"}
          </h2>

          <p>
            {isKnown
              ? "IRIS matched the detected face with an authorized family profile."
              : "IRIS could not match the detected face with an authorized identity."}
          </p>

          <div
            className={`iris-state-card ${
              isKnown
                ? "state-card-known"
                : "state-card-unknown"
            }`}
          >
            {isKnown ? (
              <Check size={27} />
            ) : (
              <ShieldAlert size={27} />
            )}

            <div>
              <strong>
                {isKnown ? "AUTHORIZED" : "CAUTION"}
              </strong>

              <span>
                {isKnown
                  ? "Access identity recognized"
                  : "Enhanced monitoring active"}
              </span>
            </div>
          </div>

          <div className="recognition-data">
            <div>
              <span>Camera</span>
              <strong>Front Door</strong>
            </div>

            <div>
              <span>AI Confidence</span>
              <strong>
                {isKnown ? "98.4%" : "76.2%"}
              </strong>
            </div>

            <div>
              <span>Recognition</span>
              <strong>
                {isKnown ? "0.42 sec" : "Analyzing"}
              </strong>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default LiveCamera;