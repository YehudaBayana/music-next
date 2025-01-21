import React from "react";
import Link from "next/link";
import { NavigationItem } from "./sidebarData";

type NavigationListProps = {
  items: NavigationItem[];
  pathname: string;
};

const NavigationList: React.FC<NavigationListProps> = ({ items, pathname }) => {
  return (
    <ul>
      {items.map((item) => {
        const isActive =
          pathname === item.path || pathname.startsWith(`${item.path}/`);

        return (
          <Link href={item.path} key={item.label}>
            <li
              className={`flex items-center gap-4 mb-2 cursor-pointer p-2 rounded-lg ${
                isActive ? "bg-gray-700 text-purple-400" : "hover:bg-gray-700"
              }`}
            >
              <item.Icon className="text-xl" />
              <span className="text-sm">{item.label}</span>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default NavigationList;
