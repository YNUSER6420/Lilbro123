import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
import { Headphones, Loader2, Save } from "lucide-react";
import {
  generateAudio,
  AudioGenerationOptions,
  getNarrationSettings,
  saveNarrationSettings,
} from "@/lib/audio-generator";
import { useToast } from "@/components/ui/use-toast";

interface AudioGenerationDialogProps {
  bookId: string;
  userId: string;
  bookTitle: string;
  bookContent: string;
  onGenerationComplete: (audioUrl: string) => void;
  trigger?: React.ReactNode;
}

export function AudioGenerationDialog({
  bookId,
  userId,
  bookTitle,
  bookContent,
  onGenerationComplete,
  trigger,
}: AudioGenerationDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [voice, setVoice] = useState<string>("en-US-Neural2-F");
  const [speed, setSpeed] = useState<number>(1.0);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Load saved narration settings when dialog opens
  useEffect(() => {
    if (open) {
      loadNarrationSettings();
    }
  }, [open]);

  const loadNarrationSettings = async () => {
    try {
      const settings = await getNarrationSettings(bookId, userId);
      if (settings) {
        setVoice(settings.voice || "en-US-Neural2-F");
        setSpeed(settings.speed || 1.0);
        setQuality((settings.quality as "low" | "medium" | "high") || "medium");
      }
    } catch (error) {
      console.error("Error loading narration settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await saveNarrationSettings(bookId, userId, {
        voice,
        speed,
        quality,
      });
      toast({
        title: "Settings saved",
        description: "Your narration settings have been saved for future use.",
      });
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

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      const options: AudioGenerationOptions = {
        voice,
        speed,
        quality,
        format: "mp3",
      };

      // Generate audio
      const audioUrl = await generateAudio(
        bookContent,
        bookId,
        userId,
        options,
      );

      toast({
        title: "Audio generated successfully",
        description: "Your book now has audio narration available.",
      });

      onGenerationComplete(audioUrl);
      setOpen(false);
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error generating audio",
        description:
          "There was an error generating the audio narration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Headphones className="h-4 w-4 mr-2" />
            Generate Audio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Generate Audio Narration</DialogTitle>
          <DialogDescription>
            Create an AI-generated audio narration for "{bookTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voice" className="text-right">
              Voice
            </Label>
            <Select
              value={voice}
              onValueChange={setVoice}
              disabled={isGenerating}
            >
              <SelectTrigger
                id="voice"
                className="col-span-3 bg-gray-800 border-gray-700"
              >
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="en-US-Neural2-F">
                  English (US) - Female
                </SelectItem>
                <SelectItem value="en-US-Neural2-M">
                  English (US) - Male
                </SelectItem>
                <SelectItem value="en-GB-Neural2-F">
                  English (UK) - Female
                </SelectItem>
                <SelectItem value="en-GB-Neural2-M">
                  English (UK) - Male
                </SelectItem>
                <SelectItem value="en-AU-Neural2-F">
                  English (AU) - Female
                </SelectItem>
                <SelectItem value="en-AU-Neural2-M">
                  English (AU) - Male
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speed" className="text-right">
              Speed
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <span className="text-sm text-gray-400">Slow</span>
              <Slider
                id="speed"
                value={[speed]}
                min={0.5}
                max={2.0}
                step={0.1}
                onValueChange={(value) => setSpeed(value[0])}
                disabled={isGenerating}
                className="flex-1"
              />
              <span className="text-sm text-gray-400">Fast</span>
              <span className="text-sm text-gray-300 w-8 text-right">
                {speed.toFixed(1)}x
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quality" className="text-right">
              Quality
            </Label>
            <Select
              value={quality}
              onValueChange={(value: "low" | "medium" | "high") =>
                setQuality(value)
              }
              disabled={isGenerating}
            >
              <SelectTrigger
                id="quality"
                className="col-span-3 bg-gray-800 border-gray-700"
              >
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="low">Low (Faster generation)</SelectItem>
                <SelectItem value="medium">Medium (Balanced)</SelectItem>
                <SelectItem value="high">High (Better quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveSettings}
              disabled={isGenerating || isSaving}
              className="border-gray-700 hover:bg-gray-800"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-2" />
                  Save as Default
                </>
              )}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
            className="border-gray-700 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Headphones className="h-4 w-4 mr-2" />
                Generate Audio
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
