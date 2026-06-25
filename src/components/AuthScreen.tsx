import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  User, 
  Chrome, 
  Fingerprint, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Building,
  Target
} from "lucide-react";

interface AuthScreenProps {
  onLoginSuccess: (email: string) => void;
  darkMode: boolean;
}

export default function AuthScreen({ onLoginSuccess, darkMode }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("sukeshananya@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Ananya Sukesh");
  const [role, setRole] = useState("Full Stack Engineer");
  
  // Simulated views
  const [view, setView] = useState<"form" | "forgot" | "biometric">("form");
  const [biometricStatus, setBiometricStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email || "sukeshananya@gmail.com");
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess("sukeshananya@gmail.com");
    }, 1000);
  };

  const handleBiometricTrigger = () => {
    setView("biometric");
    setBiometricStatus("scanning");
    setTimeout(() => {
      setBiometricStatus("success");
      setTimeout(() => {
        onLoginSuccess("sukeshananya@gmail.com");
      }, 1000);
    }, 2000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setView("form");
    }, 3000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-2 sm:p-6 font-display">
      {/* Outer Card with Glassmorphism and Rounded Corners (24dp = rounded-3xl) */}
      <div className="w-full max-w-5xl rounded-[32px] overflow-hidden border border-white/10 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.15)] grid grid-cols-1 md:grid-cols-12 min-h-[600px] relative">
        
        {/* Left column: Beautiful Minimal flat illustrations with blue/emerald gradient accents */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#10B981] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold tracking-wider text-sm text-white/90">CAREERPILOT AI</span>
          </div>

          {/* Minimalist Flat illustration container */}
          <div className="relative z-10 my-8 flex flex-col items-center justify-center">
            <svg className="w-48 h-48 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] animate-pulse" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: "6s" }}>
              {/* Ground line */}
              <path d="M20 170 H180" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" opacity="0.4" />
              {/* Portal/Laptop Frame */}
              <rect x="50" y="50" width="100" height="110" rx="16" fill="white" fillOpacity="0.08" stroke="white" strokeWidth="2" />
              <rect x="60" y="65" width="80" height="60" rx="8" fill="white" fillOpacity="0.12" />
              {/* Code lines */}
              <line x1="70" y1="80" x2="105" y2="80" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <line x1="70" y1="92" x2="125" y2="92" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              <line x1="70" y1="104" x2="90" y2="104" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              {/* Chart rising bar representing career path */}
              <path d="M120 150 L140 120 L160 130 L180 90" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="180" cy="90" r="5" fill="#F97316" />
              {/* Glowing particles */}
              <circle cx="45" cy="85" r="4" fill="white" opacity="0.6" />
              <circle cx="160" cy="60" r="6" fill="#10B981" />
              <circle cx="150" cy="165" r="5" fill="white" opacity="0.4" />
            </svg>

            {/* Simulated Floating Glass Badge */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="mt-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-semibold tracking-wide shadow-md flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Secure Sandboxed System</span>
            </motion.div>
          </div>

          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
              Build the portfolio tech leaders hire for.
            </h3>
            <p className="text-xs text-white/80 leading-relaxed max-w-xs">
              Instant ATS resume scoring, simulated mock interviews with direct speech grading, and fully interactive skill learning tracks.
            </p>
          </div>
        </div>

        {/* Right column: Interactive forms */}
        <div className="md:col-span-7 p-6 sm:p-12 flex flex-col justify-center bg-white/80 dark:bg-slate-950/85">
          <AnimatePresence mode="wait">
            {view === "form" && (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Switcher & Title */}
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5">
                    <span>{isSignUp ? "Create Launchpad Account" : "Welcome Back"}</span>
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {isSignUp 
                      ? "Get started with custom interview prompts, skills roadmap & resume scorecard."
                      : "Access your dashboard, active job applications, and career score."}
                  </p>
                </div>

                {/* Simulated Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <Chrome className="w-4 h-4 text-red-500 fill-current" />
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/60 dark:border-slate-800/60" />
                  </div>
                  <span className="relative px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-white dark:bg-[#020617] rounded">
                    or continue with email
                  </span>
                </div>

                {/* Email Sign In / Sign Up Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ananya Sukesh"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Target Role
                        </label>
                        <div className="relative">
                          <Target className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Full Stack Developer"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sukeshananya@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => setView("forgot")}
                          className="text-[10px] font-semibold text-blue-500 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Primary login button */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>{loading ? "Authenticating..." : isSignUp ? "Create Free Account" : "Access Launchpad"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Face ID / Fingerprint simulation */}
                    <button
                      type="button"
                      onClick={handleBiometricTrigger}
                      className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <Fingerprint className="w-5 h-5 text-[#10B981] animate-pulse" />
                      <span className="sm:hidden lg:inline">Fingerprint Login</span>
                    </button>
                  </div>
                </form>

                {/* Toggle tab */}
                <div className="text-center pt-4">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {isSignUp ? "Already have an account? " : "New to CareerPilot? "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-blue-500 font-bold hover:underline cursor-pointer"
                    >
                      {isSignUp ? "Sign In" : "Sign Up For Free"}
                    </button>
                  </p>
                </div>

                {/* Prepopulated demo fast access info */}
                <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-center text-[11px] text-slate-400">
                  ⚡ Pre-configured as graduate template: <strong className="text-blue-400">sukeshananya@gmail.com</strong>
                </div>
              </motion.div>
            )}

            {view === "forgot" && (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <button
                    onClick={() => setView("form")}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white font-semibold transition-colors cursor-pointer mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>
                  <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                    Reset Password
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Enter your email address and we'll simulate sending a secure passcode to reset your credentials.
                  </p>
                </div>

                {forgotSent ? (
                  <div className="p-6 text-center bg-[#10B981]/5 border border-[#10B981]/20 rounded-3xl space-y-3">
                    <div className="w-12 h-12 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">Simulated Email Dispatched</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      We sent a reset pipeline link to <strong>{forgotEmail || "your email"}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Your Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="sukeshananya@gmail.com"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Simulate Dispatch Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {view === "biometric" && (
              <motion.div
                key="biometric-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-8 text-center space-y-6"
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer breathing circle */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute w-28 h-28 bg-emerald-500/10 rounded-full blur-sm"
                  />
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center bg-emerald-500/5 animate-spin" style={{ animationDuration: "12s" }} />
                  <Fingerprint className="absolute w-12 h-12 text-[#10B981] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    {biometricStatus === "scanning" ? "Scanning Fingerprint..." : "Authentication Confirmed"}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                    {biometricStatus === "scanning" 
                      ? "Simulating Android Face ID / Biometrics verification with cryptographical handshake..."
                      : "Handshake verified! Booting secure personal portal."}
                  </p>
                </div>

                {biometricStatus === "scanning" && (
                  <button
                    onClick={() => setView("form")}
                    className="px-4 py-1.5 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    Cancel Scan
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
