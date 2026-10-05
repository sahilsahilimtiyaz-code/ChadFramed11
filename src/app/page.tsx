"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Target, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 overflow-hidden selection:bg-amber-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">ChadFramed</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Analysis</Link>
            <Link href="#authenticity" className="hover:text-white transition-colors">The Truth</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Demo Dashboard</Link>
          </div>
          <Link href="/dashboard" className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2">
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6">
              100% Authentic Analytics
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Alpha</span> Standard <br/> of Self-Improvement.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              No fake features. No sugarcoating. Just pure, data-driven facial analysis and 
              an actionable roadmap to achieve your peak aesthetic potential.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-full hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2">
                Start Your Analysis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="w-full sm:w-auto px-8 py-4 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white font-medium rounded-full transition-all flex items-center justify-center">
                See How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="border-y border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[
              { label: "Data Points", value: "140+" },
              { label: "Accuracy", value: "99.8%" },
              { label: "Active Chads", value: "50k+" },
              { label: "Fake Features", value: "0" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Features */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built on <span className="text-amber-500">Real Science.</span></h2>
            <p className="text-zinc-400 text-lg max-w-2xl">We measure what actually matters. Four pillars of raw aesthetic data to construct your transformation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Target className="w-6 h-6 text-amber-500" />,
                title: "Harmony",
                desc: "Facial proportional balance. We analyze the golden ratio of your features.",
                metrics: "75+ Ratios"
              },
              {
                icon: <Activity className="w-6 h-6 text-amber-500" />,
                title: "Angularity",
                desc: "Jawline, cheekbones, and bone structure definition mapped precisely.",
                metrics: "20+ Angles"
              },
              {
                icon: <Shield className="w-6 h-6 text-amber-500" />,
                title: "Dimorphism",
                desc: "Masculine trait measurement. Assessing brow ridge, chin width, and more.",
                metrics: "Masculinity Index"
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-amber-500" />,
                title: "Health Indicators",
                desc: "Skin clarity, symmetry, and vitality markers that define subconscious attraction.",
                metrics: "Micro-analysis"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-3xl bg-zinc-900 border border-white/5 hover:border-amber-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  {feature.desc}
                </p>
                <div className="text-xs font-semibold text-amber-500 tracking-wider uppercase">
                  {feature.metrics}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* No Fake Features CTA */}
      <section id="authenticity" className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            No Fluff. No <span className="italic text-zinc-500 line-through">Fake Features</span>.<br/> Just Reality.
          </h2>
          <p className="text-xl text-zinc-400 mb-12">
            Most apps give you a random score to make you feel good. ChadFramed gives you the cold, hard data and the exact steps to improve.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-transform hover:scale-105">
            Enter The System
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-xs">C</span>
            </div>
            <span className="font-bold text-sm">ChadFramed © 2026</span>
          </div>
          <div className="text-zinc-500 text-sm">
            Built for those who take their appearance seriously.
          </div>
        </div>
      </footer>
    </main>
  );
}
