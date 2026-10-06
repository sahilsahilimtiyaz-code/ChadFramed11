"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, Send, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "coach";
  content: string;
};

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "coach", content: "SYSTEM RESPONSE: I am the ChadFramed AI Coach. I have analyzed your biometric profile. Ask me for specific improvement directives regarding your facial harmony, angularity, or skin vitality." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cf_latest_scan");
    if (stored) {
      try {
        setScanData(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const payload = {
        message: userMsg,
        biometric_context: scanData ? {
          tier: scanData.tier,
          fwhr: scanData.raw_ratios.fwhr,
          score: scanData.score
        } : {}
      };

      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: "coach", content: data.reply || "Error: No response from matrix." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "coach", content: "CRITICAL ERROR: Unable to connect to AI Engine. Is the backend running?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]">
      <header className="mb-4 shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" /> AI Coach
        </h1>
        <p className="text-zinc-500 text-xs mt-1">Brutal clinical advice based on your scan.</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'coach' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-zinc-800 text-zinc-400 border border-white/10'}`}>
              {msg.role === 'coach' ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'coach' ? 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-sm' : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm'}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-xs text-zinc-500">Analyzing variables...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about jawline, eyes, or tier..."
          className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-full px-6 py-4 pr-14 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 bottom-2 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
