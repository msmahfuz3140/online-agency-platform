"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "👋 Hi there! I'm Nexora AI. Ask me anything about our full-stack web development, UI/UX design, cyber security auditing, or AI website generation!",
  },
];

const quickPrompts = [
  "💰 How much does a SaaS platform cost?",
  "🛡️ What cyber security services do you offer?",
  "👨‍💻 Who is on the engineering team?",
  "🤖 How does the AI Website Builder work?",
];

const knowledgeBase: Record<string, string> = {
  cost: "Our projects range from $350 (Landing Pages) to $650 (Business Sites) and $1,400+ (Full-Stack SaaS Platforms). You can use our Interactive Cost Calculator above to get an instant customized quote with zero hidden fees!",
  security:
    "Our team includes certified ethical hacking and cyber security specialists (Saif Khan & Koushik Kumar) who perform comprehensive OWASP Top 10 penetration testing, API auditing, threat modeling, and infrastructure hardening on all our projects.",
  team: "Nexora is founded and led by specialized engineers from the Computer Science & Technology (CST) department of Mymensingh Polytechnic Institute — including full-stack developers (MD Mahfuzul Haque), UI/UX designers (Jahidul Islam), and cyber security experts (Saif Khan & Koushik Kumar).",
  ai: "Our AI Website Builder uses Claude Sonnet 4.6 to turn simple business briefs into clean, production-ready Next.js React components, responsive layouts, and tailored copy in under 60 seconds!",
};

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");

    setIsTyping(true);

    setTimeout(() => {
      let reply =
        "Thanks for asking! We specialize in high-performance Next.js full-stack development, Figma UI/UX, and OWASP-grade cyber security. You can schedule a free 30-minute discovery call with our CST team to get started!";

      const lower = text.toLowerCase();
      if (lower.includes("cost") || lower.includes("price") || lower.includes("saas") || lower.includes("pricing")) {
        reply = knowledgeBase.cost;
      } else if (lower.includes("security") || lower.includes("pen") || lower.includes("hack") || lower.includes("audit")) {
        reply = knowledgeBase.security;
      } else if (lower.includes("team") || lower.includes("mahfuzul") || lower.includes("cst") || lower.includes("who")) {
        reply = knowledgeBase.team;
      } else if (lower.includes("ai") || lower.includes("builder") || lower.includes("generator") || lower.includes("claude")) {
        reply = knowledgeBase.ai;
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "ai", text: reply },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 rounded-3xl bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 shadow-[0_24px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden ring-1 ring-white/10"
            style={{ maxHeight: "520px", height: "480px" }}
          >
            {/* Header */}
            <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-400 font-bold text-sm shadow-[0_0_12px_rgba(20,184,160,0.3)]">
                  🤖
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
                    Nexora Assistant
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-muted-fg">Powered by CST Engineers & AI</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="h-7 w-7 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center text-sm transition-colors"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary-500 text-white rounded-br-none shadow-md font-medium"
                        : "bg-surface border border-border text-neutral-300 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface border border-border p-2.5 rounded-2xl rounded-bl-none text-muted-fg flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce delay-150" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce delay-300" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-neutral-900/50 border-t border-border/50 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] text-muted-fg hover:text-foreground hover:border-primary-500/40 whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-surface border-t border-border flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about pricing, tech stack, security..."
                className="flex-1 h-9 px-3 rounded-xl bg-neutral-900 border border-border text-xs text-foreground placeholder:text-muted-fg focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="h-9 w-9 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors shadow-sm flex-shrink-0 font-bold"
              >
                ↑
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs sm:text-sm font-semibold shadow-[0_0_24px_rgba(20,184,160,0.5)] border border-white/20 transition-all duration-300 hover:scale-105"
      >
        <span className="text-base">🤖</span>
        <span>{isOpen ? "Close Assistant" : "Ask Nexora AI"}</span>
        {!isOpen && <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />}
      </button>
    </div>
  );
}
