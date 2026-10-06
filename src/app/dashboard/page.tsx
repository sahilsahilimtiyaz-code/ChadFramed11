"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, AlertCircle, ScanLine, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const startScan = async () => {
    if (!file) return;
    
    setIsScanning(true);
    setError(null);
    
    // Simulate complex scan loading sequence
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Analysis failed");
      }
      
      // Store result in localStorage for the metrics page
      localStorage.setItem("cf_latest_scan", JSON.stringify(data.data));
      
      // Navigate to metrics
      router.push("/dashboard/metrics");
      
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI Engine. Is the backend running?");
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">AI Scanner</h1>
        <p className="text-zinc-400 font-medium text-sm">Upload a clear, front-facing photo with neutral lighting for the most accurate biometric analysis.</p>
      </header>

      {/* Main Scanner Area */}
      <div className="relative rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl aspect-[3/4] max-w-md mx-auto flex flex-col items-center justify-center p-6">
        
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-start gap-2 z-20 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*" 
          className="hidden" 
        />

        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center w-full h-full space-y-6"
            >
               <div className="w-32 h-32 rounded-full border border-dashed border-zinc-700 flex items-center justify-center bg-zinc-900/50">
                  <Camera className="w-10 h-10 text-zinc-500" />
               </div>
               <div className="text-center space-y-2">
                 <div className="text-white font-bold text-lg">Position your face</div>
                 <div className="text-zinc-500 text-sm max-w-[200px]">Keep your head straight and maintain a neutral expression.</div>
               </div>
               
               <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
               >
                 <Upload className="w-5 h-5" /> Select Photo
               </button>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 w-full h-full"
            >
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
               
               {/* Scanning Overlay Effect */}
               {isScanning && (
                 <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
                    {/* Fake loader logo style */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500 mb-6 shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                    />
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-white font-bold tracking-widest text-sm flex items-center gap-2"
                    >
                      <ScanLine className="w-4 h-4 animate-pulse" /> INITIALIZING NEURAL MESH...
                    </motion.div>
                    
                    {/* Scanning Laser Line */}
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(147,51,234,1)] z-20"
                    />
                 </div>
               )}

               {/* Scan Button (only visible if not scanning) */}
               {!isScanning && (
                 <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20 px-6 gap-3">
                    <button 
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="w-14 h-14 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={startScan}
                      className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2"
                    >
                      <ScanLine className="w-5 h-5" /> Run Analysis
                    </button>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
