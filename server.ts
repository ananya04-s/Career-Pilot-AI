import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini API client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  console.log("Gemini API Client initialized successfully.");
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fallback to smart mock generators.");
}

app.use(express.json());

// Database file path
const DB_PATH = path.join(process.cwd(), "db.json");

// Helper to get default database state
const getDefaultDb = () => ({
  users: {
    "default-user": {
      uid: "default-user",
      email: "sukeshananya@gmail.com",
      name: "Ananya Sukesh",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      targetRole: "Full Stack Engineer",
      bio: "Computer Science student looking to craft elegant, full-stack experiences. Eager to master AI engineering, cloud native architectures, and web standard performances.",
      experienceLevel: "Fresher / Graduate",
      level: 2,
      xp: 450,
      nextLevelXp: 1000,
      badges: ["resume_master", "job_hunter"],
      skills: ["React", "TypeScript", "Node.js", "Python"]
    }
  },
  jobs: {
    "job-1": {
      id: "job-1",
      userId: "default-user",
      company: "Google",
      role: "Associate Software Engineer",
      status: "Interview Scheduled",
      location: "Bangalore, India (Hybrid)",
      salary: "$110k - $130k",
      appliedDate: "2026-06-10",
      interviewDate: "2026-06-28T14:00:00",
      notes: "Preparation: Revise dynamic programming, system design patterns, and system-level API design.",
      updatedAt: "2026-06-20"
    },
    "job-2": {
      id: "job-2",
      userId: "default-user",
      company: "Microsoft",
      role: "Frontend Engineer Intern",
      status: "Applied",
      location: "Hyderabad (Remote)",
      salary: "$40 / hour",
      appliedDate: "2026-06-18",
      notes: "Referral secured from alumni network. Re-evaluated React hooks and Fiber architecture.",
      updatedAt: "2026-06-18"
    },
    "job-3": {
      id: "job-3",
      userId: "default-user",
      company: "Stripe",
      role: "Product Engineer",
      status: "Offer Received",
      location: "San Francisco, CA (Hybrid)",
      salary: "$145k + Equity",
      appliedDate: "2026-05-15",
      notes: "Incredible recruitment process. Pitch focused on interactive canvas UI designs and micro-animations.",
      updatedAt: "2026-06-24"
    },
    "job-4": {
      id: "job-4",
      userId: "default-user",
      company: "Amazon",
      role: "Software Development Engineer (SDE-1)",
      status: "Rejected",
      location: "Seattle, WA",
      salary: "$120k",
      appliedDate: "2026-05-02",
      notes: "Completed final loop. Failed on complex graph topological sorting complexity optimization.",
      updatedAt: "2026-06-05"
    }
  },
  resumeAnalyses: {
    "default-user": {
      userId: "default-user",
      fileName: "Ananya_Sukesh_FullStack_Resume.pdf",
      score: 84,
      atsCompatibility: 88,
      grammarScore: 95,
      missingSkills: [
        "Docker / Containerization",
        "CI/CD Pipelines (GitHub Actions)",
        "GraphQL / Apollo Client",
        "Redis / Caching Layer"
      ],
      suggestedImprovements: [
        "Include metrics-driven achievements (e.g., 'Optimized database read-times by 42% through query indexing').",
        "Add Docker deployment and microservices exposure to showcase enterprise readiness.",
        "Include keywords like 'System Architecture', 'Asynchronous processing' to secure high ATS score."
      ],
      keywordOptimization: [
        { keyword: "TypeScript", density: "1.8%", status: "Optimized" },
        { keyword: "React Hooks", density: "1.2%", status: "Optimized" },
        { keyword: "Express REST API", density: "0.6%", status: "Optimized" },
        { keyword: "PostgreSQL", density: "0.2%", status: "Missing" },
        { keyword: "CI/CD", density: "0%", status: "Missing" },
        { keyword: "Software Development", density: "4.8%", status: "Overused" }
      ],
      analyzedAt: "2026-06-22T11:45:00"
    }
  },
  skills: {
    "skill-1": {
      id: "skill-1",
      userId: "default-user",
      name: "React",
      level: "Expert",
      addedAt: "2026-06-01",
      suggestions: {
        courses: [
          { title: "Advanced React Patterns", provider: "Frontend Masters" },
          { title: "Epic React", provider: "Kent C. Dodds" }
        ],
        projects: [
          { title: "Performance Profiler Canvas", description: "Build a drag-and-drop component interface monitoring rendering re-renders and virtual DOM node depths.", complexity: "Advanced" },
          { title: "Real-time Multi-user Canvas", description: "Implement WebSockets to create a collaborative whiteboard using optimized React state syncing.", complexity: "Medium" }
        ],
        practiceQuestions: [
          "Explain the difference between concurrent rendering and traditional rendering in React 19.",
          "How would you optimize an infinite scroll list causing severe layout shifts?"
        ],
        certifications: [
          "Meta Front-End Developer Certificate",
          "Udemy React Professional"
        ]
      }
    },
    "skill-2": {
      id: "skill-2",
      userId: "default-user",
      name: "TypeScript",
      level: "Intermediate",
      addedAt: "2026-06-05",
      suggestions: {
        courses: [
          { title: "TypeScript Pro Bootcamp", provider: "Frontend Masters" },
          { title: "Advanced TypeScript", provider: "Coursera" }
        ],
        projects: [
          { title: "Type-safe Express Schema Guard", description: "Write an automatic decorator system validating body schemas mapping to runtime objects.", complexity: "Advanced" }
        ],
        practiceQuestions: [
          "Explain conditional types and the 'infer' keyword with structural examples.",
          "Write a type mapping to transform all object values to readonly promises."
        ],
        certifications: [
          "Microsoft TypeScript Masterclass"
        ]
      }
    }
  },
  certifications: {
    "cert-1": {
      id: "cert-1",
      userId: "default-user",
      name: "Google Cloud Digital Leader",
      issuer: "Google",
      status: "Completed",
      date: "2026-04-12",
      credentialUrl: "https://cloud.google.com/certification"
    },
    "cert-2": {
      id: "cert-2",
      userId: "default-user",
      name: "AWS Certified Cloud Practitioner",
      issuer: "AWS",
      status: "In Progress",
      date: "2026-07-20",
      credentialUrl: ""
    }
  },
  interviewSessions: {}
});

