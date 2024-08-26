import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeTitle = () => {
  return (
    <div className="absolute left-[-215%] pl-4 -rotate-90 border border-b-[1px] border-t-0 border-x-0 overflow-hidden">
      <Marquee
        gradient={false}
        direction="left"
        speed={1}
        className="text-8xl overflow-hidden"
        style={{
        }}
      >
        EL DESENFRENO EL DESENFRENO EL DESENFRENO <span className="ml-2"> </span>
      </Marquee>
    </div>
  );
};

export default MarqueeTitle;
