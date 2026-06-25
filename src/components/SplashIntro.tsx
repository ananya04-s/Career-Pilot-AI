import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Compass, Rocket, Briefcase, ChevronRight } from "lucide-react";

interface SplashIntroProps {
  onComplete: () => void;
}

export default function SplashIntro({ onComplete }: SplashIntroProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate floating particle coordinates
    const list = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3
    }));
    setParticles(list);

    // Auto complete splash after 4.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#070b19] flex flex-col items-center justify-center overflow-hidden font-display select-none">
      {/* Dynamic Animated Gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#2563EB]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10B981]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/30 dark:bg-emerald-400/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: ["0px", "-60px", "0px"],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Branding and Logo Container */}
      <div className="relative text-center max-w-lg px-6 flex flex-col items-center">
        {/* Animated Outer Ring */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-28 h-28 flex items-center justify-center rounded-[32px] bg-gradient-to-tr from-[#2563EB] via-indigo-600 to-[#10B981] p-[3px] shadow-[0_0_50px_rgba(37,99,235,0.3)] mb-8"
        >
          <div className="w-full h-full bg-[#0b0f19] rounded-[29px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2563EB]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            
            {/* Spinning Compass Core */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute text-emerald-400/20"
            >
              <Compass className="w-20 h-20" />
            </motion.div>

            {/* Glowing Logo Rocket */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="relative text-white flex items-center justify-center z-10"
            >
              <Rocket className="w-12 h-12 text-white fill-blue-500/10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Brand Name */}
        <motion.h1
          initial={{ letterSpacing: "0.2em", opacity: 0, y: 15 }}
          animate={{ letterSpacing: "0.05em", opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 leading-none tracking-wide"
        >
          CAREER<span className="text-[#10B981]">PILOT</span>
        </motion.h1>

        {/* Professional tag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-[10px] font-bold tracking-[0.3em] text-[#2563EB]/80 uppercase mt-2"
        >
          Next-Gen Career Launchpad
        </motion.p>

        {/* Motivational Quote */}
        <div className="mt-8 relative py-3 px-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-sm italic font-medium text-slate-300 tracking-wide"
          >
            "Build Your Future."
          </motion.p>
        </div>

        {/* Loading Indicator */}
        <div className="mt-14 w-48 bg-white/5 h-1.5 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full"
          />
        </div>

        {/* Fast Pass Action */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          onClick={onComplete}
          className="mt-6 flex items-center space-x-1 text-xs text-slate-400 hover:text-white font-semibold transition-all cursor-pointer"
        >
          <span>Skip to Launchpad</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
}