// Load Database
const loadDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData = getDefaultDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to parse db.json, returning default", err);
    return getDefaultDb();
  }
};

// Save Database
const saveDb = (data: any) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to db.json", err);
  }
};

// Gamification reward calculator helper
const awardXp = (userId: string, xpAmount: number, db: any) => {
  const user = db.users[userId];
  if (!user) return null;

  user.xp += xpAmount;
  let leveledUp = false;

  // Level up progression (e.g. 1000 XP per level, scales incrementally)
  while (user.xp >= user.nextLevelXp) {
    user.xp -= user.nextLevelXp;
    user.level += 1;
    user.nextLevelXp = Math.floor(user.nextLevelXp * 1.2);
    leveledUp = true;
  }

  // Check and unlock badges based on progress
  const unlockedBadges = user.badges || [];
  const addedBadges: string[] = [];

  // Resume Master (Uploaded a resume or generated analysis)
  if (!unlockedBadges.includes("resume_master") && Object.keys(db.resumeAnalyses).filter(k => db.resumeAnalyses[k].userId === userId).length > 0) {
    unlockedBadges.push("resume_master");
    addedBadges.push("resume_master");
  }

  // Job Hunter (At least 3 applications added)
  const userApplications = Object.values(db.jobs).filter((j: any) => j.userId === userId);
  if (!unlockedBadges.includes("job_hunter") && userApplications.length >= 3) {
    unlockedBadges.push("job_hunter");
    addedBadges.push("job_hunter");
  }

  // Skill Builder (At least 3 skills tracked)
  const userSkills = Object.values(db.skills).filter((s: any) => s.userId === userId);
  if (!unlockedBadges.includes("skill_builder") && userSkills.length >= 3) {
    unlockedBadges.push("skill_builder");
    addedBadges.push("skill_builder");
  }

  // Interview Hero (At least 1 completed mock interview session)
  const userSessions = Object.values(db.interviewSessions).filter((s: any) => s.userId === userId && s.score !== undefined);
  if (!unlockedBadges.includes("interview_hero") && userSessions.length >= 1) {
    unlockedBadges.push("interview_hero");
    addedBadges.push("interview_hero");
  }

  user.badges = unlockedBadges;
  return { level: user.level, xp: user.xp, nextLevelXp: user.nextLevelXp, leveledUp, addedBadges };
};

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Authenticate / Get profile
app.get("/api/profile", (req, res) => {
  const db = loadDb();
  const email = req.query.email as string || "sukeshananya@gmail.com";
  
  // Find user by email or return default
  let user = Object.values(db.users).find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // Register new user on the fly
    const uid = `user_${Date.now()}`;
    db.users[uid] = {
      uid,
      email,
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      photoUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      targetRole: "Graduate Analyst",
      bio: "Fresh graduate taking the first steps to direct my career with digital automation, analytics, and intelligent pilots.",
      experienceLevel: "Fresher / Graduate",
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
      badges: [],
      skills: []
    };
    saveDb(db);
    user = db.users[uid];
  }
  
  res.json(user);
});

// Update profile details
app.post("/api/profile", (req, res) => {
  const db = loadDb();
  const { uid, name, targetRole, bio, experienceLevel } = req.body;
  
  if (!uid || !db.users[uid]) {
    return res.status(404).json({ error: "User profile not found." });
  }
  
  const user = db.users[uid];
  user.name = name || user.name;
  user.targetRole = targetRole || user.targetRole;
  user.bio = bio || user.bio;
  user.experienceLevel = experienceLevel || user.experienceLevel;
  
  saveDb(db);
  res.json(user);
});

// Get all applications
app.get("/api/jobs", (req, res) => {
  const db = loadDb();
  const userId = req.query.userId as string || "default-user";
  const userJobs = Object.values(db.jobs).filter((j: any) => j.userId === userId);
  res.json(userJobs);
});

// Create application
app.post("/api/jobs", (req, res) => {
  const db = loadDb();
  const { userId, company, role, status, location, salary, notes, interviewDate } = req.body;
  
  if (!company || !role || !status) {
    return res.status(400).json({ error: "Missing required job details." });
  }
  
  const id = `job_${Date.now()}`;
  const newJob = {
    id,
    userId: userId || "default-user",
    company,
    role,
    status,
    location: location || "Remote",
    salary: salary || "",
    appliedDate: new Date().toISOString().split("T")[0],
    interviewDate: interviewDate || undefined,
    notes: notes || "",
    updatedAt: new Date().toISOString().split("T")[0]
  };
  
  db.jobs[id] = newJob;
  
  // Award XP for tracking application
  const uId = userId || "default-user";
  const reward = awardXp(uId, 50, db); // 50 XP per job logged
  
  saveDb(db);
  res.status(201).json({ job: newJob, gamification: reward });
});

