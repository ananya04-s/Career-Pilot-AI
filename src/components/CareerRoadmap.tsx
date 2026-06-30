import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Map, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Lock, 
  Award, 
  ArrowRight, 
  Plus, 
  Search, 
  Compass, 
  TrendingUp, 
  ExternalLink, 
  Check, 
  HelpCircle,
  AlertCircle,
  Zap,
  Briefcase
} from "lucide-react";
import { UserProfile, SkillItem, CertificationItem } from "../types";

interface CareerRoadmapProps {
  user: UserProfile | null;
  skills: SkillItem[];
  certs: CertificationItem[];
  darkMode: boolean;
  onAddSkill: (skillData: { name: string; level: 'Beginner' | 'Intermediate' | 'Expert' }) => Promise<any>;
  onAddCert: (certData: { name: string; issuer: string; status: 'Completed' | 'In Progress' | 'Planned' }) => Promise<any>;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<any>;
  onRefreshProfile?: () => void;
}

interface RoadmapStage {
  id: string;
  stageName: string;
  title: string;
  description: string;
  skills: { name: string; requiredLevel: 'Beginner' | 'Intermediate' | 'Expert' }[];
  actionItems: { id: string; title: string; completed: boolean }[];
  resources: { title: string; provider: string; url?: string; type: 'Course' | 'Cert' | 'Article' }[];
  mentorTip: string;
}

const PRESET_ROLES = [
  "Full Stack Engineer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Mobile App Developer",
  "Product Manager"
];

const PRESET_LEVELS = [
  "Junior / Associate",
  "Mid-level",
  "Senior",
  "Lead / Architect"
];

