import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, BookOpen, Home, Search, Settings, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../supabase/auth";
import MobileNav from "./MobileNav";

interface TopNavigationProps {
  onSearch?: (query: string) => void;
  notifications?: Array<{ id: string; title: string }>;
}

const TopNavigation = ({
  onSearch = () => {},
  notifications = [
    { id: "1", title: "New project assigned" },
    { id: "2", title: "Meeting reminder" },
  ],
}: TopNavigationProps) => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full h-16 border-b border-gray-800/80 bg-gray-900/90 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 z-50 shadow-md">
      <div className="flex items-center gap-2 flex-1">
        <MobileNav />
        <Link
          to="/"
          className="text-white hover:text-blue-400 transition-colors flex items-center gap-2"
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold text-lg hidden md:block">Imprv</span>
        </Link>
        <div className="relative w-64 ml-4 hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search books..."
            className="pl-9 h-10 rounded-full bg-gray-800/70 border border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus-visible:ring-blue-500 focus-visible:ring-offset-0 text-white"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full h-9 w-9 bg-gray-800/70 hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <Bell className="h-4 w-4 text-gray-300" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium border border-gray-900">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl overflow-hidden p-2 border border-gray-700 shadow-xl bg-gray-900"
                >
                  <DropdownMenuLabel className="text-sm font-medium text-gray-100 px-2">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-gray-700" />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="rounded-lg text-sm py-2 text-gray-300 focus:bg-gray-800 focus:text-white"
                    >
                      {notification.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg bg-gray-900 text-white text-xs px-3 py-1.5 border border-gray-700">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 hover:cursor-pointer bg-gray-800/70 hover:bg-gray-700 transition-colors rounded-full pl-2 pr-1 py-1 border border-gray-700">
              <span className="text-sm font-medium text-gray-300 hidden md:block">
                {user.email?.split("@")[0]}
              </span>
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.email || ""}
                />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border border-gray-700 shadow-xl bg-gray-900"
          >
            <DropdownMenuLabel className="text-xs text-gray-400">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="cursor-pointer text-gray-300 focus:text-white hover:bg-gray-800 focus:bg-gray-800">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-gray-300 focus:text-white hover:bg-gray-800 focus:bg-gray-800">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 focus:text-red-400 hover:bg-gray-800 focus:bg-gray-800"
              onSelect={() => signOut()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;
