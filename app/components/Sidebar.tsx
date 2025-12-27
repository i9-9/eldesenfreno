import React from "react";
import Bio from "./Bio";
import MarqueeTitle from "./marquee/MarqueeTitle";
import Locations from "./Locations";

const Sidebar = () => {
  return (
    <aside className="md:w-[500px] bg-[#0b0b0b] text-white p-8 pr-0 fixed hidden md:block h-screen">
      <div className="flex flex-col h-full border-l-[1px]">
        <MarqueeTitle />
        <div className="flex flex-col overflow-y-auto hide-scrollbar h-full pl-4">
          <Bio />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
