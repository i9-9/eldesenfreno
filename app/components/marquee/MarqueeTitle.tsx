import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeTitle = () => {
  return (
    <div className="flex items-center justify-end z-10 w-full mx-auto">
      <p>EL DESENFRENO  EL DESENFRENO  EL DESENFRENO</p>
      {/* <Marquee
        gradient={false}
        direction="right"
        speed={90}
        className="text-9xl"
      > EL DESENFRENO  EL DESENFRENO  EL DESENFRENO <span className="ml-2"> </span>
      </Marquee> */}
    </div>
  );
};

export default MarqueeTitle;