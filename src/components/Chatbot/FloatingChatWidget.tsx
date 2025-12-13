import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plane, Send, X, User, MessageCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { TypingIndicator } from "./TypingIndicator"
import { StayCard } from "./StayCard"

type Message = {
  id: string,
  role: "user" | "assistant"
  content: string
  timestamp: Date
  stays?: Stay[]
}
type Stay = {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  imageUrl: string | null
}
const mockStays: Stay[] = [
  {
    id: 1,
    name: "Ocean View Resort",
    address: "Malibu, California",
    latitude: 34.0259,
    longitude: -118.7798,
    imageUrl: "/paris-france-eiffel-tower-romantic-sunset.jpg",
  },
  {
    id: 2,
    name: "Mountain Peak Lodge",
    address: "Aspen, Colorado",
    latitude: 39.1911,
    longitude: -106.8175,
    imageUrl: "/paris-france-eiffel-tower-romantic-sunset.jpg",
  },
]
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your Virtual Agent assistant. I'm here to help you find the perfect accommodation for your next adventure. Tell me about your travel plans - where would you like to go, and what kind of experience are you looking for?",
    timestamp: new Date(),
  },
]

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping, isOpen])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Great choice! I've found some amazing stays that match your preferences. Here are my top recommendations for your trip:",
        timestamp: new Date(),
        stays: mockStays,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-secondary shadow-lg ring-4 ring-secondary/20 transition-all hover:scale-110 hover:bg-secondary/90 hover:shadow-xl"
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
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="px-4 py-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
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
                        className={`px-3 py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </Card>

                      {message.stays && (
                        <div className="grid w-full gap-3 sm:grid-cols-1">
                          {message.stays.map((stay) => (
                            <StayCard key={stay.id} stay={stay} />
                          ))}
                        </div>
                      )}

                      <span className="text-muted-foreground text-xs">
                        {message.timestamp.toLocaleTimeString([], {
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

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your ideal stay..."
                className="h-10 text-sm"
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
            <p className="mt-1.5 text-center text-muted-foreground text-xs">AI may occasionally make mistakes</p>
          </div>
        </div>
      )}
    </>
  )
}