// Update application status/details
app.put("/api/jobs/:id", (req, res) => {
  const db = loadDb();
  const { id } = req.params;
  const { status, company, role, location, salary, notes, interviewDate } = req.body;
  
  if (!db.jobs[id]) {
    return res.status(404).json({ error: "Job application not found." });
  }
  
  const job = db.jobs[id];
  const oldStatus = job.status;
  
  job.status = status || job.status;
  job.company = company || job.company;
  job.role = role || job.role;
  job.location = location || job.location;
  job.salary = salary || job.salary;
  job.notes = notes || job.notes;
  job.interviewDate = interviewDate || job.interviewDate;
  job.updatedAt = new Date().toISOString().split("T")[0];
  
  // If moving to Interview Scheduled, award extra XP!
  let reward = null;
  if (oldStatus !== "Interview Scheduled" && status === "Interview Scheduled") {
    reward = awardXp(job.userId, 100, db); // 100 XP for landing interview
  } else if (oldStatus !== "Offer Received" && status === "Offer Received") {
    reward = awardXp(job.userId, 200, db); // 200 XP for offer received!
  } else {
    // Recalculate badges in case list grew
    reward = awardXp(job.userId, 0, db);
  }
  
  saveDb(db);
  res.json({ job, gamification: reward });
});

// Delete application
app.delete("/api/jobs/:id", (req, res) => {
  const db = loadDb();
  const { id } = req.params;
  
  if (!db.jobs[id]) {
    return res.status(404).json({ error: "Job application not found." });
  }
  
  delete db.jobs[id];
  saveDb(db);
  res.json({ success: true, message: "Job application deleted." });
});

// ==========================================
// SKILLS TRACKER
// ==========================================

// Get user skills
app.get("/api/skills", (req, res) => {
  const db = loadDb();
  const userId = req.query.userId as string || "default-user";
  const userSkills = Object.values(db.skills).filter((s: any) => s.userId === userId);
  res.json(userSkills);
});

