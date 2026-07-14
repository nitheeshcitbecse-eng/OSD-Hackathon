import {
  ArrowLeft,
  Mic,
  Volume2,
  Camera,
  Square,
  Maximize,
  Circle,
} from "lucide-react";

function LiveCamera({ setScreen }) {
  return (
    <div className="web-page">
      <header className="inner-web-header">
        <div className="inner-title">
          <button onClick={() => setScreen("dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Live Camera</h1>
            <p>Monitor your cameras in real time</p>
          </div>
        </div>

        <span className="web-live-badge">
          <Circle size={9} fill="currentColor" />
          LIVE
        </span>
      </header>

      <main className="inner-web-content">
        <div className="camera-selector">
          <button className="camera-selector-active">
            Front Door
          </button>

          <button>Backyard</button>
          <button>Living Room</button>
        </div>

        <section className="desktop-camera-panel">
          <div className="desktop-camera-header">
            <div>
              <h2>Front Door Camera</h2>
              <p>CAM-001 · Online</p>
            </div>

            <button>
              <Maximize size={19} />
            </button>
          </div>

          <div className="desktop-camera-feed">
            <div className="camera-date">
              2026-07-14&nbsp;&nbsp; 19:42:18
            </div>

            <div className="web-detection-box">
              <span>Unknown Person · 96%</span>

              <div className="web-person">
                👤
              </div>
            </div>
          </div>

          <div className="desktop-camera-controls">
            <div className="camera-control-group">
              <button>
                <Mic size={20} />
                Microphone
              </button>

              <button>
                <Volume2 size={20} />
                Speaker
              </button>
            </div>

            <button className="desktop-record-button">
              <Square size={17} fill="currentColor" />
              Record
            </button>

            <button>
              <Camera size={20} />
              Snapshot
            </button>
          </div>
        </section>

        <section className="camera-info-grid">
          <div className="camera-info-card">
            <span>CAMERA STATUS</span>
            <strong className="green-text">Online</strong>
            <p>Connected and monitoring</p>
          </div>

          <div className="camera-info-card">
            <span>AI DETECTION</span>
            <strong className="green-text">Active</strong>
            <p>Real-time detection enabled</p>
          </div>

          <div className="camera-info-card">
            <span>VIDEO QUALITY</span>
            <strong>1080p HD</strong>
            <p>High quality streaming</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LiveCamera;