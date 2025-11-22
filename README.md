# CodeAtRandom CareerPath_AI

Minimal full-stack implementation for skill-gap analysis, career roadmap generation, and live tech news integration.

Everything is built inside a single Next.js project, making it seamless to deploy on Vercel without managing a separate backend.

🚀 Tech Stack

- **Frontend:** Next.js (React) + TailwindCSS
- **Backend:** Next.js API Routes (Node.js)
- **Public API:** HackerNews API
- **Deployment:** Vercel

📌 Folder Structure

```
careerpath-ai-next/
 ├ pages/               → Next.js routes (UI + API)
 │   ├ index.js         → Main dashboard UI
 │   └ api/             → Backend API routes
 │        ├ skill-gap.js
 │        ├ roadmap.js
 │        └ news.js
 ├ styles/              → Tailwind styles
 ├ public/              → Static assets
 ├ package.json
 ├ next.config.mjs
 ├ vercel.json
 └ README.md
```

🔧 Local Development

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

App will be available at:

```
http://localhost:3000
```

🧠 API Endpoints (Backend via Next.js API Routes)

- **POST** `/api/skill-gap` — Detect skill match & missing skills for target role
- **POST** `/api/roadmap` — Return 3-phase learning roadmap
- **GET** `/api/news` — Fetch top 5 latest tech stories from HackerNews

🎯 Features

- Enter a target role + current skills and get:
  - 🟢 Skill-gap insights (matched + missing skills)
  - 🟣 AI-style 3-phase learning roadmap (mock logic, not generative AI)
  - 🔥 Latest tech news from HackerNews (score, author, link, timestamp)
- Mobile-friendly + clean UI
- Dark theme with minimal modern aesthetics

🔍 Assumptions

- Predefined roles: Frontend Developer, Backend Developer, Data Analyst
- If a custom role is entered, the system returns:
  - "No required skills"
  - A professional banner with recommendations based on industry patterns
- Roadmap content is hard-coded as required by the assignment
- HackerNews is fetched without API key (public API)

🌍 Deployment (Vercel)

This project is fully deployment-ready with no extra configuration.

Deployment steps:

1. Push repository to GitHub
2. Import repository in Vercel
3. Build command & settings are auto-detected
4. Deploy 🚀

API routes automatically run as Vercel Serverless Functions.

⚠ Notes

- `node_modules/` and `.next/` must not be committed → ensure they are in `.gitignore`
- No environment variables required for this assignment
- No separate backend server needed (Next.js APIs handle backend logic)

----


