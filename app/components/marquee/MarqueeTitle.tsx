import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeTitle = () => {
  return (
    <div className="absolute left-[-215%] pl-6 -rotate-90 border border-b-[1px] border-t-0 border-x-0">
      <Marquee
        gradient={false}
        direction="left"
        speed={1}
        className="text-8xl"
        style={{
        }}
      >
        EL DESENFRENO EL DESENFRENO EL DESENFRENO <span className="ml-2"> </span>
      </Marquee>
    </div>
  );
};

export default MarqueeTitle;
