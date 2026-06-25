import { useState } from "react";
import { motion } from "motion/react";
import { 
  Sun, 
  Moon, 
  Settings, 
  Languages, 
  Bell, 
  Lock, 
  ShieldAlert, 
  HelpCircle, 
  Info, 
  Check, 
  Fingerprint, 
  Sparkles 
} from "lucide-react";

interface SettingsPanelProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function SettingsPanel({ darkMode, setDarkMode }: SettingsPanelProps) {
  const [language, setLanguage] = useState("English (US)");
  const [notifJobs, setNotifJobs] = useState(true);
  const [notifInterviews, setNotifInterviews] = useState(true);
  const [notifFeed, setNotifFeed] = useState(false);
  const [securityBiometrics, setSecurityBiometrics] = useState(true);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const triggerSave = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const faqs = [
    { q: "How is my ATS Resume score calculated?", a: "The CareerPilot AI scans your profile for structural fields (summary, experience bullets, tools used) and aggregates keyword matches against thousands of successful technical placements." },
    { q: "Is my personal data secure?", a: "Yes, all mock interview audios and credentials run in a secure, local sandboxed environment without leaking API keys to client browsers." }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-display text-xs sm:text-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
            <Settings className="w-6 h-6 text-[#2563EB]" />
            <span>Flight Settings & Preferences</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure theme aesthetics, default languages, active system notifications, and security protocols.
          </p>
        </div>
      </div>

      {/* Save Success Toast */}
      {showSaveToast && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 flex items-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Preference updates saved successfully!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Preference controls */}
        <div className="space-y-6">
          
          {/* Aesthetic Theme Selection */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Sun className="w-4.5 h-4.5 text-amber-500" />
              <span>Theme Interface</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setDarkMode(false); triggerSave(); }}
                className={`p-3 rounded-2xl border text-center font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  !darkMode 
                    ? "border-[#2563EB] bg-blue-500/5 text-[#2563EB]" 
                    : "border-slate-800 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </button>

              <button
                onClick={() => { setDarkMode(true); triggerSave(); }}
                className={`p-3 rounded-2xl border text-center font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  darkMode 
                    ? "border-[#2563EB] bg-blue-500/5 text-white" 
                    : "border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Language and Localization */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Languages className="w-4.5 h-4.5 text-[#2563EB]" />
              <span>Language Selection</span>
            </h3>

            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); triggerSave(); }}
              className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border bg-transparent outline-none focus:border-[#2563EB] ${
                darkMode ? "bg-slate-900 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish (ES)">Spanish (ES)</option>
              <option value="German (DE)">German (DE)</option>
              <option value="Hindi (HI)">Hindi (HI)</option>
              <option value="Japanese (JA)">Japanese (JA)</option>
            </select>
          </div>

          {/* Notifications */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-[#10B981]" />
              <span>System Notifications</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold block text-slate-800 dark:text-white">Active Jobs & Matching alerts</span>
                  <p className="text-[10px] text-slate-400">Ping when Vercel or Stripe posts matching roles.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifJobs} 
                  onChange={(e) => { setNotifJobs(e.target.checked); triggerSave(); }}
                  className="w-4 h-4 accent-[#2563EB]" 
                />
              </div>

              <div className="flex justify-between items-center border-t border-slate-200/30 dark:border-slate-800/30 pt-3">
                <div>
                  <span className="font-semibold block text-slate-800 dark:text-white">Interview Schedule reminders</span>
                  <p className="text-[10px] text-slate-400">Reminders 24 hours prior to mock sessions.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifInterviews} 
                  onChange={(e) => { setNotifInterviews(e.target.checked); triggerSave(); }}
                  className="w-4 h-4 accent-[#2563EB]" 
                />
              </div>

              <div className="flex justify-between items-center border-t border-slate-200/30 dark:border-slate-800/30 pt-3">
                <div>
                  <span className="font-semibold block text-slate-800 dark:text-white">Feed & Follow updates</span>
                  <p className="text-[10px] text-slate-400">Alert when peers like or follow your posts.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifFeed} 
                  onChange={(e) => { setNotifFeed(e.target.checked); triggerSave(); }}
                  className="w-4 h-4 accent-[#2563EB]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security, Privacy, Help, About */}
        <div className="space-y-6">
          
          {/* Security details & Biometrics simulation toggle */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-orange-500" />
              <span>Security & Device Biometrics</span>
            </h3>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <Fingerprint className="w-8 h-8 text-[#10B981] animate-pulse" />
                <div>
                  <span className="font-semibold block text-slate-800 dark:text-white">Biometric Login / Fingerprint</span>
                  <p className="text-[10px] text-slate-400">Secure cryptographic handshake on Android.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={securityBiometrics} 
                onChange={(e) => { setSecurityBiometrics(e.target.checked); triggerSave(); }}
                className="w-4 h-4 accent-[#2563EB]" 
              />
            </div>
          </div>

          {/* Help Center FAQs */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-blue-500" />
              <span>Help Center & FAQ</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.q} className="space-y-1">
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">{f.q}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* About App */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Info className="w-4.5 h-4.5 text-slate-400" />
              <span>About CareerPilot AI</span>
            </h3>

            <div className="space-y-2 text-[11px] text-slate-400">
              <p>
                <strong>System Version:</strong> v1.0.4-Stable (Cloud Run Sandbox)
              </p>
              <p className="leading-relaxed">
                CareerPilot represents a state-of-the-art onboarding suite designed for NIT, IIT, and modern engineering graduates globally. Crafted in React, TypeScript, and Tailwind CSS.
              </p>
              <div className="flex gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-bold">MATERIAL 3</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold">REACT 19</span>
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded text-[9px] font-bold">SECURE SANDBOX</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