// Rich fallback roadmaps based on role and level
const DEFAULT_ROADMAP_TEMPLATES: Record<string, RoadmapStage[]> = {
  "Full Stack Engineer": [
    {
      id: "fs-1",
      stageName: "Stage 1: Web Foundations",
      title: "Core Client-Side & Styling",
      description: "Master modern semantic HTML, advanced CSS layout systems (Flexbox, Grid), responsive principles, and basic modern ES6+ Javascript.",
      skills: [
        { name: "React", requiredLevel: "Beginner" },
        { name: "TypeScript", requiredLevel: "Beginner" },
        { name: "CSS Grid", requiredLevel: "Intermediate" }
      ],
      actionItems: [
        { id: "fs-1-a1", title: "Build an interactive, fully responsive personal landing page", completed: false },
        { id: "fs-1-a2", title: "Implement a deep modern API connection using standard Fetch and async/await", completed: false },
        { id: "fs-1-a3", title: "Practice styling standard layouts without standard component libraries", completed: false }
      ],
      resources: [
        { title: "HTML and CSS: Design and Build Websites", provider: "Wiley Publishing", type: "Article" },
        { title: "Responsive Web Design Certification", provider: "freeCodeCamp", type: "Course" }
      ],
      mentorTip: "Don't rush to framework learning. Mastery of standard Javascript and CSS selectors will save you countless hours of troubleshooting later."
    },
    {
      id: "fs-2",
      stageName: "Stage 2: Core Engineering & Systems",
      title: "State Management & Server Integration",
      description: "Step into structural routing, React hook optimizations, robust forms, server-side interactions, and basic database queries.",
      skills: [
        { name: "React", requiredLevel: "Intermediate" },
        { name: "Node.js", requiredLevel: "Beginner" },
        { name: "PostgreSQL", requiredLevel: "Beginner" }
      ],
      actionItems: [
        { id: "fs-2-a1", title: "Design a full REST API with Express hosting multiple relational tables", completed: false },
        { id: "fs-2-a2", title: "Optimize expensive React state triggers using useMemo, useCallback", completed: false },
        { id: "fs-2-a3", title: "Implement basic JWT auth flow with local token encryption", completed: false }
      ],
      resources: [
        { title: "Node.js Complete Guide", provider: "Maximilian Schwarzmüller", type: "Course" },
        { title: "Relational Database Masterclass", provider: "Coursera", type: "Course" }
      ],
      mentorTip: "Always profile your React re-renders. Avoid storing large structured raw arrays in general state if only simple ID tracking is needed."
    },
    {
      id: "fs-3",
      stageName: "Stage 3: Enterprise Integration",
      title: "Caching, Queues & Middleware",
      description: "Optimize server execution with in-memory caching layers (Redis), structured state stores (Zustand/Redux), background tasks, and Docker orchestration.",
      skills: [
        { name: "TypeScript", requiredLevel: "Expert" },
        { name: "Docker / Containerization", requiredLevel: "Intermediate" },
        { name: "Redis / Caching Layer", requiredLevel: "Beginner" }
      ],
      actionItems: [
        { id: "fs-3-a1", title: "Dockerize a local multi-container development sandbox using Compose", completed: false },
        { id: "fs-3-a2", title: "Set up a standard queue processor to handle background emails or uploads", completed: false },
        { id: "fs-3-a3", title: "Optimize slow SQL read endpoints with Redis cache triggers", completed: false }
      ],
      resources: [
        { title: "Docker & Kubernetes: The Complete Guide", provider: "Stephen Grider", type: "Course" },
        { title: "Redis University: RU101 Basics", provider: "Redis Labs", type: "Cert" }
      ],
      mentorTip: "At this stage, you should think about scalability. A junior coder builds features; an enterprise full stack engineer builds systems that survive spikes."
    },
    {
      id: "fs-4",
      stageName: "Stage 4: Cloud Native Operations",
      title: "CI/CD & Cloud Scale deployments",
      description: "Deliver highly reliable software with fully automated CI/CD suites (GitHub Actions), infrastructure-as-code, and serverless hosting platforms.",
      skills: [
        { name: "CI/CD Pipelines (GitHub Actions)", requiredLevel: "Intermediate" },
        { name: "Cloud Native Architecture", requiredLevel: "Intermediate" },
        { name: "GraphQL / Apollo Client", requiredLevel: "Intermediate" }
      ],
      actionItems: [
        { id: "fs-4-a1", title: "Write a linting, formatting, and unit-testing GitHub Actions workflow", completed: false },
        { id: "fs-4-a2", title: "Deploy a highly modular backend to production with automatic rolling releases", completed: false },
        { id: "fs-4-a3", title: "Write a high-performance GraphQL schema supporting real-time mutations", completed: false }
      ],
      resources: [
        { title: "AWS Certified Developer Associate", provider: "Amazon Web Services", type: "Cert" },
        { title: "Continuous Delivery and DevOps Patterns", provider: "University of Virginia", type: "Course" }
      ],
      mentorTip: "Keep production immutable. If a manual environment login is required to fix a deployment, your deployment system is lacking."
    }
  ],
  "Frontend Developer": [
    {
      id: "fe-1",
      stageName: "Stage 1: Client Core",
      title: "HTML, CSS, JavaScript basics",
      description: "Command complete web standards: markup semantics, flexbox/grids, transitions, and DOM events.",
      skills: [
        { name: "React", requiredLevel: "Beginner" },
        { name: "CSS Grid", requiredLevel: "Beginner" }
      ],
      actionItems: [
        { id: "fe-1-a1", title: "Build a responsive grid-based portfolio", completed: false },
        { id: "fe-1-a2", title: "Code a pixel-perfect page clone using pure CSS layouts", completed: false }
      ],
      resources: [
        { title: "JavaScript Info", provider: "Modern JS Tutorial", type: "Article" }
      ],
      mentorTip: "Do not use utility libraries until you understand how positioning, document flows, and margin collapses operate."
    },
    {
      id: "fe-2",
      stageName: "Stage 2: Advanced React & State",
      title: "Component Orchestration",
      description: "Learn custom hooks, memoization, structural context APIs, and type-safe components using TypeScript.",
      skills: [
        { name: "React", requiredLevel: "Intermediate" },
        { name: "TypeScript", requiredLevel: "Intermediate" }
      ],
      actionItems: [
        { id: "fe-2-a1", title: "Convert a vanilla JS web app into strong, typed TypeScript", completed: false },
        { id: "fe-2-a2", title: "Implement global dark/light state across dozens of nested components", completed: false }
      ],
      resources: [
        { title: "TypeScript Deep Dive", provider: "Basarat Ali", type: "Article" }
      ],
      mentorTip: "TypeScript is your friend, not an obstacle. Let the compiler help you design stronger interfaces."
    },
    {
      id: "fe-3",
      stageName: "Stage 3: State & GraphQL Scale",
      title: "Large Scale App Architectures",
      description: "Manage global state via stores (Zustand/Redux), work with federated GraphQL graphs, and implement rich animation engines.",
      skills: [
        { name: "TypeScript", requiredLevel: "Expert" },
        { name: "GraphQL / Apollo Client", requiredLevel: "Intermediate" }
      ],
      actionItems: [
        { id: "fe-3-a1", title: "Optimize rendering by isolating dynamic inputs inside Zustand stores", completed: false },
        { id: "fe-3-a2", title: "Code an interactive graph interface using framer-motion layout animations", completed: false }
      ],
      resources: [
        { title: "Zustand State Guide", provider: "Zustand Docs", type: "Article" }
      ],
      mentorTip: "Keep states close to where they are used. Moving everything to global state creates unnecessary complex rerenders."
    }
  ]
};

