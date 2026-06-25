import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  BookOpen, 
  Briefcase, 
  HelpCircle, 
  Award, 
  X, 
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { SkillItem, UserProfile } from "../types";

interface SkillTrackerProps {
  user: UserProfile | null;
  skills: SkillItem[];
  onAddSkill: (skillData: any) => Promise<{ skill: SkillItem; gamification: any }>;
  onDeleteSkill: (id: string) => Promise<void>;
  darkMode: boolean;
}

export default function SkillTracker({
  user,
  skills,
  onAddSkill,
  onDeleteSkill,
  darkMode,
}: SkillTrackerProps) {
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState<"Beginner" | "Intermediate" | "Expert">("Intermediate");
  const [loading, setLoading] = useState(false);
  
  // Selected skill to display AI suggestions
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  // Gamification notification state
  const [gamificationReward, setGamificationReward] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setLoading(true);
    setGamificationReward(null);
    try {
      const res = await onAddSkill({
        name: skillName.trim(),
        level: proficiency
      });
      
      // Select the added skill to display its suggestions immediately!
      if (res.skill) {
        setSelectedSkill(res.skill);
      }

      // Check gamification
      if (res.gamification && (res.gamification.leveledUp || res.gamification.addedBadges?.length > 0)) {
        setGamificationReward(res.gamification);
      }

      setSkillName("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Proficiency style helper
  const getProficiencyStyle = (lvl: string) => {
    if (lvl === "Expert") return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
    if (lvl === "Intermediate") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-emerald-500" />
            <span>AI Skill Tracker</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Map out your current skill stack. Add new skills to prompt Gemini for customized courses, portfolio project architectures, and mock technical interview questions.
          </p>
        </div>
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
              <p className="font-bold">Skill Upgrade reward unlocked!</p>
              <p className="text-xs font-medium">
                {gamificationReward.leveledUp ? `Leveled up to Level ${gamificationReward.level}! ` : ""}
                {gamificationReward.addedBadges?.map((b: string) => `Unlocked Badge: "${b.replace("_", " ")}"! `).join(" ")}
                (+80 XP Added)
              </p>
            </div>
          </div>
          <button onClick={() => setGamificationReward(null)} className="text-xs font-bold underline cursor-pointer">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Grid: catalog of skills & Add Skill card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 columns: Catalog list of added skills */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <div 
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-5 rounded-2xl border glass-card-interactive shadow-sm cursor-pointer relative group flex flex-col justify-between ${
                    selectedSkill?.id === skill.id
                      ? "border-emerald-500 bg-emerald-500/5"
                      : (darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200")
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getProficiencyStyle(skill.level)}`}>
                        {skill.level}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid selecting card!
                          if (selectedSkill?.id === skill.id) setSelectedSkill(null);
                          onDeleteSkill(skill.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-display font-extrabold text-base text-slate-800 dark:text-white mb-1">
                      {skill.name}
                    </h3>
                    
                    <p className="text-[10px] text-slate-400">
                      Added: {skill.addedAt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3 mt-4">
                    <span className="text-xs font-semibold text-emerald-500 flex items-center group-hover:underline">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400 animate-pulse" />
                      <span>View AI Roadmap</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-slate-950/40">
                <CheckSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Your skill stack is currently empty. Add skills to prompt Gemini for personalized tracks.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 column: Add skill form */}
        <div className="space-y-4">
          <div className={`p-6 rounded-3xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
          }`}>
            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-1 text-emerald-500" />
              <span>Add Skill Profile</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Skill Descriptor Name
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Docker, React, Python, Figma"
                  className="w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Proficiency Rating
                </label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value as any)}
                  className={`w-full px-3 py-2 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors ${
                    darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-800"
                  }`}
                >
                  <option value="Beginner">Beginner (Curious / Learning)</option>
                  <option value="Intermediate">Intermediate (Used in core projects)</option>
                  <option value="Expert">Expert (Can teach/mentor others)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !skillName.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/15 transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: loading ? '1.5s' : '0s' }} />
                <span>{loading ? "Modeling Recommendations..." : "Track & Query AI"}</span>
              </button>
            </form>
          </div>

          <div className="p-6 rounded-2xl border bg-slate-950 border-indigo-500/10 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
            <h4 className="font-display font-bold text-xs text-white mb-2 flex items-center">
              <Info className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              <span>Skill Level Reward Systems</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Tracking skills is essential to landing interviews. Each logged skill awards you <strong>+80 XP</strong>. Adding 3 skills unlocks your <strong>"Skill Builder"</strong> achievement badge!
            </p>
          </div>
        </div>

      </div>

      {/* AI Recommendation Panel Drawer / Popup */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-2xl rounded-3xl border transition-all duration-300 shadow-2xl overflow-hidden ${
              darkMode 
                ? "bg-[#020617] border-white/10 text-slate-200" 
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                    {selectedSkill.name} Roadmapping
                  </h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getProficiencyStyle(selectedSkill.level)} mt-0.5`}>
                    Level: {selectedSkill.level}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSkill(null)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Tab sections */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              
              {/* Courses Suggestions */}
              {selectedSkill.suggestions?.courses && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <BookOpen className="w-4 h-4 mr-1 text-emerald-500" />
                    <span>Recommended Online Courses</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSkill.suggestions.courses.map((course, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border flex flex-col justify-between ${
                          darkMode ? "bg-[#0f172a] border-white/5" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div>
                          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{course.provider}</span>
                          <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-1 line-clamp-2">{course.title}</h5>
                        </div>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Forwarding to online class page for: ${course.title} via ${course.provider}!`);
                          }}
                          className="text-[10px] font-bold text-emerald-500 hover:underline mt-3 block self-start"
                        >
                          Enroll Now
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Project Suggestions */}
              {selectedSkill.suggestions?.projects && (
                <div className="space-y-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1 text-indigo-500" />
                    <span>AI-Driven Portfolio Project Architectures</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedSkill.suggestions.projects.map((proj, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-xl border ${
                          darkMode ? "bg-[#0f172a] border-white/5" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{proj.title}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-bold uppercase">
                            {proj.complexity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Questions */}
              {selectedSkill.suggestions?.practiceQuestions && (
                <div className="space-y-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-1 text-amber-500" />
                    <span>Technical Interview Practice loops</span>
                  </h4>
                  <ul className="space-y-3">
                    {selectedSkill.suggestions.practiceQuestions.map((question, idx) => (
                      <li 
                        key={idx}
                        className={`p-3 rounded-xl text-xs leading-relaxed font-mono ${
                          darkMode ? "bg-[#0f172a] text-amber-500/90 border border-white/5" : "bg-amber-500/5 text-amber-700 border border-amber-500/10"
                        }`}
                      >
                        <strong>Q{idx + 1}:</strong> {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Certifications suggestions */}
              {selectedSkill.suggestions?.certifications && (
                <div className="space-y-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <Award className="w-4 h-4 mr-1 text-teal-500" />
                    <span>Valued Professional Certifications</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedSkill.suggestions.certifications.map((cert, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        <span className="font-semibold">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
