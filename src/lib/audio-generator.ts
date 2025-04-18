import { supabase } from "../../supabase/supabase";

export interface AudioGenerationOptions {
  voice?: string;
  speed?: number;
  format?: "mp3" | "wav" | "ogg";
  quality?: "low" | "medium" | "high";
}

const defaultOptions: AudioGenerationOptions = {
  voice: "en-US-Neural2-F", // Default to a female US English voice
  speed: 1.0,
  format: "mp3",
  quality: "medium",
};

// This is a mock implementation of an audio generation service
// In a real implementation, you would use a service like Google Cloud Text-to-Speech, Amazon Polly, etc.
export async function generateAudio(
  text: string,
  bookId: string,
  userId: string,
  options: Partial<AudioGenerationOptions> = {},
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // Simulate audio generation process
    // In a real implementation, this would call a TTS API
    console.log(
      `Generating audio for book ${bookId} with options:`,
      mergedOptions,
    );

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a real audio URL for testing
    // Using a sample MP3 file from a public source
    const mockAudioUrl =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    // Update the book record with the audio URL
    const { error: bookError } = await supabase
      .from("books")
      .update({ audio_url: mockAudioUrl })
      .eq("id", bookId)
      .eq("user_id", userId);

    if (bookError) throw bookError;

    // Save narration settings
    const { error: settingsError } = await supabase
      .from("narration_settings")
      .upsert([
        {
          book_id: bookId,
          user_id: userId,
          voice: mergedOptions.voice,
          speed: mergedOptions.speed,
          quality: mergedOptions.quality,
          updated_at: new Date().toISOString(),
        },
      ]);

    if (settingsError) throw settingsError;

    return mockAudioUrl;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw new Error("Failed to generate audio. Please try again.");
  }
}

// Function to check if a book has audio narration
export async function hasAudioNarration(bookId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("audio_url")
      .eq("id", bookId)
      .single();

    if (error) throw error;

    return !!data?.audio_url;
  } catch (error) {
    console.error("Error checking audio narration:", error);
    return false;
  }
}

// Function to get narration settings for a book
export async function getNarrationSettings(
  bookId: string,
  userId: string,
): Promise<AudioGenerationOptions | null> {
  try {
    const { data, error } = await supabase
      .from("narration_settings")
      .select("*")
      .eq("book_id", bookId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"

    if (data) {
      return {
        voice: data.voice,
        speed: data.speed,
        quality: data.quality,
        format: "mp3", // Default format
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching narration settings:", error);
    return null;
  }
}

// Function to save narration settings for a book
export async function saveNarrationSettings(
  bookId: string,
  userId: string,
  settings: Partial<AudioGenerationOptions>,
): Promise<void> {
  try {
    const { error } = await supabase.from("narration_settings").upsert([
      {
        book_id: bookId,
        user_id: userId,
        voice: settings.voice || defaultOptions.voice,
        speed: settings.speed || defaultOptions.speed,
        quality: settings.quality || defaultOptions.quality,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error("Error saving narration settings:", error);
    throw new Error("Failed to save narration settings. Please try again.");
  }
}
