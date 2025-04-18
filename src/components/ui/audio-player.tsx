import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Volume1,
  Volume,
  Settings,
  Save,
} from "lucide-react";
import textToSpeech from "@/lib/text-to-speech";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveNarrationSettings } from "@/lib/audio-generator";
import { useToast } from "@/components/ui/use-toast";

interface AudioPlayerProps {
  content: string;
  audioUrl?: string;
  onClose?: () => void;
  darkMode?: boolean;
  bookId?: string;
  userId?: string;
  compact?: boolean;
}

export function AudioPlayer({
  content,
  audioUrl,
  onClose,
  darkMode = false,
  bookId,
  userId,
  compact = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [rate, setRate] = useState(1);
  const [currentSection, setCurrentSection] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const contentSections = useRef<string[]>([]);

  // Initialize audio player
  useEffect(() => {
    // Split content into manageable sections (paragraphs)
    contentSections.current = content
      .split("\n\n")
      .filter((p) => p.trim().length > 0);

    // Initialize audio element if URL is provided
    if (audioUrl) {
      console.log("Audio URL provided:", audioUrl);
      audioRef.current = new Audio(audioUrl);

      audioRef.current.addEventListener("loadedmetadata", () => {
        console.log(
          "Audio metadata loaded, duration:",
          audioRef.current?.duration,
        );
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
      });

      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("pause", () => setIsPlaying(false));
      audioRef.current.addEventListener("play", () => setIsPlaying(true));

      // Preload the audio
      audioRef.current.load();
    }

    // Load available voices
    textToSpeech.onReady(() => {
      const voices = textToSpeech.getVoices();
      setAvailableVoices(voices);
      // Set default voice (prefer English)
      const defaultVoice = voices.find((voice) => voice.lang.startsWith("en"));
      if (defaultVoice) {
        setCurrentVoice(defaultVoice.name);
      } else if (voices.length > 0) {
        setCurrentVoice(voices[0].name);
      }
    });

    return () => {
      // Clean up
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.removeEventListener("error", (e) =>
          console.error("Audio error:", e),
        );
        audioRef.current.pause();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      textToSpeech.stop();
    };
  }, [audioUrl, content]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      // Play audio file if available
      console.log("Attempting to play audio from URL:", audioUrl);

      // Make sure the audio is loaded
      if (audioRef.current.readyState === 0) {
        audioRef.current.load();
      }

      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
            startProgressTracking();
          })
          .catch((error) => {
            console.error("Audio playback failed:", error);
            // Fallback to TTS if audio playback fails
            useTTSFallback();
          });
      }
    } else {
      useTTSFallback();
    }
  };

  const useTTSFallback = () => {
    // Use TTS if no audio file or if audio file playback fails
    const currentText = contentSections.current[currentSection];
    if (currentText) {
      console.log("Using TTS fallback for section:", currentSection);
      const utterance = textToSpeech.speak(currentText, {
        voice: currentVoice,
        rate: rate,
        volume: volume / 100,
      });

      utterance.onend = () => {
        // Move to next section if available
        if (currentSection < contentSections.current.length - 1) {
          setCurrentSection((prev) => prev + 1);
          playAudio();
        } else {
          setIsPlaying(false);
          setCurrentSection(0);
        }
      };

      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.pause();
    } else {
      textToSpeech.pause();
    }
    setIsPlaying(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    }, 100);
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(80);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      if (isPlaying) {
        textToSpeech.stop();
        setTimeout(playAudio, 100);
      }
    }
  };

  const handleNextSection = () => {
    if (currentSection < contentSections.current.length - 1) {
      setCurrentSection((prev) => prev + 1);
      if (isPlaying) {
        textToSpeech.stop();
        setTimeout(playAudio, 100);
      }
    }
  };

  const handleSaveSettings = async () => {
    if (!bookId || !userId) {
      toast({
        title: "Cannot save settings",
        description: "Book ID or User ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await saveNarrationSettings(bookId, userId, {
        voice: currentVoice,
        speed: rate,
        quality: "medium", // Default quality
      });
      toast({
        title: "Settings saved",
        description: "Your narration settings have been saved for future use.",
      });
      setShowSettingsDialog(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description:
          "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get volume icon based on current volume level
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 30) return <Volume className="h-4 w-4" />;
    if (volume < 70) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div
      className={`p-3 ${compact ? "border-b" : "border-t"} ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"} flex items-center space-x-4`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full"
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {!audioUrl && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={handlePrevSection}
            disabled={currentSection === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={handleNextSection}
            disabled={currentSection === contentSections.current.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </>
      )}

      {audioUrl ? (
        <div className="flex-1">
          <Slider
            value={[progress]}
            max={duration}
            step={0.1}
            onValueChange={handleProgressChange}
          />
        </div>
      ) : (
        <div className="flex-1 text-xs">
          {`Section ${currentSection + 1} of ${contentSections.current.length}`}
        </div>
      )}

      {audioUrl && (
        <div className="text-xs w-16 text-center">
          {formatTime(progress)} / {formatTime(duration)}
        </div>
      )}

      {!audioUrl && bookId && userId && (
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`sm:max-w-md ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
          >
            <DialogHeader>
              <DialogTitle>Narration Settings</DialogTitle>
              <DialogDescription>
                Customize your narration experience
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="voice" className="text-right">
                  Voice
                </Label>
                <Select value={currentVoice} onValueChange={setCurrentVoice}>
                  <SelectTrigger
                    id="voice"
                    className={`col-span-3 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                  >
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-300"
                    }
                  >
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate" className="text-right">
                  Speed
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Slow</span>
                  <Slider
                    id="rate"
                    value={[rate]}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onValueChange={(value) => setRate(value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-400">Fast</span>
                  <span className="text-sm text-gray-300 w-8 text-right">
                    {rate.toFixed(1)}x
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSettingsDialog(false)}
                className={darkMode ? "border-gray-700 hover:bg-gray-800" : ""}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Popover open={showVolumeControl} onOpenChange={setShowVolumeControl}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => setShowVolumeControl(!showVolumeControl)}
          >
            {getVolumeIcon()}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`w-48 p-3 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          side="top"
          align="end"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Volume
              </span>
              <span
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {volume}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-full"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume className="h-3.5 w-3.5" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <Volume2 className="h-3.5 w-3.5" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
