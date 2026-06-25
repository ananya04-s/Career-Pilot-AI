import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Award, 
  UserPlus, 
  UserCheck, 
  Plus, 
  Image, 
  FileText, 
  Sparkles, 
  MoreHorizontal, 
  ThumbsUp, 
  Globe,
  AwardIcon,
  CheckCircle2
} from "lucide-react";
import { UserProfile } from "../types";

interface CommunityFeedProps {
  user: UserProfile | null;
  darkMode: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  title: string;
  avatar: string;
  time: string;
  content: string;
  badge?: {
    name: string;
    issuer: string;
  };
  likes: number;
  comments: Comment[];
  hasLiked: boolean;
  isFollowing: boolean;
  image?: string;
}

export default function CommunityFeed({ user, darkMode }: CommunityFeedProps) {
  const [newPostText, setNewPostText] = useState("");
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<{ name: string; issuer: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      author: "Anaya Sukesh",
      title: "Full Stack Engineer Candidate",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      time: "2 hours ago",
      content: "Thrilled to share that I've unlocked my 'AI Copilot Pioneer' status! Using automated resume analysis to align my React/Node.js project metrics with modern ATS patterns has boosted my confidence index significantly. Ready for the next flight! 🚀✨",
      likes: 12,
      comments: [
        {
          id: "c-1",
          author: "Siddharth Verma",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
          text: "Phenomenal growth, Ananya! The resume alignment is a total gamechanger.",
          time: "1 hour ago"
        }
      ],
      hasLiked: true,
      isFollowing: false,
      badge: {
        name: "AI Copilot Pioneer Certificate",
        issuer: "CareerPilot Academy"
      }
    },
    {
      id: "post-2",
      author: "Jessica Chen",
      title: "AI Specialist @ Google",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      time: "5 hours ago",
      content: "Always remember that during mock technical interviews, explaining your time-complexity trade-offs (like O(N) vs O(log N)) explicitly to the panel is what sets you apart. Code works, but architectural wisdom lands the offer! Best of luck fresh graduates!",
      likes: 42,
      comments: [],
      hasLiked: false,
      isFollowing: true
    },
    {
      id: "post-3",
      author: "Michael Sterling",
      title: "Talent Acquisition Manager @ Vercel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      time: "1 day ago",
      content: "We are officially hiring for multiple Remote Junior Developer positions this quarter! We focus heavily on candidates with robust, clean portfolio products on GitHub. Show us your personal flight logs and code pipelines, not just a static sheet. Applying through CareerPilot gets direct visibility with my team! 🚀💼",
      likes: 89,
      comments: [
        {
          id: "c-2",
          author: "Rohan Das",
          avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
          text: "Applying immediately! This is exactly what graduates are looking for.",
          time: "12 hours ago"
        }
      ],
      hasLiked: false,
      isFollowing: false,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
    }
  ]);

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: `user-post-${Date.now()}`,
      author: user?.name || "Ananya Sukesh",
      title: user?.targetRole || "Associate Software Engineer",
      avatar: user?.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      time: "Just now",
      content: newPostText,
      likes: 0,
      comments: [],
      hasLiked: false,
      isFollowing: false,
      badge: selectedBadge ? selectedBadge : undefined
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setSelectedBadge(null);
    setShowBadgeSelector(false);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  const handleFollow = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isFollowing: !p.isFollowing
        };
      }
      return p;
    }));
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: user?.name || "Ananya Sukesh",
      avatar: user?.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      text: text.trim(),
      time: "Just now"
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({
      ...prev,
      [postId]: ""
    }));
  };

  const badgeTemplates = [
    { name: "Certified Machine Learning Novice", issuer: "CareerPilot Academy" },
    { name: "Advanced React Developer Portfolio", issuer: "NPTEL National Level" },
    { name: "AWS Cloud Certified Associate Specialist", issuer: "Amazon Web Services" },
    { name: "AI Prompt Engineer Champion Badge", issuer: "Google Developer Group" }
  ];

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
            <Globe className="w-6 h-6 text-[#2563EB]" />
            <span>Graduate Flight Feed</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with peers, publish certifications, share project milestones, and get referrals from tech leaders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Post Creator & Stream */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Post Composer Card with Glassmorphic design */}
          <div className={`p-5 rounded-3xl border shadow-md ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          }`}>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex items-start space-x-3">
                <img 
                  src={user?.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
                  alt={user?.name || "Ananya"}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/15"
                />
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Share an achievement, study milestone, or post your latest certificate..."
                    className="w-full bg-transparent outline-none border-none resize-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 py-1"
                  />
                </div>
              </div>

              {/* Show selected badge to attach */}
              {selectedBadge && (
                <div className="p-3.5 rounded-2xl border border-dashed border-[#10B981]/30 bg-[#10B981]/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-emerald-500 font-semibold">
                    <Award className="w-4 h-4" />
                    <span>Attaching: {selectedBadge.name} ({selectedBadge.issuer})</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedBadge(null)}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Action utilities bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowBadgeSelector(!showBadgeSelector)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Attach Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Image attachment simulation. Please use text or Certificate attachment for demo.")}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-[#2563EB] transition-colors cursor-pointer"
                  >
                    <Image className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Image</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 text-white flex items-center space-x-1 transition-all cursor-pointer shadow-md shadow-blue-500/10"
                >
                  <span>Post</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Badge Selection Box */}
            {showBadgeSelector && (
              <div className="mt-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  CHOOSE A RECENT ACCREDITATION
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {badgeTemplates.map((b) => (
                    <div
                      key={b.name}
                      onClick={() => {
                        setSelectedBadge(b);
                        setShowBadgeSelector(false);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-white dark:bg-slate-950 text-xs cursor-pointer text-left transition-all"
                    >
                      <span className="font-bold block text-slate-800 dark:text-white line-clamp-1">{b.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{b.issuer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
                    darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
                  }`}
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.avatar} 
                        alt={post.author} 
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/10"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">{post.author}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-current shrink-0" />
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold uppercase tracking-wider shrink-0">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mt-1">{post.title} • {post.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Follow Toggle */}
                      {post.author !== (user?.name || "Ananya Sukesh") && (
                        <button
                          onClick={() => handleFollow(post.id)}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${
                            post.isFollowing 
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400" 
                              : "bg-blue-500/15 text-[#2563EB] hover:bg-blue-500/20"
                          }`}
                        >
                          {post.isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                          <span>{post.isFollowing ? "Following" : "Follow"}</span>
                        </button>
                      )}
                      <MoreHorizontal className="w-4.5 h-4.5 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {post.content}
                  </p>

                  {/* Attachment image */}
                  {post.image && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                      <img src={post.image} alt="Attachment" className="w-full max-h-96 object-cover" />
                    </div>
                  )}

                  {/* Certificate attachment */}
                  {post.badge && (
                    <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center space-x-3.5">
                      <div className="p-3 bg-white rounded-xl shadow-md text-emerald-500 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest block">ACCREDITED CERTIFICATION</span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">{post.badge.name}</h4>
                        <p className="text-[11px] text-slate-400">Issued by {post.badge.issuer} via CareerPilot</p>
                      </div>
                    </div>
                  )}

                  {/* Post Stats & Interactions */}
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40">
                    <span className="font-medium">{post.likes} Likes</span>
                    <button 
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="font-semibold hover:underline"
                    >
                      {post.comments.length} Comments
                    </button>
                  </div>

                  {/* Engagement Actions */}
                  <div className="flex items-center justify-around gap-2 pt-1">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        post.hasLiked 
                          ? "bg-rose-500/10 text-rose-500" 
                          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <Heart className={`w-4.5 h-4.5 ${post.hasLiked ? "fill-current" : ""}`} />
                      <span>{post.hasLiked ? "Liked" : "Like"}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex-1 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4.5 h-4.5" />
                      <span>Comment</span>
                    </button>

                    <button
                      onClick={() => alert("Copied post share link to clipboard!")}
                      className="flex-1 py-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Share2 className="w-4.5 h-4.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments Panel */}
                  {activeCommentPostId === post.id && (
                    <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 space-y-4">
                      {/* Comments list */}
                      <div className="space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-2.5">
                            <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-lg object-cover" />
                            <div className="flex-1 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800 dark:text-white">{comment.author}</span>
                                <span className="text-[10px] text-slate-400">{comment.time}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Comment input form */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write an insightful comment..."
                          className="flex-1 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 outline-none rounded-xl px-3 py-1.5 text-xs focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="p-1.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Mini leaderboard or trend panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-5 rounded-3xl border ${
            darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
          }`}>
            <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-slate-400 mb-4">
              Trending Flight Accolades
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-start space-x-2.5">
                <span className="text-sm font-bold text-blue-500 mt-0.5 shrink-0">#1</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white">#ReactGraduates</h4>
                  <p className="text-[10px] text-slate-400">1.2k graduates shared certificates this week</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-sm font-bold text-blue-500 mt-0.5 shrink-0">#2</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white">#ATSResumeOptimization</h4>
                  <p className="text-[10px] text-slate-400">920+ users achieved score &gt;90 this month</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-sm font-bold text-blue-500 mt-0.5 shrink-0">#3</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white">#FigmaNewGrad</h4>
                  <p className="text-[10px] text-slate-400">Active hiring portal for product designers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
