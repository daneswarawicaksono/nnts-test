# NNTS Web — Guidelines & Project Context for Claude Code

## Project Overview
- **Name**: NNTS Web (Frontend PWA for Neuro-Nutrient Triage System & Otakatik)
- **Tech Stack**: React 18, Vite, TypeScript, Tailwind CSS, Lucide icons, ONNX Runtime Web.
- **Companion Backend**: `/run/media/chise/Windows-SSD/Users/LENOVO/nnts-api` (Hono, Supabase PostgreSQL, Edge Runtime).

## Commands
- Build: `npm run build` (or `npx tsc -b && vite build`)
- Dev Server: `npm run dev`
- Type Check: `npx tsc -b`

## Current State & Recent Changes (19 Nov 2026)
1. **Authentication & Auto-Role Detection**:
   - `src/views/Welcome/WelcomeView.tsx`: Screen 1 Figma (Kerro standing mascot, GET STARTED, I ALREADY HAVE AN ACCOUNT).
   - `src/views/Auth/LoginView.tsx`: Screen 2 Figma (Kerro waving, Email/Username + Password, 1-click quick-fill demo pills for Parent, Cadre, Doctor).
   - `src/views/Onboarding/OnboardingView.tsx`:
     - Step 1: Intro 1 (Hi there! I'm Kerro!).
     - Step 2: Intro 2 (Just 3 quick games to check your child's superpowers!).
     - Step 3: Role Selection (Parent / Cadre / Doctor).
     - Step 4: "Kenalan dulu, yuk!" (Nama akun pengguna; **avatar picker dihapus total**).
     - Step 5: "About your little one" & Setup Sandi (Gender Boy/Girl, nama si kecil, tanggal lahir dengan `ageInMonths` kalender 24-59 bulan, email & password akun).
2. **API & Client**:
   - `src/services/api/client.ts`: Method `login()`, `registerUser()`, fallback offline presets & `localStorage` accounts.
   - `src/utils/age.ts`: Pure calendar month calculator `ageInMonths(birthDateISO, atISO)`.
3. **Backend API Alignment (`nnts-api`)**:
   - Endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me`.
   - Child Registry: `POST /api/v1/subjects`, `GET /api/v1/posyandu/:id/subjects`.
   - Note for Backend: Running on Vercel Edge Runtime. **Do NOT use `node:*` modules**. Use Web Crypto API `crypto.subtle`.

## Reference Design
- Figma wireframe: Kerro frog mascot poses in `/public/mascot/` (`kerro_pose1_smile.png` through `kerro_pose6_stand.png`).