// Generic generator for other roles
const generateGenericRoadmap = (role: string, level: string): RoadmapStage[] => {
  return [
    {
      id: "gen-1",
      stageName: "Stage 1: Core Foundations",
      title: `${role} Entry Basics`,
      description: `Understand the core principles, syntax, toolsets, and standards required for a successful ${level} career.`,
      skills: [
        { name: "React", requiredLevel: "Beginner" },
        { name: "TypeScript", requiredLevel: "Beginner" }
      ],
      actionItems: [
        { id: "gen-1-a1", title: `Initialize basic portfolio matching standard ${role} templates`, completed: false },
        { id: "gen-1-a2", title: "Document technical processes inside an organized README.md file", completed: false }
      ],
      resources: [
        { title: `Introduction to modern ${role} setups`, provider: "Developer Roadmaps", type: "Course" }
      ],
      mentorTip: "Mastering the basic toolsets (git, code editors, command line syntax) early makes learning advanced patterns a breeze."
    },
    {
      id: "gen-2",
      stageName: "Stage 2: Core Engineering",
      title: "Systems, Security & Integration",
      description: `Learn how to connect structures, write API controllers, and format secure outputs within ${role}.`,
      skills: [
        { name: "Python", requiredLevel: "Intermediate" }
      ],
      actionItems: [
        { id: "gen-2-a1", title: "Integrate multiple async routines to automate batch file processing", completed: false },
        { id: "gen-2-a2", title: "Set up test coverage checking at least 80% of core function pathways", completed: false }
      ],
      resources: [
        { title: `Modern Systems & Database Design`, provider: "Coursera", type: "Course" }
      ],
      mentorTip: "Don't just write functional code. Plan edge cases, error handlers, and log warnings for diagnostic tracking."
    },
    {
      id: "gen-3",
      stageName: "Stage 3: Optimization & Deployments",
      title: "Advanced Deployments & Scale",
      description: `Prepare systems for public use. Build testing sequences, set up CI/CD workflows, and containerize runtimes.`,
      skills: [
        { name: "Docker / Containerization", requiredLevel: "Intermediate" },
        { name: "CI/CD Pipelines (GitHub Actions)", requiredLevel: "Intermediate" }
      ],
      actionItems: [
        { id: "gen-3-a1", title: "Construct automated release pipelines using standard git hooks", completed: false },
        { id: "gen-3-a2", title: "Measure latency metrics on remote servers and optimize memory leakages", completed: false }
      ],
      resources: [
        { title: `Ultimate Docker and Kubernetes Pipelines`, provider: "Udemy", type: "Course" }
      ],
      mentorTip: "Optimize after measuring. Avoid micro-optimizations on modules that are not running on your primary hot paths."
    }
  ];
};

// Animation Variants for dynamic timeline elements
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 140, 
      damping: 18 
    } 
  }
};

const childGridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 160, 
      damping: 20 
    } 
  }
};

