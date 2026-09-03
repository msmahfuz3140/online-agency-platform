# PROMPTS — Use One at a Time

Rules:
- Always keep `PROJECT_CONTEXT.md` and `PROJECT_PLAN.md` in your project root.
- Copy ONE prompt below into Cursor/Antigravity, run it, TEST it yourself, git commit, then move to the next prompt.
- Do not skip ahead. Do not combine multiple prompts into one message.

---

## PART A — AGENCY WEBSITE

### Prompt 1 — Project Initialization [x] (Completed)
```
@PROJECT_CONTEXT.md
Initialize the project structure exactly as described in PROJECT_CONTEXT.md:
- [x] Create /frontend as a Next.js app (App Router, TypeScript, Tailwind CSS)
- [x] Create /backend as an Express.js app with a basic server.js/index.js
- [x] Add package.json scripts to run both in dev mode
- [x] Install framer-motion and recharts in /frontend (do not use them yet, just install)
Do not add any pages, routes, or models yet. Just the base setup.
```

### Prompt 2 — MongoDB + Better Auth Setup [x] (Completed)
```
@PROJECT_CONTEXT.md
In /backend, connect to MongoDB using Mongoose (use an environment variable MONGODB_URI).
Set up Better Auth for authentication. Verify Better Auth's Mongoose adapter support first (see PROJECT_CONTEXT.md) — if it's not well supported, tell me before proceeding instead of guessing a workaround.
Do not create the User model or any routes yet — just the connection and Better Auth base configuration.

[x] Connected to MongoDB via Mongoose (src/config/db.ts)
[x] Better Auth configured with official @better-auth/mongo-adapter, sharing Mongoose raw client (src/config/auth.ts)
[x] Auth routes mounted at /api/auth/* in server.ts
[x] TypeScript build passes cleanly
```

### Prompt 3 — User Model + Auth Routes [x] (Completed)
```
@PROJECT_CONTEXT.md
Create the User model in /backend/models with fields: name, email, password (handled by Better Auth), role (enum: "user" | "admin", default "user"), aiCreditsRemaining (Number, default 5).
Create register, login, and logout routes using Better Auth.
Do not build any frontend pages yet.

[x] role and aiCreditsRemaining added as Better Auth additionalFields (src/config/auth.ts)
[x] Auth routes (register/login/logout) handled natively by Better Auth at /api/auth/sign-up/email, /api/auth/sign-in/email, /api/auth/sign-out
[x] Auth + Admin middleware created (src/middleware/auth.middleware.ts)
[x] GET /api/user/me route returns user profile with role and aiCreditsRemaining (src/routes/user.routes.ts)
[x] TypeScript build passes cleanly
```

### Prompt 4 — Design System Foundation (premium, animated) [x] (Completed)
```
@PROJECT_CONTEXT.md
In /frontend, set up the design system foundation as a PREMIUM SaaS product, not a generic AI-default template:
- [x] Configure Tailwind theme with a primary color, accent color, and neutral gray scale — avoid the generic purple-to-blue gradient cliché
- [x] Add Google Fonts for one heading font and one body font
- [x] Create reusable UI components: Button (primary/secondary/ghost variants with hover/tap micro-interactions), Card, Section container, Badge, Modal, Toast, SkeletonLoader
- [x] Create reusable Framer Motion wrapper components in /components/motion: FadeInSection (scroll-triggered fade/slide), StaggerList (staggered entrance for grids/lists), AnimatedCounter (count-up animation for numbers)
- [x] All motion components must respect prefers-reduced-motion

Design: Electric Teal (#14b8a0) + Warm Amber (#f59e0b) + Charcoal neutrals | Heading: Space Grotesk | Body: Inter
TypeScript build: PASS (0 errors)
```

### Prompt 5 — Home Page [x] (Completed)
```
@PROJECT_CONTEXT.md
Build the Home page in /frontend using the design system components from the previous step.
[x] Hero section (animated heading, AnimatedCounter stats, project preview cards, dual CTA)
[x] Agency intro (brand story + 4 highlight cards in StaggerList grid)
[x] Featured projects (3 project cards with tech badges)
[x] How-it-works (4-step process with connectors)
[x] Services overview (6 service cards in StaggerList grid)
[x] Client reviews (4 testimonials with star ratings)
[x] Pricing preview (3-tier table with highlighted popular plan)
[x] FAQ (animated accordion with AnimatePresence)
[x] CTA section (glow card, dual action buttons)
[x] Newsletter signup (email form, UI only, no backend)
[x] Navbar (glassmorphism sticky, animated mobile menu)
[x] Footer (multi-column links + social icons)
[x] All sections wrapped in FadeInSection/StaggerList
[x] TypeScript build: PASS (0 errors)
```

