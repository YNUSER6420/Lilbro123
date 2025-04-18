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
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  PlayCircle,
  Settings,
  User,
  Bookmark,
  ArrowRight,
  Star,
  Check,
  Award,
  Zap,
  Shield,
  BarChart,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

import { Book, BookOpen, Headphones, Moon, Sun, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LiquidBackground } from "@/components/ui/liquid-background";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <LiquidBackground
        color1="#1e40af"
        color2="#3730a3"
        color3="#4f46e5"
        variant="waves"
      />

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(17,24,39,0.8)] backdrop-blur-md border-b border-gray-800/30">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl flex items-center">
              <Book className="h-6 w-6 mr-2 text-blue-600" />
              <span>Imprv</span>
            </Link>
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/features"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                to="/"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Examples
              </Link>
              <Link
                to="/"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Resources
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="py-24 md:py-32 relative">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-left"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-6">
                  <Star className="h-3.5 w-3.5 mr-2" />
                  AI-Powered Book Creation Platform
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                  Transform Your Ideas Into Books with AI
                </h1>
                <h2 className="text-xl md:text-2xl font-medium text-gray-300 mb-8 max-w-2xl">
                  Create concise, beautifully crafted books on business and life
                  lessons with AI assistance in minutes, not months.
                </h2>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                  <Link to="/signup">
                    <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-base px-8 py-6 h-auto w-full sm:w-auto shadow-lg shadow-blue-900/30">
                      Start Creating
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button
                      variant="outline"
                      className="rounded-full border-gray-700 text-gray-200 hover:bg-gray-800 text-base px-8 py-6 h-auto w-full sm:w-auto"
                    >
                      Try as Guest
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-8 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    No credit card
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Free tier available
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Cancel anytime
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-1 shadow-2xl">
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80"
                      alt="Imprv Interface"
                      className="w-full rounded-t-xl h-[300px] object-cover object-center"
                    />
                    <div className="p-6 bg-gray-900">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          Business Leadership
                        </h3>
                        <div className="flex space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                            <Clock className="h-3 w-3 mr-1" /> 5 min read
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        Effective leadership begins with self-awareness.
                        Understanding your strengths and weaknesses allows you
                        to leverage your talents...
                      </p>
                      <Button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700">
                        Continue Reading
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 h-24 w-24 bg-purple-600/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-600/20 rounded-full blur-2xl"></div>
              </motion.div>
            </div>

            {/* Trusted by section */}
            <div className="mt-20 text-center">
              <p className="text-sm font-medium text-gray-400 mb-6">
                TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                {["Microsoft", "Google", "Amazon", "Airbnb", "Spotify"].map(
                  (company) => (
                    <div
                      key={company}
                      className="text-gray-500 text-lg font-semibold"
                    >
                      {company}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-24 bg-gray-950/80 backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
          <div className="max-w-[1400px] mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-4">
                <Zap className="h-3.5 w-3.5 mr-2" />
                Powerful Features
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Everything You Need to Create Amazing Books
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Our platform combines AI technology with intuitive tools to help
                you create, narrate, and share professional-quality books.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-left transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] border border-gray-800 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  AI-Powered Creation
                </h3>
                <p className="text-gray-300 mb-6">
                  Generate concise, insightful books on business and life
                  lessons with our advanced AI assistant in minutes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Topic-based generation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Customizable style and tone
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      One-click editing and refinement
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-left transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] border border-gray-800 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Headphones className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Audio Narration
                </h3>
                <p className="text-gray-300 mb-6">
                  Convert your text to natural-sounding audio with one click for
                  enhanced consumption on the go.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Multiple voice options
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Adjustable speed and pitch
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Download for offline listening
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-left transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] border border-gray-800 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Comfortable Reading
                </h3>
                <p className="text-gray-300 mb-6">
                  Enjoy your books in our built-in reader with dark/light mode
                  toggle and bookmarking functionality.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Customizable reading experience
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Progress tracking across devices
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">
                      Highlight and note-taking tools
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Additional features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Shield className="h-5 w-5" />,
                  title: "Secure Storage",
                  description:
                    "All your books are securely stored in the cloud",
                },
                {
                  icon: <BarChart className="h-5 w-5" />,
                  title: "Analytics",
                  description: "Track reading habits and content performance",
                },
                {
                  icon: <Award className="h-5 w-5" />,
                  title: "Premium Quality",
                  description: "Professional-grade content and formatting",
                },
                {
                  icon: <Zap className="h-5 w-5" />,
                  title: "Instant Generation",
                  description: "Create complete books in minutes, not months",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="h-10 w-10 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-gray-900/70 backdrop-blur-sm relative">
          <div className="max-w-[1400px] mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-4">
                <Clock className="h-3.5 w-3.5 mr-2" />
                Simple Process
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Create Your Book in Three Simple Steps
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Our streamlined process makes book creation faster and easier
                than ever before
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line (visible on md screens and up) */}
              <div className="hidden md:block absolute top-24 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-0 rounded-full"></div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-center relative z-10 border border-gray-800 group hover:border-blue-700 transition-colors"
              >
                <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 mx-auto text-white text-2xl font-bold transform group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Choose Your Topic
                </h3>
                <p className="text-gray-300 mb-6">
                  Enter your desired topic or theme and configure book
                  parameters like length, style, and tone.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80"
                  alt="Choose topic"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-center relative z-10 border border-gray-800 group hover:border-indigo-700 transition-colors"
              >
                <div className="h-16 w-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 mx-auto text-white text-2xl font-bold transform group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Generate Content
                </h3>
                <p className="text-gray-300 mb-6">
                  Our AI creates your book content, which you can review and
                  edit as needed to perfect your message.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80"
                  alt="Generate content"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-center relative z-10 border border-gray-800 group hover:border-purple-700 transition-colors"
              >
                <div className="h-16 w-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 mx-auto text-white text-2xl font-bold transform group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Read & Share
                </h3>
                <p className="text-gray-300 mb-6">
                  Export as PDF, generate audio narration, or read directly in
                  our comfortable reader and share with others.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80"
                  alt="Read and share"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </motion.div>
            </div>

            <div className="mt-16 text-center">
              <Link to="/signup">
                <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-base px-8 py-6 h-auto shadow-lg shadow-blue-900/20">
                  Start Creating Your Book
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Reader Preview */}
        <section className="py-24 bg-gray-950/80 backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
          <div className="max-w-[1400px] mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-6">
                  <BookOpen className="h-3.5 w-3.5 mr-2" />
                  Reading Experience
                </div>
                <h2 className="text-4xl font-bold tracking-tight mb-6">
                  Comfortable Reading Experience
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Our built-in reader offers a comfortable reading experience
                  with customizable options to suit your preferences:
                </p>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start bg-gray-900/50 p-4 rounded-xl border border-gray-800"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Sun className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1 text-white">
                        Light & Dark Mode
                      </h4>
                      <p className="text-gray-300">
                        Switch between light and dark mode for comfortable
                        reading in any environment, day or night.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-start bg-gray-900/50 p-4 rounded-xl border border-gray-800"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Bookmark className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1 text-white">
                        Smart Bookmarking
                      </h4>
                      <p className="text-gray-300">
                        Save your place and mark important sections for future
                        reference with our intelligent bookmarking system.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-start bg-gray-900/50 p-4 rounded-xl border border-gray-800"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Headphones className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1 text-white">
                        Integrated Audio
                      </h4>
                      <p className="text-gray-300">
                        Listen to AI-generated narration of your book while
                        following along with the text for an enhanced
                        experience.
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-10">
                  <Link to="/dashboard">
                    <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-base px-6 py-3 h-auto shadow-lg shadow-blue-900/20">
                      Try the Reader
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-1 shadow-2xl">
                  <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-white">
                        Business Leadership
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full bg-gray-800 hover:bg-gray-700"
                        >
                          <Moon className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full bg-gray-800 hover:bg-gray-700"
                        >
                          <Bookmark className="h-4 w-4 text-blue-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
                      <h4 className="text-lg font-medium mb-4 text-white">
                        Chapter 1: Principles of Leadership
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        Effective leadership begins with self-awareness.
                        Understanding your strengths and weaknesses allows you
                        to leverage your talents while building a team that
                        complements your abilities.
                        <br />
                        <br />
                        The most successful leaders share several key traits:
                        vision, integrity, and the ability to inspire others.
                        They create a clear direction for their organization
                        while maintaining ethical standards that earn trust and
                        respect.
                      </p>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <div className="text-sm text-gray-400">Page 1 of 24</div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-full border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-400" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-full border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio player overlay */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-900 to-indigo-900 backdrop-blur-sm rounded-full shadow-xl px-6 py-3 flex items-center space-x-4 border border-indigo-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <Pause className="h-5 w-5" />
                  </Button>
                  <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-white"></div>
                  </div>
                  <span className="text-sm text-white/80 font-medium">
                    01:24 / 04:30
                  </span>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 h-24 w-24 bg-purple-600/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-600/20 rounded-full blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Cross-platform section */}
        <section className="py-20 bg-gray-900/70 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-4">
                <Laptop className="h-3.5 w-3.5 mr-2" />
                Cross-Platform
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Available on All Your Devices
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Access your books and create new content from anywhere, on any
                device
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-center border border-gray-800 group hover:border-blue-700 transition-colors"
              >
                <div className="h-16 w-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Laptop className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Desktop
                </h3>
                <p className="text-gray-300 mb-6">
                  Full-featured experience with advanced editing tools and
                  content management
                </p>
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80"
                  alt="Desktop app"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-center border border-gray-800 group hover:border-indigo-700 transition-colors"
              >
                <div className="h-16 w-16 bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Tablet className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Tablet
                </h3>
                <p className="text-gray-300 mb-6">
                  Perfect for reading and making quick edits while on the go
                </p>
                <img
                  src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80"
                  alt="Tablet app"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg text-center border border-gray-800 group hover:border-purple-700 transition-colors"
              >
                <div className="h-16 w-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Smartphone className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Mobile
                </h3>
                <p className="text-gray-300 mb-6">
                  Read and listen to your books anywhere with our mobile app
                </p>
                <img
                  src="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80"
                  alt="Mobile app"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="max-w-[800px] mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Start Creating Your Book Today
              </h2>
              <p className="text-xl mb-10 opacity-90">
                Join thousands of users who are already creating insightful
                books with our AI platform
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/signup">
                  <Button className="rounded-full bg-white text-blue-600 hover:bg-gray-100 text-base px-8 py-6 h-auto w-full sm:w-auto shadow-lg">
                    Create Your First Book
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="rounded-full border-white text-white hover:bg-blue-700 text-base px-8 py-6 h-auto w-full sm:w-auto"
                  >
                    Explore Examples
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-6">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Avatar
                        key={i}
                        className="border-2 border-blue-600 w-8 h-8"
                      >
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                        />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="ml-2 text-sm">Join 10,000+ users</span>
                </div>

                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">4.9/5 average rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 text-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Book className="h-8 w-8 mr-3 text-blue-500" />
                <span className="text-2xl font-bold text-white">Imprv</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your ideas into concise, beautifully crafted books on
                business and life lessons with AI assistance in minutes, not
                months.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "GitHub", "Discord"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-500 hover:text-blue-500"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Examples
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-500">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-12 text-center">
            <p>© {new Date().getFullYear()} Imprv. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
