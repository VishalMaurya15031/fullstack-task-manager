# TaskFlow — Mini Task Management Dashboard

A beautiful, full-stack task management web application built as a screening project. Manage your tasks with a sleek dark Kanban board UI backed by a real cloud database.

![TaskFlow Screenshot](./public/screenshot.png)

---

## ✨ Features

- **Full CRUD** — Create, view, edit, and delete tasks
- **Kanban Board** — Three columns: Todo / In Progress / Completed
- **Smart Due Dates** — Colour-coded: overdue (red), due soon (amber), on track (muted)
- **Live Stats** — Task counts per status in the header
- **Glassmorphism UI** — Dark-mode, premium design with smooth animations
- **Persistent Storage** — All tasks saved to a cloud PostgreSQL database (Supabase)
- **Responsive** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | **Next.js 16** (App Router) + React |
| Backend | **Next.js Route Handlers** (Node.js) |
| Database | **Supabase** (PostgreSQL, free tier) |
| DB Client | **@supabase/supabase-js** |
| Styling | **Vanilla CSS** (custom design system) |
| Fonts | **Google Fonts — Inter** |

---



## 🚀 Setup Instructions

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A free **Supabase** account — [supabase.com](https://supabase.com)

---

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **Start your project** → Sign in with GitHub
2. Click **New Project**
3. Give it a name (e.g. `taskflow`), set a database password, choose a region → **Create new project**
4. Wait ~2 minutes for the project to provision

---

### Step 2 — Create the Database Table

1. In your Supabase project dashboard, click **SQL Editor** in the left sidebar
2. Click **+ New query**
3. Paste the following SQL and click **Run**:

```sql
CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'todo'
              CHECK (status IN ('todo', 'in_progress', 'completed')),
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Step 3 — Get Your Supabase Keys

1. In your Supabase project, go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (e.g. `https://xyzabc.supabase.co`)
   - **anon / public key** (the long `eyJ...` string under *Project API Keys*)

---

### Step 4 — Configure Environment Variables

1. In the project root, create a `.env.local` file:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with the ones you copied in Step 3.

---

### Step 5 — Install Dependencies & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
fullstack-task-manager/
├── app/
│   ├── globals.css          # Design system (dark theme, glassmorphism)
│   ├── layout.js            # Root layout + metadata
│   ├── page.js              # Main dashboard page (CRUD orchestration)
│   └── api/
│       └── tasks/
│           ├── route.js             # GET all, POST create
│           └── [id]/
│               └── route.js         # PUT update, DELETE
├── components/
│   ├── Header.js            # Sticky header with stats + add button
│   ├── TaskBoard.js         # Kanban board (3 columns)
│   ├── TaskCard.js          # Individual task card
│   └── TaskModal.js         # Create/Edit modal form
├── lib/
│   └── supabase.js          # Supabase client singleton
├── .env.example             # Environment variable template
├── .env.local               # Your actual keys (NOT committed)
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## 📝 Task Schema

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Auto-generated |
| `title` | TEXT | Required |
| `description` | TEXT | Optional |
| `status` | TEXT | `todo` / `in_progress` / `completed` |
| `due_date` | DATE | Optional |
| `created_at` | TIMESTAMPTZ | Auto-set |
| `updated_at` | TIMESTAMPTZ | Updated on edit |

---

## 🔐 Security Note

The Supabase **anon key** is safe to expose on the frontend — it enforces Supabase Row Level Security (RLS) policies. For a production app, you should enable RLS and add auth policies. For this screening project, RLS is not required.

---


