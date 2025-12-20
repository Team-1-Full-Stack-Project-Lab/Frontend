import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plane, Send, X, User, MessageCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { TypingIndicator } from "./TypingIndicator"
import { StayCard } from "./StayCard"
import type { ChatRequest, ConversationMessage, HotelData } from "@/types"
import { useServices } from '@/hooks/useServices'

type MessageWithHotels = ConversationMessage & {
  hotels?: HotelData[]
}
const initialMessages: MessageWithHotels[] = [
  {
    role: "agent",
    content:
      "Hello! I'm your Virtual Agent assistant. I'm here to help you find the perfect accommodation for your next adventure. Tell me about your travel plans - where would you like to go, and what kind of experience are you looking for?",
    timestamp: Date.now(),
  },
]

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<MessageWithHotels[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { agentService } = useServices()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const userMessage: MessageWithHotels = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = input
    setInput("")
    setIsTyping(true)
    setError(null)

    try {
      const chatRequest: ChatRequest = {
        message: messageToSend,
      }
      if (sessionId) {
        chatRequest.sessionId = sessionId
      }
      const response = await agentService.chatWithAgent(chatRequest)
      if (response.sessionId) {
        setSessionId(response.sessionId)
      }
      const assistantMessage: MessageWithHotels = {
        role: "agent",
        content: response.response,
        timestamp: Date.now(),
        hotels: response.hotels || [],
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error sending message:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)

      const errorChatMessage: MessageWithHotels = {
        role: "agent",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorChatMessage])
    } finally {
      setIsTyping(false)
    }
  }
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }
  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-secondary shadow-lg ring-4 ring-secondary/20 transition-all hover: scale-110 hover:bg-secondary/90 hover:shadow-xl"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="size-6 text-secondary-foreground" />
        ) : (
          <MessageCircle className="size-6 text-secondary-foreground" />
        )}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all sm:w-[450px]">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                <Plane className="size-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground text-base" style={{ fontFamily: "var(--font-poppins)" }}>
                  Virtual Agent
                </h2>
                <p className="text-muted-foreground text-xs">Find your perfect stay</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="size-4" />
              </Button>
            </div>
          </header>
          {/* Messages */}
          <ScrollArea className="flex-1 overflow-y-auto bg-background">
            <div className="px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "agent" && (
                      <Avatar className="size-7 border-2 border-secondary">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          <Plane className="size-3.5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`flex max-w-[75%] flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <Card
                        className={`px-3 py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </Card>

                      {/* Mostrar hoteles */}
                      {message.role === "agent" && message.hotels && message.hotels.length > 0 && (
                        <div className="w-full space-y-3">
                          <p className="text-xs text-muted-foreground px-1">
                            {message.hotels.length} {message.hotels.length === 1 ? 'hotel' : 'hotels'} found
                          </p>
                          <div className="grid w-full gap-3 sm:grid-cols-1">
                            {message.hotels.map((hotel) => (
                              <StayCard
                                key={hotel.id}
                                hotel={hotel}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-muted-foreground text-xs">
                        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="size-7 border-2 border-border">
                        <AvatarFallback className="bg-muted">
                          <User className="size-3.5 text-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Indicador de escritura */}
                {isTyping && (
                  <div className="flex gap-2">
                    <Avatar className="size-7 border-2 border-secondary">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <Plane className="size-3.5" />
                      </AvatarFallback>
                    </Avatar>
                    <TypingIndicator />
                  </div>
                )}

                {/* Mensaje de error */}
                {error && (
                  <div className="flex justify-center">
                    <Card className="border-destructive bg-destructive/10 px-3 py-2">
                      <p className="text-destructive text-sm">{error}</p>
                    </Card>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border bg-card p-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your ideal stay..."
                className="h-10 text-sm"
                disabled={isTyping}
              />

              <Button
                onClick={handleSend}
                size="icon"
                className="size-10 shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                disabled={!input.trim() || isTyping}
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="mt-1.5 text-center text-muted-foreground text-xs">
              AI may occasionally make mistakes
            </p>
          </div>
        </div>
      )}
    </>
  )
}