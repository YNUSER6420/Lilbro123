import { LiquidBackground } from "@/components/ui/liquid-background";
import TopNavigation from "@/components/dashboard/layout/TopNavigation";
import {
  CheckCircle,
  BookOpen,
  Headphones,
  Moon,
  Sparkles,
  Download,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Book Creation",
      description:
        "Generate concise, insightful books on business and life lessons with our advanced AI assistant in minutes.",
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      details: [
        "Topic-based generation",
        "Customizable style and tone",
        "One-click editing and refinement",
      ],
    },
    {
      title: "Audio Narration",
      description:
        "Convert your text to natural-sounding audio with one click for enhanced consumption on the go.",
      icon: <Headphones className="h-6 w-6 text-purple-500" />,
      details: [
        "Multiple voice options",
        "Adjustable speed and pitch",
        "Download for offline listening",
      ],
    },
    {
      title: "Comfortable Reading Experience",
      description:
        "Enjoy your books in our built-in reader with dark/light mode toggle and bookmarking functionality.",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      details: [
        "Customizable reading experience",
        "Progress tracking across devices",
        "Highlight and note-taking tools",
      ],
    },
    {
      title: "PDF Export",
      description:
        "Export your books as professionally formatted PDF documents with customizable options.",
      icon: <Download className="h-6 w-6 text-orange-500" />,
      details: [
        "Professional formatting",
        "Customizable page size and orientation",
        "Cover page generation",
      ],
    },
    {
      title: "Reading Progress Tracking",
      description:
        "Keep track of your reading progress across all your books in your personal dashboard.",
      icon: <Clock className="h-6 w-6 text-indigo-500" />,
      details: [
        "Visual progress indicators",
        "Automatic bookmarking",
        "Reading statistics",
      ],
    },
    {
      title: "Secure Cloud Storage",
      description:
        "All your books are securely stored in the cloud, accessible from any device with your account.",
      icon: <Shield className="h-6 w-6 text-teal-500" />,
      details: [
        "End-to-end encryption",
        "Automatic backups",
        "Cross-device synchronization",
      ],
    },
    {
      title: "Dark Mode Support",
      description:
        "Reduce eye strain with our fully-implemented dark mode across the entire application.",
      icon: <Moon className="h-6 w-6 text-gray-400" />,
      details: [
        "System preference detection",
        "Manual toggle option",
        "Optimized color schemes",
      ],
    },
    {
      title: "User Authentication",
      description:
        "Secure account creation and login with email/password or Google authentication.",
      icon: <Users className="h-6 w-6 text-yellow-500" />,
      details: [
        "Email/password authentication",
        "Google OAuth integration",
        "Secure session management",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <LiquidBackground
        color1="#1e40af"
        color2="#3730a3"
        color3="#4f46e5"
        variant="mesh"
      />
      <TopNavigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4"
          >
            Imprv Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Discover all the powerful features available in our AI-powered book
            creation platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-700/50 transition-colors shadow-lg"
            >
              <div className="h-12 w-12 rounded-full bg-gray-800/80 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/signup">
            <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 h-auto shadow-lg shadow-blue-900/20">
              Get Started Now
            </Button>
          </Link>
          <p className="text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
