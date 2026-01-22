# GEMINI.md

## 📌 Project Overview

This project is a **low-budget, scalable eCommerce platform for a MEN’S WEAR business** operating **within India only**.

The primary goals are:

* Extremely fast development (after-office hours)
* Near-zero infrastructure cost using free tiers
* Clean, maintainable full‑stack architecture

This file is the **authoritative instruction manual** for **Antigravity AI / Gemini / ChatGPT** when building, refactoring, or extending this application.

---

## 🎯 Core Goals

* Ship MVP fast
* Avoid premature complexity
* Use proven, developer-friendly platforms
* Stay within free tiers as long as possible

---

## 🚫 Explicitly Out of Scope (DO NOT BUILD)

* Billing / POS software
* Barcode generation or scanning
* International shipping
* International payments
* Microservices architecture
* Separate backend servers

---

## 🧱 Final Tech Stack (LOCKED)

### Hosting & Runtime

* **Vercel (Free Tier)**

  * Hosts frontend + backend
  * Uses Serverless Functions automatically

### Frontend + Backend

* **Next.js (App Router)**
* **React 18**
* **TypeScript (strict mode)**
* **Next.js Route Handlers** as backend APIs

> ❗ No Express.js or NestJS in Phase‑1

---

### UI & Styling (Speed Optimized)

* **Tailwind CSS**
* **Shadcn UI** (primary component system)
* Optional:

  * Magic UI / Aceternity UI (marketing sections only)


### Reference website

* https://dribbble.com/shots/18380246-Fashion-website
* https://dribbble.com/shots/21609385-Fashion-E-Commerce-Landing-Page
* https://dribbble.com/shots/26751485-Runvea-Fashion-Website-Design
* https://dribbble.com/shots/20820372-Fashion-Brand-Landing-Page-Website



---

### Database, Auth & Storage

* **Supabase (Free Tier)**

  * PostgreSQL database (~500MB)
  * Supabase Auth (admin login only)
  * Supabase Storage (product images)

> ❗ Neon is NOT used in Phase‑1

---

### Payments (India Only)

* **Razorpay**

  * UPI
  * Cards
  * Netbanking

---

### Shipping (India Only – Phase‑1)

* Flat‑rate shipping logic
* Couriers handled manually:

  * Delhivery
  * DTDC
  * Xpressbees

> ❗ No shipping API integration initially

---

## 🏗️ Architecture Decision (IMPORTANT)

### ✅ Chosen Architecture

**Next.js Full‑Stack on Vercel**

```
Browser
  ↓
Next.js (Server + Client Components)
  ↓
Next.js Route Handlers (API)
  ↓
Supabase (Postgres + Storage)
```

### ❌ Explicitly Rejected (for now)

* Hostinger Node hosting
* Express.js standalone server
* NestJS backend

### Reasoning

* Vercel has first‑class Next.js support
* Free tier is sufficient for MVP
* Zero DevOps overhead
* Faster iteration speed

---

## 🧠 When to Reconsider This Architecture

ONLY consider NestJS / Express if:

* Order volume grows significantly
* Mobile apps are introduced
* Multiple backend services are required
* Team size increases

Until then → **Next.js Route Handlers are mandatory**

---

## 📁 Folder Structure (STRICT)

```
/app
  /(store)
    /page.tsx
    /products
    /product/[slug]
    /cart
    /checkout
  /(admin)
    /login
    /dashboard
    /products
    /orders
  /api
    /products
    /orders
    /payments
/components
  /ui            # shadcn components
  /layout
  /product
  /cart
/lib
  /supabase
  /razorpay
  /utils
/types
```

---

## 🧠 Coding Rules (MANDATORY)

### General

* TypeScript strict mode
* No `any`
* Prefer Server Components
* Use Client Components only when required

### UI

* Reusable components
* Tailwind CSS only
* No inline styles

### Backend / APIs

* One responsibility per route
* Validate inputs
* Razorpay payment verification MUST happen server‑side

---

## 🔐 Security Practices

* Admin routes must be protected
* Never expose Supabase service role keys
* No secrets in client components
* Use environment variables via Vercel

---

## 🧪 Development Philosophy

* MVP over perfection
* Flat shipping logic first
* No over‑engineering
* Ship incremental improvements weekly

---

## 🤖 AI INSTRUCTIONS (CRITICAL)

Any AI agent (Antigravity AI / Gemini / ChatGPT) MUST:

1. Treat this file as the single source of truth
2. Follow the locked tech stack strictly
3. NOT introduce Hostinger, NestJS, Express, or Neon unless explicitly asked
4. Avoid paid services
5. Prefer clarity and maintainability over clever abstractions

---

## 🚀 Deployment

* **Vercel (Free Tier)**
* Environment variables managed in Vercel dashboard

---

## 📝 Final Statement

This project is intentionally **lean and opinionated**.

Speed > Complexity.

This file overrides all other assumptions and suggestions.

---

**Update this file whenever the architecture or stack changes.**
