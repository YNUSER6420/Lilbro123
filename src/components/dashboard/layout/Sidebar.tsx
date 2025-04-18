import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  FolderKanban,
  Bot,
  BookOpen,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const defaultNavItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Home", href: "/" },
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/dashboard",
    isActive: true,
  },
  { icon: <BookOpen size={20} />, label: "My Books", href: "/dashboard" },
  { icon: <Bot size={20} />, label: "AI Assistant", href: "/ai-assistant" },
  { icon: <FolderKanban size={20} />, label: "Projects", href: "/dashboard" },
  { icon: <Calendar size={20} />, label: "Calendar", href: "/dashboard" },
  { icon: <Users size={20} />, label: "Team", href: "/dashboard" },
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={20} />, label: "Settings", href: "/dashboard" },
  { icon: <HelpCircle size={20} />, label: "Help", href: "/dashboard" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem = "Home",
  onItemClick = () => {},
}: SidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-gray-900/90 backdrop-blur-md border-r border-gray-800/80 flex flex-col lg:block hidden">
      <div className="p-6 border-b border-gray-800/50">
        <h2 className="text-xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          My Library
        </h2>
        <p className="text-sm text-gray-400">Explore and manage your books</p>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-1.5">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href || "/dashboard"}
              className="w-full"
            >
              <Button
                variant={"ghost"}
                className={`w-full justify-start gap-3 h-11 rounded-xl text-sm font-medium ${item.label === activeItem ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/40 border border-blue-800/50" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                onClick={() => onItemClick(item.label)}
              >
                <span
                  className={`${item.label === activeItem ? "text-blue-400" : "text-gray-400"}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <Separator className="my-6 bg-gray-800" />

        <div className="space-y-3">
          <h3 className="text-xs font-medium px-4 py-1 text-gray-400 uppercase tracking-wider">
            Categories
          </h3>
          <Link to="/dashboard" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Business
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              Personal Development
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Productivity
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              Finance
            </Button>
          </Link>
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t border-gray-800/50 bg-gray-900/50">
        {defaultBottomItems.map((item) => (
          <Link
            key={item.label}
            to={item.href || "/dashboard"}
            className="w-full"
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white mb-1.5"
              onClick={() => onItemClick(item.label)}
            >
              <span className="text-gray-400">{item.icon}</span>
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
