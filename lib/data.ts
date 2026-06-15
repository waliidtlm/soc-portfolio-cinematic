// ----------------------------------------------------------------------------
// Centralized portfolio content. Edit values here to update the whole site.
// TODO(waliid): confirm name spelling + add real social/CV links + real metrics.
// ----------------------------------------------------------------------------

export const profile = {
  name: "Waliid Tlemcani",
  firstName: "Waliid",
  role: "SOC Analyst & Cybersecurity Professional",
  tagline: "Threat Detection & Response",
  location: "Remote / Global",
  email: "tlemcani.waliid@gmail.com",
  github: "https://github.com/waliidtlm", // TODO: confirm handle
  linkedin: "https://linkedin.com/in/yourprofile", // TODO: real URL
  cvUrl: "/cv.pdf", // TODO: drop cv.pdf into /public
  mission: "Make the digital world a safer place",
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// --- Hero floating widgets ---------------------------------------------------
export const liveFeed = [
  { value: "12.5M", label: "Events Analyzed" },
  { value: "842", label: "Alerts Generated" },
  { value: "128", label: "Incidents Resolved" },
];

export const threatActivity = {
  level: "LOW",
  // normalized 0..1 sample points for the mini sparkline
  series: [0.3, 0.45, 0.35, 0.5, 0.42, 0.38, 0.55, 0.4, 0.34, 0.46, 0.3, 0.28],
};

export const topThreatTypes = [
  { label: "Phishing", weight: 0.92 },
  { label: "Brute Force", weight: 0.7 },
  { label: "Initial Access", weight: 0.55 },
  { label: "Persistence", weight: 0.38 },
];

// --- Projects ----------------------------------------------------------------
export type Project = {
  badge: string;
  category: "siem" | "intel" | "automation" | "detection";
  title: string;
  problem: string;
  impact: string;
  tech: string[];
  image: string;
  href?: string; // optional external/case-study link; falls back to "#"
};

export const projects: Project[] = [
  {
    badge: "SIEM",
    category: "siem",
    title: "SIEM Detection Platform",
    problem: "Built a real-time detection platform using the ELK stack and custom correlation rules.",
    impact: "Reduced alert triage time by 60%",
    tech: ["ELK", "Python", "Sigma", "Docker"],
    image: "/images/projects/siem.jpg",
  },
  {
    badge: "THREAT INTEL",
    category: "intel",
    title: "Threat Intelligence Hub",
    problem: "Aggregated multi-source threat intel into a single actionable, deduplicated feed.",
    impact: "Improved threat visibility by 45%",
    tech: ["MISP", "Python", "OpenCTI", "Flask"],
    image: "/images/projects/threat-intel.jpg",
  },
  {
    badge: "AUTOMATION",
    category: "automation",
    title: "Phishing Analysis Framework",
    problem: "Automated phishing URL detonation, screenshotting, and IOC extraction end to end.",
    impact: "Automated 80% of manual work",
    tech: ["Python", "Selenium", "VirusTotal", "SQLite"],
    image: "/images/projects/phishing.jpg",
  },
  {
    badge: "DETECTION",
    category: "detection",
    title: "Detection Engineering Lab",
    problem: "Developed and validated detection use-cases mapped to the MITRE ATT&CK framework.",
    impact: "Created 25+ detection rules",
    tech: ["Splunk", "KQL", "ATT&CK", "Sigma"],
    image: "/images/projects/detection-lab.jpg",
  },
];

// --- Skills (network graph) --------------------------------------------------
export type SkillCluster = {
  key: string;
  title: string;
  icon: string; // lucide icon name, mapped in component
  tools: string[];
};

export const skillClusters: SkillCluster[] = [
  { key: "siem", title: "SIEM", icon: "Activity", tools: ["Splunk", "Elastic Stack", "Microsoft Sentinel", "QRadar"] },
  { key: "detection", title: "Detection Engineering", icon: "Crosshair", tools: ["Sigma", "KQL", "DetectIQ", "YARA"] },
  { key: "intel", title: "Threat Intelligence", icon: "Radar", tools: ["MISP", "OpenCTI", "Threat Feeds", "VirusTotal"] },
  { key: "edr", title: "EDR / XDR", icon: "ShieldCheck", tools: ["CrowdStrike", "Microsoft Defender", "Wazuh"] },
  { key: "ir", title: "Incident Response", icon: "Siren", tools: ["TheHive", "Cortex", "Shuffle", "Response Actions"] },
  { key: "cloud", title: "Cloud Security", icon: "Cloud", tools: ["AWS", "Azure", "Google Cloud"] },
];

// --- SOC Operations dashboard ------------------------------------------------
export type SocStat = {
  label: string;
  value: number;
  display?: string;
  suffix?: string;
  delta?: string;
  trend?: "up" | "down";
  note?: string;
  series: number[];
  color: string; // css var token
};

export const socStats: SocStat[] = [
  { label: "Alerts Investigated", value: 1247, delta: "+18%", trend: "up", series: [12, 18, 14, 22, 19, 26, 24, 30, 28, 34], color: "var(--color-ok)" },
  { label: "Mean Time to Respond", value: 18, suffix: "m", delta: "-32%", trend: "down", series: [40, 36, 38, 30, 28, 24, 26, 21, 19, 18], color: "var(--color-med)" },
  { label: "Detections Fired", value: 2341, delta: "+20%", trend: "up", series: [20, 24, 22, 30, 28, 36, 40, 44, 48, 52], color: "var(--color-cyan)" },
  { label: "Threat Feeds", value: 14, note: "Active & Updating", series: [], color: "var(--color-accent-bright)" },
  { label: "Incidents Handled", value: 83, delta: "+12%", trend: "up", series: [4, 6, 5, 8, 7, 9, 8, 11, 10, 12], color: "#c084fc" },
];

export const threatFeedSources = ["MISP", "AbuseIPDB", "AlienVault", "OTX"];

export const severity = [
  { label: "High", value: 12, color: "var(--color-high)" },
  { label: "Medium", value: 34, color: "var(--color-med)" },
  { label: "Low", value: 54, color: "var(--color-low)" },
];

export const mitreTechniques = [
  { label: "Initial Access", value: 327 },
  { label: "Execution", value: 278 },
  { label: "Persistence", value: 184 },
  { label: "Credential Access", value: 132 },
];

export const recentAlerts = [
  { time: "10:24:15", name: "Suspicious PowerShell Activity", severity: "High" as const },
  { time: "10:18:42", name: "Multiple Failed Logins", severity: "Medium" as const },
  { time: "10:12:09", name: "Unusual Data Exfiltration Pattern", severity: "High" as const },
  { time: "10:05:33", name: "New Admin User Created", severity: "Low" as const },
];

// --- Certifications ----------------------------------------------------------
export type Cert = {
  title: string;
  issuer: string;
  abbr: string;
  image?: string; // optional badge image in /public/images/certs
};

export const certifications: Cert[] = [
  { title: "GIAC Certified SOC Analyst (GCSA)", issuer: "GIAC", abbr: "GCSA", image: "/images/certs/gcsa.png" },
  { title: "CompTIA Security+", issuer: "CompTIA", abbr: "SEC+", image: "/images/certs/secplus.png" },
  { title: "Microsoft Certified: Azure Security Engineer Associate", issuer: "Microsoft", abbr: "AZ-500", image: "/images/certs/azure.png" },
  { title: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", abbr: "CEH", image: "/images/certs/ceh.png" },
  { title: "ISO 27001 Lead Implementer", issuer: "PECB", abbr: "ISO", image: "/images/certs/iso.png" },
];

// --- About -------------------------------------------------------------------
export const about = {
  bio: [
    "I thrive in environments where I can turn noise into signal. My mission is to strengthen defenses, hunt threats, and help organizations stay resilient in an ever-evolving threat landscape.",
    "When I'm not analyzing threats, I'm automating processes, sharing knowledge, or exploring new technologies.",
  ],
  highlights: [
    { icon: "TrendingUp", label: "5+ Years in Cybersecurity" },
    { icon: "Crosshair", label: "SOC Analyst & Threat Hunter" },
    { icon: "ShieldCheck", label: "Focus on Detection & Response" },
  ],
  tags: ["Threat Hunting", "Automation", "Content Creator", "CTF Player"],
  terminal: [
    { k: "Name", v: "Waliid Tlemcani" },
    { k: "Role", v: "SOC Analyst" },
    { k: "Location", v: "Remote" },
    { k: "Focus", v: "Threat Detection & Response" },
    { k: "Mission", v: "Make the digital world a safer place" },
  ],
};
