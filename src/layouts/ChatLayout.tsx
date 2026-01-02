import { FloatingChatWidget } from "@/components/Chatbot/FloatingChatWidget";
import { TripsDrawerProvider } from "@/contexts/TripsDrawerProvider";


export default function ChatLayout() {
  return (
    <>
      <TripsDrawerProvider>
        <FloatingChatWidget />
      </TripsDrawerProvider>
    </>
  )
}