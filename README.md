# Munder Difflin — React Frontend

Vite + React UI for the multi-agent inventory system.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the Flask backend (in the project root)
cd ../multi-agent-inventory-system
python3 server.py        # runs on :5000

# 3. Start the Vite dev server (in this folder)
npm run dev              # runs on :5173, proxies /api → :5000
```

Open **http://localhost:5173**

## Build for production

```bash
npm run build
# output is in dist/ — deploy alongside your Flask server
```

## Environment

Copy `.env.example` → `.env` and set `VITE_API_URL` if your Flask server
is on a different host (e.g. Railway deployment URL).

## Stack

- **Vite 5** + **React 18**
- **CSS Modules** — scoped styles, zero runtime CSS-in-JS
- **lucide-react** — icons
- No UI library — all custom components
