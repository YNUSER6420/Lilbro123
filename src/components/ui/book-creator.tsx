import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  Headphones,
  Loader2,
  Sparkles,
  Download,
} from "lucide-react";
import { generatePdf, downloadPdf } from "@/lib/pdf-generator";

export interface BookCreatorProps {
  onGenerate?: (params: BookGenerationParams) => Promise<void>;
  onSave?: (book: BookData) => Promise<void>;
  isGenerating?: boolean;
  generatedContent?: string;
}

export interface BookGenerationParams {
  topic: string;
  length: number;
  style: string;
  tone: string;
  category: string;
}

export interface BookData {
  title: string;
  description: string;
  content: string;
  coverImage?: string;
}

export function BookCreator({
  onGenerate,
  onSave,
  isGenerating = false,
  generatedContent = "",
}: BookCreatorProps) {
  const [activeTab, setActiveTab] = useState("create");
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState(5); // pages
  const [style, setStyle] = useState("concise");
  const [tone, setTone] = useState("professional");
  const [category, setCategory] = useState("business");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);

      // Generate PDF
      const pdfBlob = await generatePdf({
        title: title || topic,
        content: content || generatedContent,
      });

      // Download the PDF
      downloadPdf(
        pdfBlob,
        `${(title || topic).replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`,
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerate = async () => {
    if (onGenerate) {
      await onGenerate({
        topic,
        length,
        style,
        tone,
        category,
      });
      setActiveTab("preview");
    }
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave({
        title: title || topic,
        description,
        content: content || generatedContent,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b border-gray-800">
          <TabsList className="w-full justify-start h-12 px-4 bg-transparent">
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-blue-900/30 text-gray-300"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-blue-900/30 text-gray-300"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="export"
              className="data-[state=active]:bg-blue-900/30 text-gray-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create" className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-gray-200">
                Book Topic or Theme
              </Label>
              <Input
                id="topic"
                placeholder="E.g., Effective Leadership Strategies"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="border-gray-700 bg-gray-800/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Book Length (pages)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[length]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => setLength(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center text-gray-300">{length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="style" className="text-gray-200">
                  Writing Style
                </Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger
                    id="style"
                    className="border-gray-700 bg-gray-800/50"
                  >
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="conversational">
                      Conversational
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone" className="text-gray-200">
                  Tone
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger
                    id="tone"
                    className="border-gray-700 bg-gray-800/50"
                  >
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-200">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="category"
                  className="border-gray-700 bg-gray-800/50"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-800">
                  <SelectItem value="business">
                    Business & Leadership
                  </SelectItem>
                  <SelectItem value="personal-development">
                    Personal Development
                  </SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="finance">Finance & Investing</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="career">Career Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleGenerate}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!topic || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Book Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-200">
                Book Title
              </Label>
              <Input
                id="title"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-700 bg-gray-800/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-200">
                Book Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of your book"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border-gray-700 bg-gray-800/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-200">
                Book Content
              </Label>
              <Textarea
                id="content"
                placeholder="Your book content will appear here"
                value={content || generatedContent}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="font-mono text-sm border-gray-700 bg-gray-800/50"
              />
            </div>

            <div className="pt-4 flex space-x-4">
              <Button
                onClick={() => setActiveTab("create")}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                Back to Create
              </Button>
              <Button
                onClick={() => setActiveTab("export")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continue to Export
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="export" className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800">
              <h3 className="text-lg font-medium mb-2 text-white">
                Your Book is Ready!
              </h3>
              <p className="text-gray-300 mb-4">
                You can now save your book to your library, generate audio
                narration, or export it as a PDF.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save to Library
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-200 hover:bg-gray-800"
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
            </div>

            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-800 p-4 border-b border-gray-700">
                <h3 className="font-medium text-gray-200">Book Preview</h3>
              </div>
              <div className="p-6 max-h-[400px] overflow-auto bg-gray-900">
                <h1 className="text-2xl font-bold mb-4 text-white">
                  {title || topic}
                </h1>
                <div className="prose prose-invert max-w-none">
                  {(content || generatedContent)
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-300">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setActiveTab("preview")}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                Back to Preview
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Save and Finish
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
