import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BookGrid } from "@/components/ui/book-grid";
import { BookCardProps } from "@/components/ui/book-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { LiquidBackground } from "@/components/ui/liquid-background";
import { WelcomeBanner } from "../dashboard/WelcomeBanner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookCardProps[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBooks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      // Check if Supabase credentials are available
      if (!supabase || !user) {
        console.error("Supabase client or user not initialized");
        throw new Error("Database connection not available");
      }

      console.log(
        "Fetching books for user ID:",
        user.id,
        "(type: " + typeof user.id + ")",
      );

      const { data, error } = await supabase
        .from("books")
        .select(
          "*, reading_progress(current_page, total_pages, percentage_complete)",
        )
        .eq("user_id", user.id.toString()) // Ensure user.id is converted to string
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Books data received:", data ? data.length : 0, "books");

      // Transform data for BookGrid component
      const transformedBooks = data.map((book) => {
        // Get reading progress if available
        const readingProgress = book.reading_progress?.[0];
        const progress = readingProgress
          ? readingProgress.percentage_complete
          : 0;

        return {
          id: book.id,
          title: book.title,
          description: book.description,
          coverImage: book.cover_image,
          hasAudio: !!book.audio_url,
          progress: progress,
        };
      });

      setBooks(transformedBooks);
    } catch (error: any) {
      console.error("Error fetching books:", error);
      // More detailed error reporting
      const errorDetails = error.code ? `(Code: ${error.code})` : "";
      const errorMessage = error.message || "Unknown error occurred";
      toast({
        title: "Error loading books",
        description: `${errorMessage} ${errorDetails}. Please check your connection and try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);

      if (error) throw error;

      // Remove book from state
      setBooks(books.filter((book) => book.id !== id));

      toast({
        title: "Book deleted",
        description: "The book has been deleted from your library.",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error deleting book",
        description: "There was an error deleting the book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateAudio = (id: string) => {
    navigate(`/books/${id}`);
    toast({
      title: "Navigate to book",
      description: "You can generate audio narration from the book view page.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative overflow-hidden">
      <LiquidBackground
        color1="#1e40af"
        color2="#3730a3"
        color3="#4f46e5"
        variant="mesh"
      />
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16 relative">
        <Sidebar />
        <main className="flex-1 overflow-auto w-full">
          <div className="container mx-auto px-4 py-6 sm:p-6">
            {showWelcomeBanner && (
              <WelcomeBanner onDismiss={() => setShowWelcomeBanner(false)} />
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  My Library
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage and explore your collection of books
                </p>
              </div>
              <Link to="/create-book">
                <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-900/20 px-6 py-6 h-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Book
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Books</p>
                  <h3 className="text-2xl font-bold text-white">
                    {books.length}
                  </h3>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">In Progress</p>
                  <h3 className="text-2xl font-bold text-white">
                    {
                      books.filter(
                        (book) => book.progress > 0 && book.progress < 100,
                      ).length
                    }
                  </h3>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <h3 className="text-2xl font-bold text-white">
                    {books.filter((book) => book.progress === 100).length}
                  </h3>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 flex items-center">
                <div className="h-12 w-12 rounded-full bg-orange-900/30 flex items-center justify-center mr-4">
                  <Bookmark className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Bookmarked</p>
                  <h3 className="text-2xl font-bold text-white">0</h3>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-6 mb-8">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                  <TabsList className="bg-gray-800/50">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-blue-600"
                    >
                      All Books
                    </TabsTrigger>
                    <TabsTrigger
                      value="in-progress"
                      className="data-[state=active]:bg-blue-600"
                    >
                      In Progress
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="data-[state=active]:bg-blue-600"
                    >
                      Completed
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                <TabsContent value="all">
                  <BookGrid
                    books={books}
                    onDelete={handleDeleteBook}
                    onEdit={(id) => navigate(`/edit-book/${id}`)}
                    onGenerateAudio={handleGenerateAudio}
                    isLoading={loading}
                  />
                </TabsContent>

                <TabsContent value="in-progress">
                  <BookGrid
                    books={books.filter(
                      (book) => book.progress > 0 && book.progress < 100,
                    )}
                    onDelete={handleDeleteBook}
                    onEdit={(id) => navigate(`/edit-book/${id}`)}
                    onGenerateAudio={handleGenerateAudio}
                    isLoading={loading}
                    emptyMessage="You don't have any books in progress."
                  />
                </TabsContent>

                <TabsContent value="completed">
                  <BookGrid
                    books={books.filter((book) => book.progress === 100)}
                    onDelete={handleDeleteBook}
                    onEdit={(id) => navigate(`/edit-book/${id}`)}
                    onGenerateAudio={handleGenerateAudio}
                    isLoading={loading}
                    emptyMessage="You haven't completed any books yet."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
