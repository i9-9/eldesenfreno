import React from "react";
import Bio from "./Bio";

const Sidebar = () => {
  return (
    <aside className="md:w-[450px] bg-black text-white p-8 fixed hidden md:block">
        <div className="h-screen md:flex hidden md:visible  border-l-[1px]">
          <div className="w-48">MARQUEE</div>
          {/* <MarqueeTitle/> */}
          <Bio />
        </div>
    </aside>
  );
};

export default Sidebar;