// Create/Add skill and fetch AI suggestions via Gemini
app.post("/api/skills", async (req, res) => {
  const db = loadDb();
  const { userId, name, level } = req.body;
  
  if (!name || !level) {
    return res.status(400).json({ error: "Skill name and proficiency level are required." });
  }
  
  const uId = userId || "default-user";
  const user = db.users[uId];
  const targetRole = user ? user.targetRole : "Software Engineer";
  
  const id = `skill_${Date.now()}`;
  
  // Set default suggestions structure
  let suggestions = {
    courses: [
      { title: `Complete ${name} Masterclass`, provider: "Udemy" },
      { title: `Intermediate ${name} Essentials`, provider: "Coursera" }
    ],
    projects: [
      { title: `Comprehensive ${name} Sandbox`, description: `Build a highly modular dashboard showcasing multiple implementations of ${name} structures.`, complexity: "Medium" }
    ],
    practiceQuestions: [
      `What are the foundational core tenets of ${name} and when should they be avoided?`,
      `Detail a common scaling bottleneck encountered in ${name} and explain how to design around it.`
    ],
    certifications: [
      `Professional Certification in ${name}`
    ]
  };
  
  // Fetch from Gemini if client initialized
  if (ai) {
    try {
      const prompt = `You are an elite career development strategist.
The student is adding the skill "${name}" (current proficiency: ${level}) to their tracker. Their target career role is "${targetRole}".
Generate a strictly JSON response that conforms to this schema:
{
  "courses": [
    { "title": "Course Title", "provider": "Coursera/Udemy/Pluralsight/etc." }
  ],
  "projects": [
    { "title": "Project Title", "description": "1-2 sentence compelling project idea that demonstrates this skill in a professional portfolio", "complexity": "Beginner/Medium/Advanced" }
  ],
  "practiceQuestions": [
    "Technical or interview question to test this skill 1",
    "Technical or interview question to test this skill 2"
  ],
  "certifications": [
    "Most highly valued industry certification for this skill 1",
    "Certification 2"
  ]
}
Provide exactly 2 courses, 2 highly creative and polished portfolio projects, 2 interview prep questions, and 1-2 recognized certifications. No markdown headers, wrap inside the requested JSON object directly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              courses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    provider: { type: Type.STRING }
                  },
                  required: ["title", "provider"]
                }
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    complexity: { type: Type.STRING }
                  },
                  required: ["title", "description", "complexity"]
                }
              },
              practiceQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              certifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["courses", "projects", "practiceQuestions", "certifications"]
          }
        }
      });
      
      if (response.text) {
        suggestions = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error("Gemini failed to generate skill recommendations, using defaults:", err);
    }
  }
  
  const newSkill = {
    id,
    userId: uId,
    name,
    level,
    addedAt: new Date().toISOString().split("T")[0],
    suggestions
  };
  
  db.skills[id] = newSkill;
  
  // Add to user skills array if not already present
  if (user && !user.skills.includes(name)) {
    user.skills.push(name);
  }
  
  // Award XP for tracking skill
  const reward = awardXp(uId, 80, db); // 80 XP per skill logged
  
  saveDb(db);
  res.status(201).json({ skill: newSkill, gamification: reward });
});

// Delete skill
app.delete("/api/skills/:id", (req, res) => {
  const db = loadDb();
  const { id } = req.params;
  
  if (!db.skills[id]) {
    return res.status(404).json({ error: "Skill not found." });
  }
  
  const skill = db.skills[id];
  const uId = skill.userId;
  const name = skill.name;
  
  delete db.skills[id];
  
  // Remove from user skills array
  const user = db.users[uId];
  if (user) {
    user.skills = user.skills.filter(s => s !== name);
  }
  
  saveDb(db);
  res.json({ success: true, message: "Skill removed." });
});

// ==========================================
// CERTIFICATION TRACKER
// ==========================================

// Get user certifications
app.get("/api/certifications", (req, res) => {
  const db = loadDb();
  const userId = req.query.userId as string || "default-user";
  const userCerts = Object.values(db.certifications).filter((c: any) => c.userId === userId);
  res.json(userCerts);
});

// Create certification
app.post("/api/certifications", (req, res) => {
  const db = loadDb();
  const { userId, name, issuer, status, date, credentialUrl } = req.body;
  
  if (!name || !issuer || !status) {
    return res.status(400).json({ error: "Name, issuer, and status are required." });
  }
  
  const id = `cert_${Date.now()}`;
  const newCert = {
    id,
    userId: userId || "default-user",
    name,
    issuer,
    status,
    date: date || undefined,
    credentialUrl: credentialUrl || ""
  };
  
  db.certifications[id] = newCert;
  
  // Award XP for adding certification
  const uId = userId || "default-user";
  const xpReward = status === "Completed" ? 150 : 50; // Extra XP for completed certs!
  const reward = awardXp(uId, xpReward, db);
  
  saveDb(db);
  res.status(201).json({ certification: newCert, gamification: reward });
});

// Update certification
app.put("/api/certifications/:id", (req, res) => {
  const db = loadDb();
  const { id } = req.params;
  const { name, issuer, status, date, credentialUrl } = req.body;
  
  if (!db.certifications[id]) {
    return res.status(404).json({ error: "Certification not found." });
  }
  
  const cert = db.certifications[id];
  const oldStatus = cert.status;
  
  cert.name = name || cert.name;
  cert.issuer = issuer || cert.issuer;
  cert.status = status || cert.status;
  cert.date = date || cert.date;
  cert.credentialUrl = credentialUrl || cert.credentialUrl;
  
  let reward = null;
  if (oldStatus !== "Completed" && status === "Completed") {
    reward = awardXp(cert.userId, 120, db); // extra 120 XP on completion!
  } else {
    reward = awardXp(cert.userId, 0, db);
  }
  
  saveDb(db);
  res.json({ certification: cert, gamification: reward });
});

// Delete certification
app.delete("/api/certifications/:id", (req, res) => {
  const db = loadDb();
  const { id } = req.params;
  
  if (!db.certifications[id]) {
    return res.status(404).json({ error: "Certification not found." });
  }
  
  delete db.certifications[id];
  saveDb(db);
  res.json({ success: true, message: "Certification deleted." });
});

// ==========================================
// AI RESUME ANALYZER
// ==========================================

// Get last resume analysis
app.get("/api/resume-analyzer", (req, res) => {
  const db = loadDb();
  const userId = req.query.userId as string || "default-user";
  const analysis = db.resumeAnalyses[userId];
  if (!analysis) {
    return res.status(404).json({ error: "No resume analysis found. Try uploading a resume." });
  }
  res.json(analysis);
});

// Analyze resume text using Gemini
app.post("/api/resume-analyzer", async (req, res) => {
  const db = loadDb();
  const { userId, fileName, resumeText } = req.body;
  
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required for analysis." });
  }
  
  const uId = userId || "default-user";
  const user = db.users[uId];
  const targetRole = user ? user.targetRole : "Software Engineer";
  
  // Default fallbacks in case AI is offline
  let analysis = {
    userId: uId,
    fileName: fileName || "Pasted_Resume.txt",
    score: 72,
    atsCompatibility: 75,
    grammarScore: 88,
    missingSkills: [
      "Docker / Containers",
      "CI/CD Pipeline Configurations",
      "API Testing Suite frameworks",
      "Agile Project Tracking"
    ],
    suggestedImprovements: [
      "Include key business metrics under professional summaries to demonstrate commercial awareness.",
      "Rewrite technology stacks into distinct categorical listings (frontend, backend, database) to improve indexing readability.",
      "Expand detail on team collaborations, outlining specific team sizing and Agile methodologies used."
    ],
    keywordOptimization: [
      { keyword: "Full Stack", density: "0.2%", status: "Missing" },
      { keyword: "GitHub Actions", density: "0%", status: "Missing" },
      { keyword: "TypeScript", density: "1.4%", status: "Optimized" },
      { keyword: "React", density: "2.1%", status: "Optimized" },
      { keyword: "Software Development", density: "3.5%", status: "Overused" }
    ],
    analyzedAt: new Date().toISOString()
  };
  
  if (ai) {
    try {
      const prompt = `You are an elite Tech Recruiter and ATS algorithm evaluator.
Analyze the following resume text. The user is a college student or recent graduate targetting the role of "${targetRole}".
Grade this resume objectively and provide granular, realistic recommendations.
Produce a JSON response that conforms exactly to this structure:
{
  "score": 82, // overall score out of 100
  "atsCompatibility": 78, // ATS compatibility score out of 100
  "grammarScore": 92, // Grammar & readability score out of 100
  "missingSkills": [
    "Skill/Tech 1", "Skill/Tech 2", "Skill/Tech 3"
  ],
  "suggestedImprovements": [
    "Actionable bullet point improvement 1",
    "Actionable bullet point improvement 2",
    "Actionable bullet point improvement 3"
  ],
  "keywordOptimization": [
    { "keyword": "Key Technical Term/Language", "density": "1.2%", "status": "Optimized" }, // status options: 'Optimized', 'Missing', 'Overused'
    { "keyword": "Cloud System Architecture", "density": "0%", "status": "Missing" }
  ]
}

Resume Text:
"""
${resumeText}
"""

Be supportive yet professional. Ensure all metrics and percentages match standard industry thresholds. Strictly return only the JSON object, no wrappers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              atsCompatibility: { type: Type.INTEGER },
              grammarScore: { type: Type.INTEGER },
              missingSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              suggestedImprovements: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              keywordOptimization: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyword: { type: Type.STRING },
                    density: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ["Optimized", "Missing", "Overused"] }
                  },
                  required: ["keyword", "density", "status"]
                }
              }
            },
            required: ["score", "atsCompatibility", "grammarScore", "missingSkills", "suggestedImprovements", "keywordOptimization"]
          }
        }
      });
      
      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        analysis = {
          ...analysis,
          ...parsed,
          fileName: fileName || "Pasted_Resume_AI_Analyzed.txt",
          analyzedAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.error("Gemini failed to analyze resume, using premium defaults:", err);
    }
  }
  
  db.resumeAnalyses[uId] = analysis;
  
  // Award XP for analyzing resume
  const reward = awardXp(uId, 250, db); // Big XP reward for resume uploading
  
  saveDb(db);
  res.json({ analysis, gamification: reward });
});

