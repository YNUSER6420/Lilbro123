import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Headphones,
  Volume2,
} from "lucide-react";
import { AudioPlayer } from "@/components/ui/audio-player";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNarrationSettings } from "@/lib/audio-generator";

export interface BookReaderProps {
  title: string;
  content: string;
  currentPage?: number;
  totalPages?: number;
  audioUrl?: string;
  onPageChange?: (page: number) => void;
  onBookmark?: (page: number) => void;
  isBookmarked?: boolean;
  bookId?: string;
  userId?: string;
}

export function BookReader({
  title = "Business Leadership",
  content = "Effective leadership begins with self-awareness. Understanding your strengths and weaknesses allows you to leverage your talents while building a team that complements your abilities.\n\nThe most successful leaders share several key traits: vision, integrity, and the ability to inspire others. They create a clear direction for their organization while maintaining ethical standards that earn trust and respect.",
  currentPage = 1,
  totalPages = 24,
  audioUrl,
  onPageChange,
  onBookmark,
  isBookmarked = false,
  bookId,
  userId,
}: BookReaderProps) {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  useEffect(() => {
    // If audio URL is available, show the audio player by default
    if (audioUrl) {
      setShowAudioPlayer(true);
    }
  }, [audioUrl]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleBookmark = () => {
    if (onBookmark) {
      onBookmark(currentPage);
    }
  };
  const toggleAudioPlayer = () => setShowAudioPlayer(!showAudioPlayer);

  const goToPreviousPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Format content with paragraphs
  const formattedContent = content.split("\n\n").map((paragraph, index) => (
    <p key={index} className="mb-4">
      {paragraph}
    </p>
  ));

  return (
    <div
      className={`w-full h-full flex flex-col ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}
    >
      {/* Reader header */}
      <div
        className={`flex justify-between items-center p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={toggleAudioPlayer}
                >
                  <Headphones
                    className={`h-4 w-4 ${showAudioPlayer ? "text-blue-500" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">
                  {showAudioPlayer ? "Hide audio player" : "Show audio player"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">
                  {darkMode ? "Light mode" : "Dark mode"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full ${isBookmarked ? "text-yellow-500" : ""}`}
                  onClick={toggleBookmark}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">
                  {isBookmarked ? "Remove bookmark" : "Add bookmark"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Audio player - moved to top after header */}
      {showAudioPlayer && (
        <div
          className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <AudioPlayer
            content={content}
            audioUrl={audioUrl}
            darkMode={darkMode}
            onClose={toggleAudioPlayer}
            bookId={bookId}
            userId={userId}
            compact={true}
          />
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6 md:p-8 max-w-3xl mx-auto w-full">
        <div className={`prose ${darkMode ? "prose-invert" : ""} max-w-none`}>
          {formattedContent}
        </div>
      </div>

      {/* Reader footer */}
      <div
        className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} flex justify-between items-center`}
      >
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
