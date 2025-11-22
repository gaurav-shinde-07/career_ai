# CodeAtRandom CareerPath – Full Stack Assignment (Next.js)

Tech stack:
- Frontend: Next.js (React, TailwindCSS)
- Backend: Next.js API Routes (Node.js, hosted on Vercel)
- Public API: HackerNews (Top stories)

## 1. Setup (Windows + VS Code)

```bash
# inside the project folder
npm install
```

## 2. Run locally

```bash
npm run dev
# open http://localhost:3000
```

## 3. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On Vercel:
   - New Project → Import the repo
   - Framework: Next.js (auto-detected)
   - Build command: `npm run build`
   - Output directory: `.`
3. Deploy.

APIs:
- `POST /api/skill-gap`
- `POST /api/roadmap`
- `GET /api/news` → HackerNews wrapper
```
