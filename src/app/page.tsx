"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Target, Shield, CheckCircle, Zap, Brain, Camera, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303] text-zinc-100 overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)]">
              <span className="text-white font-black text-xl tracking-tighter">CF</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">ChadFramed</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-purple-400 transition-colors">Features</Link>
            <Link href="#technology" className="hover:text-purple-400 transition-colors">Technology</Link>
          </div>
          <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Open App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 min-h-screen flex flex-col justify-center">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest uppercase mb-6">
              <Zap className="w-3.5 h-3.5" /> AI-Powered Facial Analysis
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.05]">
              Elevate Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600">Appearance.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed font-medium">
              Ascend to your highest aesthetic potential. Upload your profile for a brutally honest, measurable breakdown of your facial structure, symmetry, and proportions using advanced AI metrics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                <Camera className="w-5 h-5" /> Analyze My Face
              </Link>
              <div className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                <Shield className="w-4 h-4" /> 100% Private & Secure
              </div>
            </div>
            
            {/* Rating summary */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-[#030303] flex items-center justify-center text-xs font-bold text-zinc-500">
                    User
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <span className="font-bold text-white">4.9/5</span> <span className="text-zinc-500">from 50,000+ men</span>
              </div>
            </div>
          </motion.div>

          {/* Right Mobile App Mockup Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block perspective-1000"
          >
            <div className="relative w-[340px] h-[700px] mx-auto bg-black rounded-[3rem] border-[8px] border-zinc-900 shadow-[0_0_50px_rgba(147,51,234,0.3)] overflow-hidden flex flex-col">
              {/* Fake App Header */}
              <div className="h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-6 pt-4">
                <span className="font-black text-lg text-white">ChadFramed</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-80 blur-sm" />
              </div>
              {/* Fake App Body */}
              <div className="flex-1 p-5 bg-[#050505] space-y-4">
                <div className="h-48 rounded-2xl bg-zinc-900 border border-white/5 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
                  <Target className="w-12 h-12 text-purple-500 opacity-50" />
                  <div className="absolute bottom-4 left-4">
                    <div className="text-xs text-purple-400 font-bold mb-1">OVERALL RATING</div>
                    <div className="text-3xl font-black text-white">8.4 <span className="text-sm text-zinc-500">/ 10</span></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-2xl bg-zinc-900 border border-white/5 p-4">
                    <Activity className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="text-xs text-zinc-400">Harmony</div>
                    <div className="text-lg font-bold text-white">92%</div>
                  </div>
                  <div className="h-24 rounded-2xl bg-zinc-900 border border-white/5 p-4">
                    <Shield className="w-5 h-5 text-amber-400 mb-2" />
                    <div className="text-xs text-zinc-400">Dimorphism</div>
                    <div className="text-lg font-bold text-white">88%</div>
                  </div>
                </div>

                <div className="h-32 rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/20 p-4">
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" /> AI Coach Advice
                  </div>
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    "Your bizygomatic width is optimal. To increase lower third angularity, focus on reducing subcutaneous water retention..."
                  </div>
                </div>
              </div>
              {/* Fake App Bottom Nav */}
              <div className="h-20 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-around px-2 pb-2">
                 <div className="p-2 text-purple-500"><Camera className="w-6 h-6" /></div>
                 <div className="p-2 text-zinc-600"><BarChart3 className="w-6 h-6" /></div>
                 <div className="p-2 text-zinc-600"><MessageSquare className="w-6 h-6" /></div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-32 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl"
            >
              <div className="text-xs text-zinc-400 font-bold mb-1">CANTHAL TILT</div>
              <div className="text-xl font-black text-blue-400">Positive +3°</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-12 bottom-40 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl"
            >
              <div className="text-xs text-zinc-400 font-bold mb-1">FWHR RATIO</div>
              <div className="text-xl font-black text-purple-400">1.38 (Optimal)</div>
            </motion.div>

          </motion.div>
        </div>
      </section>


      {/* Key Features List */}
      <section id="features" className="py-32 px-6 relative bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Deep Facial Metrics <span className="text-purple-500">Analysis.</span></h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-medium">Stop guessing. Get detailed, mathematically accurate breakdowns of the features that dictate attractiveness.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
                title: "Facial Rating",
                desc: "Receive an AI-generated assessment based purely on measurable facial structure and geometric proportions."
              },
              {
                icon: <Target className="w-8 h-8 text-purple-400" />,
                title: "Metrics Breakdown",
                desc: "Detailed analysis of crucial features including symmetry, fWHR, eye spacing, and gonial angles."
              },
              {
                icon: <Brain className="w-8 h-8 text-pink-400" />,
                title: "AI Coach",
                desc: "Ask specific questions and receive brutally honest, data-driven guidance on actionable improvement strategies."
              },
              {
                icon: <Activity className="w-8 h-8 text-amber-400" />,
                title: "Harmony Tracking",
                desc: "Monitor your overall aesthetic balance and identify exactly which features disrupt your facial harmony."
              },
              {
                icon: <Shield className="w-8 h-8 text-emerald-400" />,
                title: "Dimorphism Index",
                desc: "Measure the robust, masculine traits of your bone structure against global aesthetic standards."
              },
              {
                icon: <Zap className="w-8 h-8 text-indigo-400" />,
                title: "Skin Vitality",
                desc: "Algorithmic analysis of skin clarity and health markers that subconsciously trigger attraction."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-purple-600/10 to-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
            Stop coping. <br/> Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">improving.</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 font-medium">
            Join the ranks of men who are using raw data to maximize their aesthetic potential.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Open The App <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#030303]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">CF</span>
            </div>
            <span className="font-bold text-lg tracking-tight">ChadFramed</span>
          </div>
          <div className="text-zinc-600 text-sm font-medium">
            © 2026 ChadFramed Tech. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
