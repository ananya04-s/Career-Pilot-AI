import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Award, 
  Plus, 
  Trash2, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Globe,
  Clock,
  X
} from "lucide-react";
import { CertificationItem, UserProfile } from "../types";

interface CertificationsProps {
  user: UserProfile | null;
  certs: CertificationItem[];
  onAddCert: (certData: any) => Promise<{ cert: CertificationItem; gamification: any }>;
  onDeleteCert: (id: string) => Promise<void>;
  darkMode: boolean;
}

export default function Certifications({
  user,
  certs,
  onAddCert,
  onDeleteCert,
  darkMode,
}: CertificationsProps) {
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState<"In Progress" | "Completed">("Completed");
  const [dateCompleted, setDateCompleted] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [gamificationReward, setGamificationReward] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !provider) return;
    setLoading(true);
    setGamificationReward(null);
    try {
      const res = await onAddCert({
        title,
        provider,
        status,
        dateCompleted: status === "Completed" ? dateCompleted || new Date().toISOString().split('T')[0] : "",
      });

      if (res.gamification && (res.gamification.leveledUp || res.gamification.addedBadges?.length > 0)) {
        setGamificationReward(res.gamification);
      }

      setTitle("");
      setProvider("");
      setDateCompleted("");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Provider icon colors
  const getProviderColor = (p: string) => {
    const prov = p.toLowerCase();
    if (prov.includes("google")) return "from-blue-500 via-rose-500 to-yellow-500 text-white";
    if (prov.includes("aws") || prov.includes("amazon")) return "from-amber-500 to-orange-600 text-white";
    if (prov.includes("microsoft") || prov.includes("azure")) return "from-teal-500 to-indigo-600 text-white";
    if (prov.includes("coursera")) return "from-blue-600 to-indigo-700 text-white";
    return "from-emerald-500 to-teal-600 text-white";
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
            <Award className="w-6 h-6 text-emerald-500" />
            <span>Professional Certifications</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log verified certifications and licenses from Google Cloud, Amazon Web Services, Microsoft Azure, Coursera, or Scrum Alliance.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all shadow-md shadow-emerald-500/15"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* Gamification banner */}
      {gamificationReward && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-sm flex items-center justify-between border-2 border-amber-300 shadow-lg shadow-amber-500/20"
        >
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-slate-950" />
            <div>
              <p className="font-bold">Credential logged! (+100 XP)</p>
              <p className="text-xs font-medium">
                {gamificationReward.leveledUp ? `Leveled up to Level ${gamificationReward.level}! ` : ""}
                {gamificationReward.addedBadges?.map((b: string) => `Unlocked Badge: "${b.replace("_", " ")}"! `).join(" ")}
              </p>
            </div>
          </div>
          <button onClick={() => setGamificationReward(null)} className="text-xs font-bold underline cursor-pointer">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Grid List of certs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certs.length > 0 ? (
          certs.map((cert) => (
            <div 
              key={cert.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between glass-card-interactive relative overflow-hidden group ${
                darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
              }`}
            >
              {/* Background gradient blur */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getProviderColor(cert.issuer)} flex items-center justify-center font-bold text-xs shadow-md`}>
                    {cert.issuer.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      cert.status === "Completed" 
                        ? "bg-emerald-500/10 text-emerald-500" 
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {cert.status}
                    </span>
                    <button
                      onClick={() => onDeleteCert(cert.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Credential"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  {cert.issuer}
                </span>
                
                <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-white leading-snug mt-1 group-hover:text-emerald-500 transition-colors">
                  {cert.name}
                </h3>
              </div>

              <div className="flex items-center space-x-2 border-t border-slate-100 dark:border-slate-850 pt-4 mt-6">
                {cert.status === "Completed" ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Completed: {cert.date}
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Currently Studying Track
                    </span>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-slate-950/40">
            <Award className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-bounce" />
            <h4 className="font-display font-bold text-sm text-slate-700 dark:text-slate-200">No credentials tracked yet</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
              Log certificates to demonstrate technical credentials. Completing a certification awards <strong>+100 XP</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-md rounded-3xl border transition-all duration-300 shadow-2xl ${
              darkMode 
                ? "bg-[#020617] border-white/10 text-slate-200" 
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-display font-bold text-lg">Add Professional Credential</h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Credential / Course Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Provider Agency
                </label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Google Cloud, AWS, Coursera, freeCodeCamp"
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Studies Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors ${
                      darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-800"
                    }`}
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                {status === "Completed" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      value={dateCompleted}
                      onChange={(e) => setDateCompleted(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                {loading ? "Recording credential..." : "Add Credential to Profile"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
