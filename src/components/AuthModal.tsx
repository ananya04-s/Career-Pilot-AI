import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Mail, Sparkles, User, Target, UserCheck, RefreshCw } from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (email: string) => Promise<UserProfile>;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>;
  onResetDb: () => Promise<void>;
  darkMode: boolean;
}

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
];

export default function AuthModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onUpdateProfile,
  onResetDb,
  darkMode,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || "Fresher / Graduate");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await onLogin(email);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateProfile({
        name,
        targetRole,
        bio,
        experienceLevel,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = async (demoEmail: string) => {
    setLoading(true);
    try {
      await onLogin(demoEmail);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (!confirm("Are you sure you want to reset the database to the initial demo state? All your custom inputs will be replaced.")) return;
    setResetting(true);
    try {
      await onResetDb();
      alert("Database successfully reset. Reloading state.");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-lg overflow-hidden rounded-3xl border transition-all duration-300 shadow-2xl ${
          darkMode 
            ? "bg-[#020617] border-white/10 text-slate-200" 
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h2 className="font-display font-bold text-xl">
              {user ? "Manage Career Profile" : "CareerPilot Authentication"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {user ? (
            /* Logged in: Profile Management */
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email Account
                </label>
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Target Career Role
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Full Stack Engineer, Product Designer"
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors ${
                    darkMode ? "bg-[#020617] text-white" : "bg-white text-slate-800"
                  }`}
                >
                  <option value="Fresher / Graduate">Fresher / Graduate</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior Professional">Junior Professional (0-2 years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Career Bio & Aspiration
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of your technical focus, goals, and passions..."
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{loading ? "Saving Profile..." : "Update Profile"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDb}
                  disabled={resetting}
                  className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold text-xs transition-colors flex items-center justify-center space-x-1 border border-rose-500/20"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{resetting ? "Resetting Data..." : "Reset Database to Premium Defaults"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Logged out: Sign In / Quick Demo Users */
            <div className="space-y-6">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Welcome to CareerPilot AI! Register or sign in with your email to start mapping, tracking, and gamifying your professional journey.
                </p>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Enter Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.career@university.edu"
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center"
                >
                  {loading ? "Authenticating Account..." : "Login / Sign Up"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/50 dark:border-slate-800/50" />
                </div>
                <span className={`relative px-3 text-xs font-semibold uppercase tracking-widest text-slate-400 ${
                  darkMode ? "bg-[#020617]" : "bg-white"
                }`}>
                  OR USE PRE-CREATED DEMO
                </span>
              </div>

              {/* Quick Demos */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-medium">
                  We've initialized a highly detailed demonstration profile for immediate evaluation of the platform:
                </p>
                <button
                  onClick={() => loadDemoUser("sukeshananya@gmail.com")}
                  className={`w-full p-4 text-left rounded-xl border flex items-center space-x-3 transition-all ${
                    darkMode 
                      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/40" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-emerald-500/40"
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                    alt="Demo Avatar"
                    className="w-10 h-10 rounded-lg object-cover border border-emerald-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Ananya Sukesh</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-semibold uppercase tracking-wider">
                        Premium Grad
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                      Full Stack Engineer Candidate • sukeshananya@gmail.com
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
