import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { LiquidBackground } from "@/components/ui/liquid-background";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <LiquidBackground color1="#1e40af" color2="#3730a3" color3="#4f46e5" />
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-gray-800">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Imprv
              </h2>
              <p className="text-gray-500 mt-2 font-medium">
                Your knowledge companion
              </p>
            </div>
            {children}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
