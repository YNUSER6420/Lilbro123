import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { LiquidBackground } from "@/components/ui/liquid-background";
import { BookReader } from "@/components/ui/book-reader";
import { AudioGenerationDialog } from "@/components/ui/audio-generation-dialog";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { generatePdf, downloadPdf } from "@/lib/pdf-generator";
import { ArrowLeft, Download, Headphones, Loader2 } from "lucide-react";

interface Book {
  id: string;
  title: string;
  content: string;
  description?: string;
  cover_image?: string;
  audio_url?: string;
  category?: string;
}

export default function BookViewPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchBook(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (book && user) {
      // Calculate total pages (rough estimate based on content length)
      const wordsPerPage = 250;
      const wordCount = book.content.split(/\s+/).length;
      const calculatedPages = Math.max(1, Math.ceil(wordCount / wordsPerPage));
      setTotalPages(calculatedPages);

      // Check if current page is bookmarked
      checkBookmark(id as string, currentPage);

      // Get reading progress
      fetchReadingProgress(id as string);
    }
  }, [book, user, currentPage]);

  const fetchBook = async (bookId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast({
        title: "Error loading book",
        description: "There was an error loading the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReadingProgress = async (bookId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"

      if (data) {
        setCurrentPage(data.current_page);
      } else {
        // Create new reading progress entry
        await supabase.from("reading_progress").insert([
          {
            book_id: bookId,
            user_id: user.id,
            current_page: 1,
            total_pages: totalPages,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching reading progress:", error);
    }
  };

  const updateReadingProgress = async (page: number) => {
    if (!user || !id) return;

    try {
      await supabase.from("reading_progress").upsert([
        {
          book_id: id,
          user_id: user.id,
          current_page: page,
          total_pages: totalPages,
          last_read_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error updating reading progress:", error);
    }
  };

  const checkBookmark = async (bookId: string, page: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .eq("page_number", page);

      if (error) throw error;
      setIsBookmarked(data && data.length > 0);
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateReadingProgress(page);
  };

  const handleExportPdf = async () => {
    if (!book) return;

    try {
      setIsExporting(true);

      // Generate PDF
      const pdfBlob = await generatePdf(
        {
          title: book.title,
          content: book.content,
          coverImage: book.cover_image,
        },
        {
          title: book.title,
          author: user?.user_metadata?.full_name || "Imprv User",
          subject: book.description || "Book created with Imprv",
          keywords: ["imprv", "book", book.category || "business"],
        },
      );

      // Download the PDF
      downloadPdf(
        pdfBlob,
        `${book.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`,
      );

      toast({
        title: "PDF exported successfully",
        description: "Your book has been downloaded as a PDF file.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error exporting PDF",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBookmark = async (page: number) => {
    if (!user || !id) return;

    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from("bookmarks")
          .delete()
          .eq("book_id", id)
          .eq("user_id", user.id)
          .eq("page_number", page);

        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "The bookmark has been removed.",
        });
      } else {
        // Add bookmark
        await supabase.from("bookmarks").insert([
          {
            book_id: id,
            user_id: user.id,
            page_number: page,
          },
        ]);

        setIsBookmarked(true);
        toast({
          title: "Page bookmarked",
          description: "This page has been bookmarked for future reference.",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description:
          "There was an error managing your bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAudioGenerationComplete = (audioUrl: string) => {
    // Update the book with the new audio URL
    if (book) {
      console.log("Audio generation complete, URL:", audioUrl);
      setBook({ ...book, audio_url: audioUrl });
      toast({
        title: "Audio narration ready",
        description: "Your book now has audio narration available.",
      });

      // Refresh the book data from the database to ensure we have the latest audio_url
      fetchBook(id as string);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading book..." />;
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
        <LiquidBackground color1="#1e40af" color2="#3730a3" color3="#4f46e5" />
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-6">
            The book you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative overflow-hidden">
      <LiquidBackground color1="#1e40af" color2="#3730a3" color3="#4f46e5" />
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 py-3 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">{book.title}</h1>
        </div>
        <div className="flex space-x-2">
          {user && id && (
            <AudioGenerationDialog
              bookId={id}
              userId={user.id}
              bookTitle={book.title}
              bookContent={book.content}
              onGenerationComplete={handleAudioGenerationComplete}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isGeneratingAudio || !!book.audio_url}
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  {book.audio_url ? "Audio Available" : "Generate Audio"}
                </Button>
              }
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <BookReader
          title={book.title}
          content={book.content}
          currentPage={currentPage}
          totalPages={totalPages}
          audioUrl={book.audio_url}
          onPageChange={handlePageChange}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
          bookId={id}
          userId={user?.id}
        />
      </main>
    </div>
  );
}
