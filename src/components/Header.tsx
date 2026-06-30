import { motion } from "motion/react";
import { 
  Compass, 
  FileText, 
  Briefcase, 
  Award, 
  MessageSquare, 
  CheckSquare, 
  Trophy, 
  Sun, 
  Moon, 
  LogOut,
  User,
  Activity,
  Users,
  Bell,
  Settings,
  BookOpen,
  Map
} from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  user,
  onLogout,
  onOpenAuth,
}: HeaderProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Compass },
    { id: "resume", label: "Resume Builder", icon: FileText },
    { id: "jobs", label: "Job Explorer", icon: Briefcase },
    { id: "roadmap", label: "Career Roadmap", icon: Map },
    { id: "skills", label: "Academy Tracks", icon: BookOpen },
    { id: "interview", label: "Interview Prep", icon: Activity },
    { id: "community", label: "Community", icon: Users },
    { id: "notifications", label: "Flight Logs", icon: Bell },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const calculateXpPercentage = () => {
    if (!user) return 0;
    return Math.min(Math.round((user.xp / user.nextLevelXp) * 100), 100);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      darkMode 
        ? "bg-[#020617]/80 border-b border-white/5 text-slate-200" 
        : "bg-white/70 border-b border-white/40 text-slate-800"
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab("dashboard")}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Compass className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 dark:from-emerald-400 dark:to-indigo-300">
                CareerPilot
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400 block -mt-1 tracking-widest uppercase">
                AI CO-PILOT
              </span>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive 
                      ? (darkMode ? "text-white border border-white/10 bg-white/5" : "text-emerald-700 bg-emerald-50")
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Gamified Score, Theme & User Section */}
          <div className="flex items-center space-x-4">
            
            {/* XP Gamified Bar (Desktop/Tablet) */}
            {user && (
              <div className="hidden sm:flex items-center space-x-3 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">Lvl {user.level}</span>
                  <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${calculateXpPercentage()}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    {user.xp} XP
                  </span>
                </div>
              </div>
            )}

            {/* Dark Mode Switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all duration-300 ${
                darkMode 
                  ? "bg-white/5 border-white/10 text-emerald-400 hover:bg-white/10" 
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile dropdown or trigger */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div 
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 pl-2 pr-3 py-1.5 rounded-xl cursor-pointer hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                  onClick={onOpenAuth}
                >
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-lg object-cover ring-2 ring-emerald-500/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                </div>
                
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-emerald-500/15"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Sub Navigation Menu */}
      <div className="lg:hidden overflow-x-auto border-t border-slate-100 dark:border-white/5 flex space-x-2 px-4 py-2 bg-slate-50/50 dark:bg-[#020617]/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
