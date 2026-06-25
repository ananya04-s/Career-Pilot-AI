import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  HelpCircle,
  FileCheck,
  TrendingUp,
  Award,
  Linkedin
} from "lucide-react";
import { ResumeAnalysis, UserProfile } from "../types";

interface ResumeAnalyzerProps {
  user: UserProfile | null;
  resume: ResumeAnalysis | null;
  onAnalyze: (fileName: string, text: string) => Promise<{ analysis: ResumeAnalysis; gamification: any }>;
  darkMode: boolean;
  onOpenLinkedInSync?: () => void;
}

const DEMO_RESUMES = [
  {
    name: "Alex_SDE_Unoptimized.txt",
    description: "New grad resume with very vague bullets, no numerical impact, and high repetition.",
    text: `Alex Johnson
Web Developer Graduate
Email: alexj@school.edu

OBJECTIVE:
To secure a web development role in a leading firm where I can expand my coding skills and contribute to web design projects.

EDUCATION:
B.S. in Computer Science, University of Technology, 2026

TECHNICAL SKILLS:
HTML, CSS, JavaScript, React, Java, Git, Photoshop, Microsoft Word

PROJECTS:
- Chat App: Made a basic chat web application in React and CSS. Allowed users to login and send direct messages in chatrooms.
- E-Commerce Web: Worked on a backend server for a grocery checkout website. Used express, node, and databases.
- Personal Blog: Made a static blog with CSS grid styles and markdown elements.

EXPERIENCE:
IT Helpdesk Assistant (Intern), June 2025 - August 2025
- Managed computer hardware installs and cleared user passwords.
- Wrote documentation guidelines for setup scripts.
- Helped clear IT issues and assisted senior directors.`
  },
  {
    name: "Ananya_FullStack_Premium.txt",
    description: "Highly polished engineering resume showcasing strict metrics, specialized keywords, and advanced stacks.",
    text: `Ananya Sukesh
Full Stack Software Engineer Candidate | sukeshananya@gmail.com
Portfolio: ananya.dev | GitHub: github/ananya

TECHNICAL SUMMATION:
Specialized Full Stack developer focused on engineering highly optimized, scalable cloud architectures. Proficient in React, TypeScript, Node.js, and cloud native containers.

PROFESSIONAL EXPERIENCE:
Full Stack Engineer Intern | Stripe, Inc. | May 2025 - Present
- Architected the primary visual canvas UI for merchant billing configurations using React concurrent rendering and TypeScript generics, increasing viewport load speeds by 42%.
- Created a localized API proxy middleware using Node.js and Express REST endpoints, resolving async database thread congestion and lowering latency by 85ms.
- Coordinated with lead cloud developers to containerize 12 backend microservices using Docker and orchestrated self-healing pods via Google Kubernetes Engine (GKE).

PORTFOLIO SHIELDS & PROJECTS:
CareerPilot AI Dashboard (TypeScript, React, Node.js, Express)
- Authored a full-stack career planner using Vite, styling glassmorphism with Tailwind utility systems and securing API endpoints.
- Integrated server-side Gemini AI content stream routines to analyze resumes and grade mock interview answer structures synchronously, handling up to 10k requests daily.

EDUCATION:
Candidate B.Tech in Computer Science & Engineering | National Institute of Technology | Graduating 2026 (GPA: 3.9/4.0)`
  }
];

