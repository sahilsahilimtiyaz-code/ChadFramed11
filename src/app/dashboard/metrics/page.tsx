"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Activity, Shield, Zap, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MetricsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cf_latest_scan");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse scan data");
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-zinc-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">No Active Scan Data</h2>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">Please return to the scanner to initiate a new biometric analysis.</p>
        </div>
        <Link href="/dashboard" className="px-6 py-3 bg-white text-black font-bold rounded-full text-sm">
          Go to Scanner
        </Link>
      </div>
    );
  }

  // Tier Colors
  const tierColors: Record<string, string> = {
    'Chad': 'from-purple-500 to-blue-500',
    'HTN': 'from-emerald-400 to-teal-500',
    'MTN': 'from-amber-400 to-orange-500',
    'LTN': 'from-red-500 to-rose-600'
  };
  
  const currentTierColor = tierColors[data.tier] || tierColors['MTN'];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Analysis Results</h1>
        <p className="text-zinc-400 font-medium text-sm">Your raw geometric data, processed and categorized.</p>
      </header>

      {/* Main Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6 relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentTierColor} blur-[100px] opacity-20 pointer-events-none rounded-full`} />
        
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Classification Tier</div>
          
          <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${currentTierColor}`}>
            {data.tier}
          </div>
          
          <div className="w-full h-px bg-white/5 my-4" />
          
          <div className="flex items-center justify-between w-full px-4">
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-500 mb-1">OVERALL SCORE</div>
              <div className="text-3xl font-bold text-white">{data.score} <span className="text-sm text-zinc-600">/10</span></div>
            </div>
            <Link href="/dashboard/coach" className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors border border-white/5 flex items-center gap-2">
              <span className="text-xs font-bold text-white">Ask AI Coach</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Harmony", value: data.metrics.harmony, icon: <Target className="w-5 h-5 text-purple-400" /> },
          { label: "Angularity", value: data.metrics.angularity, icon: <Activity className="w-5 h-5 text-blue-400" /> },
          { label: "Dimorphism", value: data.metrics.dimorphism, icon: <Shield className="w-5 h-5 text-amber-400" /> },
          { label: "Skin Health", value: data.metrics.skin, icon: <Zap className="w-5 h-5 text-emerald-400" /> }
        ].map((metric, idx) => (
          <motion.div 
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              {metric.icon}
              <span className="text-xs font-bold text-zinc-400">{metric.label}</span>
            </div>
            
            <div className="mt-auto">
              <div className="text-2xl font-bold text-white mb-2">{metric.value} <span className="text-xs text-zinc-600">/10</span></div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / 10) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 + (0.1*idx) }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Raw Ratios */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6"
      >
        <h3 className="text-sm font-bold text-white mb-4">Raw Ratios</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-sm text-zinc-400">fWHR</span>
            <span className="font-mono text-sm font-bold text-white">{data.raw_ratios.fwhr}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-sm text-zinc-400">Jaw to Face Ratio</span>
            <span className="font-mono text-sm font-bold text-white">{data.raw_ratios.jaw_to_face}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Eye Spacing Ratio</span>
            <span className="font-mono text-sm font-bold text-white">{data.raw_ratios.eye_spacing}</span>
          </div>
        </div>
      </motion.div>
      
    </div>
  );
}
