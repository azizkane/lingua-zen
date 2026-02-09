---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments: ['_bmad-output/brainstorming/brainstorming-session-2026-02-05.md']
workflowType: 'prd'
classification:
  projectType: 'desktop_app'
  domain: 'edtech'
  complexity: 'medium'
  projectContext: 'greenfield'
---

# Product Requirements Document - Lingua-Zen

**Author:** Aziuk
**Date:** 2026-02-05

## Executive Summary

**Lingua-Zen** is a lightweight, cross-platform desktop utility designed to remove friction from language comprehension. Unlike traditional translation tools that require context switching (copy-paste to browser), Lingua-Zen operates as a **"Ghost" layer** over the operating system, instantly decoding text, jargon, and cultural nuances via a global shortcut.

The product combines **EdTech utility** with **SaaS monetization**, leveraging a unique "Friction-based" model (Zen Focus Meter) that encourages professional adoption through "Peace of Mind" features (Social Hazard Warnings) and student adoption through "addictive" learning loops (Mnemonics, Flashcards).

**Core Differentiator:** The "Ghost UI" pattern—invisible until needed, <1s latency, and context-aware intelligence that explains *why* a translation matters, not just what it says.

## Success Criteria

### User Success
- **The "Addiction" Loop:** Users perform 10+ translations per day, indicating workflow integration.
- **The Clarity Moment:** Successful use of **Explainer Mode** to decode jargon in-situ.
- **Peace of Mind:** Professional users avoid "Social Hazards" via proactive warnings.
- **Habit Formation:** Retention >40% at Day 7.

### Business Success
- **Conversion:** 15-20% conversion rate from Free to Paid (Stretch: 70%).
- **Revenue Stability:** Low churn due to seamless Paid experience vs. Free tier friction.
- **Viral Growth:** Users actively sharing "Quote-Translate" cards.

### Technical Success
- **Zen Performance:** Cold-start <1s, Invocation <200ms (Tauri).
- **Thin Client:** 100% Cloud-based AI to minimize local footprint.

### Measurable Outcomes
- **15-20%** Conversion Rate (Free -> Paid).
- **<200ms** Invocation Latency.
- **>10** Daily Active Translations per User.

## Product Scope

### MVP - Minimum Viable Product (Phase 1)
*   **Core Experience:** Ghost Mode (Tray-only, Global Shortcut), Sticky Main Window (History), Settings.
*   **Intelligence:** Smart Toggle (Auto-Language), Explainer Mode (Jargon), Mnemonics (Lite).
*   **Monetization:** Zen Focus Meter (Energy), Fading Context (Reset Timer), Locked Insights, Social Hazard Warnings (Paid).
*   **Growth:** Shareable "Quote-Translate" Cards.
*   **Tech Stack:** Tauri (Rust/React), Stripe, Cloud AI.

### Growth Features (Phase 2)
*   **Visual Intelligence:** Advanced OCR (Drag-to-Translate).
*   **Gamification:** "Rare Drop" Golden Cards (Linguistic Secrets).
*   **Resilience:** Local "Lite" offline models.

### Vision (Phase 3)
*   **Ecosystem:** BYOK (Bring Your Own Key), Plugin System, Community Contributions.

## User Journeys

### Journey 1: Sarah, The Diplomat (Professional)
*   **Context:** Drafting a high-stakes email to a Japanese partner.
*   **Action:** Highlights "hit the ground running", hits `Alt+Z`.
*   **Result:** Instant popup with **Red Warning** (Social Hazard). "Idiom implies rushing."
*   **Outcome:** Sarah selects the safe alternative ("Start with energy"). Email sent.
*   **Value:** "Peace of Mind" insurance.

### Journey 2: Alex, The Grinder (Student)
*   **Context:** Reading a French novel. Stuck on "étourdi".
*   **Action:** `Alt+Z`.
*   **Result:** Standard translation + **Mnemonic** ("Dizzy TOUR guide").
*   **Friction:** Wants to save to Flashcards but "Zen Focus" is low.
*   **Outcome:** Clicks "Unlock Infinite Zen" to subscribe.
*   **Value:** Learning aid + Friction-driven conversion.

## Domain-Specific Requirements

### Compliance & Regulatory (EdTech)
*   **Zero-Log Architecture:** Transient translations are never logged. Data is strictly pass-through.
*   **Encrypted History:** Local user history is AES-256 encrypted.
*   **GDPR/FERPA:** "Ghost" data handling minimizes PII risk.

### Content Safety
*   **Tiered Moderation:** Strict filtering for Free/Student tier; "Unfiltered" toggle for Pro.

## Innovation & Novel Patterns

### Innovation Areas
*   **Ghost UI Pattern:** Invisible app service with "Zen Pulse" visual feedback on clipboard events.
*   **Friction-as-a-Feature:** "Fading Context" (Memory Loss) creates psychological need for Paid tier.
*   **Reverse-Translation:** "Explainer Mode" redefines translation as comprehension.

### Validation
*   **The "Ghost" Test:** DAU/MAU ratio to ensure invisibility doesn't lead to abandonment.
*   **The "Habit" Metric:** Time to first daily double-click.

## Functional Requirements

### System & Interface
*   **FR1:** Invoke translation popup via global OS shortcut (Default: `Alt+Z`).
*   **FR2:** Detect selected text or clipboard content upon invocation.
*   **FR3:** Interact via System Tray (Quit, Settings, Pause).
*   **FR4:** Access "Sticky Window" for persistent history/reading.
*   **FR5:** Display "Zen Pulse" visual feedback on clipboard copy (Opt-in).

### Translation Intelligence
*   **FR6:** Auto-detect source language.
*   **FR7:** Manually override target language.
*   **FR8:** View standard translation.
*   **FR9:** Activate **Explainer Mode** (Jargon -> Simple English).
*   **FR10:** Activate **Mnemonics Mode** (Memory Aid).
*   **FR11:** Display **Social Hazard Warning** (Paid Tier).

### Monetization & Gamification
*   **FR12:** Track local "Zen Focus" balance.
*   **FR13:** Deduct points per action (Translate=1, Explain=3).
*   **FR14:** Reset context (Source/Target/Tone) after idle time (Free Tier).
*   **FR15:** Blur "Deep Insight" fields (Free Tier).
*   **FR16:** Validate subscription status via Stripe.

### Content Management
*   **FR17:** Save translation to local History.
*   **FR18:** Encrypt history at rest.
*   **FR19:** Generate "Quote-Translate" image card.
*   **FR20:** Browse history offline.
*   **FR24:** Copy result to clipboard.
*   **FR25:** Replace selected text with translation (OS-permitting).
*   **FR26:** Export history (CSV/Anki).

### Configuration
*   **FR21:** Customize global shortcut.
*   **FR22:** Toggle "Zen Mode" vs "Study Mode".
*   **FR23:** Toggle "Unfiltered Mode" (Pro).
*   **FR27:** Submit feedback/bugs.

## Non-Functional Requirements

### Performance
*   **Invocation Latency:** Popup visible in **<200ms**.
*   **Interaction Latency:** Visual feedback **<50ms**.
*   **Startup:** Launch to tray in **<1s**.
*   **Smoothness:** UI animations **60fps**.

### Security
*   **Encryption:** AES-256 for local data; TLS 1.2+ for transit.
*   **Privacy:** No PII sent to AI provider.

### Reliability
*   **Resilience:** 24h "Grace Period" for subscription validation failures.
*   **Degradation:** Offline mode allows read-only history access.

### Scalability
*   **Concurrency:** Support 10,000+ concurrent requests.
