import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Code,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { ChatMessage, UserProfile } from "../types";

interface CareerCoachProps {
  user: UserProfile | null;
  darkMode: boolean;
}

const PRESET_PROMPTS = [
  {
    title: "Rewrite resume bullets using STAR",
    prompt: "I am a new graduate. Help me rewrite my resume bullets using the STAR method. Here is an unoptimized bullet: 'I updated some React code to speed up our team dashboard.'"
  },
  {
    title: "Suggest a premium Portfolio project",
    prompt: "Suggest an extremely impressive and unique full-stack portfolio project that I can build to stand out to recruiters as a Junior developer. Detail the exact frontend and backend stacks."
  },
  {
    title: "Behavioral interview prep tricks",
    prompt: "What are the best frameworks or psychological tricks to prepare for behavioral HR interviews as a student? Explain how to handle the 'Tell me about a time you failed' question."
  },
  {
    title: "Create a 6-month career roadmap",
    prompt: "Analyze my goals and target role. Create a strict, realistic 6-month step-by-step career roadmap detailing what certifications to earn, projects to ship, and how to start applying."
  }
];

// Bulletproof and pristine Custom text formatter to support custom markdown styling in standard chat logs
function formatMessageContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    // Trimmed line for checks
    const trimmed = line.trim();

    // Check for Headers (e.g. ### or ##)
    if (trimmed.startsWith("###")) {
      return (
        <h4 key={idx} className="font-display font-extrabold text-sm text-slate-800 dark:text-white mt-4 mb-2 uppercase tracking-wide flex items-center">
          <div className="w-1.5 h-3.5 bg-emerald-500 rounded mr-2" />
          {trimmed.replace("###", "").trim()}
        </h4>
      );
    }
    if (trimmed.startsWith("##") || trimmed.startsWith("#")) {
      const headerText = trimmed.replace(/^#+\s*/, "");
      return (
        <h3 key={idx} className="font-display font-extrabold text-base text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center">
          <div className="w-2.5 h-4 bg-indigo-500 rounded mr-2 animate-pulse" />
          {headerText}
        </h3>
      );
    }

    // Check for bullet lists
    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      const bulletText = trimmed.substring(1).trim();
      return (
        <div key={idx} className="flex items-start space-x-2 my-1 pl-4">
          <span className="text-emerald-500 mt-1 font-bold">•</span>
          <span className="text-xs leading-relaxed text-slate-650 dark:text-slate-300">
            {parseInlineMarkdown(bulletText)}
          </span>
        </div>
      );
    }

    // Check for code block content (e.g., inside ```)
    if (trimmed.startsWith("```")) {
      return null; // Skip markdown block identifiers
    }

    // Default Paragraph line
    if (!trimmed) return <div key={idx} className="h-2" />;
    return (
      <p key={idx} className="text-xs leading-relaxed text-slate-650 dark:text-slate-350 my-1.5">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
}

// Simple inline parser for **bold** text and code terms
function parseInlineMarkdown(text: string) {
  // Regex to match **bold** text
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-indigo-500 rounded font-mono text-[11px] font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function CareerCoach({
  user,
  darkMode,
}: CareerCoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "ai",
      text: `Hello! I am your **CareerPilot AI Coach**, powered by Google Gemini. 
      
      Whether you need to:
      - Rewrite unoptimized resume bullets using strict STAR metrics
      - Formulate a 6-month technical career roadmap
      - Brainstorm unique and high-tier portfolio projects
      - Prepare for scheduled behavioral or HR loops
      
      Ask me anything! Let's plot your coordinates.`,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    // Append User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });
      const data = await response.json();

      // Append Coach Response
      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "I encountered a slight turbulence in my server systems. Let's try re-routing that prompt or check your Gemini connectivity.",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)] items-stretch">
      
      {/* Left Chat Window (3/4 Grid space) */}
      <div className={`lg:col-span-3 flex flex-col rounded-3xl border overflow-hidden ${
        darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
      }`}>
        
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bot className="w-5 h-5 text-emerald-500 animate-pulse" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-white dark:border-slate-950" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-slate-800 dark:text-white block leading-none">
                AI Career Coach
              </span>
              <span className="text-[9px] font-mono font-medium text-emerald-500 uppercase tracking-widest block mt-0.5">
                GEMINI ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Message Streams Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isCoach = msg.sender === "ai";
            return (
              <div 
                key={msg.id}
                className={`flex items-start gap-3 ${isCoach ? "justify-start" : "justify-end"}`}
              >
                {isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20 text-emerald-500 flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
                  <div className={`p-4 rounded-2xl border shadow-sm ${
                    isCoach
                      ? (darkMode ? "bg-[#0f172a] border-white/5 text-slate-200" : "bg-slate-50 border-slate-150 text-slate-700")
                      : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-600/10"
                  }`}>
                    {/* Formatted Content */}
                    <div className="space-y-0.5">
                      {isCoach ? formatMessageContent(msg.text) : <p className="text-xs leading-relaxed font-medium">{msg.text}</p>}
                    </div>
                  </div>
                  <span className={`text-[9px] text-slate-400 mt-1 font-mono ${!isCoach && "self-end"}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {!isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                    {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Active Loader */}
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20 text-emerald-500 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className={`p-4 rounded-2xl border ${
                darkMode ? "bg-[#0f172a] border-white/5" : "bg-slate-50 border-slate-150"
              } flex items-center space-x-2`}>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_100ms]" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_200ms]" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-950/20"
        >
          <input
            type="text"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Coach a question..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>

      {/* Right Presets Panel (1/4 Grid space) */}
      <div className="space-y-4">
        
        {/* Preset Cards list */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
          darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
        }`}>
          <div>
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-slate-400 mb-3 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Suggested Coaching Loops</span>
            </h3>

            <div className="space-y-2">
              {PRESET_PROMPTS.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => handleSend(preset.prompt)}
                  disabled={loading}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold hover:border-emerald-500/20 transition-all cursor-pointer flex justify-between items-center group ${
                    darkMode ? "bg-[#0f172a] border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="line-clamp-2 pr-2 text-slate-700 dark:text-slate-250 group-hover:text-emerald-500 transition-colors">
                    {preset.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gemini info widget */}
        <div className="p-5 rounded-2xl border bg-slate-950 border-indigo-500/10 relative overflow-hidden group">
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
          <h4 className="font-display font-bold text-xs text-white mb-2 flex items-center">
            <Bot className="w-4 h-4 mr-1 text-indigo-400" />
            <span>Interactive Contextual Memory</span>
          </h4>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Your AI coach tracks details about your career goals, active certificates, and skills to provide customized recommendations for mock loop preparations.
          </p>
        </div>

      </div>

    </div>
  );
}
