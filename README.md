
# 🧠 Starklytics — Starknet Analytics & Research Platform

**Starklytics** is a decentralized data analytics platform built for Starknet. It empowers analysts, researchers, and stakeholders to build and share insights using SQL and Python — backed by onchain data, STRK-based subscriptions, and deep social integrations.

Live site: _Coming soon_  
Tech Stack: React + TypeScript + Tailwind CSS + Supabase + Edge Functions + Starknet  

---

## 🚀 Features

### 🔍 Query Engine  
- Fork, execute, and publish SQL queries  
- Public/private visibility controls  
- Query performance tracking

### 📓 Python Notebook Sandbox  
- Build Jupyter-style notebooks using Python  
- Share insights with live visualizations  
- Versioning and comments supported

### 🧑‍💻 Social & Identity  
- Wallet login via Starknet (SIWE)  
- OAuth linking for GitHub and Twitter  
- Social profile with contributions, repos, followers

### 🧠 Marketplace  
- Hire analysts or post research bounties  
- Rate, review, and track completed work

### 🏆 Hackathon System  
- Submit queries and notebooks to compete  
- Judge, rate, and award top contributors

### 💳 STRK-Powered Subscriptions  
- Tiered access plans paid with STRK  
- Onchain verification of payments  
- Access gates for premium datasets and tools

### 🔔 Realtime Notifications  
- Comments, forks, messages & reviews  
- Admin alerts for flagged content

---

## 📄 Pages & Navigation

| Page                      | Path              | Auth Required | Notes |
|---------------------------|-------------------|---------------|-------|
| Home                      | `/`               | ❌            | Landing page overview |
| Explore Queries           | `/queries`        | ❌            | Public query explorer |
| View Query                | `/query/[id]`     | ❌/✅         | Depends on visibility |
| Create/Edit Query         | `/query/new`      | ✅            | SQL editor with run & fork |
| Notebooks                 | `/notebooks`      | ❌            | Browse notebooks |
| View Notebook             | `/notebook/[id]`  | ❌/✅         | Notebook viewer |
| Dashboard                 | `/dashboard`      | ✅            | User's contributions |
| Profile                   | `/profile`        | ✅            | GitHub, Twitter links |
| Marketplace               | `/marketplace`    | ✅            | Post/apply for gigs |
| Hackathons                | `/hackathons`     | ❌            | List active competitions |
| Subscriptions             | `/pricing`        | ❌            | Choose a STRK-based plan |
| Admin Panel               | `/admin`          | 🔐 Admin only | For moderation, stats |

---

## 🧩 Supabase Architecture

### Auth
- SIWE login for Starknet wallet
- GitHub & Twitter OAuth  
- RLS-based access enforcement

### Tables
- `users`, `queries`, `notebooks`, `subscriptions`, `wallets`, `projects`, `applications`, `scores`, `notifications`

### Edge Functions
- `run_query()` — sandbox SQL runner  
- `run_notebook()` — executes notebook in container  
- `verify_strk_payment()` — validates STRK tx  
- `link_github()`, `link_twitter()` — fetch social metadata

### Storage
- Notebook files  
- Result exports  
- Profile images

---

## 🛠️ Getting Started (Dev)

### 1. Clone Repo  
```bash
git clone https://github.com/your-org/starklytics.git
cd starklytics
````

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

* Create a project on [Supabase](https://supabase.io)
* Copy `.env.example` to `.env.local` and fill with your keys
* Apply SQL schema via Supabase SQL Editor or CLI

### 4. Run Dev Server

```bash
pnpm dev
```

---

## 🔗 Connect Wallet, GitHub, Twitter

* **Wallet**: Click "Connect Wallet" → Sign SIWE → Your address is linked.
* **GitHub**: Go to Profile → Click "Link GitHub" → OAuth flow.
* **Twitter**: Go to Profile → Click "Link Twitter" → OAuth + Metadata pulled.

---

## 💡 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/new-feature`)
3. Commit and push
4. Open a PR

---

## 🛡 Security

* RLS ensures strict data access control
* OAuth & SIWE ensure verified identities
* All user content is validated and sandboxed

---

## 📜 License

MIT License © 2025 Starklytics Contributors
Built with ❤️ for the Starknet ecosystem.
