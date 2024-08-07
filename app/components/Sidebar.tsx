import React from "react";
import Bio from "./Bio";
import MarqueeTitle from "./marquee/MarqueeTitle";
import Locations from "./Locations";

const Sidebar = () => {
  return (
    <aside className="md:w-[500px] bg-[#0a0a0a] text-white p-8 pr-0 fixed hidden md:block md:border-r h-screen">
      <div className="flex flex-col h-full border-l-[1px]">
        <MarqueeTitle />
        <div className="flex flex-col overflow-y-auto hide-scrollbar h-full">
          <Bio />
          <hr className="px-2 ml-24 mt-4" />
          <Locations />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
