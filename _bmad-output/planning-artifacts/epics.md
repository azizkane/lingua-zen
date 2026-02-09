---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md']
---

# Lingua-Zen - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Lingua-Zen, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: Invoke translation popup via global OS shortcut (Default: `Alt+Z`).
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
- FR16: Validate subscription status via Stripe.
- FR17: Save translation to local History.
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

### Non-Functional Requirements

- Invocation Latency: <200ms.
- Interaction Latency: <50ms.
- Startup: <1s.
- Animation Smoothness: 60fps.
- Encryption: AES-256 for local data; TLS 1.2+ for transit.
- Privacy: No PII sent to AI provider.
- Resilience: 24h "Grace Period" for subscription validation failures.
- Degradation: Offline mode allows read-only history access.
- Concurrency: Support 10,000+ concurrent requests.

### Additional Requirements

- **Starter Template:** Use official Tauri + React + TS starter.
- **Multi-WebView:** Separate WebViews for Ghost Popup and Main Window.
- **State Sync:** Use Tauri events for cross-window state sync.
- **Key Management:** Use OS Keyring (`keyring` crate) for master encryption key.

### FR Coverage Map

- FR1: Epic 1 - Invoke translation popup
- FR2: Epic 1 - Detect selected text/clipboard
- FR3: Epic 2 - Interact via System Tray
- FR4: Epic 2 - Access "Sticky Window" / Main Window
- FR5: Epic 1 - Display "Zen Pulse"
- FR6: Epic 1 - Auto-detect source language
- FR7: Epic 1 - Manually override target language
- FR8: Epic 1 - View standard translation
- FR9: Epic 3 - Activate Explainer Mode
- FR10: Epic 3 - Activate Mnemonics Mode
- FR11: Epic 3 - Display Social Hazard Warning (Paid Tier)
- FR12: Epic 1 - Track local "Zen Focus" balance
- FR13: Epic 1 - Deduct points per action
- FR14: Epic 1 - Reset context (Fading Context)
- FR15: Epic 1 - Blur "Deep Insight" fields (Locked Insights)
- FR16: Epic 4 - Validate subscription status via Stripe
- FR17: Epic 5 - Save translation to local History
- FR18: Epic 5 - Encrypt history at rest
- FR19: Epic 5 - Generate "Quote-Translate" image card
- FR20: Epic 5 - Browse history offline
- FR21: Epic 2 - Customize global shortcut
- FR22: Epic 2 - Toggle "Zen Mode" vs "Study Mode"
- FR23: Epic 2 - Toggle "Unfiltered Mode" (Pro)
- FR24: Epic 1 - Copy result to clipboard
- FR25: Epic 1 - Replace selected text with translation
- FR26: Epic 5 - Export history (CSV/Anki)
- FR27: Epic 2 - Submit feedback/bugs

## Epic List

### Epic 1: Core Ghost UI & System Integration
**Epic Goal:** Users can invoke Lingua-Zen from anywhere, instantly translate selected text, and receive seamless visual feedback, while understanding their current "Zen Focus" status.
**FRs covered:** FR1, FR2, FR5, FR6, FR7, FR8, FR12, FR13, FR14, FR15, FR24, FR25.

### Epic 2: Settings & Persistent Control Center
**Epic Goal:** Users can configure their Lingua-Zen experience and access their translation history and other tools from a dedicated, persistent interface.
**FRs covered:** FR3, FR4, FR21, FR22, FR23, FR27.

### Epic 3: AI-Powered Insights & Learning
**Epic Goal:** Users can enhance their comprehension and learning with AI-powered insights, including advanced explanations and cultural safety.
**FRs covered:** FR9, FR10, FR11.

### Epic 4: Subscription & Premium Access
**Epic Goal:** Users can easily upgrade to a premium experience, unlocking all advanced features and continuous "Zen" flow.
**FRs covered:** FR16.

### Epic 5: Knowledge & Sharing Management
**Epic Goal:** Users can permanently save, organize, and share their linguistic discoveries and insights.
**FRs covered:** FR17, FR18, FR19, FR20, FR26.

## Epic 1: Core Ghost UI & System Integration

Users can invoke Lingua-Zen from anywhere, instantly translate selected text, and receive seamless visual feedback, while understanding their current "Zen Focus" status.

### Story 1.1: Project Infrastructure Setup

As a Developer,
I want to initialize the Tauri project with React, TypeScript, and Tailwind,
So that I have a stable foundation for building the Ghost UI.

**Acceptance Criteria:**

**Given** I have Node.js and Rust installed
**When** I run the project initialization command (from Architecture doc)
**Then** a "Hello World" Tauri window launches
**And** Tailwind styles are applied correctly
**And** The project structure matches the Architecture Document (`src-tauri`, `src/features`)

### Story 1.2: Global Shortcut & Ghost Window Logic

As a User,
I want to toggle the translation popup with a global shortcut (`Alt+Z`),
So that I can access the tool without leaving my current application.

**Acceptance Criteria:**

**Given** the app is running in the background
**When** I press `Alt+Z` (or configured default)
**Then** the Ghost Popup window appears within 200ms
**When** I press `Alt+Z` again (or `Esc`)
**Then** the window hides (not closes)
**And** The window acts as a "spotlight" (frameless, floating)

### Story 1.3: Text & Clipboard Detection

As a User,
I want the popup to automatically contain the text I selected,
So that I don't have to manually paste it.

**Acceptance Criteria:**

