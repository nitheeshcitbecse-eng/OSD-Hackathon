function SecurityBackground() {
  const particles = Array.from({ length: 24 });

  return (
    <div className="security-background">
      <div className="security-grid-animation"></div>

      <div className="security-radial-pulse"></div>

      <div className="security-particles">
        {particles.map((_, index) => (
          <span
            key={index}
            className={`security-particle particle-${index + 1}`}
          ></span>
        ))}

        <svg
          className="security-network-lines"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          <line x1="80" y1="120" x2="240" y2="210" />
          <line x1="240" y1="210" x2="410" y2="100" />
          <line x1="410" y1="100" x2="590" y2="230" />
          <line x1="590" y1="230" x2="820" y2="120" />

          <line x1="130" y1="450" x2="300" y2="350" />
          <line x1="300" y1="350" x2="470" y2="480" />
          <line x1="470" y1="480" x2="690" y2="370" />
          <line x1="690" y1="370" x2="900" y2="500" />

          <line x1="240" y1="210" x2="300" y2="350" />
          <line x1="410" y1="100" x2="470" y2="480" />
          <line x1="590" y1="230" x2="690" y2="370" />
        </svg>
      </div>

      <div className="security-noise"></div>

      <div className="security-radar">
        <div className="radar-circle radar-circle-one"></div>
        <div className="radar-circle radar-circle-two"></div>

        <div className="radar-cross radar-horizontal"></div>
        <div className="radar-cross radar-vertical"></div>

        <div className="radar-sweep"></div>

        <span className="radar-target target-one"></span>
        <span className="radar-target target-two"></span>
        <span className="radar-target target-three"></span>
      </div>
    </div>
  );
}

export default SecurityBackground;