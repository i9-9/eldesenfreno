import React from "react";
import Bio from "./Bio";
import MarqueeTitle from "./marquee/MarqueeTitle";

const Sidebar = () => {
  return (
    <aside className="md:w-[500px] bg-black text-white p-8 fixed hidden md:block">
        <div className="h-screen md:flex hidden md:visible  border-l-[1px]">
          <MarqueeTitle/>
          <Bio />
        </div>
    </aside>
  );
};

export default Sidebar;
