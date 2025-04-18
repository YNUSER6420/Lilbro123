import { BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No books found",
  description = "You haven't created any books yet. Start by creating your first book.",
  actionLabel = "Create Book",
  actionLink = "/create-book",
  icon = <BookOpen className="h-12 w-12 text-blue-500" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-lg">
      <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-8 rounded-full mb-8 border border-blue-800/30 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md text-lg">{description}</p>
      <Link to={actionLink}>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full px-6 py-6 h-auto shadow-lg shadow-blue-900/20">
          <PlusCircle className="mr-2 h-5 w-5" />
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
}
