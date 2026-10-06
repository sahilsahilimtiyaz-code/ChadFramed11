"use client";

import { motion } from "framer-motion";
import { ArrowLeft, User, TrendingUp, AlertCircle, CheckCircle2, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

// For local testing, ensure backend is running.
const API_URL = "http://localhost:8000";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        setScanData(json.data);
      } else {
        alert("Failed to analyze image. Make sure the backend is running and you uploaded a face.");
      }
    } catch (err) {
      alert("Network error connecting to AI engine.");
    } finally {
      setLoading(false);
    }
  };

  const currentScore = scanData ? scanData.score : 0.0;
  const currentTier = scanData ? scanData.tier : "AWAITING UPLOAD";
  const pHarmony = scanData ? scanData.metrics.harmony : 0.0;
  const pAngularity = scanData ? scanData.metrics.angularity : 0.0;
  const pDimorphism = scanData ? scanData.metrics.dimorphism : 0.0;
  const pSkin = scanData ? scanData.metrics.skin : 0.0;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight">ChadFramed</span>
        </Link>
        
        <nav className="flex-1 space-y-2">
          {["Overview", "Facial Analysis", "Improvement Plan", "Simulations", "Settings"].map((item, i) => (
            <button key={i} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${i === 0 ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/5">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <div className="text-sm font-medium">Guest User</div>
            <div className="text-xs text-zinc-500">Free Tier</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          
          <header className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2 md:hidden">
                <Link href="/" className="hover:text-white"><ArrowLeft className="w-4 h-4" /></Link>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Your Analysis Overview</h1>
              <p className="text-zinc-400 mt-1">{scanData ? `Tier Classification: ${currentTier}` : "Upload a photo to generate biometrics."}</p>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold rounded-md transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {loading ? "Analyzing Mesh..." : "Initialize Scan"}
            </button>
          </header>

          {/* Top Level Score */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="md:col-span-1 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-md p-8 relative overflow-hidden flex flex-col justify-center items-center text-center"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px]" />
              <div className="text-sm font-bold text-zinc-500 tracking-widest uppercase mb-4">Overall Score</div>
              <div className="text-6xl font-black text-white mb-2 tracking-tighter">{currentScore}<span className="text-3xl text-zinc-600">/10</span></div>
              <div className="flex items-center gap-1 text-cyan-400 text-sm font-bold tracking-wider">
                TIER: {currentTier}
              </div>
            </motion.div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: "Harmony", score: pHarmony, desc: "Golden ratio alignment." },
                { label: "Angularity", score: pAngularity, desc: "Jawline width ratio." },
                { label: "Dimorphism", score: pDimorphism, desc: "Masculine traits index." },
                { label: "Skin Health", score: pSkin, desc: "Clarity & variance." },
              ].map((pillar, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/50 border border-white/5 rounded-md p-5 hover:bg-zinc-900 transition-colors"
                >
                  <div className="text-xs font-bold text-cyan-500 uppercase mb-2 tracking-wider">{pillar.label}</div>
                  <div className="text-2xl font-black text-white mb-1">{pillar.score}</div>
                  <div className="text-xs text-zinc-400">{pillar.desc}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Action Plan */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              Actionable Directives <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded">High Priority</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: <AlertCircle className="w-5 h-5 text-cyan-500" />,
                  title: "Reduce Subcutaneous Water",
                  desc: "Your angularity metrics indicate slight facial puffiness. Implement sodium reduction.",
                  status: "Active"
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5 text-purple-500" />,
                  title: "Maintain Skincare Routine",
                  desc: "Skin variance is optimal. Continue current regimen. No surgical changes required.",
                  status: "Optimized"
                },
                {
                  icon: <AlertCircle className="w-5 h-5 text-cyan-500" />,
                  title: "Masseter Protocol",
                  desc: "Lower third width requires slight lateral expansion to reach apex ratios.",
                  status: "Active"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="bg-black border border-white/10 p-6 rounded-md flex items-start gap-4 hover:border-cyan-500/20 transition-colors"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{item.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="ml-auto flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full border border-white/10 bg-white/5">
                    {item.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
