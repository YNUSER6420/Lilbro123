import { BookCard, BookCardProps } from "./book-card";
import { EmptyState } from "@/components/dashboard/EmptyState";

export interface BookGridProps {
  books: BookCardProps[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onGenerateAudio?: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const defaultBooks: BookCardProps[] = [
  {
    id: "1",
    title: "Business Leadership Principles",
    description:
      "A concise guide to effective leadership in modern business environments.",
    coverImage:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80",
    hasAudio: true,
    progress: 45,
  },
  {
    id: "2",
    title: "Personal Productivity Mastery",
    description:
      "Strategies and techniques to maximize your productivity and achieve your goals.",
    coverImage:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&q=80",
    hasAudio: false,
    progress: 0,
  },
  {
    id: "3",
    title: "Financial Freedom Blueprint",
    description:
      "A step-by-step guide to building wealth and achieving financial independence.",
    coverImage:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=80",
    hasAudio: true,
    progress: 78,
  },
  {
    id: "4",
    title: "Mindful Communication",
    description:
      "How to improve your relationships through effective and mindful communication.",
    coverImage:
      "https://images.unsplash.com/photo-1521898284481-a5ec348cb555?w=300&q=80",
    hasAudio: false,
    progress: 12,
  },
];

export function BookGrid({
  books = defaultBooks,
  onDelete,
  onEdit,
  onGenerateAudio,
  isLoading = false,
  emptyMessage = "No books found. Create your first book to get started!",
}: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="aspect-[3/4] bg-gray-800/80 rounded-t-lg"></div>
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-800 rounded-full w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded-full w-full"></div>
              <div className="h-4 bg-gray-800 rounded-full w-1/2"></div>
              <div className="h-10 bg-gray-800 rounded-full w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return <EmptyState title="No books found" description={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          {...book}
          onDelete={onDelete}
          onEdit={onEdit}
          onGenerateAudio={onGenerateAudio}
        />
      ))}
    </div>
  );
}

import { BookOpen } from "lucide-react";
