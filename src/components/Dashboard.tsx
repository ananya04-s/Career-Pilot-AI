import { motion } from "motion/react";
import { 
  Trophy, 
  CheckSquare, 
  Briefcase, 
  FileText, 
  ChevronRight, 
  Clock, 
  Building, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  ArrowUpRight,
  Linkedin
} from "lucide-react";
import { UserProfile, JobApplication, ResumeAnalysis, SkillItem, CertificationItem } from "../types";

interface DashboardProps {
  user: UserProfile | null;
  jobs: JobApplication[];
  resume: ResumeAnalysis | null;
  skills: SkillItem[];
  certs: CertificationItem[];
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  onOpenLinkedInSync?: () => void;
}

export default function Dashboard({
  user,
  jobs,
  resume,
  skills,
  certs,
  setCurrentTab,
  darkMode,
  onOpenLinkedInSync,
}: DashboardProps) {

  // Calculate stats
  const activeJobs = jobs.filter(j => j.status === "Applied" || j.status === "Interview Scheduled");
  const interviewsScheduled = jobs.filter(j => j.status === "Interview Scheduled");
  const offersReceived = jobs.filter(j => j.status === "Offer Received");
  const completedCerts = certs.filter(c => c.status === "Completed");

  // Daily Career Score logic (composite)
  const calculateCareerScore = () => {
    let score = 30; // base score
    if (resume) score += Math.floor(resume.score * 0.35); // max 35 pts
    if (skills.length > 0) score += Math.min(skills.length * 5, 20); // max 20 pts
    if (jobs.length > 0) score += Math.min(jobs.length * 3, 15); // max 15 pts
    if (interviewsScheduled.length > 0) score += 10; // 10 pts
    if (completedCerts.length > 0) score += Math.min(completedCerts.length * 5, 10); // max 10 pts
    return Math.min(score, 100);
  };

  const careerScore = calculateCareerScore();

  // Color mappings based on score range
  const getScoreColor = (val: number) => {
    if (val >= 85) return "from-emerald-500 to-teal-400";
    if (val >= 70) return "from-indigo-500 via-teal-500 to-emerald-400";
    return "from-amber-500 to-orange-400";
  };

  // Pre-generate custom recommended jobs based on targetRole
  const getRecommendedJobs = () => {
    const role = user?.targetRole || "Software Engineer";
    return [
      {
        id: "rec-1",
        title: `Junior ${role}`,
        company: "Vercel",
        location: "Remote",
        salary: "$120k - $140k",
        match: 96,
        type: "Full-time"
      },
      {
        id: "rec-2",
        title: `${role} (New Grad)`,
        company: "Figma",
        location: "San Francisco, CA (Hybrid)",
        salary: "$130k - $150k",
        match: 91,
        type: "Full-time"
      },
      {
        id: "rec-3",
        title: `Associate ${role}`,
        company: "Linear",
        location: "Remote (Global)",
        salary: "$110k - $125k",
        match: 87,
        type: "Full-time"
      }
    ];
  };

  // Get responsive dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-800 to-indigo-900 dark:from-slate-100 dark:via-emerald-400 dark:to-indigo-300">
            {getGreeting()}, {user?.name || "Candidate"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Let's pilot your career targets today. You have <strong className="text-emerald-500 font-semibold">{interviewsScheduled.length} scheduled interviews</strong> and <strong className="text-indigo-500 font-semibold">{offersReceived.length} active offers</strong>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 self-start md:self-auto">
          {onOpenLinkedInSync && (
            <button 
              onClick={onOpenLinkedInSync}
              className="flex items-center space-x-1.5 px-4 py-2 text-sm rounded-xl bg-[#0077b5] hover:bg-[#00669c] text-white font-semibold transition-all shadow-md shadow-[#0077b5]/15"
            >
              <Linkedin className="w-4 h-4 fill-current" />
              <span>Sync LinkedIn</span>
            </button>
          )}
          <button 
            onClick={() => setCurrentTab("coach")}
            className="flex items-center space-x-1.5 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all shadow-md shadow-emerald-500/15"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Coach</span>
          </button>
        </div>
      </div>

      {/* LinkedIn Profile Sync Quick Banner CTA */}
      {onOpenLinkedInSync && (
        <div className="relative overflow-hidden p-6 rounded-3xl border border-[#0077b5]/20 bg-[#0077b5]/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0077b5]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center space-x-4 relative">
            <div className="p-3.5 bg-white rounded-2xl shadow-md text-[#0077b5] flex items-center justify-center shrink-0">
              <Linkedin className="w-8 h-8 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#0077b5] uppercase tracking-widest bg-[#0077b5]/10 px-2 py-0.5 rounded-full">
                AUTOMATED PROFILE PILOT
              </span>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white mt-1.5 flex items-center">
                <span>Sync with LinkedIn to supercharge your pilot score</span>
                <Sparkles className="w-4 h-4 ml-1.5 text-yellow-500 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Skip manual data entry! Import your professional experiences, certifications, and skills in seconds using our secure sandboxed OAuth simulation.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenLinkedInSync}
            className="self-start md:self-auto px-5 py-2.5 text-xs font-extrabold rounded-xl bg-[#0077b5] hover:bg-[#00669c] text-white shadow-md shadow-[#0077b5]/20 transition-all flex items-center space-x-1.5 whitespace-nowrap"
          >
            <span>Sync Profile Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Score Dial & Stats cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Career Score Gauge Card */}
        <div className={`p-6 rounded-3xl border ${
          darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
        } flex flex-col items-center justify-center relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block self-start mb-6">
            DAILY CAREER PILOT SCORE
          </span>

          {/* Glowing Circle Gauge */}
          <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r="68"
                className="stroke-slate-100 dark:stroke-slate-900"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Highlight Fill Progress */}
              <motion.circle
                cx="80"
                cy="80"
                r="68"
                className={`stroke-emerald-500`}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 68}
                initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - careerScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-extrabold text-slate-800 dark:text-white">
                {careerScore}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6 line-clamp-2">
            Your score is calculated using composite analytics from Resume Analysis ({resume ? `${resume.score}%` : "No upload"}), Skills ({skills.length}), and active trackers.
          </p>

          <button 
            onClick={() => setCurrentTab("resume")}
            className="mt-4 flex items-center space-x-1 text-xs font-semibold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <span>Analyze Resume to Boost Score</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 2x2 Stats Summary Card Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Active Applications */}
          <div 
            onClick={() => setCurrentTab("jobs")}
            className={`p-6 rounded-3xl border cursor-pointer hover:border-emerald-500/20 group transition-all duration-300 ${
              darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200/50 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-500 font-mono">
                {offersReceived.length} Offers Received
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-white">
                {activeJobs.length}
              </span>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Active Job Applications
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(activeJobs.length * 15, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Resume Score Tracker */}
          <div 
            onClick={() => setCurrentTab("resume")}
            className={`p-6 rounded-3xl border cursor-pointer hover:border-indigo-500/20 group transition-all duration-300 ${
              darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200/50 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-indigo-500 font-mono">
                {resume ? `ATS Fit: ${resume.atsCompatibility}%` : "Action Required"}
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-white">
                {resume ? `${resume.score}%` : "N/A"}
              </span>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Resume Health Index
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${resume ? resume.score : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Technical Skills Tracked */}
          <div 
            onClick={() => setCurrentTab("skills")}
            className={`p-6 rounded-3xl border cursor-pointer hover:border-teal-500/20 group transition-all duration-300 ${
              darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200/50 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform duration-300">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-teal-500 font-mono">
                {skills.filter(s => s.level === "Expert").length} Expert Skills
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-white">
                {skills.length}
              </span>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Active Skills Tracking
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${Math.min(skills.length * 20, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Unlocked Gamified Badges */}
          <div 
            onClick={() => setCurrentTab("dashboard")}
            className={`p-6 rounded-3xl border cursor-pointer hover:border-amber-500/20 group transition-all duration-300 ${
              darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200/50 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-amber-500 font-mono">
                Level {user?.level || 1} Achieved
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold text-slate-800 dark:text-white">
                {user?.badges?.length || 0}
              </span>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Earned Career Badges
              </p>
              <div className="flex gap-1.5 mt-3">
                {user?.badges?.map((badgeId, index) => (
                  <div 
                    key={badgeId} 
                    className="w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-950"
                    title={badgeId.replace("_", " ")}
                  >
                    ★
                  </div>
                ))}
                {(!user?.badges || user.badges.length === 0) && (
                  <span className="text-xs text-slate-400">Unlock your first badge!</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Upcoming Interviews & AI Tips & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Interviews & AI Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming interviews list */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
          }`}>
            <h3 className="font-display font-bold text-base flex items-center space-x-2 text-slate-800 dark:text-white">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>Upcoming Flight Prep (Interviews)</span>
            </h3>
            
            <div className="mt-4 space-y-3">
              {interviewsScheduled.length > 0 ? (
                interviewsScheduled.map((job) => (
                  <div 
                    key={job.id} 
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                      darkMode ? "bg-[#0f172a] border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{job.company}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{job.role} • {job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-500 block">
                          {job.interviewDate ? new Date(job.interviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Date TBD"}
                        </span>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">SCHEDULED</span>
                      </div>
                      <button 
                        onClick={() => setCurrentTab("interview")}
                        className="px-3 py-1 text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-all"
                      >
                        Prep Mock
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                  <p className="text-xs text-slate-400 dark:text-slate-500">No upcoming interviews currently scheduled.</p>
                  <button 
                    onClick={() => setCurrentTab("jobs")}
                    className="mt-2 text-xs font-semibold text-emerald-500 hover:underline"
                  >
                    Track a Job Application
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
          }`}>
            <h3 className="font-display font-bold text-base flex items-center space-x-2 text-slate-800 dark:text-white">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <span>AI Job Recommendations</span>
            </h3>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {getRecommendedJobs().map((rec) => (
                <div 
                  key={rec.id}
                  className={`p-4 rounded-xl border relative flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-all ${
                    darkMode ? "bg-[#0f172a] border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="absolute top-0 right-0 p-1 bg-indigo-500 text-white font-bold font-mono text-[9px] rounded-bl-lg">
                    {rec.match}% Match
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">
                      {rec.type}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-1">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      {rec.company}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {rec.location}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-3 mt-4">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {rec.salary}
                    </span>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Forwarding profile of ${user?.name || "Ananya"} to ${rec.company} recruiters via CareerPilot connection!`);
                      }}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center"
                    >
                      <span>Apply</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AI Career Coach tips widget (1/3 column) */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl border bg-gradient-to-br from-emerald-600 to-navy-900 border-white/10 text-slate-100 relative overflow-hidden group shadow-lg shadow-emerald-500/10">
            {/* Ambient gold glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-4 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>PILOT ADVICE OF THE DAY</span>
            </span>

            <h4 className="font-display font-bold text-lg text-white leading-snug">
              "Actionable metric bullet points sell profiles to recruiters."
            </h4>
            
            <p className="text-xs text-slate-400 leading-relaxed mt-3">
              Instead of writing <em>"Assisted with front-end React code improvements"</em>, optimize it using action verbs and structural numbers:
            </p>

            <div className="p-3 bg-[#020617]/50 rounded-xl border border-white/5 mt-4 space-y-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">BEFORE:</span>
              <p className="text-xs text-slate-400 italic">"Responsible for updating CSS grids and speed."</p>
              
              <div className="border-t border-white/5 my-2" />
              
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">AFTER:</span>
              <p className="text-xs text-white font-medium">"Redesigned the primary user viewport with CSS Grid and deferred loading, cutting bundle metrics by 35% and improving Web Vitals LCP by 2.4s."</p>
            </div>

            <button 
              onClick={() => setCurrentTab("coach")}
              className="w-full mt-5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-all flex items-center justify-center space-x-1"
            >
              <span>Ask AI For Resume Bullets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gamification Level Achievement Widget */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
          }`}>
            <h3 className="font-display font-bold text-base flex items-center space-x-2 text-slate-800 dark:text-white">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Career Roadmap Achievements</span>
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold font-mono text-xs">
                  ★
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-white">Resume Master</h4>
                  <p className="text-[10px] text-slate-400">Unlocked • Uploaded or pasted your primary engineering resume.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-500 font-bold font-mono text-xs">
                  ★
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-white">Job Hunter</h4>
                  <p className="text-[10px] text-slate-400">Unlocked • Tracking at least 3 active applications in the flight board.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 opacity-50 hover:opacity-100 transition-opacity duration-300">
                <div className="p-1 rounded-lg bg-slate-500/10 text-slate-500 font-bold font-mono text-xs">
                  ☆
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-white">Interview Hero</h4>
                  <p className="text-[10px] text-slate-400">Locked • Complete at least 1 technical or HR prep session with AI grading.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 opacity-50 hover:opacity-100 transition-opacity duration-300">
                <div className="p-1 rounded-lg bg-slate-500/10 text-slate-500 font-bold font-mono text-xs">
                  ☆
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-white">Skill Builder</h4>
                  <p className="text-[10px] text-slate-400">Locked • Track at least 3 active technical skill proficiencies.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
