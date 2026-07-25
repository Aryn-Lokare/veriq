# Veriq

**Veriq** (formerly _Veritas AI_) is an autonomous, multi-agent fact-verification and research platform. It deploys specialized AI agents to collaborate on researching, verifying, challenging, and synthesizing information to produce structured, transparent reports.

The platform is designed with a sleek, developer-centric aesthetic inspired by the **Vercel Geist Design System** (see [docs/DESIGN-vercel.md](file:///e:/veritas-ai/docs/DESIGN-vercel.md)).

---

## 🚀 Key Features

- **Multi-Agent Collaboration**: Integrates Orchestrator, Strategist, Searcher, and Contradiction Detector agents to investigate claims.
- **Granular Claim Verification**: Identifies key claims and classifies their status (`verified`, `mixed`, `unsupported`) with explanations and confidence scores.
- **Contradiction Detection**: Explicitly seeks out sources that disprove or conflict with claims, highlighting discrepancies.
- **Transparent Citations**: Evaluates source reliability, tracking institutional, academic, or governmental domains.
- **Real-time Log Stream**: Streams agent logs and execution timelines directly to the dashboard workspace.
- **Secure Auth & SSR**: Leverages **Supabase Auth** and SSR for session and workspace management.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS with Geist System colors
- **Database & Auth**: [Supabase](https://supabase.com/) (`@supabase/ssr`)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```
veritasai/
├── app/                  # Next.js App Router Pages
│   ├── globals.css       # Global styles & Tailwind entry
│   ├── layout.tsx        # Root layout & font loading
│   ├── page.tsx          # Landing / Marketing Page
│   ├── login/            # Auth: Login Page
│   ├── signup/           # Auth: Signup Page
│   └── workspace/        # Authenticated Research Dashboard
├── lib/
│   └── supabase/         # Supabase Client, Server, & Middleware Setup
├── public/               # Asset assets, SVGs, and brand logos
├── next.config.ts        # Next.js Configuration
└── package.json          # Node scripts & dependencies
```

---

## 💾 Database Schema

The database is built on PostgreSQL inside Supabase. The schema file is located at [supabase/schema.sql](file:///e:/veritas-ai/supabase/schema.sql).

### Core Tables

1. **`profiles`**: User metadata, synced automatically with `auth.users` via database triggers.
2. **`research_sessions`**: The parent session records holding the user's question, status (`idle`, `running`, `completed`, `failed`), and synthesis summary.
3. **`sources`**: Tracked citation URLs, snippets, and reliability scores.
4. **`claims`**: Synthesized facts containing verification status and explanations.
5. **`contradictions`**: Discrepancies between verified claims and specific sources.
6. **`agent_logs`**: Step-by-step logs from active agents during research pipelines.

---

## ⚙️ Getting Started

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database Schema

Execute the SQL instructions from [supabase/schema.sql](file:///e:/veritas-ai/supabase/schema.sql) in your Supabase SQL Editor.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Build & Deploy

To build the production bundle:

```bash
npm run build
```

To run the built production server locally:

```bash
npm run start
```