export default function ResumeAnalyzer({
  user,
  resume,
  onAnalyze,
  darkMode,
  onOpenLinkedInSync,
}: ResumeAnalyzerProps) {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [gamificationReward, setGamificationReward] = useState<any | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setInputText(evt.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDemoSelect = (demo: typeof DEMO_RESUMES[0]) => {
    setFileName(demo.name);
    setInputText(demo.text);
  };

  const startAnalysis = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    setGamificationReward(null);
    try {
      const res = await onAnalyze(fileName || "My_Uploaded_Resume.txt", inputText);
      if (res.gamification && res.gamification.leveledUp || res.gamification?.addedBadges?.length > 0) {
        setGamificationReward(res.gamification);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Score badge helper color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/15 border-emerald-500/20";
    if (score >= 60) return "text-indigo-500 bg-indigo-500/15 border-indigo-500/20";
    return "text-amber-500 bg-amber-500/15 border-amber-500/20";
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
          <FileText className="w-6 h-6 text-emerald-500" />
          <span>AI Resume Analyzer</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Scan your CV against industry-standard recruiter algorithms, evaluate ATS compatibility, detect grammar index, and optimize keywords instantly.
        </p>
      </div>

      {/* Gamification Level Reward banner */}
      {gamificationReward && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-sm flex items-center justify-between border-2 border-amber-300 shadow-lg shadow-amber-500/20"
        >
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-slate-950" />
            <div>
              <p className="font-bold">Resume Scan Reward unlocked!</p>
              <p className="text-xs font-medium">
                {gamificationReward.leveledUp ? `Leveled up to Level ${gamificationReward.level}! ` : ""}
                {gamificationReward.addedBadges?.length > 0 ? `Unlocked Badge: "Resume Master"! (+250 XP)` : ""}
              </p>
            </div>
          </div>
          <button onClick={() => setGamificationReward(null)} className="text-xs font-bold underline cursor-pointer">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Grid: Editor Box & Quick Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor Box */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`p-6 rounded-2xl border-2 transition-all ${
              dragActive 
                ? "border-emerald-500 bg-emerald-500/5" 
                : "border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40"
            }`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Drag and drop your resume file here (.pdf, .txt, .docx)
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Or paste your entire resume content in the text editor below.
              </p>
            </div>
          </div>

          <div className={`rounded-2xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
          } overflow-hidden`}>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {fileName ? `File: ${fileName}` : "Resume Text Editor"}
              </span>
              {fileName && (
                <button 
                  onClick={() => { setFileName(""); setInputText(""); }}
                  className="text-[10px] font-bold text-rose-500 hover:underline"
                >
                  Clear File
                </button>
              )}
            </div>
            
            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your resume contents here... e.g. Contact Info, Work History, Core Projects, Skills, and Academics"
              className="w-full px-4 py-3 text-sm font-mono bg-transparent outline-none resize-none border-none text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={startAnalysis}
            disabled={analyzing || !inputText.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/15 transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
          >
            <Sparkles className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: analyzing ? '2s' : '0s' }} />
            <span>{analyzing ? "Scanning ATS Database & Modeling..." : "Analyze CV with Gemini"}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className={`p-6 rounded-3xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
          }`}>
            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-indigo-500" />
              <span>Load Demo Presets</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Select one of our pre-configured graduate resumes to test the Gemini ATS compliance engine instantly.
            </p>

            <div className="space-y-3">
              {DEMO_RESUMES.map((demo) => (
                <div 
                  key={demo.name}
                  onClick={() => handleDemoSelect(demo)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    fileName === demo.name
                      ? "border-emerald-500 bg-emerald-500/5"
                      : (darkMode ? "bg-[#0f172a] border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100")
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-xs truncate flex-1">{demo.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {demo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* LinkedIn Profile Sync Card */}
          {onOpenLinkedInSync && (
            <div className="p-6 rounded-3xl border border-[#0077b5]/20 bg-[#0077b5]/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0077b5]/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center">
                <Linkedin className="w-4 h-4 mr-1.5 text-[#0077b5] fill-current" />
                <span>Sync with LinkedIn</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Connect your LinkedIn to auto-import skills, past employment, and certifications, and get an automated high-fidelity ATS resume score analysis immediately!
              </p>
              <button
                onClick={onOpenLinkedInSync}
                className="w-full py-2 px-4 text-xs font-extrabold rounded-xl bg-[#0077b5] hover:bg-[#00669c] text-white flex items-center justify-center space-x-1.5 shadow-md shadow-[#0077b5]/15 transition-all cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
                <span>Simulate LinkedIn Import</span>
              </button>
            </div>
          )}

          <div className="p-6 rounded-2xl border bg-slate-950 border-emerald-500/15 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
            <h3 className="font-display font-bold text-sm text-white mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-emerald-400 animate-pulse" />
              <span>How we score ATS</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Our analyzer uses live <strong>Gemini models</strong> to test layout structure, analyze keyword density of technical descriptors, audit bullet sentence structures (STAR method) and score grammatical clarity, assuring you are ready for major agency scanners.
            </p>
          </div>
        </div>

      </div>

      {/* Scanner Loading Animation Screen */}
      {analyzing && (
        <div className="p-12 rounded-2xl border border-emerald-500/20 bg-slate-950 text-center flex flex-col items-center justify-center relative overflow-hidden">
          {/* Laser Scanner Effect */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-lg shadow-emerald-500/80 animate-[bounce_3s_infinite]" />
          
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
            <FileCheck className="w-8 h-8 text-emerald-400" />
          </div>

          <h3 className="font-display font-bold text-lg text-white">ATS Algorithm Check Active</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Running structural layout diagnostics, analyzing grammatical components, and evaluating target skill optimization vectors...
          </p>
        </div>
      )}

      {/* Results View */}
      {resume && !analyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-4"
        >
          {/* Top Score summary widget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Overall score */}
            <div className={`p-5 rounded-3xl border ${
              darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
            } text-center flex flex-col justify-center items-center`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Overall CV Score</span>
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold font-display ${getScoreColor(resume.score)}`}>
                {resume.score}%
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Weight: 35% of total Career Score</p>
            </div>

            {/* ATS Score */}
            <div className={`p-5 rounded-3xl border ${
              darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
            } text-center flex flex-col justify-center items-center`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">ATS Compatibility</span>
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold font-display ${getScoreColor(resume.atsCompatibility)}`}>
                {resume.atsCompatibility}%
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Keywords and Structure fits</p>
            </div>

            {/* Grammar Score */}
            <div className={`p-5 rounded-3xl border ${
              darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
            } text-center flex flex-col justify-center items-center`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Grammar & Formatting</span>
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold font-display ${getScoreColor(resume.grammarScore)}`}>
                {resume.grammarScore}%
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Readability and tone indexes</p>
            </div>

          </div>

          {/* Action Improvements & Missing skills panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Suggestions & Action points */}
            <div className={`p-6 rounded-3xl border ${
              darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
            }`}>
              <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-500" />
                <span>Actionable Improvements (STAR Method)</span>
              </h3>
              
              <ul className="space-y-3">
                {resume.suggestedImprovements.map((imp, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing skills descriptor */}
            <div className={`p-6 rounded-3xl border ${
              darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
            }`}>
              <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" />
                <span>Missing Stacks & Keywords Detected</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resume.missingSkills.map((skill, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${
                      darkMode ? "bg-[#0f172a] border-white/5 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Keyword density optimization analytics table */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
          }`}>
            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-indigo-500" />
              <span>ATS Keyword Density Analysis</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Keyword descriptor</th>
                    <th className="pb-3 text-center">Measured Density</th>
                    <th className="pb-3 text-center">Recommended Threshold</th>
                    <th className="pb-3 text-right pr-2">Optimization Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {resume.keywordOptimization.map((opt, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 pl-2 font-semibold text-slate-750 dark:text-slate-200">{opt.keyword}</td>
                      <td className="py-3 text-center font-mono">{opt.density}</td>
                      <td className="py-3 text-center text-slate-400">1.0% - 2.5%</td>
                      <td className="py-3 text-right pr-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          opt.status === "Optimized" 
                            ? "bg-emerald-500/10 text-emerald-500"
                            : opt.status === "Missing"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {opt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </motion.div>
      )}

    </div>
  );
}
