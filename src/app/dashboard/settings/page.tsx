"use client";

import { LogOut, ChevronRight, Shield, Bell, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Settings</h1>
      </header>

      {/* Account Profile Card */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-xl font-bold text-zinc-400">
          OP
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Operative</h2>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mt-1 border border-purple-500/20">
            Free Tier
          </div>
        </div>
      </div>

      {/* Settings Menu List */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
        {[
          { label: "Account Settings", icon: <Shield className="w-5 h-5 text-zinc-400" /> },
          { label: "Notifications", icon: <Bell className="w-5 h-5 text-zinc-400" /> },
          { label: "Help & Support", icon: <HelpCircle className="w-5 h-5 text-zinc-400" /> }
        ].map((item, idx) => (
          <button key={idx} className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left last:border-b-0">
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm font-medium text-white">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600" />
          </button>
        ))}
      </div>

      <div className="pt-4">
        <Link href="/" className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-red-500 font-bold bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20">
          <LogOut className="w-5 h-5" /> Sign Out
        </Link>
      </div>

    </div>
  );
}
