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
  { label: "Work", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
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
