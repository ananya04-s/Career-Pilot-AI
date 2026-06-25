import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Linkedin, 
  ShieldCheck, 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  X,
  User,
  Briefcase,
  Layers,
  GraduationCap
} from "lucide-react";
import { UserProfile } from "../types";

interface LinkedInSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSyncComplete: () => void;
  darkMode: boolean;
}

export default function LinkedInSyncModal({
  isOpen,
  onClose,
  userEmail,
  onSyncComplete,
  darkMode
}: LinkedInSyncModalProps) {
  const [step, setStep] = useState<"select" | "consent" | "syncing" | "success">("select");
  const [selectedProfile, setSelectedProfile] = useState<"ananya" | "alex" | "samantha" | "custom">("ananya");
  
  // Custom Profile Form state
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [customBio, setCustomBio] = useState("");
  const [customSkills, setCustomSkills] = useState("");

  // Syncing progress states
  const [syncProgress, setSyncProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setSyncProgress(0);
      setProgressStatus("");
    }
  }, [isOpen]);

  const handleNextToConsent = () => {
    if (selectedProfile === "custom" && (!customName || !customRole)) {
      alert("Please provide at least a name and target role for your custom profile.");
      return;
    }
    setStep("consent");
  };

  const handleStartSync = async () => {
    setStep("syncing");
    
    // Animate the progress bar steps
    const steps = [
      { prg: 10, msg: "Connecting to LinkedIn secure gateway..." },
      { prg: 25, msg: "Verifying OAuth client credentials & signature..." },
      { prg: 40, msg: "Exchanging authorization code for OAuth access token..." },
      { prg: 60, msg: "Fetching user profile details & work experience..." },
      { prg: 80, msg: "Extracting skills, certifications, and academic record..." },
      { prg: 95, msg: "Synchronizing details with CareerPilot ATS & Resume Analyzers..." },
      { prg: 100, msg: "Finalizing sync and unlocking exclusive badges!" }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i === 0 ? 800 : i === 3 ? 1200 : 700));
      setSyncProgress(steps[i].prg);
      setProgressStatus(steps[i].msg);
    }

    try {
      const skillsArray = customSkills 
        ? customSkills.split(",").map(s => s.trim()).filter(s => s.length > 0)
        : [];

      const response = await fetch("/api/linkedin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          profileType: selectedProfile,
          customData: selectedProfile === "custom" ? {
            name: customName,
            targetRole: customRole,
            bio: customBio,
            skills: skillsArray.length > 0 ? skillsArray : undefined,
            experienceLevel: "Mid-Level Professional"
          } : undefined
        })
      });

      if (response.ok) {
        setStep("success");
        onSyncComplete();
      } else {
        alert("Simulated sync encountered a network delay. Please try again.");
        setStep("select");
      }
    } catch (err) {
      console.error(err);
      setStep("select");
    }
  };

  const profiles = [
    {
      id: "ananya" as const,
      name: "Ananya Sukesh",
      role: "Full Stack Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      skills: ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL"],
      tag: "Software Engineering Focus"
    },
    {
      id: "alex" as const,
      name: "Alex Rivera",
      role: "Technical Product Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      skills: ["Product Strategy", "System Design", "Agile Methodologies", "Jira", "API Design"],
      tag: "Product & Strategy Focus"
    },
    {
      id: "samantha" as const,
      name: "Samantha Chen",
      role: "Cloud Infrastructure Engineer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Go"],
      tag: "DevOps & Cloud Focus"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl relative z-10 overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 ${
          darkMode 
            ? "bg-[#020617] border-white/10 text-slate-200" 
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0a66c2] via-[#0077b5] to-indigo-600 p-6 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>SECURE SIMULATED LINKEDIN OAUTH</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-white rounded-2xl shadow-md text-[#0077b5] flex items-center justify-center">
              <Linkedin className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-white tracking-tight flex items-center">
                <span>LinkedIn Connect</span>
                <Sparkles className="w-4.5 h-4.5 ml-2 text-yellow-300 animate-pulse" />
              </h2>
              <p className="text-white/80 text-xs mt-0.5">
                Import high-fidelity work, skills, and credentials directly into CareerPilot.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select Profile Template */}
            {step === "select" && (
              <motion.div
                key="step-select"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-1">
                    Select a Verified LinkedIn Profile to Sync
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Choose one of our hand-crafted, high-fidelity LinkedIn profiles or input your custom information to simulate a real profile parse and resume optimization audit.
                  </p>
                </div>

                {/* Profiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-44 relative overflow-hidden group ${
                        selectedProfile === profile.id
                          ? "border-[#0077b5] bg-[#0077b5]/5"
                          : darkMode 
                            ? "bg-white/5 border-white/5 hover:border-white/15" 
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#0077b5]">
                            {profile.tag}
                          </span>
                          {selectedProfile === profile.id && (
                            <CheckCircle className="w-4.5 h-4.5 text-[#0077b5]" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2.5">
                          <img 
                            src={profile.avatar} 
                            alt={profile.name}
                            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#0077b5] transition-colors">
                              {profile.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal">
                              {profile.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 3).map((s, idx) => (
                            <span 
                              key={idx} 
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                                darkMode ? "bg-[#0f172a] text-slate-400" : "bg-white text-slate-600 shadow-sm"
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                          {profile.skills.length > 3 && (
                            <span className="text-[9px] text-slate-400 self-center">
                              +{profile.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Profile Option */}
                <div
                  onClick={() => setSelectedProfile("custom")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedProfile === "custom"
                      ? "border-[#0077b5] bg-[#0077b5]/5"
                      : darkMode 
                        ? "bg-white/5 border-white/5 hover:border-white/15" 
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded-xl flex items-center justify-center ${
                        selectedProfile === "custom" ? "bg-[#0077b5]/15 text-[#0077b5]" : "bg-slate-200 dark:bg-white/10"
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                          Create Custom Profile Sync
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Configure a custom professional identity to import.
                        </p>
                      </div>
                    </div>
                    {selectedProfile === "custom" && (
                      <CheckCircle className="w-4.5 h-4.5 text-[#0077b5]" />
                    )}
                  </div>

                  {selectedProfile === "custom" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                        <input 
                          type="text" 
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="Ananya Sukesh"
                          className="w-full text-xs px-3 py-2 border rounded-xl bg-transparent outline-none border-slate-200 dark:border-white/10 focus:border-[#0077b5]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Career Role</label>
                        <input 
                          type="text" 
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          placeholder="Senior React Developer"
                          className="w-full text-xs px-3 py-2 border rounded-xl bg-transparent outline-none border-slate-200 dark:border-white/10 focus:border-[#0077b5]"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Professional Headline & Bio</label>
                        <textarea 
                          value={customBio}
                          onChange={(e) => setCustomBio(e.target.value)}
                          placeholder="Passionate builder specializing in performance optimizations and client-side design architecture."
                          rows={2}
                          className="w-full text-xs px-3 py-2 border rounded-xl bg-transparent outline-none border-slate-200 dark:border-white/10 focus:border-[#0077b5] resize-none"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Import Skills (comma separated)</label>
                        <input 
                          type="text" 
                          value={customSkills}
                          onChange={(e) => setCustomSkills(e.target.value)}
                          placeholder="React, TypeScript, Next.js, Redux, Tailwind"
                          className="w-full text-xs px-3 py-2 border rounded-xl bg-transparent outline-none border-slate-200 dark:border-white/10 focus:border-[#0077b5]"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 flex justify-end space-x-3">
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleNextToConsent}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#0077b5] hover:bg-[#00669c] text-white flex items-center space-x-1.5 transition-colors shadow-md"
                  >
                    <span>Proceed to Permissions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: LinkedIn Consent & Scopes Form */}
            {step === "consent" && (
              <motion.div
                key="step-consent"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div className="text-center py-2">
                  <div className="w-14 h-14 bg-[#0077b5]/10 text-[#0077b5] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">
                    App Authorization Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    CareerPilot Pilot is requesting authorization to securely sync your LinkedIn digital profile details.
                  </p>
                </div>

                {/* Permissions Breakdown List */}
                <div className={`p-4 rounded-2xl border ${
                  darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-200"
                } space-y-3.5`}>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 p-1 bg-indigo-500/10 text-indigo-500 rounded-lg">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        Profile & Digital Credentials
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                        Your professional headline, email, profile photo, and structural introductory bio summary.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 p-1 bg-emerald-500/10 text-emerald-500 rounded-lg">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        Historical Work Experience & Active Loop Statuses
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                        Detailed enterprise records, timeline dates, and notes corresponding to past internships and employment loops.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 p-1 bg-yellow-500/10 text-yellow-500 rounded-lg">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        Skill Tracks & Certifications
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                        Your LinkedIn-verified skills matrix and completed credentials. These are parsed directly to seed your training modules.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Fully sandbox-simulated OAuth protocol. No actual external credentials required.</span>
                </div>

                {/* Consent buttons */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 flex justify-end space-x-3">
                  <button 
                    onClick={() => setStep("select")}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleStartSync}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#0077b5] hover:bg-[#00669c] text-white flex items-center space-x-1.5 transition-colors shadow-md"
                  >
                    <span>Agree & Import Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Syncing Progress */}
            {step === "syncing" && (
              <motion.div
                key="step-syncing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-10 text-center space-y-6"
              >
                <div className="relative inline-block">
                  <Loader2 className="w-16 h-16 text-[#0077b5] animate-spin mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Linkedin className="w-6 h-6 text-[#0077b5] fill-current" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white">
                    Synchronizing LinkedIn Data
                  </h3>
                  <p className="text-xs text-[#0077b5] font-semibold animate-pulse h-5">
                    {progressStatus}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-sm mx-auto bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${syncProgress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                    className="bg-gradient-to-r from-[#0077b5] to-indigo-500 h-full rounded-full"
                  />
                </div>

                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  Performing automated schema validations, allocating career experience nodes, and computing optimized ATS grades.
                </p>
              </motion.div>
            )}

            {/* STEP 4: Success checkmark */}
            {step === "success" && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-5"
              >
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-white">
                    Profile Synchronized Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    LinkedIn profile data has been parsed and integrated. Your Dashboard, Job Pipeline, Skill Tracker, Certifications, and Resume Analyzer have been updated to reflect your verified credentials.
                  </p>
                </div>

                {/* Rewards / Badges Earned Container */}
                <div className={`max-w-sm mx-auto p-4 rounded-2xl border text-left flex items-center space-x-3.5 ${
                  darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                      Locked +300 XP Integration Bonus!
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                      Unlocked the rare <strong className="text-indigo-500 dark:text-indigo-400">Digital Identity Verified</strong> badge!
                    </p>
                  </div>
                </div>

                {/* Complete close button */}
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/15 transition-all"
                  >
                    Go back to Career Dashboard
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
