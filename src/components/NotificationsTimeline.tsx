import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle, 
  X, 
  Briefcase, 
  MessageSquare, 
  Globe 
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: "interview" | "certification" | "jobs" | "community" | "ai";
  isRead: boolean;
}

interface NotificationsTimelineProps {
  darkMode: boolean;
}

export default function NotificationsTimeline({ darkMode }: NotificationsTimelineProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Interview Fast-Track Confirmed",
      description: "Michael Sterling from Vercel flagged your profile. Prepare with the AI technical mock questions immediately!",
      time: "20 minutes ago",
      category: "interview",
      isRead: false
    },
    {
      id: "notif-2",
      title: "Google New Grad Role Open",
      description: "Google listed Associate Frontend Developer (New Grad) at Mountain View matching 96% of your skills stack.",
      time: "2 hours ago",
      category: "jobs",
      isRead: false
    },
    {
      id: "notif-3",
      title: "Android Native App Cert Unlocked",
      description: "Your 100% completion of Kotlin & Compose has been credited. You earned +250 XP points!",
      time: "1 day ago",
      category: "certification",
      isRead: true
    },
    {
      id: "notif-4",
      title: "Siddharth Verma commented on your post",
      description: "'Phenomenal growth, Ananya! The resume alignment is a total gamechanger.'",
      time: "1 day ago",
      category: "community",
      isRead: true
    },
    {
      id: "notif-5",
      title: "ATS Compatibility Boosted",
      description: "AI Keywords Injection completed. Your composite daily career score has escalated to 78/100.",
      time: "2 days ago",
      category: "ai",
      isRead: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "interview":
        return { bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: Clock };
      case "certification":
        return { bg: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Award };
      case "jobs":
        return { bg: "bg-[#2563EB]/10 text-[#2563EB] border-blue-500/20", icon: Briefcase };
      case "community":
        return { bg: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Globe };
      default:
        return { bg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", icon: Sparkles };
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-display text-xs sm:text-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
            <Bell className="w-6 h-6 text-[#2563EB]" />
            <span>Flight Logs & Alerts</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates regarding application dispatch, certifications unlocked, and recruiter fast-tracks.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 hover:text-[#2563EB] dark:hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications timeline list */}
      <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800/80 space-y-6 py-2">
        <AnimatePresence>
          {notifications.map((n, i) => {
            const styleObj = getCategoryStyles(n.category);
            const IconComp = styleObj.icon;

            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                {/* Timeline circle point */}
                <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-[#020617] flex items-center justify-center ${
                  n.isRead ? "bg-slate-300 dark:bg-slate-700" : "bg-[#2563EB] animate-pulse"
                }`} />

                {/* Main Card with Glassmorphic styling */}
                <div className={`p-4 rounded-2xl border shadow-sm transition-all flex items-start justify-between gap-4 ${
                  darkMode ? "bg-slate-900/40 border-white/10 hover:border-blue-500/25" : "bg-white border-slate-200/50 hover:border-blue-500/25"
                } ${!n.isRead ? "ring-1 ring-blue-500/10" : ""}`}>
                  
                  <div className="flex gap-3">
                    {/* Category Icon */}
                    <div className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center ${styleObj.bg}`}>
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-slate-800 dark:text-white leading-tight">{n.title}</h4>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.description}</p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {n.time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotif(n.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <span className="text-sm text-slate-400">All alerts successfully cleared! You are on a smooth flight. ✈️</span>
          </div>
        )}
      </div>
    </div>
  );
}
