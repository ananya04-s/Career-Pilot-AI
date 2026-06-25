import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Activity, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  Play,
  RotateCcw,
  BookOpen,
  Award,
  ChevronLeft
} from "lucide-react";
import { InterviewQuestion, UserProfile } from "../types";

interface InterviewPrepProps {
  user: UserProfile | null;
  onEvaluate: (questionId: string, questionText: string, userAnswer: string, category: string) => Promise<any>;
  darkMode: boolean;
}

export default function InterviewPrep({
  user,
  onEvaluate,
  darkMode,
}: InterviewPrepProps) {
  // Navigation tabs / states
  const [step, setStep] = useState<"select" | "active" | "feedback">("select");
  const [category, setCategory] = useState<"HR" | "Technical" | "Coding" | "Behavioral">("Technical");
  
  // Loaded questions list
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);

  // Active loop states
  const [userAnswer, setUserAnswer] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Evaluation results
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  // Gamification notification state
  const [gamificationReward, setGamificationReward] = useState<any | null>(null);

  // Timer tick effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // Load questions from backend
  const fetchQuestions = async (cat: string) => {
    setLoadingQuestions(true);
    setQuestions([]);
    try {
      const role = user?.targetRole || "Software Engineer";
      const response = await fetch(`/api/interview-prep/questions?category=${cat}&targetRole=${encodeURIComponent(role)}`);
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Launch mock interview session
  const startSession = (q: InterviewQuestion) => {
    setSelectedQuestion(q);
    setUserAnswer("");
    setTimerSeconds(0);
    setTimerActive(true);
    setStep("active");
  };

  // Format MM:SS timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  // Submit answer for evaluation
  const handleSubmitResponse = async () => {
    if (!userAnswer.trim() || !selectedQuestion) return;
    setTimerActive(false);
    setEvaluating(true);
    setEvaluationResult(null);
    setGamificationReward(null);
    try {
      const res = await onEvaluate(
        selectedQuestion.id,
        selectedQuestion.question,
        userAnswer.trim(),
        selectedQuestion.category
      );
      
      setEvaluationResult(res.evaluation);
      setStep("feedback");

      // Check gamification
      if (res.gamification && (res.gamification.leveledUp || res.gamification.addedBadges?.length > 0)) {
        setGamificationReward(res.gamification);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      
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
              <p className="font-bold">Interview Prep reward unlocked!</p>
              <p className="text-xs font-medium">
                {gamificationReward.leveledUp ? `Leveled up to Level ${gamificationReward.level}! ` : ""}
                {gamificationReward.addedBadges?.map((b: string) => `Unlocked Badge: "${b.replace("_", " ")}"! `).join(" ")}
                (+100 XP Added)
              </p>
            </div>
          </div>
          <button onClick={() => setGamificationReward(null)} className="text-xs font-bold underline cursor-pointer">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Select Category & Load Questions Step */}
      {step === "select" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div>
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white flex items-center space-x-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              <span>Simulated Interview Prep</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select an interview loop category. Gemini will generate professional questions matched specifically to your target career path: <strong>"{user?.targetRole || "Software Engineer"}"</strong>.
            </p>
          </div>

          {/* Interactive Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["HR", "Technical", "Coding", "Behavioral"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  fetchQuestions(cat);
                }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  category === cat
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                    : (darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200/50 hover:bg-slate-50")
                }`}
              >
                <span className="text-sm">{cat} Prep</span>
              </button>
            ))}
          </div>

          {/* Questions list */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
          }`}>
            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <HelpCircle className="w-4.5 h-4.5 mr-1.5 text-indigo-500" />
                <span>Available Questions Loop</span>
              </span>
              <button 
                onClick={() => fetchQuestions(category)}
                className="text-xs font-semibold text-indigo-500 hover:underline"
              >
                Regenerate Questions
              </button>
            </h3>

            {loadingQuestions ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-dashed border-indigo-500 animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400">Gemini is compiling customized industry questions...</p>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                      darkMode ? "bg-[#0f172a] border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="pr-4 flex-1">
                      <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">
                        Question {idx + 1} • {q.difficulty}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                    <button
                      onClick={() => startSession(q)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start Interview</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400">Select a category tab above to fetch interview questions.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Active Mock Interview Simulator */}
      {step === "active" && selectedQuestion && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Back control */}
          <button 
            onClick={() => { setStep("select"); setTimerActive(false); }}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel Session</span>
          </button>

          {/* Simulator Arena */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Answer input area (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`p-6 rounded-3xl border ${
                darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
              }`}>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block mb-2">
                  Active Simulated Loop • {selectedQuestion.difficulty}
                </span>

                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-800 dark:text-white leading-relaxed mb-6">
                  "{selectedQuestion.question}"
                </h3>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Response Editor
                  </label>
                  <textarea
                    rows={10}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type or dictate your response here... Try to structure using the STAR method: Situation, Task, Action, Result. Highlight quantities and exact tools."
                    className="w-full px-4 py-3 text-sm rounded-xl border bg-transparent border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-500 transition-colors resize-none text-slate-800 dark:text-slate-250"
                  />
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/40 dark:border-slate-800/40 pt-4 mt-4">
                  <span className="text-xs text-slate-400">
                    Characters: {userAnswer.length} • Word count: {userAnswer.split(/\s+/).filter(Boolean).length}
                  </span>
                  <button
                    onClick={handleSubmitResponse}
                    disabled={evaluating || !userAnswer.trim()}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/15 transition-all flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Evaluate Response</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timer & tips (Right Column) */}
            <div className="space-y-4">
              
              {/* Timer card */}
              <div className={`p-6 rounded-3xl border ${
                darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
              } text-center flex flex-col items-center justify-center`}>
                <Clock className="w-8 h-8 text-indigo-500 mb-2 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LOOP TIMER</span>
                <span className="text-3xl font-mono font-bold text-slate-800 dark:text-white mt-1">
                  {formatTime(timerSeconds)}
                </span>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => setTimerActive(!timerActive)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      timerActive ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {timerActive ? "Pause Loop" : "Resume"}
                  </button>
                  <button 
                    onClick={() => setTimerSeconds(0)}
                    className="px-3 py-1 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* STAR guidelines */}
              <div className="p-6 rounded-2xl border bg-slate-950 border-emerald-500/15">
                <h4 className="font-display font-bold text-xs text-white mb-2 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span>STAR Structure Checklist</span>
                </h4>
                <ul className="space-y-2 text-[10px] text-slate-400 leading-relaxed">
                  <li><strong>• Situation:</strong> Give context of the fail, team size, or target benchmark.</li>
                  <li><strong>• Task:</strong> Explain your unique personal ownership task.</li>
                  <li><strong>• Action:</strong> List explicit codes, libraries, databases, or algorithms.</li>
                  <li><strong>• Result:</strong> Quantify metrics (e.g. 42% faster, $15k saved).</li>
                </ul>
              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* Evaluating scanning loader */}
      {evaluating && (
        <div className="p-12 rounded-2xl border border-indigo-500/20 bg-slate-950 text-center flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500 animate-spin" />
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Gemini Evaluation Active</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Grading vocabulary, analyzing core technical tenets, formatting strengths & improvements, and drafting a perfect model answer response...
          </p>
        </div>
      )}

      {/* Evaluation Feedback Step */}
      {step === "feedback" && evaluationResult && selectedQuestion && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Back control */}
          <button 
            onClick={() => setStep("select")}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Questions list</span>
          </button>

          {/* Feedback details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Strengths & Improvements (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Strengths card */}
              <div className={`p-6 rounded-3xl border ${
                darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
              }`}>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-3 flex items-center">
                  <CheckCircle className="w-4.5 h-4.5 mr-1.5 text-emerald-500" />
                  <span>Your Strengths</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {evaluationResult.strengths}
                </p>
              </div>

              {/* Improvements card */}
              <div className={`p-6 rounded-3xl border ${
                darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
              }`}>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-3 flex items-center">
                  <AlertCircle className="w-4.5 h-4.5 mr-1.5 text-amber-500" />
                  <span>Constructive Improvements</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {evaluationResult.improvements}
                </p>
              </div>

              {/* Perfect Model Answer */}
              <div className="p-6 rounded-2xl border bg-slate-950 border-indigo-500/20">
                <h3 className="font-display font-bold text-sm text-white mb-3 flex items-center">
                  <BookOpen className="w-4.5 h-4.5 mr-1.5 text-indigo-400" />
                  <span>Perfect Model Answer Response</span>
                </h3>
                <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                  {evaluationResult.modelAnswer}
                </div>
              </div>

            </div>

            {/* Score circle (Right column) */}
            <div className="space-y-4">
              
              {/* Score breakdown */}
              <div className={`p-6 rounded-3xl border ${
                darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200/50"
              } text-center flex flex-col items-center justify-center`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">MOCK GRADE</span>
                
                <div className="w-28 h-28 rounded-full border-4 border-indigo-500 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-extrabold text-slate-800 dark:text-white">
                    {evaluationResult.score}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">out of 100</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
                  {evaluationResult.score >= 80 
                    ? "Exceptional conceptual and vocabulary mastery! This score meets the criteria for high-tier technical recruitments."
                    : "A solid first loop. Focus on the suggestions of STAR structures to improve your grading metrics."
                  }
                </p>

                <button 
                  onClick={() => startSession(selectedQuestion)}
                  className="w-full mt-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Question Again</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
