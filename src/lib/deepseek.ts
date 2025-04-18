// Deepseek API integration for content generation
import * as deepseekApi from "deepseek-api";

// Initialize the Deepseek API client
let deepseekClient: any = null;

// Default API key for Deepseek
const DEFAULT_DEEPSEEK_API_KEY =
  "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";

// Initialize the Deepseek API client with the API key
export function initDeepseekClient(apiKey: string): void {
  try {
    deepseekClient = new deepseekApi.default({
      apiKey,
    });
  } catch (error) {
    console.error("Error initializing Deepseek API client:", error);
    throw new Error("Failed to initialize Deepseek API client");
  }
}

// Generate content using the Deepseek API
export async function generateDeepseekContent(prompt: string): Promise<string> {
  try {
    if (!deepseekClient) {
      // Use the default API key or try to get it from environment variables
      const apiKey =
        DEFAULT_DEEPSEEK_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error("Deepseek API key is not configured");
      }
      initDeepseekClient(apiKey);
    }

    // Call the Deepseek API to generate content
    const response = await deepseekClient.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    // Extract and return the generated content
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating content with Deepseek:", error);
    throw new Error(
      "Failed to generate content with Deepseek. Please try again later.",
    );
  }
}

// Helper function for generating structured content with Deepseek
export async function generateDeepseekStructuredContent(
  prompt: string,
  structurePrompt: string,
): Promise<any> {
  try {
    if (!deepseekClient) {
      // Use the default API key or try to get it from environment variables
      const apiKey =
        DEFAULT_DEEPSEEK_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error("Deepseek API key is not configured");
      }
      initDeepseekClient(apiKey);
    }

    // Combine the prompts to request structured output
    const combinedPrompt = `${prompt}\n\n${structurePrompt}`;

    // Call the Deepseek API
    const response = await deepseekClient.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: combinedPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || "";

    // If JSON was requested, try to parse the response
    if (structurePrompt.toLowerCase().includes("json")) {
      try {
        // Extract JSON from the response if it's wrapped in markdown code blocks
        const jsonMatch =
          content.match(/```json\n([\s\S]*?)\n```/) ||
          content.match(/```\n([\s\S]*?)\n```/);

        const jsonString = jsonMatch ? jsonMatch[1] : content;
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return content; // Return the raw content if parsing fails
      }
    }

    return content;
  } catch (error) {
    console.error("Error generating structured content with Deepseek:", error);
    throw new Error(
      "Failed to generate structured content with Deepseek. Please try again later.",
    );
  }
}
