"use client";

import { Home, BarChart3, MessageSquare, Settings, Camera } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { icon: <Camera className="w-6 h-6" />, label: "Scanner", href: "/dashboard" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Metrics", href: "/dashboard/metrics" },
    { icon: <MessageSquare className="w-6 h-6" />, label: "AI Coach", href: "/dashboard/coach" },
    { icon: <Settings className="w-6 h-6" />, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col md:flex-row selection:bg-purple-500/30">
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#050505] sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.4)]">
            <span className="text-white font-black text-xs">CF</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">ChadFramed</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  isActive 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* User profile snippet */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-2">
             <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
               OP
             </div>
             <div>
               <div className="text-sm font-bold text-white">Operative</div>
               <div className="text-xs text-purple-400 font-medium">Free Tier</div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 relative overflow-y-auto min-h-screen">
        {/* Top bar for mobile only */}
        <div className="md:hidden sticky top-0 z-50 h-16 border-b border-white/5 bg-[#030303]/80 backdrop-blur-md flex items-center justify-center px-4">
           <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-black text-[10px]">CF</span>
             </div>
             ChadFramed
           </span>
        </div>
        
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full h-20 bg-[#0a0a0a] border-t border-white/5 z-50 px-2 pb-safe pt-2 flex items-center justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-all",
                isActive ? "text-purple-400" : "text-zinc-600"
              )}
            >
              <div className={clsx(
                "p-1.5 rounded-xl transition-all",
                isActive ? "bg-purple-500/10" : ""
              )}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