**Given** I have text selected in another app (e.g., Notepad)
**When** I trigger the Ghost Popup
**Then** the selected text appears in the input field
**And** If no text is selected, it falls back to Clipboard content

### Story 1.4: Cloud Translation Integration (Google Gemini)

As a User,
I want to see the translation of my text in my target language,
So that I can understand it immediately.

**Acceptance Criteria:**

**Given** text is in the input field
**When** the translation triggers (auto or manual)
**Then** the Rust backend calls the Google Gemini API (via Cloud Proxy or direct if securely handled)
**And** The result is displayed in the UI
**And** A "Breathing Loader" animation plays during latency
**And** If API fails or user is offline, display a friendly "Zen connection lost" message (no crash)

### Story 1.5: Zen Focus Meter Implementation

As a User,
I want to see my current "Energy" balance,
So that I know how many free translations I have left.

**Acceptance Criteria:**

**Given** I am a free user
**When** I perform a translation
**Then** my "Zen Focus" balance decreases by 1
**And** The new balance is persisted locally (encrypted `tauri-plugin-store`)
**And** The UI updates immediately

### Story 1.6: Zen Pulse Feedback

As a User,
I want a subtle visual cue when I copy text,
So that I know Lingua-Zen is ready to translate.

**Acceptance Criteria:**

**Given** the app is running
**When** I copy text to the clipboard
**Then** the Tray Icon changes state (or a small UI pulse occurs) for 0.5s
**And** This feature can be disabled in config (default: enabled)

## Epic 2: Settings & Persistent Control Center

Users can configure their Lingua-Zen experience and access their translation history from a dedicated interface.

### Story 2.1: System Tray & Window Management

As a User,
I want to manage the app from the System Tray,
So that it stays out of my taskbar when not in use.

**Acceptance Criteria:**

**Given** the app is running
**When** I right-click the Tray Icon
**Then** I see options: "Settings", "History", "Quit"
**When** I click "Settings"
**Then** the Main Window opens (separate WebView from Ghost Popup)

### Story 2.2: Settings UI & Configuration Store

As a User,
I want to change my target language and shortcut,
So that the app fits my workflow.

**Acceptance Criteria:**

**Given** the Settings window is open
**When** I change the Global Shortcut to `Ctrl+Space`
**Then** the old shortcut (`Alt+Z`) stops working and the new one activates immediately
**And** The preference is saved to `tauri-plugin-store`

### Story 2.3: Sticky Window Mode

As a User,
I want to pin a translation window to the side,
So that I can keep a reference while reading a long document.

**Acceptance Criteria:**

**Given** I am viewing a translation
**When** I click "Pin" (or "Sticky")
**Then** the content moves to a persistent, always-on-top window

## Epic 3: AI-Powered Insights & Learning

Users can enhance their comprehension with AI-powered insights tailored to their needs.

### Story 3.1: Explainer Mode

As a User,
I want to get a simplified explanation of a complex term,
So that I understand the concept, not just the word.

**Acceptance Criteria:**

**Given** I have a technical term selected
**When** I click "Explain"
**Then** the app sends a specific prompt to Google Gemini ("Explain this concept simply...")
**And** 3 Zen Focus points are deducted

### Story 3.2: Mnemonics Generator

As a Student,
I want a memory aid for a word,
So that I don't forget it again.

**Acceptance Criteria:**

**Given** a translated word
**When** I click "Mnemonic"
**Then** the app generates a short, memorable sentence linking the source and target words

### Story 3.3: Social Hazard Warning (Paid)

As a Professional,
I want to be warned if a translation carries cultural risk,
So that I don't offend my recipient.

**Acceptance Criteria:**

**Given** I am a Paid user
**When** the translation returns a potentially offensive ambiguity
**Then** a "Red Warning" icon appears
**When** clicked, it explains the risk

## Epic 4: Subscription & Premium Access

Users can easily upgrade to a premium experience via Stripe.

### Story 4.1: Subscription UI & Stripe Handoff

As a User,
I want to upgrade to Pro,
So that I can remove the Zen Focus limits.

**Acceptance Criteria:**

**Given** I am on the Free tier
**When** I click "Upgrade"
**Then** my system browser opens to the Stripe Checkout page

### Story 4.2: Deep Link Handling & Activation

As a User,
I want my app to instantly unlock Pro features after I pay,
So that I can use them immediately.

**Acceptance Criteria:**

**Given** I completed payment in the browser
**When** Stripe redirects to `lingua-zen://success`
**Then** the app captures the deep link
**And** The app validates the session with the backend
**And** My local state updates to "Pro" (Zen Focus Meter hidden/infinite)
**And** If deep link fails, display instructions to contact support with the Session ID (MVP fallback)

## Epic 5: Knowledge & Sharing Management

Users can permanently save, organize, and share their linguistic discoveries.

### Story 5.1: Local History Persistence

As a User,
I want my translations to be saved automatically,
So that I can review them later.

**Acceptance Criteria:**

**Given** a translation completes
**Then** it is appended to the local encrypted history store
**And** I can view this list in the "Sticky Window" or "Main Window"

### Story 5.2: Quote-Translate Card Generation

As a User,
I want to turn a translation into a beautiful image,
So that I can share it on social media.

**Acceptance Criteria:**

**Given** a visible translation
**When** I click "Share"
**Then** the app generates a PNG (using `html2canvas`) of the text on a styled background
**And** The image is copied to my clipboard