// ==========================================
// COMPATIBILITY ROUTE ALIASES
// ==========================================

// Support /api/certs alias for /api/certifications
app.get("/api/certs", (req, res) => {
  const db = loadDb();
  const email = req.query.email as string || "sukeshananya@gmail.com";
  const user = Object.values(db.users).find((u: any) => u.email.toLowerCase() === email.toLowerCase()) as any;
  const userId = user ? user.uid : "default-user";
  const userCerts = Object.values(db.certifications).filter((c: any) => c.userId === userId);
  res.json(userCerts);
});

// Support /api/resume alias for /api/resume-analyzer
app.get("/api/resume", (req, res) => {
  const db = loadDb();
  const email = req.query.email as string || "sukeshananya@gmail.com";
  const user = Object.values(db.users).find((u: any) => u.email.toLowerCase() === email.toLowerCase()) as any;
  const userId = user ? user.uid : "default-user";
  const analysis = db.resumeAnalyses[userId];
  if (!analysis) {
    return res.status(404).json({ error: "No resume analysis found." });
  }
  res.json(analysis);
});

// ==========================================
// LINKEDIN OAUTH SIMULATION & SYNC
// ==========================================

app.post("/api/linkedin/sync", (req, res) => {
  const db = loadDb();
  const { email, profileType, customData } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required to sync." });
  }
  
  // Find or create user
  let user: any = Object.values(db.users).find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const uid = `user_${Date.now()}`;
    db.users[uid] = {
      uid,
      email,
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      targetRole: "Graduate Analyst",
      bio: "Fresh graduate.",
      experienceLevel: "Fresher / Graduate",
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
      badges: [],
      skills: []
    };
    user = db.users[uid];
  }
  
  const userId = user.uid;
  
  // Define profile templates
  const templates: Record<string, any> = {
    ananya: {
      name: "Ananya Sukesh",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      targetRole: "Full Stack Engineer",
      bio: "Computer Science student looking to craft elegant, full-stack experiences. Eager to master AI engineering, cloud native architectures, and web standard performances.",
      experienceLevel: "Fresher / Graduate",
      skills: ["React", "TypeScript", "Node.js", "Python", "Docker", "PostgreSQL"],
      certs: [
        { name: "Google Cloud Digital Leader", issuer: "Google", status: "Completed", date: "2026-04-12" },
        { name: "AWS Certified Cloud Practitioner", issuer: "AWS", status: "In Progress", date: "2026-07-20" }
      ],
      jobs: [
        { company: "Google", role: "Associate Software Engineer", status: "Interview Scheduled", location: "Bangalore, India (Hybrid)", salary: "$110k - $130k", appliedDate: "2026-06-10", notes: "Preparation: Revise dynamic programming." },
        { company: "Microsoft", role: "Frontend Engineer Intern", status: "Applied", location: "Hyderabad (Remote)", salary: "$40 / hour", appliedDate: "2026-06-18", notes: "Referral secured from alumni network." },
        { company: "Stripe", role: "Product Engineer", status: "Offer Received", location: "San Francisco, CA (Hybrid)", salary: "$145k + Equity", appliedDate: "2026-05-15", notes: "Incredible recruitment process." }
      ],
      resume: {
        score: 91,
        atsCompatibility: 94,
        grammarScore: 96,
        missingSkills: ["Redis / Caching Layer", "CI/CD Pipelines (GitHub Actions)"],
        suggestedImprovements: [
          "Incorporate metrics-driven accomplishments under professional experience entries.",
          "Add Docker container deployment to showcase cloud enterprise readiness."
        ],
        keywordOptimization: [
          { keyword: "TypeScript", density: "2.1%", status: "Optimized" },
          { keyword: "React", density: "1.8%", status: "Optimized" },
          { keyword: "PostgreSQL", density: "1.2%", status: "Optimized" }
        ]
      }
    },
    alex: {
      name: "Alex Rivera",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      targetRole: "Technical Product Manager",
      bio: "Technical PM with a software engineering foundation. Expert at bridge-building between engineering, design, and business goals to deliver world-class developer tools.",
      experienceLevel: "Mid-Level Professional",
      skills: ["Product Strategy", "System Design", "SQL", "Agile Methodologies", "Jira", "API Design"],
      certs: [
        { name: "Certified Scrum Product Owner (CSPO)", issuer: "Other", status: "Completed", date: "2025-11-05" },
        { name: "Google Project Management Certificate", issuer: "Google", status: "Completed", date: "2026-02-18" }
      ],
      jobs: [
        { company: "Atlassian", role: "Associate Product Manager", status: "Offer Received", location: "Sydney, Australia (Hybrid)", salary: "$130k + Bonus", appliedDate: "2026-06-02", notes: "Focus on Jira automation products." },
        { company: "Vercel", role: "Developer Relations Intern", status: "Applied", location: "Remote", salary: "$45 / hour", appliedDate: "2026-06-19", notes: "Met hiring manager at JS Conf." },
        { company: "Linear", role: "Product Operations Intern", status: "Interview Scheduled", location: "Remote (Global)", salary: "$100k equivalent", appliedDate: "2026-06-15", notes: "Deeply aligned with Linear's product design philosophy." }
      ],
      resume: {
        score: 88,
        atsCompatibility: 91,
        grammarScore: 94,
        missingSkills: ["Python Programming", "Tableau Data Visualization"],
        suggestedImprovements: [
          "Quantify the impact of product releases (e.g., 'Increased retention by 15%').",
          "Include a clear section dedicated to API technical design scope."
        ],
        keywordOptimization: [
          { keyword: "Product Roadmap", density: "1.8%", status: "Optimized" },
          { keyword: "System Architecture", density: "1.1%", status: "Optimized" },
          { keyword: "Agile Scrums", density: "1.5%", status: "Optimized" }
        ]
      }
    },
    samantha: {
      name: "Samantha Chen",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      targetRole: "Cloud Infrastructure Engineer",
      bio: "DevOps Engineer specializing in cloud infrastructure, Kubernetes orchestration, and automated deployment pipelines. Strong believer in Infrastructure as Code.",
      experienceLevel: "Senior Professional",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD Pipelines", "Go"],
      certs: [
        { name: "AWS Certified DevOps Engineer - Professional", issuer: "AWS", status: "Completed", date: "2025-08-14" },
        { name: "Google Cloud Associate Cloud Engineer", issuer: "Google", status: "Completed", date: "2026-01-10" }
      ],
      jobs: [
        { company: "HashiCorp", role: "Solutions Engineer", status: "Offer Received", location: "Seattle, WA (Hybrid)", salary: "$150k + Equity", appliedDate: "2026-05-28", notes: "Focus on Terraform Cloud and Vault workflows." },
        { company: "AWS", role: "Cloud Support Associate", status: "Interview Scheduled", location: "Dallas, TX", salary: "$115k", appliedDate: "2026-06-12", notes: "Preparation on EC2, VPC, IAM, and CloudWatch." },
        { company: "Cloudflare", role: "DevOps Intern", status: "Applied", location: "San Francisco, CA", salary: "$55 / hour", appliedDate: "2026-06-21", notes: "Strong referral from senior infra engineer." }
      ],
      resume: {
        score: 94,
        atsCompatibility: 96,
        grammarScore: 92,
        missingSkills: ["Python Scripting", "Azure Cloud Architecture"],
        suggestedImprovements: [
          "Add details about automated scaling triggers and concrete cost-saving numbers.",
          "Describe load testing metrics that justified network infrastructure overhauls."
        ],
        keywordOptimization: [
          { keyword: "Terraform", density: "2.4%", status: "Optimized" },
          { keyword: "Kubernetes", density: "1.9%", status: "Optimized" },
          { keyword: "CI/CD Pipelines", density: "1.6%", status: "Optimized" }
        ]
      }
    },
    custom: {
      name: customData?.name || "LinkedIn Professional",
      photoUrl: customData?.photoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
      targetRole: customData?.targetRole || "Software Engineer",
      bio: customData?.bio || "Passionate software development professional with a track record of driving impact and building scalable systems.",
      experienceLevel: customData?.experienceLevel || "Mid-Level Professional",
      skills: customData?.skills || ["React", "TypeScript", "Node.js", "System Design"],
      certs: [
        { name: "Meta Professional Certificate", issuer: "Coursera", status: "Completed", date: "2026-01-15" }
      ],
      jobs: [
        { company: "TechCorp", role: "Senior Engineer", status: "Offer Received", location: "Remote", salary: "$140k", appliedDate: "2026-06-01", notes: "Custom imported professional profile." }
      ],
      resume: {
        score: 85,
        atsCompatibility: 89,
        grammarScore: 90,
        missingSkills: ["Cloud Platforms", "CI/CD Deployment"],
        suggestedImprovements: [
          "Clearly showcase individual technical contributions vs group management.",
          "Quantify system load processing gains in numeric metrics."
        ],
        keywordOptimization: [
          { keyword: "TypeScript", density: "1.5%", status: "Optimized" },
          { keyword: "System Design", density: "1.2%", status: "Optimized" }
        ]
      }
    }
  };
  
  const template = templates[profileType] || templates.custom;
  
  // Apply profile update
  user.name = template.name;
  user.photoUrl = template.photoUrl;
  user.targetRole = template.targetRole;
  user.bio = template.bio;
  user.experienceLevel = template.experienceLevel;
  
  // Wipe out previous jobs for this user (to keep it clean and sync completely)
  const previousJobs = Object.keys(db.jobs).filter(id => db.jobs[id].userId === userId);
  previousJobs.forEach(id => delete db.jobs[id]);
  
  // Sync template jobs
  template.jobs.forEach((j: any, index: number) => {
    const id = `job_linkedin_${Date.now()}_${index}`;
    db.jobs[id] = {
      id,
      userId,
      company: j.company,
      role: j.role,
      status: j.status,
      location: j.location,
      salary: j.salary,
      appliedDate: j.appliedDate,
      notes: j.notes,
      updatedAt: new Date().toISOString().split("T")[0]
    };
  });
  
  // Wipe out previous certs for this user
  const previousCerts = Object.keys(db.certifications).filter(id => db.certifications[id].userId === userId);
  previousCerts.forEach(id => delete db.certifications[id]);
  
  // Sync template certs
  template.certs.forEach((c: any, index: number) => {
    const id = `cert_linkedin_${Date.now()}_${index}`;
    db.certifications[id] = {
      id,
      userId,
      name: c.name,
      issuer: c.issuer,
      status: c.status,
      date: c.date,
      credentialUrl: "https://linkedin.com"
    };
  });
  
  // Wipe out previous skills for this user
  const previousSkills = Object.keys(db.skills).filter(id => db.skills[id].userId === userId);
  previousSkills.forEach(id => delete db.skills[id]);
  
  // Sync template skills
  user.skills = [];
  template.skills.forEach((skillName: string, index: number) => {
    const id = `skill_linkedin_${Date.now()}_${index}`;
    user.skills.push(skillName);
    db.skills[id] = {
      id,
      userId,
      name: skillName,
      level: index === 0 ? "Expert" : "Intermediate",
      addedAt: new Date().toISOString().split("T")[0],
      suggestions: {
        courses: [
          { title: `Advanced ${skillName} Masterclass`, provider: "LinkedIn Learning", url: "https://linkedin.com/learning" },
          { title: `${skillName} Certification Program`, provider: "Coursera" }
        ],
        projects: [
          { title: `Simulated Enterprise ${skillName} App`, description: `Develop an open-source tool incorporating advanced concepts of ${skillName}.`, complexity: "Intermediate" }
        ],
        practiceQuestions: [
          `Explain top-tier optimization concepts for ${skillName} in production.`,
          `How does ${skillName} handle high-load horizontal scaling limits?`
        ],
        certifications: [
          `LinkedIn Verified Skill: ${skillName}`
        ]
      }
    };
  });
  
  // Set resume analyses
  db.resumeAnalyses[userId] = {
    userId,
    fileName: `LinkedIn_Profile_Import_${template.name.replace(/\s+/g, '_')}.pdf`,
    score: template.resume.score,
    atsCompatibility: template.resume.atsCompatibility,
    grammarScore: template.resume.grammarScore,
    missingSkills: template.resume.missingSkills,
    suggestedImprovements: template.resume.suggestedImprovements,
    keywordOptimization: template.resume.keywordOptimization,
    analyzedAt: new Date().toISOString()
  };
  
  // Award gamified LinkedIn badge
  const unlockedBadges = user.badges || [];
  if (!unlockedBadges.includes("linkedin_pilot")) {
    unlockedBadges.push("linkedin_pilot");
  }
  user.badges = unlockedBadges;
  
  // Award massive 300 XP
  const reward = awardXp(userId, 300, db);
  
  saveDb(db);
  res.json({ success: true, user, gamification: reward });
});

