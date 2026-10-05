"use client";

import { motion } from "framer-motion";
import { ArrowLeft, User, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex selection:bg-amber-500/30">
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
              <p className="text-zinc-400 mt-1">Based on your latest scan from today.</p>
            </div>
            <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-colors text-sm">
              New Scan
            </button>
          </header>

          {/* Top Level Score */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="md:col-span-1 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center items-center text-center"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px]" />
              <div className="text-sm font-semibold text-zinc-500 tracking-widest uppercase mb-4">Overall Score</div>
              <div className="text-6xl font-bold text-white mb-2 tracking-tighter">7.4<span className="text-3xl text-zinc-600">/10</span></div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                <TrendingUp className="w-4 h-4" /> +0.3 since last scan
              </div>
            </motion.div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: "Harmony", score: "8.1", desc: "Excellent symmetry." },
                { label: "Angularity", score: "6.8", desc: "Focus area." },
                { label: "Dimorphism", score: "7.5", desc: "Strong masculine traits." },
                { label: "Skin Health", score: "9.2", desc: "Optimal condition." },
              ].map((pillar, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 hover:bg-zinc-900 transition-colors"
                >
                  <div className="text-xs font-semibold text-zinc-500 uppercase mb-2">{pillar.label}</div>
                  <div className="text-2xl font-bold text-white mb-1">{pillar.score}</div>
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
                  icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
                  title: "Reduce Buccal Fat / Water Retention",
                  desc: "Your angularity score (6.8) is primarily affected by facial puffiness. Implement sodium reduction and consider targeted lymphatic drainage.",
                  status: "Active"
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                  title: "Maintain Skincare Routine",
                  desc: "Your skin health (9.2) is peak. Continue current tretinoin/sunscreen regimen. No changes required.",
                  status: "Optimized"
                },
                {
                  icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
                  title: "Masseter Hypertrophy Protocol",
                  desc: "Lower third width is slightly below optimal golden ratio. Incorporate mastication exercises to add 2-3mm of width to the gonial angles.",
                  status: "Active"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="bg-black border border-white/10 p-6 rounded-2xl flex items-start gap-4 hover:border-white/20 transition-colors"
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
