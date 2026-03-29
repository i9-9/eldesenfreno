import React from "react";

const PHRASE = "EL DESENFRENO EDICIONES  ·  ";

const TopTicker = () => {
  const content = PHRASE.repeat(20);

  return (
    <div className="hidden md:flex fixed top-0 left-0 right-0 z-[60] overflow-hidden bg-white h-6 items-center">
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          animation: "marquee-ticker 60s linear infinite",
          willChange: "transform",
          color: "#000",
          opacity: 0.7,
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default TopTicker;
