import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";

interface WelcomeBannerProps {
  onDismiss?: () => void;
}

export function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      // Get user's name from metadata or fetch from users table
      const fetchUserData = async () => {
        try {
          // First try to get from auth metadata
          const fullName = user.user_metadata?.full_name;
          if (fullName) {
            setUserName(fullName);
            return;
          }

          // If not in metadata, fetch from users table
          const { data, error } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (data && !error) {
            setUserName(data.full_name || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();

      // Check if this is first visit
      const hasVisitedBefore = localStorage.getItem(
        `${user.id}_visited_dashboard`,
      );
      if (hasVisitedBefore) {
        setIsFirstVisit(false);
      }
    }
  }, [user]);

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`${user.id}_visited_dashboard`, "true");
    }
    if (onDismiss) {
      onDismiss();
    }
    setIsFirstVisit(false);
  };

  if (!isFirstVisit) return null;

  const firstName = userName.split(" ")[0];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-xl border border-blue-500/20">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80')] opacity-15 bg-cover bg-center" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/30 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-3">
          Welcome{firstName ? `, ${firstName}` : ""}! 👋
        </h2>
        <p className="text-blue-100 mb-8 max-w-2xl text-lg">
          Get started by creating your first book. Our AI will help you generate
          professional content on any business or personal development topic.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/create-book">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-6 py-6 h-auto shadow-lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Book
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-white border-white/30 hover:bg-white/10 rounded-full px-6 py-6 h-auto"
            onClick={handleDismiss}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