export default function CareerRoadmap({
  user,
  skills,
  certs,
  darkMode,
  onAddSkill,
  onAddCert,
  onUpdateProfile,
  onRefreshProfile,
}: CareerRoadmapProps) {
  // Config States
  const [selectedRole, setSelectedRole] = useState<string>(user?.targetRole || "Full Stack Engineer");
  const [selectedLevel, setSelectedLevel] = useState<string>(user?.experienceLevel || "Junior / Associate");
  
  // Roadmap Data
  const [roadmap, setRoadmap] = useState<RoadmapStage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStageId, setActiveStageId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Custom states
  const [newSkillInput, setNewSkillInput] = useState<string>("");
  const [actionItemCompletion, setActionItemCompletion] = useState<Record<string, boolean>>({});
  const [xpRewardToast, setXpRewardToast] = useState<{ show: boolean; amount: number; reason: string } | null>(null);

  // Initialize Roadmap
  useEffect(() => {
    // Attempt load from preset templates
    let stages = DEFAULT_ROADMAP_TEMPLATES[selectedRole];
    if (!stages) {
      stages = generateGenericRoadmap(selectedRole, selectedLevel);
    }
    
    // De-duplicate actions to ensure keys exist, restore completion from localStorage if exists
    const stored = localStorage.getItem(`roadmap_completions_${user?.uid || "default"}_${selectedRole}`);
    if (stored) {
      try {
        setActionItemCompletion(JSON.parse(stored));
      } catch (e) {
        setActionItemCompletion({});
      }
    } else {
      setActionItemCompletion({});
    }

    setRoadmap(stages);
    if (stages.length > 0) {
      setActiveStageId(stages[0].id);
    }
  }, [selectedRole, selectedLevel, user?.uid]);

  // Save completions to localStorage
  const handleToggleActionItem = async (itemId: string, itemTitle: string) => {
    const nextState = { ...actionItemCompletion, [itemId]: !actionItemCompletion[itemId] };
    setActionItemCompletion(nextState);
    localStorage.setItem(`roadmap_completions_${user?.uid || "default"}_${selectedRole}`, JSON.stringify(nextState));

    // Award XP if completed!
    if (!actionItemCompletion[itemId]) {
      // Award XP
      try {
        const response = await fetch("/api/profile/award-xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user?.email || "sukeshananya@gmail.com",
            amount: 25,
            reason: `Milestone: ${itemTitle}`
          })
        });
        
        if (response.ok) {
          const resData = await response.json();
          // Trigger visual notification
          setXpRewardToast({ show: true, amount: 25, reason: itemTitle });
          setTimeout(() => setXpRewardToast(null), 4000);
          
          if (onRefreshProfile) {
            onRefreshProfile();
          }
        }
      } catch (e) {
        console.error("Failed to award XP:", e);
      }
    }
  };

  // Generate / Personalize using AI
  const handleAIGenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          level: selectedLevel,
          currentSkills: skills.map(s => s.name),
          email: user?.email || "sukeshananya@gmail.com"
        })
      });

      if (!response.ok) {
        throw new Error("Server failed to generate career path.");
      }

      const data = await response.json();
      if (data && Array.isArray(data.roadmap)) {
        setRoadmap(data.roadmap);
        if (data.roadmap.length > 0) {
          setActiveStageId(data.roadmap[0].id);
        }
        
        // Update user profile target role & level if they differ
        await onUpdateProfile({
          targetRole: selectedRole,
          experienceLevel: selectedLevel
        });

        // Trigger visual success notification
        setXpRewardToast({ show: true, amount: 150, reason: `AI Career Roadmap generated for ${selectedRole}!` });
        setTimeout(() => setXpRewardToast(null), 4000);
        
        if (onRefreshProfile) {
          onRefreshProfile();
        }
      } else {
        throw new Error("Malformed roadmap response received.");
      }
    } catch (err: any) {
      console.warn("API Roadmap Generation fallback triggered:", err);
      setErrorMsg("We could not establish custom neural pipelines. Loaded our premium, industry-vetted master track templates instead.");
      
      // Fallback
      let stages = DEFAULT_ROADMAP_TEMPLATES[selectedRole];
      if (!stages) {
        stages = generateGenericRoadmap(selectedRole, selectedLevel);
      }
      setRoadmap(stages);
      if (stages.length > 0) {
        setActiveStageId(stages[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if user has a skill
  const checkUserHasSkill = (skillName: string) => {
    return skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
  };

  // Helper to add missing skill on-the-fly
  const handleQuickAddSkill = async (skillName: string) => {
    try {
      const added = await onAddSkill({ name: skillName, level: "Beginner" });
      setXpRewardToast({ show: true, amount: 80, reason: `Learned Skill: ${skillName}` });
      setTimeout(() => setXpRewardToast(null), 4000);
      
      if (onRefreshProfile) {
        onRefreshProfile();
      }
    } catch (err) {
      console.error("Failed to add skill:", err);
    }
  };

  // Quick add certification
  const handleQuickAddCert = async (certName: string, provider: string) => {
    try {
      await onAddCert({
        name: certName,
        issuer: provider as any || "Other",
        status: "Planned"
      });
      setXpRewardToast({ show: true, amount: 50, reason: `Planned Academy Track: ${certName}` });
      setTimeout(() => setXpRewardToast(null), 4000);
      
      if (onRefreshProfile) {
        onRefreshProfile();
      }
    } catch (err) {
      console.error("Failed to add cert:", err);
    }
  };

  // Calculate matching stats
  const calculateStageStats = (stage: RoadmapStage) => {
    const totalSkills = stage.skills.length;
    const userSkillsMatched = stage.skills.filter(s => checkUserHasSkill(s.name)).length;
    const progressPercent = totalSkills > 0 ? Math.round((userSkillsMatched / totalSkills) * 100) : 100;
    
    // Action tasks progress
    const totalActions = stage.actionItems.length;
    const completedActions = stage.actionItems.filter(item => actionItemCompletion[item.id]).length;
    
    return {
      totalSkills,
      userSkillsMatched,
      progressPercent,
      totalActions,
      completedActions,
      status: progressPercent === 100 ? "Completed" : (progressPercent > 0 || completedActions > 0 ? "In Progress" : "Locked")
    };
  };

  // Find active stage
  const activeStage = roadmap.find(s => s.id === activeStageId) || roadmap[0];
  const activeStageStats = activeStage ? calculateStageStats(activeStage) : null;

  // Overall Match score
  const getOverallProgress = () => {
    if (roadmap.length === 0) return 0;
    const allSkills = roadmap.flatMap(s => s.skills.map(sk => sk.name));
    const uniqueSkills = Array.from(new Set(allSkills));
    if (uniqueSkills.length === 0) return 0;
    
    const matched = uniqueSkills.filter((sk: string) => checkUserHasSkill(sk));
    return Math.round((matched.length / uniqueSkills.length) * 100);
  };

  const overallProgress = getOverallProgress();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
      id="career-roadmap-root"
    >
      {/* Toast Notification for XP Rewards */}
      <AnimatePresence>
        {xpRewardToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center space-x-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 p-4 rounded-2xl shadow-xl text-white border border-white/20"
            id="xp-reward-toast"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 animate-bounce">
              <Zap className="w-5 h-5 text-yellow-300 fill-current" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold tracking-wider text-emerald-100 uppercase">REWARD UNLOCKED</p>
              <h4 className="text-sm font-bold text-white leading-tight">+{xpRewardToast.amount} XP AWarded!</h4>
              <p className="text-[11px] text-white/85 truncate max-w-[200px]">{xpRewardToast.reason}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-indigo-950/20 p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
            <Map className="w-3.5 h-3.5" />
            <span>Interactive Navigation Path</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
            AI Career Roadmap
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Navigate your growth path step-by-step. Identify skill deficits, check off critical project milestones, sync academy modules, and climb levels toward your target career roles.
          </p>
        </div>

        <div className="shrink-0 flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-950 border border-white/10">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-slate-800 fill-none"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-emerald-400 fill-none transition-all duration-1000"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - overallProgress / 100)}`}
              />
            </svg>
            <span className="text-sm font-mono font-bold text-white">{overallProgress}%</span>
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">Skill Alignment</span>
            <span className="text-sm font-bold text-slate-200 block">{selectedRole}</span>
            <span className="text-xs font-semibold text-emerald-400">{selectedLevel}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Config, Right Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="roadmap-main-grid">
        
        {/* Left Side: Pathfinder Customizer */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 rounded-3xl border border-white/5 p-6 space-y-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-mono tracking-wider uppercase text-emerald-400 flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Pilot Settings</span>
            </h3>

            {/* Target Role Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Target Job Role</label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-xs text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer appearance-none"
                  id="target-role-select"
                >
                  {PRESET_ROLES.map(role => (
                    <option key={role} value={role} className="bg-slate-950 text-slate-200">{role}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Target Level Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Experience Depth</label>
              <div className="grid grid-cols-2 gap-2" id="experience-depth-grid">
                {PRESET_LEVELS.map(lvl => {
                  const isSel = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3 py-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                        isSel 
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5"
                          : "bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Generator Button */}
            <div className="pt-2">
              <button
                onClick={handleAIGenerate}
                disabled={loading}
                className="w-full relative overflow-hidden flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white text-xs font-bold transition-all duration-300 shadow-md shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
                id="ai-generate-roadmap-btn"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Synthesizing Paths...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Personalize Path with Gemini</span>
                  </>
                )}
              </button>
              {errorMsg && (
                <p className="mt-3 text-[10px] text-amber-400/95 leading-relaxed bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>
          </div>

          {/* Current Skills Alignment */}
          <div className="bg-slate-900/60 rounded-3xl border border-white/5 p-6 space-y-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono tracking-wider uppercase text-emerald-400 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>My Active Skills</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded-full">
                {skills.length} skills
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Toggling or adding your skills dynamically synchronizes and validates matching checkpoints inside the roadmap timeline.
            </p>

            {/* Quick Skill Add Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, GraphQL)"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && newSkillInput.trim() && (handleQuickAddSkill(newSkillInput.trim()), setNewSkillInput(""))}
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 transition-colors"
                id="quick-skill-input"
              />
              <button
                onClick={() => {
                  if (newSkillInput.trim()) {
                    handleQuickAddSkill(newSkillInput.trim());
                    setNewSkillInput("");
                  }
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1" id="active-skills-chips">
              {skills.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2">No skills registered. Type above to add.</div>
              ) : (
                skills.map(sk => (
                  <div
                    key={sk.id}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono"
                  >
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{sk.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Graphical Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/60 rounded-3xl border border-white/5 p-6 shadow-xl backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Timeline Roadmap Stages</h2>
                <p className="text-xs text-slate-400 mt-0.5">Click any stage to view matching, requirements, resources, and action steps.</p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
                <span className="font-semibold text-slate-300">Interact to build XP</span>
              </div>
            </div>

            {/* Roadmap Horizontal Progression Track / Stage Navigation */}
            <motion.div 
              key={selectedRole}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex space-x-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" 
              id="horizontal-stage-track"
            >
              {roadmap.map((stage, idx) => {
                const stats = calculateStageStats(stage);
                const isActive = stage.id === activeStageId;
                
                let ringColor = "border-slate-800 text-slate-500";
                let bgColor = "bg-slate-950";
                
                if (stats.status === "Completed") {
                  ringColor = "border-emerald-500/40 text-emerald-400";
                  bgColor = "bg-emerald-500/5";
                } else if (stats.status === "In Progress") {
                  ringColor = "border-indigo-500/40 text-indigo-400";
                  bgColor = "bg-indigo-500/5";
                }
                
                return (
                  <motion.button
                    key={stage.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -3,
                      borderColor: "rgba(16, 185, 129, 0.4)",
                      boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.15)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`flex-1 min-w-[160px] text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-white/10 border-white/20 ring-2 ring-emerald-500/30" 
                        : "bg-slate-950/20 border-white/5 hover:bg-slate-950/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-extrabold text-slate-400 tracking-wider block uppercase">Step 0{idx + 1}</span>
                      {stats.status === "Completed" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : stats.status === "In Progress" ? (
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 mt-1 truncate">{stage.stageName.split(":")[1]?.trim() || stage.title}</h4>
                    
                    {/* Progress slider bar */}
                    <div className="mt-2.5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.progressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          stats.status === "Completed" ? "bg-emerald-400" : "bg-indigo-400"
                        }`}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block mt-1">{stats.userSkillsMatched}/{stats.totalSkills} skills matched</span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Active Stage Details Panel */}
            <AnimatePresence mode="wait">
              {activeStage && (
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-950/50 rounded-2xl border border-white/10 p-5 sm:p-6 space-y-6"
                  id="active-stage-panel"
                >
                  
                  {/* Title Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-xs font-mono font-extrabold text-emerald-400 tracking-widest uppercase">{activeStage.stageName}</span>
                      <h3 className="text-xl font-bold text-white mt-1">{activeStage.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">{activeStage.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 self-start sm:self-auto">
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase">Step Status</span>
                        <span className={`text-xs font-bold ${
                          activeStageStats?.status === "Completed" ? "text-emerald-400" : (activeStageStats?.status === "In Progress" ? "text-indigo-400" : "text-slate-400")
                        }`}>
                          {activeStageStats?.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Alignment Checkpoints */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400/80" />
                      <span>Required Tech & Match Analysis</span>
                    </h4>

                    <motion.div 
                      variants={childGridVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3" 
                      id="stage-skills-grid"
                    >
                      {activeStage.skills.map((skill, index) => {
                        const hasSkill = checkUserHasSkill(skill.name);
                        return (
                          <motion.div 
                            key={index}
                            variants={gridItemVariants}
                            whileHover={{ 
                              scale: 1.02, 
                              y: -2,
                              borderColor: hasSkill ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.15)",
                              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)"
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              hasSkill 
                                ? "bg-emerald-500/5 border-emerald-500/20" 
                                : "bg-slate-900/60 border-white/5"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              {hasSkill ? (
                                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="p-1 rounded-lg bg-slate-800 text-slate-500 shrink-0">
                                  <Circle className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <div>
                                <span className={`text-xs font-bold ${hasSkill ? "text-slate-200" : "text-slate-400"}`}>{skill.name}</span>
                                <span className="text-[10px] font-mono text-slate-500 block">Level: {skill.requiredLevel}</span>
                              </div>
                            </div>

                            {!hasSkill && (
                              <button
                                onClick={() => handleQuickAddSkill(skill.name)}
                                className="flex items-center space-x-1 px-2.5 py-1 text-[9px] font-bold bg-white/5 hover:bg-white/10 text-emerald-400 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>Learn</span>
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>

                  {/* Gamified Action Checklists */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-emerald-400/80" />
                        <span>Milestone Action Tasks</span>
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">+25 XP Each</span>
                    </div>

                    <motion.div 
                      variants={childGridVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-2" 
                      id="action-items-list"
                    >
                      {activeStage.actionItems.map((item) => {
                        const isCompleted = !!actionItemCompletion[item.id];
                        return (
                          <motion.div
                            key={item.id}
                            variants={gridItemVariants}
                            whileHover={{ 
                              scale: 1.01, 
                              x: 3,
                              borderColor: isCompleted ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.12)"
                            }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleToggleActionItem(item.id, item.title)}
                            className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                              isCompleted 
                                ? "bg-emerald-500/5 border-emerald-500/20 text-slate-300" 
                                : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-900/60"
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-600" />
                              )}
                            </div>
                            <span className={`text-xs font-semibold ${isCompleted ? "line-through text-slate-400" : "text-slate-200"}`}>
                              {item.title}
                            </span>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>

                  {/* Curated Resources and Course Integrations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-emerald-400/80" />
                      <span>Curated Academy Tracks & Docs</span>
                    </h4>

                    <motion.div 
                      variants={childGridVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3" 
                      id="stage-resources-grid"
                    >
                      {activeStage.resources.map((res, index) => (
                        <motion.div 
                          key={index}
                          variants={gridItemVariants}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            borderColor: "rgba(99, 102, 241, 0.4)",
                            boxShadow: "0 8px 18px rgba(99, 102, 241, 0.08)"
                          }}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/5 rounded-lg text-indigo-400">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">{res.type} • {res.provider}</span>
                              <h5 className="text-xs font-bold text-slate-200 leading-snug">{res.title}</h5>
                            </div>
                          </div>

                          <button
                            onClick={() => handleQuickAddCert(res.title, res.provider)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Add to Planned Certifications"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Mentor Tip Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/10 border border-emerald-500/10 space-y-1">
                    <span className="text-[10px] font-mono font-extrabold tracking-widest text-emerald-400 uppercase flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>CO-PILOT ADVISORY</span>
                    </span>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{activeStage.mentorTip}"
                    </p>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </motion.div>
  );
}