// ==========================================
// INTERVIEW PREPARATION
// ==========================================

// Get mock interview questions based on role and category
app.get("/api/interview-prep/questions", async (req, res) => {
  const { category, targetRole } = req.query;
  const role = targetRole as string || "Software Engineer";
  const cat = category as string || "Technical";
  
  // Default pre-generated questions fallback
  const fallbacks: Record<string, any[]> = {
    "HR": [
      { id: "q1", category: "HR", question: "Tell me about yourself and why you chose to target our firm.", difficulty: "Easy" },
      { id: "q2", category: "HR", question: "Where do you see your career going in the next five years, and how do we fit into that journey?", difficulty: "Medium" }
    ],
    "Technical": [
      { id: "q3", category: "Technical", question: "What is the differences between asynchronous microtask queues and macrotask queues in runtime execution?", difficulty: "Medium" },
      { id: "q4", category: "Technical", question: "Explain how you would design a highly scalable caching strategy for an API displaying dynamic sports scores.", difficulty: "Hard" }
    ],
    "Coding": [
      { id: "q5", category: "Coding", question: "Given an array of integers representing stock prices over consecutive days, return the maximum profit you can make by buying and selling once.", difficulty: "Medium" },
      { id: "q6", category: "Coding", question: "Write a function to detect if a given linked list contains a cycle. Optimize for O(1) space complexity.", difficulty: "Easy" }
    ],
    "Behavioral": [
      { id: "q7", category: "Behavioral", question: "Describe a project that failed or encountered critical bottlenecks. How did you coordinate the resolution?", difficulty: "Medium" },
      { id: "q8", category: "Behavioral", question: "Detail a time when you had to adapt quickly to a completely unfamiliar framework or API. What was your process?", difficulty: "Easy" }
    ]
  };
  
  let questions = fallbacks[cat] || fallbacks["Technical"];
  
  if (ai) {
    try {
      const prompt = `You are a Principal Software Engineering Recruiter.
Generate 4 highly relevant, highly professional mock interview questions for the candidate role "${role}" in the category "${cat}".
Return a JSON array of questions, conforming strictly to this format:
[
  { "id": "q_1", "category": "${cat}", "question": "Question text here...", "difficulty": "Easy/Medium/Hard" },
  ...
]
Do not include code wrappers or markdown. Generate only the requested JSON array.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                question: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ["id", "category", "question", "difficulty"]
            }
          }
        }
      });
      
      if (response.text) {
        questions = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error("Gemini failed to generate custom interview questions, utilizing premium defaults.", err);
    }
  }
  
  res.json(questions);
});

// Evaluate a user's mock interview answer using Gemini
app.post("/api/interview-prep/evaluate", async (req, res) => {
  const { questionText, userAnswer, category } = req.body;
  
  if (!questionText || !userAnswer) {
    return res.status(400).json({ error: "Question text and user answer are required for evaluation." });
  }
  
  let evaluation = {
    score: 75,
    strengths: "The answer displays reasonable conceptual understanding and lists appropriate technologies.",
    improvements: "Elaborate with actual architectural examples and state specific quantitative metrics rather than vague details.",
    modelAnswer: "A model response would cover: (1) Setting up clean API caching headers, (2) Implementing Redis with key eviction timeouts, (3) Documenting strict interface definitions."
  };
  
  if (ai) {
    try {
      const prompt = `You are an elite Tech Recruiter conducting a live career interview for a "${category}" role.
Evaluate the candidate's answer to the given question. Provide honest, highly detailed constructive feedback.
Respond with a JSON object conforming exactly to this schema:
{
  "score": 85, // objective score out of 100
  "strengths": "1-2 paragraphs detailing exactly what they did well (use of vocabulary, structured logic, concepts covered)",
  "improvements": "1-2 paragraphs detailing concrete, highly technical ways to improve the response (framework metrics, missing key words, better design structures)",
  "modelAnswer": "A perfect, complete mock answer displaying executive level technical proficiency (2-3 paragraphs or bullet list)"
}

Question: "${questionText}"
Candidate's Answer: "${userAnswer}"

Analyze the response strictly. Give a model answer that is fully detailed and ready to memorize.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              strengths: { type: Type.STRING },
              improvements: { type: Type.STRING },
              modelAnswer: { type: Type.STRING }
            },
            required: ["score", "strengths", "improvements", "modelAnswer"]
          }
        }
      });
      
      if (response.text) {
        evaluation = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error("Gemini failed to evaluate interview answer, falling back to smart defaults:", err);
    }
  }
  
  // Save mock session record
  const db = loadDb();
  const userId = req.body.userId || "default-user";
  const sessionId = req.body.sessionId || `session_${Date.now()}`;
  
  let session = db.interviewSessions[sessionId];
  if (!session) {
    session = {
      id: sessionId,
      userId,
      category: category || "Technical",
      date: new Date().toISOString().split("T")[0],
      durationSeconds: 180,
      questionsCount: 0,
      answers: []
    };
  }
  
  session.answers.push({
    questionId: req.body.questionId || `q_${Date.now()}`,
    questionText,
    userAnswer,
    score: evaluation.score,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
    modelAnswer: evaluation.modelAnswer
  });
  
  session.questionsCount = session.answers.length;
  session.score = Math.floor(session.answers.reduce((acc: number, val: any) => acc + val.score, 0) / session.questionsCount);
  
  db.interviewSessions[sessionId] = session;
  
  // Award XP for answering interview prep question
  const reward = awardXp(userId, 100, db); // 100 XP per question completed!
  
  saveDb(db);
  res.json({ evaluation, session, gamification: reward });
});