### Prompt 6 — About Page [x] (Completed)
```
@PROJECT_CONTEXT.md
Build the About page: agency story, mission, vision, founder profile, technology stack, achievements.
Match the design system and scroll-animation pattern already established on the Home page.
[x] Agency story (CST roots, journey from 2024 to present, 4 core values)
[x] Mission & Vision (dual atmospheric cards + 3 strategic pillars)
[x] Founder profile (MD Mahfuzul Haque spotlight + CST leadership core)
[x] Technology stack (interactive category tabs: Next.js 16, React 19, TypeScript, Tailwind v4, Claude, etc.)
[x] Achievements (AnimatedCounter statistics + verified timeline milestones)
[x] About CTA section & Navbar/Footer integration
[x] All sections wrapped in FadeInSection/StaggerList
[x] TypeScript build: PASS (0 errors)
[x] Route verified: HTTP 200 OK (/about)
```

### Prompt 7 — Services Page [x] (Completed)
```
@PROJECT_CONTEXT.md
Build the Services page listing: Portfolio Website, Business Website, Landing Page, SaaS Website, E-commerce Website, Web Application, UI/UX Design, Website Redesign, SEO Optimization, Website Maintenance, Hosting Setup, Domain Setup, AI Solution Development.
Use cards in a grid layout wrapped in StaggerList so they animate in with a stagger effect on scroll, consistent with the design system.
[x] All 13 services fully listed with icons, descriptions, deliverables & tech stacks
[x] Category filter tabs (All, Website Development, Design & Optimization, DevOps, AI Solutions)
[x] StaggerList scroll-entrance animation grid with hover effects
[x] 4-Step service execution workflow section
[x] Service FAQ accordion with AnimatePresence
[x] High-conversion Services CTA section & navigation integration
[x] TypeScript build: PASS (0 errors)
[x] Route verified: HTTP 200 OK (/services)
```

### Prompt 8 — Portfolio + Case Studies Pages [x] (Completed)
```
@PROJECT_CONTEXT.md
Build the Portfolio page: a project grid (StaggerList entrance) where each project shows screenshot, live demo link, GitHub link, tech stack, description, features. Use placeholder project data for now.
Also build the Case Studies page: 2-3 detailed write-ups (problem → solution → result format).

[x] Portfolio Hero section with AnimatedCounter stats (50+ projects, 100% satisfaction, 13 categories, 48h turnaround)
[x] Portfolio Grid: 8 placeholder projects — SaaS, E-Commerce, Portfolio, Landing Page, AI Solutions categories
[x] Category filter pills with AnimatePresence transition (All / SaaS & Web App / E-Commerce / Portfolio / Landing Page / AI Solutions)
[x] Each project card: icon, name, tagline, description, live demo ↗ + GitHub links, 3 key features (✓ checklist), tech stack badges, year/badge overlays
[x] Portfolio CTA section linking to Discovery Call + Case Studies
[x] Navbar "Work" dropdown updated: Full Portfolio → /portfolio, Case Studies → /case-studies
[x] Case Studies Hero section with amber AnimatedCounter stats (3x revenue, 95% retention, 50+ businesses, 100k+ users)
[x] 3 Full case studies (Problem → Solution → Result format):
    - Finflow Inc.: Spreadsheet chaos → Multi-tenant SaaS platform (96% time reduction)
    - Bloom Co.: Instagram DM orders → E-commerce store (300% revenue growth)
    - LaunchPad: 1.2% conversion rate → 8.7% landing page (7.25x improvement)
[x] Each case study: expand/collapse accordion, phase blocks (red/amber/green), quantified results table, tech stack tags, client testimonial blockquote
[x] Case Studies CTA section with amber glow gradient
[x] TypeScript build: PASS (0 errors)
[x] Routes verified: HTTP 200 OK (/portfolio, /case-studies)
```

