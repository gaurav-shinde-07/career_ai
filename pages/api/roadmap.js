const PREDEFINED_ROADMAPS = {
  "Backend Developer": [
    {
      id: "phase-1",
      title: "Phase 1 • Foundations & Git",
      duration: "1–2 months",
      description:
        "Build a strong base in Java and object-oriented programming. Get comfortable with Git and basic terminal usage.",
      focusAreas: ["Java basics", "OOP", "Git", "Data structures (intro)"],
    },
    {
      id: "phase-2",
      title: "Phase 2 • APIs & Persistence",
      duration: "2 months",
      description:
        "Learn Spring Boot, build REST APIs, and connect them to relational databases using SQL.",
      focusAreas: ["Spring Boot", "REST APIs", "SQL", "Authentication basics"],
    },
    {
      id: "phase-3",
      title: "Phase 3 • Real Projects & Deployment",
      duration: "1–2 months",
      description:
        "Build 1–2 real portfolio projects, deploy them, and learn basic system design.",
      focusAreas: ["Deployment", "System design basics", "Portfolio projects"],
    },
  ],
  "Frontend Developer": [
    {
      id: "phase-1",
      title: "Phase 1 • Web Fundamentals",
      duration: "1–2 months",
      description:
        "Master HTML, modern CSS (Flexbox/Grid), and vanilla JavaScript for core web concepts.",
      focusAreas: ["HTML", "CSS", "JavaScript basics"],
    },
    {
      id: "phase-2",
      title: "Phase 2 • React & Tooling",
      duration: "2 months",
      description:
        "Learn React, component architecture, and basic state management. Use Git daily.",
      focusAreas: ["React", "Git", "APIs", "Routing"],
    },
    {
      id: "phase-3",
      title: "Phase 3 • UI Engineering & Projects",
      duration: "1–2 months",
      description:
        "Build responsive dashboards and micro frontends. Focus on performance and DX.",
      focusAreas: ["Responsive design", "Testing basics", "Portfolio projects"],
    },
  ],
  "Data Analyst": [
    {
      id: "phase-1",
      title: "Phase 1 • Spreadsheet & SQL Foundations",
      duration: "1–2 months",
      description:
        "Get comfortable with Excel/Sheets and write basic to intermediate SQL queries.",
      focusAreas: ["Excel", "SQL basics", "Data cleaning"],
    },
    {
      id: "phase-2",
      title: "Phase 2 • Python & Dashboards",
      duration: "2 months",
      description:
        "Use Python for analysis and build dashboards using tools like Power BI, Tableau, or similar.",
      focusAreas: ["Python", "Dashboards", "Visualization"],
    },
    {
      id: "phase-3",
      title: "Phase 3 • Case Studies & Portfolio",
      duration: "1–2 months",
      description:
        "Create 2–3 case-study style projects with real datasets and end-to-end storytelling.",
      focusAreas: ["Storytelling", "Statistics", "Portfolio projects"],
    },
  ],
};

function genericRoadmap(role) {
  return [
    {
      id: "phase-1",
      title: "Phase 1 • Fundamentals",
      duration: "1–2 months",
      description:
        "Identify core concepts for this role and cover fundamentals from official docs and beginner courses.",
      focusAreas: ["Core concepts", "Syntax & tools", "Version control"],
    },
    {
      id: "phase-2",
      title: "Phase 2 • Projects & Tooling",
      duration: "2 months",
      description:
        "Build 2–3 small projects that apply the fundamentals. Learn the standard tools used in the industry.",
      focusAreas: ["Projects", "Tooling", "Debugging"],
    },
    {
      id: "phase-3",
      title: "Phase 3 • Portfolio & Interviews",
      duration: "1–2 months",
      description:
        "Polish your portfolio, document your learnings, and prepare for role-specific interview patterns.",
      focusAreas: ["Portfolio", "Interview prep", "Networking"],
    },
  ];
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { targetRole } = req.body || {};
    if (!targetRole || typeof targetRole !== "string") {
      return res
        .status(400)
        .json({ message: "targetRole (string) is required" });
    }

    const normalizedRole = targetRole.trim();
    const phases =
      PREDEFINED_ROADMAPS[normalizedRole] || genericRoadmap(normalizedRole);

    return res.status(200).json({
      targetRole: normalizedRole,
      phases,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