// ==========================================
// AI CAREER COACH CHATPROXY
// ==========================================

// Chat interface proxy using Gemini
app.post("/api/coach/chat", async (req, res) => {
  const { messages, userRole } = req.body;
  const role = userRole || "Software Engineering Graduate";
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }
  
  // Extract conversation context
  const chatContext = messages.map(m => `${m.sender === "user" ? "Candidate" : "CareerPilot Coach"}: ${m.text}`).join("\n");
  
  // Default response fallback
  let responseText = "I am currently initializing my central neural models. How can I help you navigate your job hunt, portfolio design, or technical challenges today?";
  
  if (ai) {
    try {
      const prompt = `You are "CareerPilot Coach", a premium career coach designed by Google DeepMind, blending the design-mind of Apple, the career network of LinkedIn, and the game dynamics of Duolingo.
Your persona is incredibly supportive, authoritative, encouraging, and highly technical. You give hyper-specific advice (naming libraries, exact networking templates, formatting metrics) rather than generalities.
Help the student who is targetting a career in: "${role}".

Conversation History:
${chatContext}

Provide a supportive, beautifully structured markdown reply. Keep paragraphs elegant, use clean bullet spacing, and suggest real-world actionable steps the candidate can take today (such as reachouts, portfolio code segments, or tech stacks).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      
      if (response.text) {
        responseText = response.text.trim();
      }
    } catch (err) {
      console.error("Gemini failed to generate chat reply, fallback text active.", err);
    }
  }
  
  res.json({ text: responseText });
});

// Clear/Reset DB route (convenient for testing or resetting demo state)
app.post("/api/reset", (req, res) => {
  const defaultData = getDefaultDb();
  saveDb(defaultData);
  res.json({ success: true, message: "Database reset to highly detailed demo state." });
});

// Vite & Static Asset Handling
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerPilot AI Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