### Prompt 9 — Pricing + Blog Pages [x] (Completed)
```
@PROJECT_CONTEXT.md
Build the Pricing page with a plan comparison table for Free, Pro, and Business tiers. Clearly label Pro/Business as "Coming soon" (no payment integration yet) — do not link them to any checkout flow.
Build the Blog page: a list view and a single blog post view, using placeholder posts for now.

[x] Pricing Hero section with guarantee badges and transparent tier intro
[x] Pricing Plans: 3 tiers (Free live at $0, Pro at $49/mo or $799/proj, Business at $199/mo or $2,999/proj)
[x] Clear "Coming Soon" badges and disabled state on Pro & Business (no payment / checkout link)
[x] Monthly vs. Per-Project billing toggle with smooth animations
[x] Full plan feature comparison matrix table (10 feature criteria comparing Free vs Pro vs Business)
[x] Pricing FAQ section answering common billing and "Coming Soon" questions
[x] Navbar "Pricing" dropdown updated with "Full Plan Comparison" link to /pricing
[x] Blog Hero section with Nexora Lab branding, topic filter chips
[x] Blog List page: Featured article hero card + 3-column article cards grid with tags, reading time, author
[x] Single Blog Post dynamic route (/blog/[slug]):
    - Dynamic metadata & generateStaticParams for all posts
    - Article header with category badge, reading time, publication date, author details
    - Interactive BlogShareButtons (Copy link, Twitter/X, LinkedIn)
    - Custom BlogContentRenderer supporting Markdown headings, code blocks with syntax styling and copy button, data tables, and lists
    - Author bio card with role and avatar
    - "Continue Reading" recommended articles grid
    - Blog CTA section linking to discovery call and portfolio
[x] TypeScript build: PASS (0 errors)
[x] Routes verified: HTTP 200 OK (/pricing, /blog, /blog/[slug])
```

### Prompt 10 — Contact Page + Backend Route
```
@PROJECT_CONTEXT.md
Build the Contact page with a form: name, email, message.
Show a loading state on submit and a Toast confirmation on success/failure — no browser alert().
In /backend, create a Contact model and a route to save submissions to MongoDB.
Connect the frontend form to this backend route.
```

### Prompt 11 — Register/Login Frontend Pages
```
@PROJECT_CONTEXT.md
Build the Register and Login pages in /frontend, connected to the Better Auth routes created in Prompt 3.
Include basic form validation and error messages (inline, not alert()).
After login, redirect to a placeholder /dashboard route (dashboard itself will be built later).
```

### Prompt 12 — Client Project Request System
```
@PROJECT_CONTEXT.md
Create a ProjectRequest model in /backend (fields: clientId or contact info, requirements, budget, timeline, status: pending/in-progress/completed).
Build a "Request a Project" form page in /frontend connected to this route.
```

### Prompt 13 — Basic Admin Panel (professional/premium)
```
@PROJECT_CONTEXT.md
Build a protected /admin route in /frontend, accessible only to users with role "admin" (check via middleware/backend route protection).
Make this feel like a professional, premium admin dashboard — NOT a bare list of links or plain table:
- Persistent collapsible sidebar nav + top bar (search, profile)
- Dashboard overview page with animated stat cards (use AnimatedCounter) for: total users, total project requests, total contact messages
- Sortable/filterable/paginated data tables for: all users, all project requests, all contact submissions — with color-coded status badges
- A "block/delete user" action that opens a Modal for confirmation (never window.confirm), with a smooth transition
- Reuse the same design tokens (colors, fonts, spacing) as the public site — it should look like part of the same premium product
```

### Prompt 14 — Deployment Prep
```
@PROJECT_CONTEXT.md
Prepare the project for deployment:
- Add a .env.example file for both /frontend and /backend listing required environment variables (including Cloudinary keys and Anthropic API key)
- Add basic build scripts if missing
- Do not deploy automatically — just make sure the project is deploy-ready
```

**→ After Prompt 14: deploy manually to Vercel (frontend) + Render/Railway (backend) + MongoDB Atlas. Test the whole flow live before moving to Part B.**

---

## PART B — AI WEBSITE GENERATOR

