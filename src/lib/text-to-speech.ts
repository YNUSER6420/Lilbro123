// Text-to-speech service using Web Speech API

export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TextToSpeechService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isReady: boolean = false;
  private onReadyCallbacks: (() => void)[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    // Chrome loads voices asynchronously
    if (typeof window !== "undefined") {
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
    this.isReady = true;
    this.onReadyCallbacks.forEach((callback) => callback());
    this.onReadyCallbacks = [];
  }

  onReady(callback: () => void) {
    if (this.isReady) {
      callback();
    } else {
      this.onReadyCallbacks.push(callback);
    }
  }

  getVoices() {
    return this.voices;
  }

  speak(text: string, options: TTSOptions = {}) {
    // Cancel any ongoing speech
    this.stop();

    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(text);

    // Set options
    if (options.voice) {
      const selectedVoice = this.voices.find(
        (voice) => voice.name === options.voice,
      );
      if (selectedVoice) {
        this.utterance.voice = selectedVoice;
      }
    }

    if (options.rate !== undefined) this.utterance.rate = options.rate;
    if (options.pitch !== undefined) this.utterance.pitch = options.pitch;
    if (options.volume !== undefined) this.utterance.volume = options.volume;

    // Start speaking
    this.synth.speak(this.utterance);

    return this.utterance;
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }

  stop() {
    this.synth.cancel();
    this.utterance = null;
  }

  isSpeaking() {
    return this.synth.speaking;
  }

  isPaused() {
    return this.synth.paused;
  }

  // Generate audio file from text (returns a blob URL)
  async generateAudio(text: string, options: TTSOptions = {}): Promise<string> {
    // This is a mock implementation since Web Speech API doesn't support direct audio file generation
    // In a real implementation, you would use a server-side TTS service like Google Cloud TTS, Amazon Polly, etc.
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Return a mock audio URL
        // In a real implementation, this would be the URL to the generated audio file
        resolve(`https://example.com/audio/${Date.now()}.mp3`);
      }, 2000);
    });
  }
}

// Create a singleton instance
const textToSpeech = new TextToSpeechService();
export default textToSpeech;
