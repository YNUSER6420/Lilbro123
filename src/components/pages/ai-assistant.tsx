import { AIChat } from "@/components/ui/ai-chat";
import TopNavigation from "@/components/dashboard/layout/TopNavigation";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { LiquidBackground } from "@/components/ui/liquid-background";

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <LiquidBackground color1="#1e40af" color2="#3730a3" color3="#4f46e5" />
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto h-full">
            <h1 className="text-2xl font-semibold mb-6">AI Assistant</h1>
            <div className="h-[calc(100vh-180px)]">
              <AIChat />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