### Prompt 15 — Website/Template/AIGeneration Models
```
@PROJECT_CONTEXT.md
In /backend, create these models:
- Website: ownerId, title, content (JSON), status ("draft"|"published"), createdAt
- Template: name, category, previewImage (Cloudinary URL), structure (JSON)
- AIGeneration: userId, inputPrompt, outputJSON, createdAt
Do not build any routes yet.
```

### Prompt 16 — User Dashboard
```
@PROJECT_CONTEXT.md
Build the User Dashboard home in /frontend: total websites count, AI credits remaining (real value from the logged-in User, not a placeholder), recent activity list (placeholder for now).
Use the same AnimatedCounter stat-card pattern as the admin panel dashboard.
```

### Prompt 17 — Website CRUD
```
@PROJECT_CONTEXT.md
In /backend, create protected CRUD routes for the Website model (create, read, update, delete, list-by-owner). Users can only access their own websites.
In /frontend, build a "My Websites" list page showing the user's websites with edit/delete/preview actions. Show a SkeletonLoader while fetching and an animated empty state (with CTA to create a website) if the user has none.
```

### Prompt 18 — AI Generation Form
```
@PROJECT_CONTEXT.md
Build the AI website generation form in /frontend: website type (Portfolio/Business/Landing Page), business info (name, industry, description), design style, color preference, extra requirements text field.
Do not connect it to the backend yet — just the form UI and validation.
```

### Prompt 19 — AI Generate Backend Route
```
@PROJECT_CONTEXT.md
Create the /api/ai-generate route in /backend. It should:
- Accept the form data from Prompt 18
- Check the logged-in user's aiCreditsRemaining — if 0, reject with a clear error message and do not call the AI API
- Build a structured prompt for the Anthropic API (model: claude-sonnet-4-6)
- Call the API, instructing it to return ONLY JSON matching this shape: { sections: [{type, heading, subtext, content, items, cta}], theme: {primaryColor, font} }
- Decrement aiCreditsRemaining by 1 on success
- Save the result to AIGeneration and create a linked Website document with status "draft"
- Return the generated website's ID to the frontend
```

### Prompt 20 — Section Components
```
@PROJECT_CONTEXT.md
Build the pre-built section components in /frontend for rendering AI-generated content: Hero, About, Services, Testimonials, Pricing, Footer, Contact.
Each component should accept props matching the JSON shape from Prompt 19, and be wrapped for a smooth entrance animation (fade/slide) when rendered.
```

### Prompt 21 — Component Mapper + Preview Page
```
@PROJECT_CONTEXT.md
Build a component mapper function that takes the sections array from a Website's content and renders the matching component from Prompt 20 for each section type.
Build a Preview page that fetches a Website by ID and renders it using this mapper, with a SkeletonLoader while loading.
Connect the form from Prompt 18 to the backend route from Prompt 19, redirecting to this Preview page after generation.
```

### Prompt 22 — Inline Editing + Save/Publish
```
@PROJECT_CONTEXT.md
On the Preview page, add inline editing for text fields (heading, subtext, content) that updates the Website's content JSON in the backend on save.
Add "Save as Draft" and "Publish" buttons with a loading state and a Toast confirmation on success/failure — no alert().
```

### Prompt 23 — Template Gallery
```
@PROJECT_CONTEXT.md
Build a Template gallery page showing available templates (Portfolio, Agency, Restaurant, Coaching, Hospital, SaaS) using the Template model, rendered with StaggerList entrance.
Add a "Use this template" action that creates a new Website pre-filled with that template's structure, then redirects to the Preview page for further AI customization.
```

### Prompt 24 — Admin AI Monitoring
```
@PROJECT_CONTEXT.md
In the Admin panel, add a section showing: total AI generations count (AnimatedCounter), generations per user, a sparkline trend chart (recharts) of generations over time, and a sortable/filterable table of all generated websites with the ability to view or delete any of them.
Also allow the admin to manually adjust a user's aiCreditsRemaining (simple number input + save, inside a Modal).
```

### Prompt 25 — Final Deploy
```
@PROJECT_CONTEXT.md
Review the full project against PROJECT_PLAN.md Part A and Part B checklists, including the Design Quality Checklist (animations, loading/empty/error states, no alert()/confirm()). Point out anything missing or inconsistent. Do not make changes yet — just report gaps.
```

**→ After Prompt 25: fix any gaps manually or with a follow-up targeted prompt, then deploy the updated version live. This completes the MVP.**
