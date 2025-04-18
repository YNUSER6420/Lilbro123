import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, MoreVertical, Volume } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface BookCardProps {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  hasAudio?: boolean;
  progress?: number;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onGenerateAudio?: (id: string) => void;
}

export function BookCard({
  id = "1",
  title = "Business Leadership Principles",
  description = "A concise guide to effective leadership in modern business environments.",
  coverImage = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80",
  hasAudio = false,
  progress = 0,
  onDelete,
  onEdit,
  onGenerateAudio,
}: BookCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-blue-700/50 h-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-900/30">
            <BookOpen className="h-16 w-16 text-blue-400" />
          </div>
        )}

        {/* Progress indicator */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700">
            <div
              className={`h-full ${progress === 100 ? "bg-green-600" : "bg-blue-600"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Audio badge */}
        {hasAudio && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-3 right-3 bg-blue-900/80 text-white rounded-full p-1.5 backdrop-blur-sm border border-blue-700/50">
                  <Headphones className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Audio narration available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Progress badge */}
        {progress > 0 && (
          <div className="absolute top-3 left-3 bg-gray-900/80 text-white text-xs rounded-full py-1 px-2 backdrop-blur-sm border border-gray-700/50">
            {progress === 100 ? "Completed" : `${progress}% Read`}
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 text-white">
              {title}
            </h3>
            {description && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {(onEdit || onDelete || onGenerateAudio) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-900 border border-gray-800"
              >
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(id)}
                    className="text-gray-300 hover:text-white focus:text-white hover:bg-gray-800 focus:bg-gray-800"
                  >
                    Edit
                  </DropdownMenuItem>
                )}
                {onGenerateAudio && !hasAudio && (
                  <DropdownMenuItem
                    onClick={() => onGenerateAudio(id)}
                    className="text-gray-300 hover:text-white focus:text-white hover:bg-gray-800 focus:bg-gray-800"
                  >
                    <Volume className="h-4 w-4 mr-2" />
                    Generate Audio
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(id)}
                    className="text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-gray-800 focus:bg-gray-800"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-5 flex space-x-2">
          <Link to={`/books/${id}`} className="flex-1">
            <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white">
              Read Now
            </Button>
          </Link>
          {hasAudio && (
            <Link to={`/books/${id}`} className="">
              <Button
                variant="outline"
                className="rounded-full border-blue-700 text-blue-400 hover:bg-blue-900/20"
              >
                <Headphones className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
