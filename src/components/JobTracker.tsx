import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  MapPin, 
  Building, 
  Trash2, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  X,
  PlusCircle,
  TrendingUp,
  Award,
  Wallet
} from "lucide-react";
import { JobApplication, JobStatus, UserProfile } from "../types";

interface JobTrackerProps {
  user: UserProfile | null;
  jobs: JobApplication[];
  onAddJob: (jobData: any) => Promise<{ job: JobApplication; gamification: any }>;
  onUpdateJob: (id: string, jobData: any) => Promise<{ job: JobApplication; gamification: any }>;
  onDeleteJob: (id: string) => Promise<void>;
  darkMode: boolean;
}

const COLUMNS: { id: JobStatus; title: string; color: string; bg: string; dot: string }[] = [
  { id: "Applied", title: "Applied", color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20", dot: "bg-indigo-500" },
  { id: "Interview Scheduled", title: "Interview", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  { id: "Offer Received", title: "Offer Received", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  { id: "Rejected", title: "Rejected", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20", dot: "bg-slate-400" },
];

export default function JobTracker({
  user,
  jobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  darkMode,
}: JobTrackerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Gamification notification state
  const [gamificationReward, setGamificationReward] = useState<any | null>(null);

  // HTML5 Drag state
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;
    setLoading(true);
    setGamificationReward(null);
    try {
      const res = await onAddJob({
        company,
        role,
        status: "Applied",
        location,
        salary,
        notes,
      });
      
      // Check gamification
      if (res.gamification && (res.gamification.leveledUp || res.gamification.addedBadges?.length > 0)) {
        setGamificationReward(res.gamification);
      }

      // Reset
      setCompany("");
      setRole("");
      setLocation("");
      setSalary("");
      setNotes("");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Move status handler (either via drag or quick button clicks)
  const moveJobStatus = async (id: string, newStatus: JobStatus) => {
    setGamificationReward(null);
    try {
      const res = await onUpdateJob(id, { status: newStatus });
      if (res.gamification && (res.gamification.leveledUp || res.gamification.addedBadges?.length > 0)) {
        setGamificationReward(res.gamification);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // HTML5 Drag events
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggingCardId(cardId);
    e.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop!
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: JobStatus) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain") || draggingCardId;
    if (cardId) {
      const job = jobs.find(j => j.id === cardId);
      if (job && job.status !== targetStatus) {
        await moveJobStatus(cardId, targetStatus);
      }
    }
    setDraggingCardId(null);
  };

  // Math stats
  const totalTracked = jobs.length;
  const interviewCount = jobs.filter(j => j.status === "Interview Scheduled").length;
  const offerCount = jobs.filter(j => j.status === "Offer Received").length;
  const conversionRate = totalTracked > 0 
    ? Math.round(((interviewCount + offerCount) / totalTracked) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
            <Building className="w-6 h-6 text-emerald-500" />
            <span>Flight Board (Job Tracker)</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Map out your applications, log offer contracts, organize scheduled loops, and drag cards across active statuses.
          </p>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all shadow-md shadow-emerald-500/15"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Track New Job</span>
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
              <p className="font-bold">Career Board Progress Unlocked!</p>
              <p className="text-xs font-medium">
                {gamificationReward.leveledUp ? `Leveled up to Level ${gamificationReward.level}! ` : ""}
                {gamificationReward.addedBadges?.map((b: string) => `Unlocked Badge: "${b.replace("_", " ")}"! `).join(" ")}
                (+XP Added)
              </p>
            </div>
          </div>
          <button onClick={() => setGamificationReward(null)} className="text-xs font-bold underline cursor-pointer">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Highlights Metrics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"} flex items-center space-x-3`}>
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
            <Building className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-slate-800 dark:text-white block">{totalTracked}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total logged</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"} flex items-center space-x-3`}>
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-slate-800 dark:text-white block">{interviewCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Loops scheduled</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"} flex items-center space-x-3`}>
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Wallet className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-slate-800 dark:text-white block">{offerCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Offers Secured</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"} flex items-center space-x-3`}>
          <div className="p-2 bg-teal-500/10 text-teal-500 rounded-lg">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-slate-800 dark:text-white block">{conversionRate}%</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Interview Rate</span>
          </div>
        </div>

      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colJobs = jobs.filter(j => j.status === col.id);
          return (
            <div 
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`p-4 rounded-3xl border flex flex-col min-h-[500px] transition-all ${
                darkMode ? "bg-white/5 border-white/10" : "bg-slate-50/60 border-slate-200/50"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="font-display font-bold text-sm tracking-tight text-slate-700 dark:text-slate-200">
                    {col.title}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold ${col.bg} ${col.color}`}>
                  {colJobs.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colJobs.length > 0 ? (
                  colJobs.map((job) => (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job.id)}
                      className={`p-4 rounded-xl border glass-card-interactive shadow-sm cursor-grab active:cursor-grabbing relative ${
                        darkMode ? "bg-[#0f172a] border-white/5" : "bg-white border-slate-200"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {job.appliedDate}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{job.role}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                        <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {job.company}
                      </p>
                      
                      {job.location && (
                        <p className="text-[11px] text-slate-400 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          {job.location}
                        </p>
                      )}

                      {job.salary && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {job.salary}
                        </span>
                      )}

                      {/* Notes / Interview highlight */}
                      {job.notes && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic bg-slate-50/50 dark:bg-slate-950/20 p-2 rounded-lg mt-3 border border-slate-100 dark:border-slate-850">
                          {job.notes}
                        </p>
                      )}

                      {/* Manual Quick Move controls */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-2.5 mt-3">
                        <button 
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex space-x-1">
                          {col.id !== "Applied" && (
                            <button
                              onClick={() => {
                                const idx = COLUMNS.findIndex(c => c.id === col.id);
                                moveJobStatus(job.id, COLUMNS[idx - 1].id);
                              }}
                              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title="Move Left"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {col.id !== "Rejected" && (
                            <button
                              onClick={() => {
                                const idx = COLUMNS.findIndex(c => c.id === col.id);
                                moveJobStatus(job.id, COLUMNS[idx + 1].id);
                              }}
                              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title="Move Right"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200/20 rounded-xl h-full">
                    <p className="text-[10px] text-slate-400 text-center">Drag cards here or click Move.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Card Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-md rounded-2xl border transition-all duration-300 shadow-2xl ${
              darkMode 
                ? "bg-slate-950 border-slate-800 text-slate-100" 
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center space-x-1.5">
                <PlusCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="font-display font-bold text-lg">Track New Job Application</h3>
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
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, Vercel"
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Graduate Analyst"
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote, Hybrid"
                    className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $120k - $140k"
                    className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Private Notes / Prep Checklist
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Checklist: Revise recursion patterns, read merchant billing API docs..."
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                {loading ? "Saving to board..." : "Add Application Card"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
