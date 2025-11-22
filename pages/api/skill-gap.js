const ROLE_SKILLS = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"],
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { targetRole, currentSkills } = req.body || {};

    if (!targetRole || !Array.isArray(currentSkills)) {
      return res.status(400).json({
        message: "targetRole (string) and currentSkills (string[]) are required",
      });
    }

    const normalizedRole = targetRole.trim();
    const requiredSkills = ROLE_SKILLS[normalizedRole] || [];

    // 🆕 Case: custom / undefined role
    if (requiredSkills.length === 0) {
      return res.status(200).json({
        targetRole: normalizedRole,
        requiredSkills: [],
        matchedSkills: [],
        missingSkills: [],
        isCustomRole: true,
        recommendations: [
          "This role is not in our predefined list.",
          "Search job postings for this role to identify must-have skills.",
          "Plan learning in 3 steps: fundamentals → tools → portfolio projects.",
        ],
        suggestedLearningOrder: [
          "1. Find required skills on LinkedIn / Naukri / Indeed.",
          "2. Learn core fundamentals before advanced tools.",
          "3. Build 2–3 portfolio projects based on real job requirements.",
          "4. Start interview prep & networking.",
        ],
      });
    }

    // 🆕 Normal predefined role logic
    const normalizedCurrent = currentSkills.map((s) => s.trim().toLowerCase());
    const matchedSkills = requiredSkills.filter((skill) =>
      normalizedCurrent.includes(skill.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(
      (skill) => !normalizedCurrent.includes(skill.toLowerCase())
    );

    const recommendations = [];
    if (missingSkills.length) {
      recommendations.push(
        `Start with missing fundamentals: ${missingSkills.slice(0, 3).join(", ")}`
      );
      recommendations.push("Build small practice projects while learning.");
      recommendations.push("Then create 1–2 portfolio projects based on real jobs.");
    } else {
      recommendations.push("You cover core skills — go deeper into projects & system design.");
      recommendations.push("Create 2 portfolio-ready projects and polish your resume & GitHub.");
    }

    return res.status(200).json({
      targetRole: normalizedRole,
      requiredSkills,
      matchedSkills,
      missingSkills,
      isCustomRole: false,
      recommendations,
      suggestedLearningOrder: [
        "1. Cover missing skills first.",
        "2. Deepen matched skills with intermediate projects.",
        "3. Build 1–2 major portfolio projects.",
        "4. Prepare interview patterns & system design.",
      ],
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
