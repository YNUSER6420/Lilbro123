import { jsPDF } from "jspdf";
// No need to import polyfills in newer jsPDF versions

export interface PdfOptions {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
  pageSize?: "a4" | "letter" | "legal";
  orientation?: "portrait" | "landscape";
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface BookContent {
  title: string;
  content: string;
  coverImage?: string;
}

const defaultOptions: PdfOptions = {
  title: "Untitled Book",
  author: "Imprv",
  subject: "Book",
  keywords: ["book", "imprv"],
  creator: "Imprv Book Platform",
  pageSize: "a4",
  orientation: "portrait",
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
};

export async function generatePdf(
  book: BookContent,
  options: Partial<PdfOptions> = {},
): Promise<Blob> {
  const mergedOptions = { ...defaultOptions, ...options };

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: mergedOptions.orientation,
    unit: "mm",
    format: mergedOptions.pageSize,
  });

  // Set document properties
  doc.setProperties({
    title: mergedOptions.title,
    author: mergedOptions.author,
    subject: mergedOptions.subject,
    keywords: mergedOptions.keywords?.join(", "),
    creator: mergedOptions.creator,
  });

  // Set font
  doc.setFont("helvetica", "normal");

  // Add cover image if available
  if (book.coverImage) {
    try {
      const img = new Image();
      img.src = book.coverImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Calculate image dimensions to fit the page while maintaining aspect ratio
      const imgRatio = img.width / img.height;
      const pageRatio = pageWidth / pageHeight;

      let imgWidth, imgHeight;

      if (imgRatio > pageRatio) {
        imgWidth =
          pageWidth - mergedOptions.margins.left - mergedOptions.margins.right;
        imgHeight = imgWidth / imgRatio;
      } else {
        imgHeight = pageHeight / 2; // Use half the page height for the cover image
        imgWidth = imgHeight * imgRatio;
      }

      const xPos = (pageWidth - imgWidth) / 2;
      const yPos = mergedOptions.margins.top;

      doc.addImage(img, "JPEG", xPos, yPos, imgWidth, imgHeight);

      // Add title below the image
      doc.setFontSize(24);
      doc.text(book.title, pageWidth / 2, yPos + imgHeight + 20, {
        align: "center",
      });

      // Add a new page for content
      doc.addPage();
    } catch (error) {
      console.error("Error adding cover image:", error);
      // If cover image fails, just add the title on the first page
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(24);
      doc.text(book.title, pageWidth / 2, 40, { align: "center" });
    }
  } else {
    // No cover image, just add the title
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(24);
    doc.text(book.title, pageWidth / 2, 40, { align: "center" });
  }

  // Process content
  const margins = mergedOptions.margins;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margins.left - margins.right;

  // Split content into paragraphs
  const paragraphs = book.content.split("\n\n");

  let yPos = book.coverImage ? margins.top : 60; // Start position after title

  // Process each paragraph
  doc.setFontSize(12);

  for (const paragraph of paragraphs) {
    // Check if this is a heading (starts with # or ##)
    if (paragraph.startsWith("# ")) {
      // Main heading
      const headingText = paragraph.substring(2);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");

      // Check if we need a new page
      if (yPos > pageHeight - margins.bottom - 20) {
        doc.addPage();
        yPos = margins.top;
      }

      doc.text(headingText, margins.left, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
    } else if (paragraph.startsWith("## ")) {
      // Subheading
      const headingText = paragraph.substring(3);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");

      // Check if we need a new page
      if (yPos > pageHeight - margins.bottom - 20) {
        doc.addPage();
        yPos = margins.top;
      }

      doc.text(headingText, margins.left, yPos);
      yPos += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
    } else {
      // Regular paragraph
      // Split text to fit within page width
      const textLines = doc.splitTextToSize(paragraph, contentWidth);

      // Check if we need a new page
      if (yPos + textLines.length * 7 > pageHeight - margins.bottom) {
        doc.addPage();
        yPos = margins.top;
      }

      doc.text(textLines, margins.left, yPos);
      yPos += textLines.length * 7 + 5; // Add some space after paragraph
    }
  }

  // Add page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  }

  // Return as blob
  return doc.output("blob");
}

export function downloadPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
