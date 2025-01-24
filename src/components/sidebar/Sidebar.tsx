// components/Sidebar/Sidebar.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NavigationList from "./NavigationList";
import { navigationItems, libraryItems, podcastItems } from "./sidebarData";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="bg-gray-800 text-white w-64 h-screen flex flex-col p-6 overflow-auto fixed top-0 left-0">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center mb-4">
          <span className="text-black text-xl font-bold">SiC-up</span>
        </div>
        <h1 className="text-lg font-semibold">Ayne Mekonen</h1>
      </div>

      <div className="space-y-4">
        <nav>
          <NavigationList items={navigationItems} pathname={pathname!} />
        </nav>

        <div>
          <h2 className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Library
          </h2>
          <NavigationList items={libraryItems} pathname={pathname!} />
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Podcasts
          </h2>
          <NavigationList items={podcastItems} pathname={pathname!} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
