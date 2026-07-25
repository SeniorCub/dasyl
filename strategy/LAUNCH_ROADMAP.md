# Dasyl: The Launch Roadmap

> **"What is the smallest version of Dasyl that people will happily pay for?"**
> Everything else goes into the backlog. 

This document outlines the immediate go-to-market strategy for the Dasyl Ecosystem, focusing entirely on a SaaS foundation, a subscription model, and an API-first architecture. Layers 4-12 (Cloud, AI Chat, Marketplace, Enterprise) have been pushed to the long-term Vision 2030 backlog.

---

## The Core Architectural Decision
**Dasyl is "API-first" from day one.**
- The CLI is a client.
- The website is a client.
- The Pulse Extension is a client.
- Everything authenticates against the same backend (`dasyl-ten.vercel.app`), tracks usage, verifies subscriptions, and shares the same user account.

---

## Phase 0 — Product Freeze (2–3 days)
**Goal:** Stop adding random features. Determine exactly what v1 is and isn't.
- **Brand & Pricing:** Established.
- **MVP Features:** Locked in.
- **Launch Date:** Set.

## Phase 1 — SaaS Foundation (1 week)
**Goal:** The core authentication and web dashboard infrastructure.
- **Website:** Landing page, Pricing, Login, Register, Dashboard.
- **Authentication:** Google & GitHub OAuth.
- **Dashboard Features:** Profile, Subscription status, API/CLI Token generation, Usage metrics, Billing.
- **CLI Authentication:** 
  - `dasyl login` (paste token)
  - `dasyl login --browser` (future)

## Phase 2 — Subscription System (1 week)
**Goal:** Simple, trackable monetization.
- **Free Tier:** 10 builds/month, Community templates, Basic CLI features.
- **Pro Tier:** Unlimited builds, Premium templates, Priority updates.
- *No AI yet.*

## Phase 3 — CLI 2.0 Polish (2 weeks)
**Goal:** Make the CLI feel premium and tracked.
- **Experience Polish:** Better onboarding, loading animations, project summaries, and error messages.
- **SaaS Features:** Login support, Subscription verification on every run, Usage tracking, and Analytics.
- **Target Frameworks:** Next.js, NestJS, Tailwind, Shadcn. (Limit to these high-value stacks to ensure quality).

## Phase 4 — Pulse Public Launch (2 weeks)
**Goal:** Finish and publish the Runtime Intelligence extension.
- **Features:** Network interception, Request Monitor, Request History, Export, Dev Mode.
- **UI:** A beautiful, responsive popup.
- **Action:** Submit to the Chrome Web Store.

## Phase 5 — Marketing (1 week)
**Goal:** Build an audience before adding AI.
- Assets: Website, Documentation, Videos, Twitter, LinkedIn, Discord, GitHub, Product Hunt.

## 🚀 Launch (Week 8)
- Release **Dasyl CLI** + **Dasyl Pulse**.
- Gather feedback and acquire the first 100 paying users.

---

## Phase 6 — AI Beta (Post-Launch)
**Goal:** Introduce AI *only* after users exist.
- Start small: `dasyl ai` (Explain error, recommend stack, architect).

---

## New CLI Commands Required Before Launch
```bash
dasyl login    # Authenticate via Token
dasyl logout   # Remove local token
dasyl whoami   # Show current logged-in user
dasyl plan     # Show active subscription tier
dasyl usage    # Show builds used this month
dasyl upgrade  # Link to billing page
dasyl doctor   # Check environment health
```

## Dashboard Gamification Features
To make the product feel alive:
- **Usage tracking:** "Builds This Month: 9/10"
- **Activity log:** "Yesterday: Created Next Project"
- **Daily Streak:** Open CLI, Build = +1 day.
- **Achievements:** First Build, 10 Projects, 7-Day Streak.
- **Referral System:** Invite a friend = +20 builds for both.
