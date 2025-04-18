import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface PdfPreviewProps {
  pdfUrl: string;
  title: string;
  onDownload: () => void;
}

export function PdfPreview({ pdfUrl, title, onDownload }: PdfPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Reset to first page when PDF changes
    if (open) {
      setCurrentPage(1);
    }
  }, [pdfUrl, open]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] flex flex-col p-0 gap-0 bg-gray-900 border-gray-800">
        <DialogHeader className="p-4 border-b border-gray-800 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-950 p-4">
          <div
            className="mx-auto bg-white shadow-lg transition-all duration-200"
            style={{
              width: `${8.27 * zoom}in`,
              height: `${11.69 * zoom}in`,
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#page=${currentPage}`}
              className="w-full h-full"
              title="PDF Preview"
              onLoad={() => {
                // Try to get total pages from iframe document
                try {
                  const iframe = iframeRef.current;
                  if (iframe && iframe.contentWindow) {
                    // This is a simplified approach - actual implementation would depend on PDF.js or similar
                    setTotalPages(10); // Placeholder - would need actual PDF parsing
                  }
                } catch (error) {
                  console.error("Error accessing PDF iframe:", error);
                }
              }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="h-9 w-9 p-0 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || "?"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages && totalPages !== 0}
              className="h-9 w-9 p-0 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
