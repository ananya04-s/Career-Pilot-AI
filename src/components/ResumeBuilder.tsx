import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  Download, 
  CheckCircle, 
  Check,
  AlertTriangle, 
  Layout, 
  User, 
  Briefcase, 
  BookOpen, 
  Plus, 
  Trash2, 
  Printer, 
  Cpu, 
  BookmarkCheck,
  ListRestart
} from "lucide-react";
import { UserProfile, ResumeAnalysis } from "../types";

interface ResumeBuilderProps {
  user: UserProfile | null;
  darkMode: boolean;
  onAnalyze?: (fileName: string, text: string) => Promise<any>;
}

interface ResumeData {
  name: string;
  role: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
  experience: { company: string; role: string; period: string; bullets: string[] }[];
  education: { school: string; degree: string; period: string; gpa: string }[];
  projects: { name: string; stack: string; description: string }[];
  skills: string;
}

export default function ResumeBuilder({ user, darkMode, onAnalyze }: ResumeBuilderProps) {
  const [template, setTemplate] = useState<"classic" | "mono" | "glass">("glass");
  
  // Prepopulated state for premium graduate
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "Ananya Sukesh",
    role: "Full Stack Engineer Candidate",
    email: "sukeshananya@gmail.com",
    phone: "+91 98765 43210",
    github: "github.com/ananya",
    linkedin: "linkedin.com/in/ananya",
    summary: "Dedicated, research-focused graduate engineer with hands-on experience designing reactive web dashboards and low-latency cloud architectures.",
    experience: [
      {
        company: "Stripe, Inc.",
        role: "Full Stack Engineer Intern",
        period: "May 2025 - Present",
        bullets: [
          "Architected responsive merchant billing canvas using React and TypeScript, boosting load times by 42%.",
          "Engineered Node.js proxy middleware, resolving DB thread congestion and cutting overall latency by 85ms."
        ]
      }
    ],
    education: [
      {
        school: "National Institute of Technology",
        degree: "B.Tech in Computer Science",
        period: "2022 - 2026",
        gpa: "3.9 / 4.0"
      }
    ],
    projects: [
      {
        name: "CareerPilot Platform",
        stack: "TypeScript, React, Node.js",
        description: "Built unified client-side dashboard with modular state management and interactive mock technical evaluation sessions."
      }
    ],
    skills: "React, TypeScript, Node.js, Express, SQL, Python, Java, Docker, GCP"
  });

  // Score states
  const [resumeScore, setResumeScore] = useState(78);
  const [grammarScore, setGrammarScore] = useState(82);
  const [isGrammarChecked, setIsGrammarChecked] = useState(false);
  const [isATSKeywordOptimized, setIsATSKeywordOptimized] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Re-calculate mock ATS compatibility metrics based on inputs
  useEffect(() => {
    let score = 65;
    if (resumeData.name) score += 5;
    if (resumeData.summary.length > 50) score += 5;
    if (resumeData.experience.length > 0) score += 10;
    if (resumeData.projects.length > 0) score += 5;
    if (resumeData.skills.length > 10) score += 5;
    if (isGrammarChecked) score += 5;
    if (isATSKeywordOptimized) score += 10;
    setResumeScore(Math.min(score, 100));
  }, [resumeData, isGrammarChecked, isATSKeywordOptimized]);

  const handleUpdateExperience = (index: number, field: string, val: any) => {
    setResumeData(prev => {
      const list = [...prev.experience];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, experience: list };
    });
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "New Corp", role: "Junior Developer", period: "2026", bullets: ["Implemented REST endpoints."] }]
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "New SaaS App", stack: "Next.js, Prisma", description: "Engineered database tables." }]
    }));
  };

  const handleRemoveProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Simulated AI optimizations
  const handleAIOptimizeKeywords = () => {
    setLoadingAction("ats");
    setTimeout(() => {
      setLoadingAction(null);
      setIsATSKeywordOptimized(true);
      // Enrich summary and skills with rich terms
      setResumeData(prev => ({
        ...prev,
        summary: "Specialized Full Stack Systems developer with expertise configuring containerized Docker pods and reactive Web interfaces, guaranteeing 99.9% uptime and O(log N) query speeds.",
        skills: prev.skills + ", AWS cloud, Kubernetes, GKE, CI/CD, Jest"
      }));
    }, 1500);
  };

  const handleAIGrammarCheck = () => {
    setLoadingAction("grammar");
    setTimeout(() => {
      setLoadingAction(null);
      setIsGrammarChecked(true);
      setGrammarScore(98);
      // Refine bullets to highly metrics-driven professional points
      setResumeData(prev => {
        const list = [...prev.experience];
        list[0].bullets = [
          "Architected Stripe's primary responsive merchant billing canvas using React and TypeScript, boosting overall viewport rendering speed metrics by 42%.",
          "Engineered localized REST proxy middlewares, resolving async database thread congestion and lowering average latency by 85ms."
        ];
        return { ...prev, experience: list };
      });
    }, 1200);
  };

  // Real Print Export
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#2563EB]" />
            <span>AI Resume Builder</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build, format, and audit an ATS-optimized, high-scoring technical resume. Toggle templates instantly and export directly to PDF.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 text-xs font-bold bg-[#2563EB] text-white hover:bg-blue-600 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Builder Inputs (Left) and Templates Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Fields and AI Assistances */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Metrics Auditing panel */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/50"
          } space-y-4`}>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              AI AUDIT REPORT CARD
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/30 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-400 block">ATS FIT SCORE</span>
                <span className="text-3xl font-display font-extrabold text-[#2563EB] mt-1.5 block">{resumeScore}%</span>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  {resumeScore >= 85 ? (
                    <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider flex items-center"><Check className="w-3 h-3 mr-0.5" /> High</span>
                  ) : (
                    <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider flex items-center"><AlertTriangle className="w-3 h-3 mr-0.5" /> Optimize</span>
                  )}
                </div>
              </div>

              <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/30 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-400 block">GRAMMAR INDEX</span>
                <span className="text-3xl font-display font-extrabold text-[#10B981] mt-1.5 block">{grammarScore}%</span>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {isGrammarChecked ? "Polished" : "Needs check"}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Action triggers */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleAIOptimizeKeywords}
                disabled={loadingAction !== null || isATSKeywordOptimized}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  isATSKeywordOptimized 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                    : "bg-[#2563EB] text-white hover:bg-blue-600 shadow-md shadow-blue-500/10"
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>{loadingAction === "ats" ? "Injecting GKE & AWS terms..." : isATSKeywordOptimized ? "Keywords ATS Optimized" : "AI Keywords Injection"}</span>
              </button>

              <button
                onClick={handleAIGrammarCheck}
                disabled={loadingAction !== null || isGrammarChecked}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  isGrammarChecked
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                    : "bg-[#10B981] text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingAction === "grammar" ? "Scanning metrics-bullets..." : isGrammarChecked ? "Grammar Checked & Tuned" : "AI Grammar / Metrics Fix"}</span>
              </button>
            </div>
          </div>

          {/* Core Builder Forms */}
          <div className={`p-5 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          }`}>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              RESUME PROFILE DATA
            </span>

            {/* Personal Details */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider flex items-center"><User className="w-3.5 h-3.5 mr-1" /> Contact details</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={resumeData.name}
                  onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Target Role"
                  value={resumeData.role}
                  onChange={(e) => setResumeData(prev => ({ ...prev, role: e.target.value }))}
                  className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">Professional Summary</span>
              <textarea
                rows={2}
                value={resumeData.summary}
                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1" /> Experience</span>
                <button onClick={handleAddExperience} className="text-xs text-[#2563EB] font-bold hover:underline flex items-center">
                  <Plus className="w-3.5 h-3.5 mr-0.5" /> Add
                </button>
              </div>

              {resumeData.experience.map((exp, i) => (
                <div key={i} className="p-3 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-2 relative">
                  <button onClick={() => handleRemoveExperience(i)} className="absolute top-2 right-2 text-rose-500 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(i, "company", e.target.value)}
                      className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => handleUpdateExperience(i, "role", e.target.value)}
                      className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Period (e.g. May 2025 - Present)"
                    value={exp.period}
                    onChange={(e) => handleUpdateExperience(i, "period", e.target.value)}
                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Technical Skills String */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">Technical Skill Stack (Comma separated)</span>
              <input
                type="text"
                value={resumeData.skills}
                onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: PDF Preview Render with multiple templates */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Template Choice Tab */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Live Preview & Style
            </span>

            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
              <button
                onClick={() => setTemplate("glass")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  template === "glass" ? "bg-[#2563EB] text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Modern Glass
              </button>
              <button
                onClick={() => setTemplate("mono")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  template === "mono" ? "bg-[#2563EB] text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Tech Mono
              </button>
              <button
                onClick={() => setTemplate("classic")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  template === "classic" ? "bg-[#2563EB] text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                Classic Corporate
              </button>
            </div>
          </div>

          {/* Template container */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-10 font-sans print:p-0 print:border-none print:shadow-none min-h-[750px] relative text-slate-800 text-xs sm:text-sm">
            {/* Template Class 1: glass */}
            {template === "glass" && (
              <div className="space-y-6">
                {/* Visual Glass Header */}
                <div className="p-6 rounded-2xl bg-[#2563EB]/5 border border-[#2563EB]/15 flex justify-between items-center">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#2563EB] font-display">{resumeData.name}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{resumeData.role}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 space-y-0.5">
                    <p>{resumeData.email}</p>
                    <p>{resumeData.phone}</p>
                    <p>{resumeData.github}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-[10px] sm:text-xs text-[#2563EB] uppercase tracking-wider">Professional Summation</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{resumeData.summary}</p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="font-display font-extrabold text-[10px] sm:text-xs text-[#2563EB] uppercase tracking-wider">Professional Experience</h4>
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <strong className="font-bold text-slate-800 dark:text-white">{exp.company} — <span className="text-slate-400 font-medium">{exp.role}</span></strong>
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{exp.period}</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed pl-1">
                        {exp.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="font-display font-extrabold text-[10px] sm:text-xs text-[#2563EB] uppercase tracking-wider">Technology Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.split(",").map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="font-display font-extrabold text-[10px] sm:text-xs text-[#2563EB] uppercase tracking-wider">Educational Accolades</h4>
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between text-xs sm:text-sm leading-tight">
                      <div>
                        <strong className="font-bold text-slate-800 dark:text-white">{edu.school}</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">{edu.degree}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">{edu.period}</span>
                        <span className="text-[11px] text-emerald-500 font-semibold block mt-0.5">GPA: {edu.gpa}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Template Class 2: Mono */}
            {template === "mono" && (
              <div className="font-mono space-y-6 text-xs text-slate-800 dark:text-slate-300">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-800 dark:text-white">{resumeData.name}</h1>
                  <p className="text-xs text-[#2563EB] mt-1">// {resumeData.role}</p>
                  <div className="mt-2 text-[10px] text-slate-400 flex flex-wrap gap-3">
                    <span>EMAIL: {resumeData.email}</span>
                    <span>TEL: {resumeData.phone}</span>
                    <span>LINKEDIN: {resumeData.linkedin}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 block uppercase">&gt; SUMMARY</span>
                  <p className="leading-relaxed pl-3 border-l-2 border-[#2563EB]/40">{resumeData.summary}</p>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <span className="font-bold text-slate-400 block uppercase">&gt; RECENT WORK EXPERIENCES</span>
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="space-y-1 pl-3">
                      <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-white">
                        <span>[{exp.company}] - {exp.role}</span>
                        <span>{exp.period}</span>
                      </div>
                      <ul className="list-inside space-y-1 leading-relaxed text-slate-600 dark:text-slate-400">
                        {exp.bullets.map((b, j) => (
                          <li key={j}>* {b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 block uppercase">&gt; TECHNOLOGY_STACK</span>
                  <p className="pl-3 leading-relaxed text-slate-600 dark:text-slate-300">{resumeData.skills}</p>
                </div>
              </div>
            )}

            {/* Template Class 3: Classic */}
            {template === "classic" && (
              <div className="space-y-6 text-slate-800 text-xs sm:text-sm">
                {/* Center Header */}
                <div className="text-center space-y-1 border-b border-slate-300 pb-4">
                  <h1 className="text-2xl font-serif font-bold text-slate-900">{resumeData.name}</h1>
                  <p className="text-xs italic text-slate-500">{resumeData.role}</p>
                  <p className="text-[11px] text-slate-400 flex justify-center gap-3">
                    <span>{resumeData.email}</span> | <span>{resumeData.phone}</span> | <span>{resumeData.linkedin}</span>
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <h4 className="font-bold border-b border-slate-200 text-slate-800 text-xs sm:text-sm pb-0.5 font-serif uppercase tracking-wider">Professional Profile</h4>
                  <p className="text-slate-600 leading-relaxed font-serif italic">"{resumeData.summary}"</p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="font-bold border-b border-slate-200 text-slate-800 text-xs sm:text-sm pb-0.5 font-serif uppercase tracking-wider">Work History</h4>
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="space-y-1 font-serif">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <strong className="font-bold text-slate-900">{exp.company} — <span className="font-normal italic text-slate-600">{exp.role}</span></strong>
                        <span className="text-xs text-slate-400 italic">{exp.period}</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1 leading-relaxed">
                        {exp.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
