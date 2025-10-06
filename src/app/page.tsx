"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  Sparkles,
  Zap,
  BarChart3,
  TrendingUp,
  Target,
  BookOpen,
  Star,
  PieChart,
  Send,
  Loader2,
  Square as StopIcon,
  SkipForward,
} from "lucide-react";
import NavBar from "@/components/layout/NavBar";


type Role = "ai" | "user" | "system";
type Message = {
  role: Role;
  text: string;
  timestamp: number;
  quizOptions?: string[];
  correctAnswer?: string;
  explanation?: string;
};
type Quiz = {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 text-white/70">
      <span className="animate-bounce">•</span>
      <span className="animate-bounce [animation-delay:120ms]">•</span>
      <span className="animate-bounce [animation-delay:240ms]">•</span>
    </div>
  );
}

export default function Home() {
  // chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  // quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizRunning, setQuizRunning] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const busy = loadingChat || loadingQuiz;

  // welcome seed
  useEffect(() => {
    if (messages.length) return;
    setMessages([
      {
        role: "ai",
        text:
          "Welcome to Surge AI Assistant. Ask for a market overview, top movers, risks, or tap Take Quiz to practice. You can stop the quiz anytime.",
        timestamp: Date.now(),
      },
    ]);
  }, [messages.length]);

  // auto-scroll on new content
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingChat, loadingQuiz]);

  // ---- actions ----
  async function handleSend(custom?: string) {
    const text = (custom ?? input).trim();
    if (!text || busy) return;
    setMessages((m) => [...m, { role: "user", text, timestamp: Date.now() }]);
    setInput("");
    setLoadingChat(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "system", text: data?.error || "Error.", timestamp: Date.now() },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "ai", text: data.answer || "…", timestamp: Date.now() },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "system", text: "Failed to contact AI.", timestamp: Date.now() },
      ]);
    } finally {
      setLoadingChat(false);
    }
  }

  async function fetchQuizQuestion() {
    setLoadingQuiz(true);
    try {
      const res = await fetch("/api/ai-quiz", { method: "POST" });
      const quiz = await res.json();
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "system", text: quiz?.error || "Failed to load quiz.", timestamp: Date.now() },
        ]);
        return;
      }
      setActiveQuiz(quiz);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: quiz.question,
          timestamp: Date.now(),
          quizOptions: quiz.options,
          correctAnswer: quiz.correct,
          explanation: quiz.explanation,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "system", text: "Failed to load quiz.", timestamp: Date.now() },
      ]);
    } finally {
      setLoadingQuiz(false);
    }
  }

  function startQuiz() {
    if (quizRunning || busy) return;
    setQuizRunning(true);
    setMessages((m) => [
      ...m,
      { role: "ai", text: "Quiz started. Tap Stop any time.", timestamp: Date.now() },
    ]);
    fetchQuizQuestion();
  }
  function stopQuiz() {
    setQuizRunning(false);
    setActiveQuiz(null);
    setMessages((m) => [
      ...m,
      { role: "ai", text: "Quiz stopped. Nice work!", timestamp: Date.now() },
    ]);
  }
  function nextQuizQuestion() {
    if (!quizRunning || busy) return;
    setActiveQuiz(null);
    fetchQuizQuestion();
  }
  function answerQuiz(option: string) {
    if (!activeQuiz) return;
    const correct = option === activeQuiz.correct;
    setMessages((m) => [
      ...m,
      { role: "user", text: option, timestamp: Date.now() },
      {
        role: "ai",
        text: correct
          ? `Correct! ${activeQuiz.explanation}`
          : `Incorrect. Correct: "${activeQuiz.correct}". ${activeQuiz.explanation}`,
        timestamp: Date.now(),
      },
    ]);
    setActiveQuiz(null);
    if (quizRunning) setTimeout(() => nextQuizQuestion(), 500);
  }

  const quick = [
    { label: "Market Overview", icon: <BarChart3 className="w-4 h-4" />, run: () => handleSend("Give me the current cryptocurrency market overview") },
    { label: "Trading Tips", icon: <Target className="w-4 h-4" />, run: () => handleSend("What are good trading strategies for today’s market?") },
    { label: "Top Gainers", icon: <TrendingUp className="w-4 h-4" />, run: () => handleSend("Which cryptocurrencies are performing best today?") },
    { label: quizRunning ? "Stop Quiz" : "Take Quiz", icon: quizRunning ? <StopIcon className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />, run: () => (quizRunning ? stopQuiz() : startQuiz()) },
    { label: "Bitcoin Analysis", icon: <Star className="w-4 h-4" />, run: () => handleSend("Analyze Bitcoin’s current price and trend") },
    { label: "Market Risks", icon: <PieChart className="w-4 h-4" />, run: () => handleSend("What are the current risks in the crypto market?") },
  ];

  return (
    <div className="flex min-h-[100svh] flex-col bg-[#0B1018] text-white">
      {/* NAVBAR */}
      <NavBar />

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto w-full flex-1 px-5 pt-20 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR (non-scrolling, short list scroll) */}
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
            <div className="flex items-center gap-2 text-white/80 font-medium mb-4">
              <Zap className="w-5 h-5 text-cyan-400" />
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quick.map((q) => (
                <button
                  key={q.label}
                  onClick={q.run}
                  className="text-left rounded-xl border border-white/10 bg-[#0D141E] hover:bg-white/10 transition-colors px-3 py-3 flex items-center gap-2 text-[13px]"
                >
                  {q.icon}
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
            {quizRunning && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={stopQuiz}
                  className="rounded-lg border border-white/10 bg-red-500/15 hover:bg-red-500/25 text-red-200 px-3 py-2 text-xs transition"
                >
                  Stop Quiz
                </button>
                <button
                  onClick={nextQuizQuestion}
                  disabled={busy}
                  className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/85 px-3 py-2 text-xs transition inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <SkipForward className="w-4 h-4" />
                  Next
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* CHAT COLUMN (THIS IS THE ONLY SCROLL CONTAINER) */}
        <section className="lg:col-span-8 flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          {/* MESSAGES AREA (scrolls) */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-6">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isSystem = m.role === "system";
              return (
                <div key={i} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 grid place-items-center shrink-0">
                      <Bot className="text-black w-5 h-5" />
                    </div>
                  )}
                  <div className={`max-w-[78%] ${isUser ? "order-2" : ""}`}>
                    <div
                      className={[
                        "px-4 py-3 rounded-2xl text-[14px] leading-relaxed",
                        isUser && "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-medium",
                        isSystem && "bg-red-500/10 border border-red-500/40 text-red-200",
                        !isUser && !isSystem && "bg-[#0D141E] border border-white/10 text-white/90",
                      ].join(" ")}
                    >
                      {m.text}

                      {m.quizOptions && activeQuiz && (
                        <div className="mt-3 grid gap-2">
                          {m.quizOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => answerQuiz(opt)}
                              disabled={busy}
                              className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 transition disabled:opacity-50"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-white/45 px-1">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {isUser && (
                    <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 grid place-items-center shrink-0">
                      <User className="text-white/90 w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {(loadingChat || loadingQuiz) && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 grid place-items-center">
                  <Bot className="text-black w-5 h-5" />
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0D141E] px-4 py-2">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* COMPOSER (fixed height, not scrolling) */}
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={busy}
                placeholder={quizRunning ? "Answer the question above…" : "Ask anything about the market…"}
                className="w-full rounded-xl bg-[#0D141E] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 px-4 h-12 placeholder:text-white/40 text-white disabled:opacity-60"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || busy}
                className="h-12 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-semibold disabled:opacity-50 grid place-items-center"
              >
                {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
