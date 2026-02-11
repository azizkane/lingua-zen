---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation', 'pm-review-2026-02-10', 'ocr-pivot-2026-02-10']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md']
---
# Lingua-Zen - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Lingua-Zen, incorporating the Supabase backend for identity and persistence, and the new Vision Intelligence (OCR) module.

## Requirements Inventory

### Functional Requirements

- FR1: Invoke translation popup via global OS shortcut (Default: `Alt+Shift+Z`).
- FR2: Detect selected text or clipboard content upon invocation.
- FR3: Interact via System Tray (Quit, Settings, Pause).
- FR4: Access "Sticky Window" for persistent history/reading.
- FR5: Display "Zen Pulse" visual feedback on clipboard copy (Opt-in).
- FR6: Auto-detect source language.
- FR7: Manually override target language.
- FR8: View standard translation.
- FR9: Activate **Explainer Mode** (Jargon -> Simple English).
- FR10: Activate **Mnemonics Mode** (Memory Aid).
- FR11: Display **Social Hazard Warning** (Paid Tier).
- FR12: Track local "Zen Focus" balance.
- FR13: Deduct points per action (Translate=1, Explain=3).
- FR14: Reset context (Source/Target/Tone) after idle time (Free Tier).
- FR15: Blur "Deep Insight" fields (Free Tier).
- FR16: Manage Identity via Supabase Auth (Google Login).
- FR17: Save translation to Supabase DB with Local Cache.
- FR18: Encrypt history at rest.
- FR19: Generate "Quote-Translate" image card.
- FR20: Browse history offline.
- FR21: Customize global shortcut.
- FR22: Toggle "Zen Mode" vs "Study Mode".
- FR23: Toggle "Unfiltered Mode" (Pro).
- FR24: Copy result to clipboard.
- FR25: Replace selected text with translation (OS-permitting).
- FR26: Export history (CSV/Anki).
- FR27: Submit feedback/bugs.
- **FR28 (New): Screen Sniping OCR (Pro Feature).**
- **FR29 (New): OCR Area Selection UI.**

### Infrastructure Requirements

- INF1: Supabase Auth for multi-device identity.
- INF2: Supabase Database for persistent user profiles and history.
- INF3: Supabase Edge Functions for secure Stripe communication.

## Epic List

### Epic 1: Core Ghost UI & System Integration (DONE)
### Epic 2: Settings & Persistent Control Center (DONE)
### Epic 3: AI-Powered Insights & Learning (DONE)

### Epic 4: Identity & Premium Access (IN PROGRESS)

**Epic Goal:** Users can securely sign in, upgrade to Pro, and have their status recognized across devices.
**FRs covered:** FR16, FR12.

### Epic 5: Knowledge & Sharing Management (BACKLOG)

**Epic Goal:** Users can permanently save, organize, and share their linguistic discoveries using a hybrid local/cloud storage model.
**FRs covered:** FR17, FR18, FR19, FR20, FR26.

### Epic 6: Vision Intelligence (OCR) (NEW - PRO ONLY)

**Epic Goal:** Users can understand non-selectable text (images, videos, PDFs) via a seamless "Screen Snipe" tool.
**FRs covered:** FR28, FR29.

---

## Epic 1: Core Ghost UI & System Integration (DONE)

### Story 1.1: Project Infrastructure Setup
### Story 1.2: Global Shortcut & Ghost Window Logic
### Story 1.3: Text & Clipboard Detection
### Story 1.4: Cloud Translation Integration (Google Gemini)
### Story 1.5: Zen Focus Meter Implementation
### Story 1.6: Zen Pulse Feedback

---

## Epic 2: Settings & Persistent Control Center (DONE)

### Story 2.1: System Tray & Window Management
### Story 2.2: Settings UI & Configuration Store
### Story 2.3: Sticky Window Mode

---

## Epic 3: AI-Powered Insights & Learning (DONE)

### Story 3.1: Explainer Mode
### Story 3.2: Mnemonics Generator
### Story 3.3: Social Hazard Warning (Paid)

---

## Epic 4: Identity & Premium Access (IN PROGRESS)

### Story 4.1: Subscription UI & Stripe Handoff (DONE)
### Story 4.2: Deep Link Handling & Activation (DONE)

### Story 4.3: Supabase Auth Integration (Google Login)

As a User,
I want to sign in with my Google account,
So that my Pro status and history are preserved if I change devices.

**Acceptance Criteria:**
- The Settings window displays a "Sign in with Google" button.
- Clicking the button opens the OS browser for OAuth.
- The app handles the redirect and captures the Supabase Session.
- The UI displays the user's avatar/email when logged in.

### Story 4.4: Cloud Pro Status Synchronization

As a User,
I want my Pro status to be fetched from the cloud,
So that I don't have to re-activate after re-installing the app.

**Acceptance Criteria:**
- Upon login, the app queries the Supabase `profiles` table for `is_pro`.
- The local "Pro" state is synchronized with the cloud state.
- Energy limits are removed based on the cloud status.

---

## Epic 5: Knowledge & Sharing Management

### Story 5.1: Hybrid History Persistence (Supabase + Local)

As a User,
I want my translations to be saved to the cloud but available offline,
So that I never lose my discoveries.

**Acceptance Criteria:**
- Translations are saved to Supabase DB when online.
- A local SQLite or JSON cache allows for offline browsing.
- Historical entries include: Source text, Translation, Target Language, and timestamp.

### Story 5.2: Quote-Translate Card Generation
### Story 5.3: History Search & Export

---

## Epic 6: Vision Intelligence (OCR)

### Story 6.1: Screen Sniping UI (The "Sniper" Overlay)
### Story 6.2: Native OCR Integration (Windows/Local)
### Story 6.3: Vision-to-Translation Pipeline (5E Cost)

---

## Energy Economy (Price List)

| Action | Cost | Tier |
| :--- | :--- | :--- |
| **Standard Translation** | 1 Energy | Free / Pro |
| **Zen Insight (Explain)** | 3 Energy | Free / Pro |
| **Zen Mnemonic** | 3 Energy | Free / Pro |
| **Vision Snipe (OCR)** | **5 Energy** | **Pro Exclusive** |

*Note: Pro users have infinite (∞) energy.*
