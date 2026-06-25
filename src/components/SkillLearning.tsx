import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  Users, 
  RotateCcw,
  BookMarked,
  Layers,
  ArrowLeft,
  Trophy
} from "lucide-react";
import { UserProfile } from "../types";

interface SkillLearningProps {
  user: UserProfile | null;
  darkMode: boolean;
  onUpdateProfile?: (data: Partial<UserProfile>) => Promise<void>;
  onAddCert?: (certData: any) => Promise<any>;
}

interface Course {
  id: string;
  title: string;
  category: string;
  icon: string;
  lecturesCount: number;
  completedLectures: number;
  duration: string;
  enrolled: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  skillsCovered: string[];
  description: string;
  outline: string[];
}

export default function SkillLearning({ user, darkMode, onUpdateProfile, onAddCert }: SkillLearningProps) {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "course-ai",
      title: "Generative AI Foundations",
      category: "AI",
      icon: "🤖",
      lecturesCount: 6,
      completedLectures: 3,
      duration: "4.5 hours",
      enrolled: 2450,
      level: "Beginner",
      skillsCovered: ["LLMs", "Generative AI", "Vector Embeddings"],
      description: "Learn how modern transformer architectures, Large Language Models (LLMs), and semantic searching drive today's artificial intelligence breakthroughs.",
      outline: [
        "Introduction to Neural Transformers",
        "How LLMs Predict the Next Token",
        "Introduction to Retrieval-Augmented Generation (RAG)",
        "Semantic Search vs Lexical Keyword Search",
        "Vector Databases and Cosine Similarity",
        "Fine-Tuning vs RAG Architectures"
      ]
    },
    {
      id: "course-ml",
      title: "Machine Learning Boot Camp",
      category: "Machine Learning",
      icon: "📊",
      lecturesCount: 8,
      completedLectures: 0,
      duration: "12 hours",
      enrolled: 1850,
      level: "Intermediate",
      skillsCovered: ["Regression", "Neural Networks", "Pandas"],
      description: "Get hands-on with linear regressions, random forest decision trees, and basic deep learning networks using scikit-learn and PyTorch.",
      outline: [
        "Data Prep & Cleansing with Pandas",
        "Supervised vs Unsupervised Learning",
        "Linear & Logistic Regression",
        "Decision Trees and Random Forest Classifiers",
        "Evaluating Models: Precision, Recall, F1",
        "Introduction to Deep Artificial Neural Networks",
        "Tensor Operation Basics with PyTorch",
        "Building Your First Classification Pipeline"
      ]
    },
    {
      id: "course-android",
      title: "Android Native App Architecture",
      category: "Android",
      icon: "📱",
      lecturesCount: 10,
      completedLectures: 10, // Pre-completed for demonstration certification claiming!
      duration: "15 hours",
      enrolled: 3100,
      level: "Intermediate",
      skillsCovered: ["Kotlin", "Jetpack Compose", "Coroutines"],
      description: "Build robust, production-ready Android apps using Jetpack Compose, state flow architectures, clean room databases, and Kotlin coroutines.",
      outline: [
        "Kotlin Language Basics & Type Systems",
        "Jetpack Compose Declarative UI Principles",
        "Managing State: ViewModels and StateFlow",
        "Local Persistence with Room Database",
        "Kotlin Coroutines and Async Workflows",
        "Dependency Injection with Hilt",
        "Clean Architecture Data-Domain-Presentation Layers",
        "Retrofit Integration for REST APIs",
        "Testing Compose Layouts and ViewModels",
        "Publishing to Google Play Console"
      ]
    },
    {
      id: "course-java",
      title: "Modern Java Enterprise Master Class",
      category: "Java",
      icon: "☕",
      lecturesCount: 5,
      completedLectures: 0,
      duration: "8.5 hours",
      enrolled: 1200,
      level: "Advanced",
      skillsCovered: ["Spring Boot", "JVM", "Multi-threading"],
      description: "Explore JVM tuning, multi-threaded concurrencies, and build enterprise REST endpoints using Spring Boot 3.0.",
      outline: [
        "Modern Java Features (Records, Sealed Classes)",
        "Spring Boot Starter Architectures",
        "Spring Data JPA and Hibernate ORM",
        "Understanding JVM Memory & GC Tuning",
        "Multi-threading with Virtual Threads"
      ]
    },
    {
      id: "course-python",
      title: "Python for Engineering and Scripts",
      category: "Python",
      icon: "🐍",
      lecturesCount: 6,
      completedLectures: 2,
      duration: "6 hours",
      enrolled: 4200,
      level: "Beginner",
      skillsCovered: ["Object-Oriented Python", "API Requests", "Web Scraping"],
      description: "Go from syntax basics to writing background scripts, API requests, and web crawlers using beautiful Python libraries.",
      outline: [
        "Variables, Dicts, and Loop Comprehensions",
        "Object-Oriented Programming (OOP) in Python",
        "File Operations and Error Handling",
        "Making REST API Calls with requests",
        "Web Scraping with BeautifulSoup",
        "Automating Standard Operating Tasks"
      ]
    },
    {
      id: "course-webdev",
      title: "Modern Full Stack Web Architectures",
      category: "Web Development",
      icon: "🌐",
      lecturesCount: 8,
      completedLectures: 4,
      duration: "10 hours",
      enrolled: 5400,
      level: "Intermediate",
      skillsCovered: ["React", "TypeScript", "Tailwind CSS"],
      description: "Master modern Single Page Applications (SPAs) and full-stack Express engines with secure JWT authentications.",
      outline: [
        "The React 18 Virtual DOM and Rendering Lifecycle",
        "TypeScript Strict Typings & Interfaces",
        "Responsive Styling with Tailwind utility classes",
        "State Engines: Context API vs Zustand",
        "Building Custom Express Middleware",
        "Secure JSON Web Token (JWT) Authentications",
        "CORS, Helmet Security Headers, and rate-limiting",
        "Deploying to Cloud Run with Docker"
      ]
    },
    {
      id: "course-data",
      title: "SQL & Analytics Deep Dive",
      category: "Data Analytics",
      icon: "📈",
      lecturesCount: 6,
      completedLectures: 1,
      duration: "7 hours",
      enrolled: 1980,
      level: "Intermediate",
      skillsCovered: ["D3.js", "Tableau", "Statistical Aggregation"],
      description: "Unravel big database columns, statistical averages, and build rich charts using data-driven documents (D3.js).",
      outline: [
        "Understanding Relational database Normalizations",
        "Advanced Aggregations & Analytical Window Functions",
        "Transforming CSV data with Pandas",
        "Intro to Data-Driven Documents (D3.js)",
        "Building Real-Time interactive Web Visualizations",
        "Designing Dashboard Metrics for Stakeholders"
      ]
    },
    {
      id: "course-sql",
      title: "Advanced SQL Database Orchestration",
      category: "SQL",
      icon: "🗄️",
      lecturesCount: 5,
      completedLectures: 5, // Pre-completed to allow demonstration certification claiming!
      duration: "5 hours",
      enrolled: 2800,
      level: "Intermediate",
      skillsCovered: ["PostgreSQL", "Query Tuning", "Indexes"],
      description: "Optimize slower queries, build relational database schemas, and create automated database trigger routines.",
      outline: [
        "Primary Keys, Foreign Keys, and Referential Integrity",
        "B-Tree Indexes vs Hash Indexes in PostgreSQL",
        "Analyzing Query Performance with EXPLAIN ANALYZE",
        "Building Complex Subqueries and CTEs",
        "Writing Database Stored Procedures & Triggers"
      ]
    },
    {
      id: "course-cloud",
      title: "Cloud Infrastructure (AWS & GCP)",
      category: "Cloud",
      icon: "☁️",
      lecturesCount: 6,
      completedLectures: 0,
      duration: "9 hours",
      enrolled: 1540,
      level: "Advanced",
      skillsCovered: ["Docker", "Kubernetes", "IAM"],
      description: "Deploy servers, microservices, and databases globally. Master Docker containerizations and secure cloud IAM roles.",
      outline: [
        "Cloud Virtual Private Networks and Security Groups",
        "Docker Containerization of Web Services",
        "Setting up CI/CD Pipelines with GitHub Actions",
        "Orchestrating services with Kubernetes",
        "Serverless Deployments (Cloud Run & AWS Lambda)",
        "Principal of Least Privilege in Cloud IAM Policies"
      ]
    },
    {
      id: "course-prompt",
      title: "Prompt Engineering Specialist",
      category: "Prompt Engineering",
      icon: "⚡",
      lecturesCount: 5,
      completedLectures: 5, // Pre-completed to allow immediate claiming!
      duration: "4 hours",
      enrolled: 3700,
      level: "Beginner",
      skillsCovered: ["Chain-of-thought", "Few-shot prompting", "System Context"],
      description: "Master techniques to squeeze high-grade accuracy out of foundation models like Gemini. Write templates that prevent hallucinations.",
      outline: [
        "Under the Hood: Temperature, Top-K, Top-P Params",
        "Zero-Shot vs Few-Shot Prompt Templates",
        "Chain-of-Thought (CoT) Prompt Frameworks",
        "Role-Playing and System Context Injection",
        "Structured JSON Output formatting instructions"
      ]
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [successCertMsg, setSuccessCertMsg] = useState<string | null>(null);
  const [loadingClaim, setLoadingClaim] = useState(false);

  // Complete a lecture mock function
  const handleCompleteLecture = (courseId: string, index: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const nextCompleted = Math.min(c.completedLectures + 1, c.lecturesCount);
        // If we select active, update active too
        if (selectedCourse && selectedCourse.id === courseId) {
          setSelectedCourse({
            ...selectedCourse,
            completedLectures: nextCompleted
          });
        }
        return {
          ...c,
          completedLectures: nextCompleted
        };
      }
      return c;
    }));
  };

  // Claim Certification!
  const handleClaimCert = async (course: Course) => {
    setLoadingClaim(true);
    setSuccessCertMsg(null);
    try {
      // Award certificate via simulated state / API
      if (onAddCert) {
        await onAddCert({
          name: `${course.title} Professional Badge`,
          issuer: "Google Partner / CareerPilot Academy",
          status: "Completed",
          credentialUrl: "https://careerpilot.academy/credentials/" + course.id
        });
      }

      // Award XP points (simulate profile gain)
      if (onUpdateProfile && user) {
        const currentXp = user.xp + 250; // award 250 XP
        let currentLevel = user.level;
        let nextXpThreshold = user.nextLevelXp;
        if (currentXp >= nextXpThreshold) {
          currentLevel += 1;
          nextXpThreshold = Math.floor(nextXpThreshold * 1.5);
        }
        await onUpdateProfile({
          xp: currentXp,
          level: currentLevel,
          nextLevelXp: nextXpThreshold
        });
      }

      setSuccessCertMsg(`Congratulations! You claimed the "${course.title} Professional Badge". 250 XP has been awarded to your pilot account!`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClaim(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedCourse ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-[#2563EB]" />
                  <span>Academy Learning Tracks</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Access 10 custom curricula designed specifically to build skills currently matching high-salary open roles. Claim blockchain-simulated PDF certificates at 100% completion.
                </p>
              </div>
            </div>

            {/* Cert claim toast notice */}
            {successCertMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-xs text-emerald-500"
              >
                <Trophy className="w-6 h-6 shrink-0 animate-bounce" />
                <div className="flex-1">
                  <strong className="font-bold block">Accreditation Succeeded!</strong>
                  <span>{successCertMsg}</span>
                </div>
                <button onClick={() => setSuccessCertMsg(null)} className="font-bold hover:underline">Dismiss</button>
              </motion.div>
            )}

            {/* Courses Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const percent = Math.floor((course.completedLectures / course.lecturesCount) * 100);
                const isComplete = percent === 100;

                return (
                  <div
                    key={course.id}
                    className={`rounded-3xl border shadow-sm p-6 relative overflow-hidden group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[280px] ${
                      darkMode 
                        ? "bg-slate-900/40 border-white/10 hover:border-[#2563EB]/40" 
                        : "bg-white border-slate-200/60 hover:border-[#2563EB]/40"
                    }`}
                  >
                    {/* Glowing highlight sphere */}
                    <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-[#2563EB]/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
                    
                    <div>
                      {/* Top labels */}
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                          {course.category}
                        </span>
                        <span className="text-[10px] font-bold font-mono text-indigo-500">
                          {course.level}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-center space-x-3 mt-4">
                        <span className="text-3xl">{course.icon}</span>
                        <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2">
                          {course.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 mt-3 line-clamp-3">
                        {course.description}
                      </p>

                      {/* Info counts */}
                      <div className="flex items-center space-x-4 mt-4 text-[11px] text-slate-400">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1" />
                          {course.enrolled.toLocaleString()} enrolled
                        </span>
                      </div>
                    </div>

                    {/* Progress engine */}
                    <div className="mt-6 pt-4 border-t border-slate-200/30 dark:border-slate-800/30">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                        <span>COURSE PROGRESS</span>
                        <span className={isComplete ? "text-emerald-500" : "text-blue-500"}>{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isComplete ? "bg-[#10B981]" : "bg-[#2563EB]"
                          }`} 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>

                      {/* Click Action */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex-1 py-2 text-xs font-bold text-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <span>Explore Outline</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {isComplete && (
                          <button
                            onClick={() => handleClaimCert(course)}
                            disabled={loadingClaim}
                            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#10B981] text-white hover:bg-emerald-600 transition-all flex items-center justify-center space-x-1 animate-pulse cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                            <span>Claim Cert</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Academy Tracks</span>
            </button>

            {/* Course Header Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
              darkMode ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200/50"
            }`}>
              {/* Highlight background elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-[#2563EB]/10 to-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <span className="text-5xl">{selectedCourse.icon}</span>
                  <div>
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest bg-[#2563EB]/15 px-2.5 py-0.5 rounded-full">
                      {selectedCourse.category}
                    </span>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-white mt-1">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                      {selectedCourse.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar info */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 text-center min-w-[150px] shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">COURSE PROGRESS</span>
                  <span className="text-3xl font-display font-extrabold text-slate-800 dark:text-white block mt-1.5">
                    {Math.floor((selectedCourse.completedLectures / selectedCourse.lecturesCount) * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {selectedCourse.completedLectures} / {selectedCourse.lecturesCount} Lectures Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Outline list and actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Outline lectures list */}
              <div className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 ${
                darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/50"
              }`}>
                <h4 className="font-display font-extrabold text-base text-slate-800 dark:text-white flex items-center space-x-2">
                  <BookMarked className="w-5 h-5 text-[#2563EB]" />
                  <span>Curriculum Outline</span>
                </h4>

                <div className="space-y-2">
                  {selectedCourse.outline.map((lecture, i) => {
                    const isCompleted = i < selectedCourse.completedLectures;
                    const canComplete = i === selectedCourse.completedLectures;

                    return (
                      <div
                        key={lecture}
                        className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                          isCompleted
                            ? "bg-emerald-500/5 border-emerald-500/10 text-slate-400"
                            : canComplete
                              ? "bg-blue-500/5 border-[#2563EB]/20 text-slate-800 dark:text-white"
                              : "bg-slate-50/50 dark:bg-[#0f172a]/30 border-slate-200/40 dark:border-slate-800/40 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span className="text-xs font-bold text-[#2563EB] w-5 font-mono">0{i+1}</span>
                          <span className="text-xs sm:text-sm font-semibold truncate pr-2">{lecture}</span>
                        </div>

                        {isCompleted ? (
                          <div className="flex items-center space-x-1.5 text-xs text-emerald-500 font-bold">
                            <CheckCircle className="w-4 h-4 fill-current text-emerald-500/20" />
                            <span className="hidden sm:inline">Completed</span>
                          </div>
                        ) : canComplete ? (
                          <button
                            onClick={() => handleCompleteLecture(selectedCourse.id, i)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-blue-500/15 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Study Lesson</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side column: Skills and tools covered */}
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border space-y-4 ${
                  darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/50"
                }`}>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white flex items-center space-x-2">
                    <Layers className="w-4.5 h-4.5 text-[#10B981]" />
                    <span>Skills You Build</span>
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.skillsCovered.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-500"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-slate-200/30 dark:border-slate-800/30 my-4" />

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Completing this roadmap aligns your active career metrics with the technical keywords sought after by enterprise recruiters tracking open roles.
                  </p>
                </div>

                {/* Claim Certificate Banner */}
                {selectedCourse.completedLectures === selectedCourse.lecturesCount && (
                  <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Curriculum 100% Completed!</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Claim your Professional Certification and award 250 XP to your Profile level!</p>
                    </div>
                    <button
                      onClick={() => handleClaimCert(selectedCourse)}
                      disabled={loadingClaim}
                      className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>{loadingClaim ? "Claiming Badge..." : "Claim Academy Certificate"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
