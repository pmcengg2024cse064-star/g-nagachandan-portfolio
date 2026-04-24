export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="blob"
        style={{
          width: 500,
          height: 500,
          background: "oklch(0.65 0.28 300)",
          top: "-10%",
          left: "-10%",
        }}
      />
      <div
        className="blob"
        style={{
          width: 600,
          height: 600,
          background: "oklch(0.65 0.25 250)",
          top: "30%",
          right: "-15%",
          animationDelay: "-6s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 450,
          height: 450,
          background: "oklch(0.7 0.28 350)",
          bottom: "-10%",
          left: "20%",
          animationDelay: "-12s",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
