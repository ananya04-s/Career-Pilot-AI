import { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  Globe, 
  Award, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  TrendingUp,
  Cpu,
  Trophy,
  ExternalLink,
  Edit2
} from "lucide-react";
import { UserProfile, JobApplication, SkillItem, CertificationItem, ResumeAnalysis } from "../types";

interface UserProfileViewProps {
  user: UserProfile | null;
  jobs: JobApplication[];
  skills: SkillItem[];
  certs: CertificationItem[];
  resume: ResumeAnalysis | null;
  darkMode: boolean;
  onOpenAuth?: () => void;
}

export default function UserProfileView({
  user,
  jobs,
  skills,
  certs,
  resume,
  darkMode,
  onOpenAuth
}: UserProfileViewProps) {
  
  // Composite calculated achievements
  const expertSkills = skills.filter(s => s.level === "Expert");
  const completedCerts = certs.filter(c => c.status === "Completed");
  const offersCount = jobs.filter(j => j.status === "Offer Received").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-display text-xs sm:text-sm">
      {/* Profile Header Card */}
      <div className={`rounded-3xl overflow-hidden border shadow-sm relative ${
        darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
      }`}>
        {/* Banner with modern Royal Blue / Emerald gradient */}
        <div className="h-40 bg-gradient-to-r from-[#2563EB] via-indigo-600 to-[#10B981] relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          <div className="absolute top-4 right-4 flex gap-2">
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-xs flex items-center space-x-1.5 hover:bg-white/25 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details overlap */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 z-10">
          <img
            src={user?.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
            alt={user?.name || "Ananya"}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-950 shadow-xl shrink-0"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white leading-none">
                {user?.name || "Ananya Sukesh"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider">
                Nit Graduate
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold flex items-center">
              <Briefcase className="w-4 h-4 mr-1 text-[#2563EB]" />
              {user?.targetRole || "Full Stack Engineer"}
            </p>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {user?.bio || "Dedicated development engineer focused on building highly responsive viewports, clean room structures, and optimized backend Express REST controllers."}
            </p>

            {/* Social Anchor points */}
            <div className="flex flex-wrap gap-3 pt-2 text-slate-400">
              <a href="https://github.com/ananya" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-[#2563EB] transition-colors">
                <Github className="w-4 h-4" />
                <span className="font-semibold text-[11px]">github.com/ananya</span>
              </a>
              <a href="https://linkedin.com/in/ananya" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-[#2563EB] transition-colors">
                <Linkedin className="w-4 h-4" />
                <span className="font-semibold text-[11px]">linkedin.com/ananya</span>
              </a>
              <a href="https://ananya.dev" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-[#2563EB] transition-colors">
                <Globe className="w-4 h-4" />
                <span className="font-semibold text-[11px]">ananya.dev</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Work Experience */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          }`}>
            <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-[#2563EB]" />
              <span>Professional Milestones</span>
            </h3>

            <div className="space-y-4">
              <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800">
                <div className="absolute -left-1.5 top-1 w-3 h-3 bg-[#2563EB] rounded-full" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">May 2025 - Present</span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white block mt-1">Full Stack Engineer Intern</strong>
                <span className="text-xs text-[#2563EB] block font-medium">Stripe, Inc. • San Francisco, CA</span>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Architected the primary merchant billing dashboard with concurrent state rendering loops, reducing viewport loading bottlenecks by 42%. Managed secure Express REST controllers.
                </p>
              </div>

              <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 opacity-60">
                <div className="absolute -left-1.5 top-1 w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">December 2024 - April 2025</span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white block mt-1">Associate Software Developer</strong>
                <span className="text-xs text-[#2563EB] block font-medium">NIT Open Source Lab</span>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Optimized relational SQL schemas, configured continuous integration (CI) environments with secure Docker images, and authored documentation.
                </p>
              </div>
            </div>
          </div>

          {/* Education & Portfolio Projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Education */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
            }`}>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#10B981]" />
                <span>Education Background</span>
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">NIT CALICUT (GPA: 3.9/4.0)</span>
                  <strong className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block">B.Tech in Computer Science</strong>
                  <span className="text-[11px] text-slate-500 block">Class of 2022 - 2026 • Graduating Senior</span>
                </div>
              </div>
            </div>

            {/* Portfolio Project */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
            }`}>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-orange-500" />
                <span>Active Core Portfolio</span>
              </h3>

              <div className="space-y-1">
                <span className="text-[10px] text-orange-500 font-bold block uppercase tracking-wider">CAREERPILOT CO-PILOT APP</span>
                <strong className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white block">ATS Resume Builder & Academy</strong>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Modular Vite SPA incorporating speech practicing simulators, ATS audits, and cert templates.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right column (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Resume and Credentials stats */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              ATS COMPATIBILITY AUDIT
            </span>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#2563EB] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">ATS COMPATIBLE RESUME</span>
                <strong className="text-xs sm:text-sm text-slate-800 dark:text-white block">
                  {resume ? `${resume.score}% Compatibility` : "88% Score Approved"}
                </strong>
              </div>
            </div>
          </div>

          {/* Claimed Badges and Certifications */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              ACADEMIC CERTIFICATIONS CLAIMED
            </span>

            <div className="space-y-2.5">
              {certs.length > 0 ? (
                certs.map((c) => (
                  <div key={c.id} className="flex items-start space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="text-xs font-bold text-slate-800 dark:text-white block truncate">{c.name}</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Verified by {c.issuer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs font-bold text-slate-800 dark:text-white block truncate">Android Native Kotlin & Compose Cert</strong>
                    <p className="text-[10px] text-slate-400 mt-0.5">Verified by Google Partner</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills Checklist */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          } space-y-4`}>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              TECHNICAL SKILLS & PROFICIENCY
            </span>

            <div className="flex flex-wrap gap-1.5">
              {skills.length > 0 ? (
                skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/15 rounded text-[11px] font-bold text-[#2563EB]"
                  >
                    {s.name} • {s.level}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/15 rounded text-[11px] font-bold text-[#2563EB]">React • Expert</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/15 rounded text-[11px] font-bold text-emerald-500">TypeScript • Expert</span>
                  <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/15 rounded text-[11px] font-bold text-orange-500">Node.js • Expert</span>
                  <span className="px-2.5 py-0.5 bg-slate-500/10 border border-slate-500/15 rounded text-[11px] font-bold text-slate-500">GCP • Intermediate</span>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
