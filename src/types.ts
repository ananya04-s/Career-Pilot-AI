export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  photoUrl?: string;
  targetRole?: string;
  bio?: string;
  experienceLevel?: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  badges: string[]; // Badge ID list
  skills: string[]; // List of skills
}

export type JobStatus = 'Applied' | 'Interview Scheduled' | 'Rejected' | 'Offer Received';

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: JobStatus;
  location: string;
  salary?: string;
  appliedDate: string;
  interviewDate?: string;
  notes?: string;
  updatedAt: string;
}

export interface ResumeAnalysis {
  userId: string;
  fileName: string;
  score: number;
  atsCompatibility: number;
  grammarScore: number;
  missingSkills: string[];
  suggestedImprovements: string[];
  keywordOptimization: { keyword: string; density: string; status: 'Optimized' | 'Missing' | 'Overused' }[];
  analyzedAt: string;
}

export interface SkillItem {
  id: string;
  userId: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  addedAt: string;
  suggestions?: {
    courses: { title: string; provider: string; url?: string }[];
    projects: { title: string; description: string; complexity: string }[];
    practiceQuestions: string[];
    certifications: string[];
  };
}

export interface CertificationItem {
  id: string;
  userId: string;
  name: string;
  issuer: 'Google' | 'Microsoft' | 'AWS' | 'Coursera' | 'NPTEL' | 'Udemy' | 'Other';
  status: 'Completed' | 'In Progress' | 'Planned';
  date?: string;
  credentialUrl?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'HR' | 'Technical' | 'Coding' | 'Behavioral';
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  category: string;
  date: string;
  durationSeconds: number;
  questionsCount: number;
  score?: number;
  answers: {
    questionId: string;
    questionText: string;
    userAnswer: string;
    score: number;
    strengths: string;
    improvements: string;
    modelAnswer: string;
  }[];
  overallFeedback?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'Resume' | 'Interview' | 'Job' | 'Skill' | 'General';
  xpReward: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface DbState {
  users: Record<string, UserProfile>;
  jobs: Record<string, JobApplication>;
  resumeAnalyses: Record<string, ResumeAnalysis>;
  skills: Record<string, SkillItem>;
  certifications: Record<string, CertificationItem>;
  interviewSessions: Record<string, MockInterviewSession>;
}
