import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building, 
  Star, 
  MapPin, 
  Briefcase, 
  Users, 
  ArrowUpRight, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle,
  Clock,
  Heart,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { UserProfile, JobApplication } from "../types";

interface CompanyExplorerProps {
  user: UserProfile | null;
  darkMode: boolean;
  onAddJob?: (jobData: any) => Promise<any>;
}

interface Review {
  author: string;
  rating: number;
  role: string;
  comment: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  banner: string;
  rating: number;
  openJobsCount: number;
  size: string;
  industry: string;
  reviews: Review[];
  about: string;
  jobs: {
    id: string;
    title: string;
    salary: string;
    location: string;
    skills: string[];
    description: string;
    responsibilities: string[];
    benefits: string[];
  }[];
}

export default function CompanyExplorer({ user, darkMode, onAddJob }: CompanyExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedJob, setSelectedJob] = useState<{ company: Company; job: any } | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);

  const companies: Company[] = [
    {
      id: "comp-google",
      name: "Google",
      logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=150",
      banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      openJobsCount: 4,
      size: "150,000+ employees",
      industry: "Technology / AI",
      about: "Google's mission is to organize the world's information and make it universally accessible and useful. Our engineering teams tackle core systemic issues across distributed servers, web scales, and foundation model AI.",
      reviews: [
        { author: "Aniket M.", rating: 5, role: "Senior Engineer", comment: "Incredible development speed, rich internal libraries, and absolute work-life balance." },
        { author: "Sarah L.", rating: 4.5, role: "Product Manager", comment: "High scale impact, though navigating corporate levels takes some time." }
      ],
      jobs: [
        {
          id: "google-1",
          title: "Associate Frontend Developer (New Grad)",
          salary: "$135k - $160k",
          location: "Mountain View, CA (Hybrid)",
          skills: ["React", "TypeScript", "HTML5/CSS3"],
          description: "We are looking for exceptional fresh graduates to join our Core Search and Web products group. You will build highly responsive UI dashboards and participate in core browser performance optimizations.",
          responsibilities: [
            "Implement pixel-perfect modular UI components styled with responsive CSS grids.",
            "Collaborate with UX researchers to improve Accessibility (a11y) standards across screens.",
            "Write strict unit and integration tests to guarantee high-grade codebase coverage."
          ],
          benefits: ["Comprehensive medical and dental coverage", "Onsite gourmet dining & micro-kitchens", "Generous 401(k) matching & equity options", "Unlimited learning allowances"]
        }
      ]
    },
    {
      id: "comp-vercel",
      name: "Vercel",
      logo: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=150",
      banner: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      openJobsCount: 2,
      size: "500 - 1000 employees",
      industry: "Cloud & Developer Tools",
      about: "Vercel provides the developer platform and hosting tools to deploy instantly, scale automatically, and deliver stellar digital experiences with zero configurations.",
      reviews: [
        { author: "Damien K.", rating: 5, role: "Core Developer", comment: "Absolute builder paradise. Fully remote and highly collaborative!" }
      ],
      jobs: [
        {
          id: "vercel-1",
          title: "Junior Cloud Infrastructure Engineer",
          salary: "$120k - $145k",
          location: "Remote (Global)",
          skills: ["Docker", "Kubernetes", "AWS/GCP"],
          description: "Help scale Vercel's global edge network. Develop serverless integrations and manage cloud compute distributions with low-latency constraints.",
          responsibilities: [
            "Monitor server clusters and configure scalable edge routers.",
            "Optimize continuous integration and continuous deployment pipelines.",
            "Build secure cloud IAM boundaries and configure alert systems."
          ],
          benefits: ["Fully remote workspace setup allowances", "Yearly company retreat global travel", "Health & fitness monthly stipends"]
        }
      ]
    },
    {
      id: "comp-linear",
      name: "Linear",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150",
      banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      openJobsCount: 1,
      size: "50 - 100 employees",
      industry: "Productivity Software",
      about: "Linear helps software teams streamline projects, sprint pipelines, tasks, and bug tracking. We care deeply about high-fidelity design, instant keyboard shortcuts, and visual speed.",
      reviews: [
        { author: "Elena R.", rating: 5, role: "Product Designer", comment: "We live and breathe design craft. Every pixel is intentional." }
      ],
      jobs: [
        {
          id: "linear-1",
          title: "Junior Product Designer",
          salary: "$110k - $130k",
          location: "Remote (Europe/US)",
          skills: ["Figma", "UI/UX Prototyping", "Tailwind CSS"],
          description: "Collaborate on next-generation features for Linear's issue tracker. Ensure gorgeous typography, smooth animations, and layout rhythmic variations.",
          responsibilities: [
            "Produce clean visual design variations in Figma with high-contrast themes.",
            "Propose custom motion paths, spring constants, and micro-interaction transitions.",
            "Align front-end styles using pure Tailwind CSS utility classes."
          ],
          benefits: ["High-spec MacBook Pro & custom display", "Equity options in a highly profitable firm", "Unlimited paid time off (PTO) policy"]
        }
      ]
    },
    {
      id: "comp-figma",
      name: "Figma",
      logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=150",
      banner: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
      openJobsCount: 1,
      size: "1000 - 2000 employees",
      industry: "Design & Technology",
      about: "Figma is the leading collaborative design platform where teams brainstorm, design, and build digital products in real time.",
      reviews: [
        { author: "Marc A.", rating: 4.6, role: "UI Engineer", comment: "Superb collaborative workspace. The technology stack (WebAssembly, WebGL) is cutting edge." }
      ],
      jobs: [
        {
          id: "figma-1",
          title: "Associate Systems Engineer (C++)",
          salary: "$140k - $165k",
          location: "San Francisco, CA (Hybrid)",
          skills: ["C++", "WebAssembly", "Data Structures"],
          description: "Optimize the core collaborative engine of Figma. Dive deep into canvas rendering calculations, vector nodes, and real-time multiplayer states.",
          responsibilities: [
            "Optimize C++ structures compiled down to WebAssembly for browser speeds.",
            "Benchmark and minimize memory footprints of active visual canvases.",
            "Build robust synchronization algorithms for real-time peer inputs."
          ],
          benefits: ["Figma office catering, gym facilities", "Annual mental health retreat coverage", "Full commuter benefits & matching 401k"]
        }
      ]
    }
  ];

  const handleApply = async (company: Company, job: any) => {
    if (appliedJobs.includes(job.id)) return;
    
    setAppliedJobs(prev => [...prev, job.id]);
    
    // Simulate adding job to tracker via prop
    if (onAddJob) {
      await onAddJob({
        company: company.name,
        role: job.title,
        status: "Applied",
        location: job.location,
        salary: job.salary,
        appliedDate: new Date().toISOString().split('T')[0],
        notes: "Applied via CareerPilot Academy connection!"
      });
    }

    alert(`Success! Your profile and verified academy portfolio have been securely dispatched to the recruitment pipelines of ${company.name} for the "${job.title}" position. You can track this application in your Job Tracker!`);
  };

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleShare = (job: any) => {
    alert(`Copied link to clipboard: https://careerpilot.ai/jobs/${job.id}`);
  };

  const industries = ["All", "Technology / AI", "Cloud & Developer Tools", "Productivity Software", "Design & Technology"];

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6">
      {/* Detail views */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
          >
            {/* Job details overlay card */}
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[90vh] ${
                darkMode ? "bg-slate-900 border-white/10 text-slate-200" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              {/* Image banner with frosted close buttons */}
              <div className="h-44 relative bg-slate-200 shrink-0">
                <img src={selectedJob.company.banner} alt="Company Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/50 backdrop-blur-md text-white border border-white/10 hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                {/* Company Logo and quick info overlap */}
                <div className="absolute bottom-4 left-6 flex items-end space-x-4">
                  <img src={selectedJob.company.logo} alt="Company Logo" className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-lg shrink-0" />
                  <div className="text-white">
                    <h3 className="font-display font-extrabold text-lg leading-tight">{selectedJob.job.title}</h3>
                    <p className="text-xs text-white/80 mt-1">{selectedJob.company.name} • {selectedJob.job.location}</p>
                  </div>
                </div>
              </div>

              {/* Detail Sheet Scroll Area */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
                {/* Highlights row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-white/5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">SALARY RANGE</span>
                    <strong className="text-xs sm:text-sm font-extrabold text-emerald-500 mt-0.5 block">{selectedJob.job.salary}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">WORK MODEL</span>
                    <strong className="text-xs sm:text-sm font-extrabold text-[#2563EB] mt-0.5 block">Hybrid/Remote</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">RATING</span>
                    <strong className="text-xs sm:text-sm font-extrabold text-yellow-500 mt-0.5 block flex items-center">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      {selectedJob.company.rating} / 5
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">SIZE</span>
                    <strong className="text-xs sm:text-sm font-extrabold text-slate-500 mt-0.5 block truncate">{selectedJob.company.size}</strong>
                  </div>
                </div>

                {/* Main columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Job detail nodes */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                      <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-400">Position Overview</h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedJob.job.description}</p>
                    </div>

                    {/* Responsibilities */}
                    <div className="space-y-2">
                      <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#2563EB]">Core Responsibilities</h4>
                      <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                        {selectedJob.job.responsibilities.map((resp: string) => (
                          <li key={resp}>{resp}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#10B981]">Compensations & Benefits</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedJob.job.benefits.map((b: string) => (
                          <div key={b} className="p-2.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Skills, About Company, Reviews */}
                  <div className="space-y-6">
                    {/* Skills Required */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f172a]/20 space-y-2">
                      <h4 className="font-display font-bold text-xs uppercase text-slate-400">Key Skills Required</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.job.skills.map((skill: string) => (
                          <span key={skill} className="px-2.5 py-0.5 bg-blue-500/10 text-[#2563EB] rounded text-[11px] font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* About Company snippet */}
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-xs uppercase text-slate-400">About {selectedJob.company.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{selectedJob.company.about}</p>
                    </div>

                    {/* Quick Reviews snippet */}
                    <div className="space-y-2.5">
                      <h4 className="font-display font-bold text-xs uppercase text-slate-400">Employee Reviews</h4>
                      <div className="space-y-2">
                        {selectedJob.company.reviews.map((rev) => (
                          <div key={rev.author} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-[11px]">
                            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                              <span>{rev.author} • {rev.role}</span>
                              <span className="text-yellow-500 font-bold flex items-center">
                                <Star className="w-3 h-3 fill-current mr-0.5" /> {rev.rating}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mt-1 italic">"{rev.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-4 sm:p-6 border-t border-slate-200/40 dark:border-slate-800/40 shrink-0 flex items-center gap-3 bg-slate-50/55 dark:bg-slate-900/45">
                <button
                  onClick={() => handleBookmark(selectedJob.job.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    bookmarkedJobs.includes(selectedJob.job.id)
                      ? "border-amber-500 bg-amber-500/10 text-amber-500"
                      : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  }`}
                  title="Bookmark Position"
                >
                  {bookmarkedJobs.includes(selectedJob.job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => handleShare(selectedJob.job)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-all"
                  title="Share Listing"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleApply(selectedJob.company, selectedJob.job)}
                  disabled={appliedJobs.includes(selectedJob.job.id)}
                  className={`flex-1 py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm text-center flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/10 ${
                    appliedJobs.includes(selectedJob.job.id)
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-400"
                      : "bg-[#2563EB] hover:bg-blue-600 text-white"
                  }`}
                >
                  <span>{appliedJobs.includes(selectedJob.job.id) ? "Applied Successfully" : "Apply Now via CareerPilot"}</span>
                  <ArrowUpRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Companies Exploration List */}
      <div className="space-y-6">
        {/* Search and Filters row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, job titles, technologies, skills required..."
              className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl outline-none border focus:border-[#2563EB] transition-colors ${
                darkMode ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            />
          </div>

          <div className="flex items-center space-x-2 scrollbar-none overflow-x-auto pb-1 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedIndustry === ind
                    ? "bg-[#2563EB] text-white"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* List Grid of Companies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompanies.map((comp) => (
            <div
              key={comp.id}
              className={`rounded-3xl border shadow-sm p-6 relative overflow-hidden group flex flex-col justify-between ${
                darkMode ? "bg-slate-900/40 border-white/10" : "bg-white border-slate-200/60"
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img src={comp.logo} alt={comp.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm" />
                    <div>
                      <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white">{comp.name}</h3>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{comp.industry}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-yellow-500 flex items-center justify-end">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                      {comp.rating}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{comp.size}</span>
                  </div>
                </div>

                {/* About company block */}
                <p className="text-xs text-slate-500 mt-4 leading-relaxed line-clamp-2">
                  {comp.about}
                </p>

                {/* Open jobs header */}
                <div className="mt-5 border-t border-slate-200/30 dark:border-slate-800/30 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-2">
                    <span>AVAILABLE OPENINGS ({comp.openJobsCount})</span>
                    <span className="text-emerald-500 uppercase">Actively Hiring</span>
                  </div>

                  {/* Jobs list */}
                  <div className="space-y-2">
                    {comp.jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob({ company: comp, job })}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          darkMode 
                            ? "bg-[#0f172a] border-white/5 hover:border-blue-500/30 hover:bg-white/5" 
                            : "bg-slate-50 border-slate-200/50 hover:border-blue-500/30 hover:bg-slate-100"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-xs text-slate-800 dark:text-white block truncate">{job.title}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{job.location} • {job.salary}</span>
                        </div>
                        <span className="p-1.5 rounded-xl bg-blue-500/10 text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all shrink-0">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Quick reviews slide trigger */}
              <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400">
                <span>Featured Review: "{comp.reviews[0].comment.slice(0, 45)}..."</span>
                <button
                  onClick={() => setSelectedJob({ company: comp, job: comp.jobs[0] })}
                  className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
