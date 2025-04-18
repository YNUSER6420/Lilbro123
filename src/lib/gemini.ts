// AI content generation functions that support multiple providers
import {
  generateDeepseekContent,
  generateDeepseekStructuredContent,
} from "./deepseek";

// Helper function to generate content
export async function generateContent(
  prompt: string,
  provider: string = "gemini",
): Promise<string> {
  try {
    // Use the selected AI provider
    if (provider === "deepseek") {
      return await generateDeepseekContent(prompt);
    }

    // Default to Gemini/placeholder content
    const title = prompt.includes("topic of")
      ? prompt.split('"')[1]
      : "Sample Book";

    return generatePlaceholderContent(title);
  } catch (error) {
    console.error(`Error generating content with ${provider}:`, error);
    throw new Error(
      `Failed to generate content with ${provider}. Please try again later.`,
    );
  }
}

// Helper function for generating content with structured output
export async function generateStructuredContent(
  prompt: string,
  structurePrompt: string,
  provider: string = "gemini",
): Promise<any> {
  try {
    // Use the selected AI provider
    if (provider === "deepseek") {
      return await generateDeepseekStructuredContent(prompt, structurePrompt);
    }

    // Default to Gemini/placeholder content
    const content = generatePlaceholderContent("Sample Topic");

    // If the structure prompt asks for JSON, return a simple object
    if (structurePrompt.toLowerCase().includes("json")) {
      return {
        title: "Sample Book",
        chapters: [
          { title: "Introduction", content: "This is an introduction." },
          { title: "Chapter 1", content: "This is chapter 1." },
          { title: "Chapter 2", content: "This is chapter 2." },
          { title: "Conclusion", content: "This is the conclusion." },
        ],
      };
    }

    return content;
  } catch (error) {
    console.error(
      `Error generating structured content with ${provider}:`,
      error,
    );
    throw new Error(
      `Failed to generate structured content with ${provider}. Please try again later.`,
    );
  }
}

// Helper function for chat conversations
export async function chatWithGemini(
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    // Get the last message to determine a response
    const lastMessage = messages[messages.length - 1];

    // Generate a simple response based on the last message
    let response =
      "I'm sorry, I don't have enough information to help with that.";

    if (lastMessage.content.toLowerCase().includes("book")) {
      response =
        "I can help you create a book! Just provide a topic and I'll generate content for you.";
    } else if (
      lastMessage.content.toLowerCase().includes("hello") ||
      lastMessage.content.toLowerCase().includes("hi")
    ) {
      response = "Hello! How can I assist you with your book creation today?";
    } else if (lastMessage.content.toLowerCase().includes("help")) {
      response =
        "I can help you create books, edit content, and provide suggestions for improvement. What would you like to do?";
    }

    return response;
  } catch (error) {
    console.error("Error with chat:", error);
    throw new Error("Failed to get a response. Please try again later.");
  }
}

// Helper function to generate placeholder content
function generatePlaceholderContent(topic: string): string {
  return `# ${topic.toUpperCase()}

## Introduction

This guide explores the key principles of ${topic} with a professional approach to the subject matter. The following chapters will provide valuable insights and practical advice.

## Chapter 1: Understanding the Fundamentals

Before diving into advanced strategies, it's essential to grasp the core concepts of ${topic}. This foundation will serve as the building blocks for more complex ideas explored later.

The fundamental principles include:
- Clear vision and purpose
- Consistent execution
- Adaptability to changing circumstances
- Continuous learning and improvement

## Chapter 2: Practical Applications

Theory without application has limited value. This chapter explores how to implement the principles of ${topic} in real-world scenarios.

Case studies demonstrate successful implementation across various industries and contexts, providing a blueprint for your own application.

## Chapter 3: Overcoming Challenges

Every journey faces obstacles. This chapter addresses common challenges in ${topic} and provides strategies to overcome them effectively.

By anticipating potential roadblocks, you can prepare appropriate responses and maintain momentum toward your goals.

## Conclusion

Mastering ${topic} is an ongoing process that requires dedication and practice. By applying the principles outlined in this guide, you'll be well-equipped to achieve success in your endeavors.

Remember that excellence is not a destination but a continuous journey of improvement and refinement.`;
}
