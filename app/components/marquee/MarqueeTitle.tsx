import React from "react";

const PHRASE = "EL DESENFRENO     ";
const STRIP = 80; // px — matches aside pl-20 (5rem)

const MarqueeTitle = () => {
  // 12 repetitions: at -50% → 0 the loop is seamless (all phrases identical)
  const content = PHRASE.repeat(12);

  return (
    <div
      className="absolute top-0 left-0 overflow-hidden z-50"
      style={{ width: STRIP, height: "100vh" }}
    >
      {/*
        Rotation wrapper at top=100% with transform-origin "left top".
        After rotate(-90deg) the element visually fills [0..STRIP] × [0..100vh].
        Characters appear 90° CCW → tilt head right to read.
        Local +X = screen upward, so translateX(-50%)→(0) = upward scroll.
      */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          width: "100vh",
          transformOrigin: "left top",
          transform: "rotate(-90deg)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            fontSize: "5rem",
            lineHeight: `${STRIP}px`,
            letterSpacing: "0.04em",
            animation: "marquee-horiz 90s linear infinite",
            willChange: "transform",
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

export default MarqueeTitle;
