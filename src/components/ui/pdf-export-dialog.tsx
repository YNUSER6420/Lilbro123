import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Loader2 } from "lucide-react";
import { generatePdf, downloadPdf, PdfOptions } from "@/lib/pdf-generator";

interface PdfExportDialogProps {
  title: string;
  content: string;
  coverImage?: string;
  author?: string;
  onExportComplete?: () => void;
  trigger?: React.ReactNode;
}

export function PdfExportDialog({
  title,
  content,
  coverImage,
  author = "",
  onExportComplete,
  trigger,
}: PdfExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName] = useState(
    title.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
  );
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [open, setOpen] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const options: PdfOptions = {
        title,
        pageSize,
        orientation,
        author: includeMetadata ? author : undefined,
      };

      // Generate PDF
      const pdfBlob = await generatePdf(
        {
          title,
          content,
          coverImage,
        },
        options,
      );

      // Download the PDF
      downloadPdf(pdfBlob, `${fileName}.pdf`);

      if (onExportComplete) {
        onExportComplete();
      }

      setOpen(false);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Export as PDF</DialogTitle>
          <DialogDescription>
            Configure your PDF export settings below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-700"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pageSize" className="text-right">
              Page Size
            </Label>
            <div className="col-span-3 flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="a4"
                  value="a4"
                  checked={pageSize === "a4"}
                  onChange={() => setPageSize("a4")}
                  className="text-blue-600"
                />
                <Label htmlFor="a4" className="cursor-pointer">
                  A4
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="letter"
                  value="letter"
                  checked={pageSize === "letter"}
                  onChange={() => setPageSize("letter")}
                  className="text-blue-600"
                />
                <Label htmlFor="letter" className="cursor-pointer">
                  Letter
                </Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="orientation" className="text-right">
              Orientation
            </Label>
            <div className="col-span-3 flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="portrait"
                  value="portrait"
                  checked={orientation === "portrait"}
                  onChange={() => setOrientation("portrait")}
                  className="text-blue-600"
                />
                <Label htmlFor="portrait" className="cursor-pointer">
                  Portrait
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="landscape"
                  value="landscape"
                  checked={orientation === "landscape"}
                  onChange={() => setOrientation("landscape")}
                  className="text-blue-600"
                />
                <Label htmlFor="landscape" className="cursor-pointer">
                  Landscape
                </Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <div className="col-start-2 col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includePageNumbers"
                  checked={includePageNumbers}
                  onCheckedChange={(checked) =>
                    setIncludePageNumbers(checked as boolean)
                  }
                />
                <Label
                  htmlFor="includePageNumbers"
                  className="cursor-pointer text-sm"
                >
                  Include page numbers
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) =>
                    setIncludeMetadata(checked as boolean)
                  }
                />
                <Label
                  htmlFor="includeMetadata"
                  className="cursor-pointer text-sm"
                >
                  Include document metadata (author, creation date)
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-700 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
