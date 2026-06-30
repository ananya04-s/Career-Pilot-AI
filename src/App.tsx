import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import Dashboard from "./components/Dashboard";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import JobTracker from "./components/JobTracker";
import SkillTracker from "./components/SkillTracker";
import InterviewPrep from "./components/InterviewPrep";
import Certifications from "./components/Certifications";
import CareerCoach from "./components/CareerCoach";
import LinkedInSyncModal from "./components/LinkedInSyncModal";

// Premium newly designed components
import SplashIntro from "./components/SplashIntro";
import AuthScreen from "./components/AuthScreen";
import ResumeBuilder from "./components/ResumeBuilder";
import CompanyExplorer from "./components/CompanyExplorer";
import SkillLearning from "./components/SkillLearning";
import CommunityFeed from "./components/CommunityFeed";
import NotificationsTimeline from "./components/NotificationsTimeline";
import UserProfileView from "./components/UserProfileView";
import SettingsPanel from "./components/SettingsPanel";
import CareerRoadmap from "./components/CareerRoadmap";

import { 
  UserProfile, 
  JobApplication, 
  SkillItem, 
  CertificationItem, 
  ResumeAnalysis 
} from "./types";
import { Compass, Sparkles } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [linkedInSyncOpen, setLinkedInSyncOpen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Core authenticated states
  const [email, setEmail] = useState<string>("sukeshananya@gmail.com"); // Prepopulated premium graduate defaults!
  const [user, setUser] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [resume, setResume] = useState<ResumeAnalysis | null>(null);

  // Global loaders
  const [appLoading, setAppLoading] = useState<boolean>(true);

  // Initialize and load user data on boot or email transition
  useEffect(() => {
    if (email) {
      loadAllUserData(email);
    } else {
      setUser(null);
      setJobs([]);
      setSkills([]);
      setCerts([]);
      setResume(null);
      setAppLoading(false);
    }
  }, [email]);

  // Handle dark mode DOM toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const loadAllUserData = async (userEmail: string) => {
    setAppLoading(true);
    try {
      // 1. Load Profile
      const profileRes = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
      }

      // 2. Load Jobs
      const jobsRes = await fetch(`/api/jobs?email=${encodeURIComponent(userEmail)}`);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      // 3. Load Skills
      const skillsRes = await fetch(`/api/skills?email=${encodeURIComponent(userEmail)}`);
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(skillsData);
      }

      // 4. Load Certs
      const certsRes = await fetch(`/api/certs?email=${encodeURIComponent(userEmail)}`);
      if (certsRes.ok) {
        const certsData = await certsRes.json();
        setCerts(certsData);
      }

      // 5. Load Resume Analysis
      const resumeRes = await fetch(`/api/resume?email=${encodeURIComponent(userEmail)}`);
      if (resumeRes.ok) {
        const resumeData = await resumeRes.json();
        setResume(resumeData);
      }

    } catch (err) {
      console.error("Failed to load user records:", err);
    } finally {
      setAppLoading(false);
    }
  };

  // Auth Operations
  const handleLogin = async (userEmail: string): Promise<UserProfile> => {
    const response = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
    if (!response.ok) throw new Error("Authentication failed");
    const profile = await response.json();
    setEmail(userEmail);
    setUser(profile);
    return profile;
  };

  const handleLogout = () => {
    setEmail("");
    setUser(null);
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!email) return;
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...data })
    });
    if (response.ok) {
      const updated = await response.json();
      setUser(updated);
    }
  };

  // Reset database entirely to default premium sets
  const handleResetDb = async () => {
    const response = await fetch("/api/reset-db", { method: "POST" });
    if (response.ok) {
      // Reload entire state
      await loadAllUserData(email);
    }
  };

  // Job Operations
  const handleAddJob = async (jobData: any) => {
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...jobData })
    });
    const result = await response.json();
    if (response.ok) {
      setJobs(prev => [result.job, ...prev]);
      if (result.gamification?.user) {
        setUser(result.gamification.user);
      }
    }
    return result;
  };

  const handleUpdateJob = async (id: string, jobData: any) => {
    const response = await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...jobData })
    });
    const result = await response.json();
    if (response.ok) {
      setJobs(prev => prev.map(j => j.id === id ? result.job : j));
      if (result.gamification?.user) {
        setUser(result.gamification.user);
      }
    }
    return result;
  };

  const handleDeleteJob = async (id: string) => {
    const response = await fetch(`/api/jobs/${id}?email=${encodeURIComponent(email)}`, {
      method: "DELETE"
    });
    if (response.ok) {
      setJobs(prev => prev.filter(j => j.id !== id));
    }
  };

  // Skill Operations
  const handleAddSkill = async (skillData: any) => {
    const response = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...skillData })
    });
    const result = await response.json();
    if (response.ok) {
      setSkills(prev => [result.skill, ...prev]);
      if (result.gamification?.user) {
        setUser(result.gamification.user);
      }
    }
    return result;
  };

  const handleDeleteSkill = async (id: string) => {
    const response = await fetch(`/api/skills/${id}?email=${encodeURIComponent(email)}`, {
      method: "DELETE"
    });
    if (response.ok) {
      setSkills(prev => prev.filter(s => s.id !== id));
    }
  };

  // Cert Operations
  const handleAddCert = async (certData: any) => {
    const response = await fetch("/api/certs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...certData })
    });
    const result = await response.json();
    if (response.ok) {
      setCerts(prev => [result.cert, ...prev]);
      if (result.gamification?.user) {
        setUser(result.gamification.user);
      }
    }
    return result;
  };

  const handleDeleteCert = async (id: string) => {
    const response = await fetch(`/api/certs/${id}?email=${encodeURIComponent(email)}`, {
      method: "DELETE"
    });
    if (response.ok) {
      setCerts(prev => prev.filter(c => c.id !== id));
    }
  };

  // Resume Analyzer Trigger
  const handleAnalyzeResume = async (fileName: string, text: string) => {
    const response = await fetch("/api/resume-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fileName, text })
    });
    const result = await response.json();
    if (response.ok) {
      setResume(result.analysis);
      if (result.gamification?.user) {
        setUser(result.gamification.user);
      }
    }
    return result;
  };

  // Interview Evaluation Trigger
  const handleEvaluateInterview = async (questionId: string, questionText: string, userAnswer: string, category: string) => {
    const response = await fetch("/api/interview-prep/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, questionId, questionText, userAnswer, category })
    });
    const result = await response.json();
    if (response.ok) {
      if (result.gamification?.user) {
        setUser(result.gamification.user);
      }
    }
    return result;
  };

  // Render tabs conditionally
  const renderTabContent = () => {
    if (!email) {
      return (
        <AuthScreen 
          onLoginSuccess={(em) => setEmail(em)} 
          darkMode={darkMode} 
        />
      );
    }

    switch (currentTab) {
      case "dashboard":
        return (
          <Dashboard 
            user={user}
            jobs={jobs}
            resume={resume}
            skills={skills}
            certs={certs}
            setCurrentTab={setCurrentTab}
            darkMode={darkMode}
            onOpenLinkedInSync={() => setLinkedInSyncOpen(true)}
          />
        );
      case "resume":
        return (
          <ResumeBuilder 
            user={user}
            darkMode={darkMode}
            onAnalyze={handleAnalyzeResume}
          />
        );
      case "jobs":
        return (
          <CompanyExplorer 
            user={user}
            darkMode={darkMode}
            onAddJob={handleAddJob}
          />
        );
      case "roadmap":
        return (
          <CareerRoadmap 
            user={user}
            skills={skills}
            certs={certs}
            darkMode={darkMode}
            onAddSkill={handleAddSkill}
            onAddCert={handleAddCert}
            onUpdateProfile={handleUpdateProfile}
            onRefreshProfile={() => email && loadAllUserData(email)}
          />
        );
      case "skills":
        return (
          <SkillLearning 
            user={user}
            darkMode={darkMode}
            onUpdateProfile={handleUpdateProfile}
            onAddCert={handleAddCert}
          />
        );
      case "interview":
        return (
          <InterviewPrep 
            user={user}
            onEvaluate={handleEvaluateInterview}
            darkMode={darkMode}
          />
        );
      case "community":
        return (
          <CommunityFeed 
            user={user}
            darkMode={darkMode}
          />
        );
      case "notifications":
        return (
          <NotificationsTimeline 
            darkMode={darkMode}
          />
        );
      case "profile":
        return (
          <UserProfileView 
            user={user}
            jobs={jobs}
            skills={skills}
            certs={certs}
            resume={resume}
            darkMode={darkMode}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        );
      case "settings":
        return (
          <SettingsPanel 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  if (showSplash) {
    return <SplashIntro onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${
      darkMode ? "bg-[#020617] text-slate-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Decorative top-corner light glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-gradient-to-br from-emerald-500/10 via-teal-500/0 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-gradient-to-br from-indigo-500/10 via-teal-500/0 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Navigation Header */}
      <Header 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Page Body Wrap */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {appLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500 animate-spin" />
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Calibrating CareerPilot flight instruments...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Auth / Profile Modal popup */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onUpdateProfile={handleUpdateProfile}
        onResetDb={handleResetDb}
        darkMode={darkMode}
      />

      {/* LinkedIn Simulated OAuth & Sync Modal */}
      <LinkedInSyncModal
        isOpen={linkedInSyncOpen}
        onClose={() => setLinkedInSyncOpen(false)}
        userEmail={email}
        onSyncComplete={() => {
          if (email) {
            loadAllUserData(email);
          }
        }}
        darkMode={darkMode}
      />
    </div>
  );
}
