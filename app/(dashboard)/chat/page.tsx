import { PlaceholderPage } from "@/components/placeholder-page";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <PlaceholderPage
      title="Chat AI"
      description="Hacé preguntas sobre cualquier cuenta en lenguaje natural."
      icon={MessageSquare}
      phase={3}
    />
  );
}
