import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookCreator,
  BookData,
  BookGenerationParams,
} from "@/components/ui/book-creator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { LiquidBackground } from "@/components/ui/liquid-background";
import { generateContent } from "@/lib/gemini";

export default function CreateBookPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGenerate = async (params: BookGenerationParams) => {
    try {
      setIsGenerating(true);

      // Create a prompt for Gemini based on the parameters
      const prompt = `
        Create a concise book on the topic of "${params.topic}".
        The book should be approximately ${params.length} pages long.
        Use a ${params.style} writing style with a ${params.tone} tone.
        The book should be in the ${params.category} category.
        
        Format the book with a title, introduction, chapters with headings, and a conclusion.
        Each chapter should provide valuable insights and practical advice.
        Use markdown formatting with # for main title, ## for chapter titles, and paragraphs separated by blank lines.
      `;

      // Call the Gemini API
      const generatedText = await generateContent(prompt);
      setGeneratedContent(generatedText);

      toast({
        title: "Content generated successfully",
        description:
          "Your book content has been generated using AI. You can now review and edit it.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error generating content",
        description:
          "There was an error generating your book content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (book: BookData) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your book.",
          variant: "destructive",
        });
        return;
      }

      // Save to Supabase
      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            title: book.title,
            description: book.description,
            content: book.content,
            cover_image: book.coverImage || null,
            user_id: user.id,
            reading_time: estimateReadingTime(book.content),
            category: "business", // This would come from the form in a real implementation
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Book saved successfully",
        description: "Your book has been saved to your library.",
      });

      // Navigate to the dashboard or book view
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving book:", error);
      toast({
        title: "Error saving book",
        description: "There was an error saving your book. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <LiquidBackground color1="#1e40af" color2="#3730a3" color3="#4f46e5" />
      <div className="h-screen flex flex-col">
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 py-4 px-6">
          <h1 className="text-xl font-semibold">Create New Book</h1>
        </header>

        <main className="flex-1 overflow-hidden">
          <BookCreator
            onGenerate={handleGenerate}
            onSave={handleSave}
            isGenerating={isGenerating}
            generatedContent={generatedContent}
          />
        </main>
      </div>
    </div>
  );
}

// Helper function to estimate reading time
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
