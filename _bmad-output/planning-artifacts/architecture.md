---
stepsCompleted: ['step-01-init', 'step-02-context', 'step-03-starter', 'step-04-decisions', 'step-05-patterns', 'step-06-structure', 'step-07-validation']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md']
workflowType: 'architecture'
project_name: 'lingua-zen'
user_name: 'Aziuk'
date: '2026-02-05'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **The Ghost Engine:** Requires deep OS integration for global shortcuts (`Alt+Z`) and clipboard monitoring ("Zen Pulse"). This dictates a **Tauri (Rust)** backend for native hooks.
- **Cloud Intelligence:** "Explainer Mode" and "Translation" rely on external APIs (OpenAI/Anthropic). The architecture must handle API latency gracefully ("Breathing Loader").
- **Monetization Logic:** "Zen Focus" Meter and "Fading Context" require robust **local state management** that is tamper-resistant but offline-first.
- **Viral Loop:** "Quote-Translate" requires client-side image generation (`html2canvas`/`satori`).

**Non-Functional Requirements:**
- **Performance:** The `<200ms` invocation latency is the critical constraint. The architecture must minimize the "Bridge" cost between Rust and the WebView.
- **Privacy:** **Zero-Log** means the backend cannot be a "Database of translations." It must be a stateless pass-through.
- **Security:** Local history must be **AES-256 encrypted**.

**Scale & Complexity:**
- **Complexity Level:** Medium (High native complexity, Low backend complexity).
- **Primary Domain:** Desktop Utility (Native Hybrid).
- **Architecture Strategy:** **Multi-WebView Architecture**. Separate WebViews for the Ghost Popup, Main Window, and Sticky Window to ensure maximum performance and separation of concerns.

### Technical Constraints & Dependencies

- **Tauri Framework:** The primary constraint. All native features must flow through Tauri Commands.
- **Cross-Platform:** Windows first, but architecture must be OS-agnostic where possible.
- **Third-Party AI:** Reliance on OpenAI/Anthropic APIs.
- **Stateless Serverless:** The "Cloud Proxy" must be strictly stateless and have **Request Logging Disabled** to comply with Zero-Log privacy requirements.

### Cross-Cutting Concerns Identified

- **Inter-Window State Sync:** Synchronizing "Zen Focus" balance and settings across independent WebViews.
- **Security:** Secure storage of user tokens and history encryption keys using OS Keychain.
- **Telemetry:** Anonymous feature usage tracking (No PII).

## Starter Template Evaluation

### Primary Technology Domain

**Desktop Application (Tauri)** with **React Frontend**.

### Starter Options Considered

1.  **Official `create-tauri-app`:** The gold standard. Maintained by the Tauri Working Group. Guarantees compatibility with the latest Rust/Tauri versions.
2.  **Community Starters (e.g., `tauri-react-tailwind-template`):** Often outdated (Tauri v1 vs v2). High risk of "dependency drift."

### Selected Starter: Official Tauri CLI

**Rationale for Selection:**
We prioritize **Stability** and **Security** for the "Zen" brand. Using the official CLI ensures we start with the latest security patches for the Rust/WebView bridge. Adding Tailwind manually takes 2 minutes and is less risky than using a stale template.

**Initialization Command:**

```bash
# 1. Create the Tauri App
npm create tauri-app@latest lingua-zen -- --template react-ts

# 2. Enter directory
cd lingua-zen

# 3. Install Tailwind CSS (The "Zen" styling engine)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Install Core Rust Deps (for Global Shortcuts)
npm install @tauri-apps/api
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- **Rust:** Backend core (Tauri main process).
- **TypeScript:** Frontend logic (React components).
- **Bun/Node:** Package manager (User choice, we'll document `npm` for compatibility but `bun` is faster).

**Styling Solution:**
- **Tailwind CSS:** Utility-first for rapid UI development (Sticky Window / Ghost Popup layouts).

**Build Tooling:**
- **Vite:** Extremely fast HMR (Hot Module Replacement), critical for tuning the "Animation Smoothness".

**Code Organization:**
- `/src-tauri`: Rust backend code.
- `/src`: React frontend code.

## Core Architectural Decisions

### Decision Priority Analysis
**Critical Decisions (Block Implementation):**
- **State Management:** Zustand (v5.0.11) with **Event-Driven Multi-Window Sync**.
- **Local Storage:** `tauri-plugin-store` (v2.4.2) + **`keyring` Rust crate** for key management.
- **UI Components:** Shadcn/UI (Latest) for "Zen" interaction patterns.
- **Payment Flow:** External Browser Redirect + **Tauri Deep Link** (Stripe).

**Deferred Decisions (Post-MVP):**
- **Database:** SQLite (`tauri-plugin-sql`) - Deferred until we need complex offline search or large history archives.
- **Multi-Platform Build:** Linux packaging - Deferred until Windows/Mac MVP is stable.

### Data Architecture
- **Local Store:** `tauri-plugin-store` for Settings and History.
    - *Encryption:** Files encrypted with AES-256 via Rust backend. The master key is stored securely in the **OS Keyring** (via `keyring` crate).
- **Cloud Data:** None (Zero-Log). All processing is stateless.

### Authentication & Security
- **Auth Strategy:** Device-Based Subscription Token stored in the OS Keychain.
- **Stripe Integration:**
    - **Flow:** "Upgrade" button triggers system browser opening `checkout.stripe.com`.
    - **Success:** Redirects to `lingua-zen://payment-success?session_id=...`.
    - **Handshake:** Tauri Rust backend catches the protocol, validates the session via the Cloud Proxy, and unlocks Pro features locally.

### API & Communication Patterns
- **Rust-to-Frontend:** Tauri Commands for all AI calls and file I/O.
- **Frontend-to-Frontend (Multi-Window):** Use Tauri's `emit` system to synchronize Zustand store changes (e.g., deducting "Energy") across the Ghost Popup and Main Window.
- **Cloud Proxy:** Vercel Edge Functions (Stateless, Request Logging Disabled).

### Infrastructure & Deployment
- **CI/CD:** GitHub Actions building NSIS (Windows) and DMG (macOS) installers.
- **Deployment:** Custom protocol (`lingua-zen://`) registered at the OS level.

### Decision Impact Analysis
- **Implementation Sequence:**
    1.  Tauri Starter + Deep Link Plugin registration.
    2.  Rust Native Hooks (Shortcut `Alt+Z`, Tray, Keyring).
    3.  Cloud Proxy (Stateless translation wrapper).
    4.  Frontend Zustand Store with Cross-Window event listeners.
- **Technical Risks:**
    - **Anti-Virus (AV) False Positives:** Registering a custom protocol and hooking global keystrokes can trigger AV software. **Mitigation:** Code signing the binaries (NSIS/App Bundle) is mandatory for MVP.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
- **Naming Conflicts:** Rust uses `snake_case`, JS uses `camelCase`.
- **Logic Location:** Where does core business logic reside (Rust vs JS)?
- **File Organization:** Feature-based vs type-based structure.

### Naming Patterns

**Rust (Backend):**
- `snake_case` for functions, methods, and variables.
- `PascalCase` for structs, enums.

**TypeScript (Frontend):**
- `camelCase` for variables, functions, and methods.
- `PascalCase` for React components.

**Tauri Commands:**
- Defined in Rust as `snake_case` (e.g., `get_settings`).
- Invoked from TypeScript as `camelCase` (e.g., `getSettings()`).

### Structure Patterns

**Project Organization:**
- **Feature-First Architecture:** Code organized by domain features rather than file type.
    - `/src/features/ghost-mode/`
    - `/src/features/history/`
    - `/src/features/payment/`
- **Shared Components:**
    - `/src/components/ui/` for Shadcn/UI primitives.
    - `/src/lib/` for shared utilities and helper functions.

**File Structure Patterns:**
- Configuration files (`tauri.conf.json`, `tailwind.config.ts`) at project root or designated config folders.
- Static assets (`/public`) for images, fonts.

### Format Patterns

**API Response Formats:**
- Rust Tauri Commands will return `Result<T, String>` for all operations. Frontend will `try/catch` and handle `Err` as toast notifications.
- Data payloads for AI will be strictly JSON.

### Communication Patterns

**Event System Patterns (Multi-Window Sync):**
- Event names will be `kebab-case` (e.g., `zen-focus-update`, `settings-changed`).
- Payloads will be JSON objects with clear schemas.

**State Management Patterns:**
- **Zustand Stores:** Named `use[Feature]Store` (e.g., `useZenFocusStore`).
- **Logic Location:** Core business logic (encryption, API calls, focus deduction) resides in Rust. Frontend Zustand stores hold UI-specific state derived from Rust data.

### Process Patterns

**Error Handling Patterns:**
- Global error boundaries in React.
- Toast notifications (Shadcn) for user-facing errors.
- Detailed logging in Rust (via `log` crate) for debugging.

**Loading State Patterns:**
- **"Breathing Loader" animation:** Global indicator for AI API latency.
- Per-component loading states for specific data fetches.

### Enforcement Guidelines

**All AI Agents MUST:**
- Adhere to the defined Naming, Structure, and Communication patterns.
- Implement core business logic (e.g., Zen Focus deduction, encryption) in the Rust backend.
- Utilize Tauri Commands for all native interactions.

**Pattern Enforcement:**
- Code review (human/AI) will check for pattern adherence.
- Linting rules will enforce naming conventions where possible.

### Pattern Examples

**Good Examples:**
```rust
// Rust backend
#[tauri::command]
fn get_zen_focus_balance() -> Result<u32, String> { /* ... */ }

// TypeScript frontend
const balance = await invoke('get_zen_focus_balance');
```

**Anti-Patterns:**
- Calling external APIs directly from frontend.
- Implementing Zen Focus deduction logic in JavaScript.

## Project Structure & Boundaries

### Complete Project Directory Structure
```
lingua-zen/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions for CI/CD, Tauri builds
├── src-tauri/                 # Rust backend for Tauri
│   ├── Cargo.toml             # Rust package manifest
│   ├── src/
│   │   ├── main.rs            # Tauri Rust entry point
│   │   ├── commands/          # Tauri commands (Rust functions callable from JS)
│   │   │   ├── ai_commands.rs # AI API calls, Explainer, Translation
│   │   │   ├── data_commands.rs # History CRUD, Settings
│   │   │   └── payment_commands.rs # Stripe webhook processing
│   │   ├── encryption/        # AES-256 and keyring integration
│   │   │   └── mod.rs
│   │   ├── global_shortcut/   # Global shortcut registration and event handling
│   │   │   └── mod.rs
│   │   ├── store/             # Wrappers for tauri-plugin-store
│   │   │   └── mod.rs
│   │   ├── tray/              # System tray icon and menu logic
│   │   │   └── mod.rs
│   │   ├── window/            # Multi-window management (Ghost, Main, Sticky)
│   │   │   └── mod.rs
│   │   └── utils/             # Common Rust utilities
│   │       └── mod.rs
│   └── build.rs               # Tauri custom build script
├── src/                       # React TypeScript frontend
│   ├── main.tsx               # Frontend entry point
│   ├── App.tsx                # Main App component
│   ├── features/              # Feature-based code organization
│   │   ├── ghost-mode/        # Ghost Popup UI, Zen Pulse logic
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── stores/        # Zustand store for ghost mode
│   │   ├── history/           # Sticky Window History UI, Export logic
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── stores/        # Zustand store for history
│   │   ├── payment/           # Upgrade UI, Stripe integration callbacks
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── stores/        # Zustand store for payment status
│   │   └── settings/          # Settings UI, Shortcut customization
│   │       ├── components/
│   │       └── stores/        # Zustand store for settings
│   ├── components/            # Shared UI components (not tied to a specific feature)
│   │   └── ui/                # Shadcn/UI components
│   │       └── button.tsx
│   ├── lib/                   # Utilities, API wrappers, hooks
│   │   ├── api.ts             # Wrappers for Tauri Commands
│   │   ├── stores/            # General Zustand stores (e.g., useAppStore)
│   │   └── utils.ts
│   ├── assets/                # Images, icons, fonts
│   │   ├── logo.svg
│   │   └── icon.png
│   ├── styles/                # Global CSS, Tailwind directives
│   │   └── index.css
│   └── types/                 # Global TypeScript types and interfaces
│       └── index.d.ts
├── tests/                     # Test suite
│   ├── unit/                  # Unit tests for Rust and React components
│   ├── integration/           # Integration tests for Tauri Commands
│   └── e2e/                   # End-to-end tests (Playwright/Cypress)
├── public/                    # Static assets for the webview
│   └── icon.png
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── tauri.conf.json            # Tauri configuration
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

### Architectural Boundaries

**API Boundaries:**
- **Rust Internal API:** `src-tauri/src/commands/` exposes `#[tauri::command]` functions.
- **Cloud AI API:** External (`api.openai.com`, `api.anthropic.com`) accessed only from Rust.
- **Stripe API:** External (`checkout.stripe.com`) initiated from Frontend, validated by Rust/Cloud Proxy.

**Component Boundaries:**
- **Multi-WebView:** Each major UI (Ghost Popup, Main Window, Sticky Window) is its own Tauri WebView, communicating via Tauri events.
- **Feature Modules:** Each folder in `src/features/` is a distinct, cohesive unit.

**Service Boundaries:**
- **Cloud Proxy (Serverless):** Stateless, serves only to securely forward AI requests and validate Stripe payments.
- **Local Backend (Rust):** Handles native OS interactions, encryption, and local data persistence.

**Data Boundaries:**
- **Local Encrypted Store:** Managed exclusively by Rust backend (`src-tauri/src/store/`).
- **Ephemeral Data:** Transient translation data is not stored (Zero-Log).

### Requirements to Structure Mapping

**Feature Mapping:**
- **Ghost Mode:** `src/features/ghost-mode/`, `src-tauri/src/global_shortcut/`, `src-tauri/src/window/`.
- **History:** `src/features/history/`, `src-tauri/src/store/`, `src-tauri/src/encryption/`.
- **Payment:** `src/features/payment/`, `src-tauri/src/commands/payment_commands.rs` (for Stripe validation), Cloud Proxy.

**Cross-Cutting Concerns:**
- **Telemetry:** Handled by a dedicated Rust module (`src-tauri/src/telemetry/` if implemented), forwarding anonymous events to a serverless endpoint.
- **Error Handling:** Global handlers in `main.rs` and `App.tsx`, component-specific error states.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- All technology choices (Tauri, Rust, React, Zustand, Shadcn/UI, Tailwind) are compatible.
- Multi-WebView architecture supports performance and separation of concerns.
- Patterns (naming, structure) align with the chosen stack.

**Pattern Consistency:**
- Naming conventions (`snake_case` in Rust, `camelCase` in TS) are clear and align with Tauri's auto-conversion.
- Feature-first organization supports modular development.

**Structure Alignment:**
- The project structure maps directly to architectural decisions and functional requirements.
- Clear boundaries between Rust native code and React UI components.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
- All 27 FRs from the PRD are covered by specific architectural components and decisions.
    - *Example:* FR1 (Global Shortcut) is covered by `tauri-plugin-global-shortcut` and `src-tauri/src/global_shortcut/`.
    - *Example:* FR16 (Stripe Validation) is covered by Stripe Deep Link, Cloud Proxy, and `payment_commands.rs`.

**Non-Functional Requirements Coverage:**
- All 9 NFRs are addressed:
    - *Performance:* Multi-WebView, Rust backend, `<200ms` target.
    - *Security:* OS Keyring, AES-256, Zero-Log Cloud Proxy.
    - *Reliability:* Grace Period for subscription validation.

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical decisions (State Management, Local Storage, Native Bridges, Component Library) are documented with specific technologies and versions.

**Structure Completeness:**
- The complete project directory structure provides a clear blueprint for development.

**Pattern Completeness:**
- Naming, Structure, Communication, and Process patterns are defined with examples, reducing ambiguity for AI agents.

### Gap Analysis Results

- **No Critical Gaps.**
- **No Important Gaps.**
- **Minor Gaps:** Detailed telemetry implementation strategy (deferred).

### Validation Issues Addressed

- **OS Keyring Integration:** Confirmed for master encryption key.
- **Multi-WebView Performance:** Confirmed as the strategy for UI separation.
- **Stripe Protocol AV Testing:** Identified as a mandatory step for release.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** **READY FOR IMPLEMENTATION**

**Confidence Level:** High

**Key Strengths:**
- **Clear Boundaries:** Rust for native/secure, React for UI, Multi-WebView separation.
- **Performance First:** Explicit targets for invocation/interaction latency, smooth animations.
- **Security & Privacy by Design:** OS Keyring, AES-256 encryption, Zero-Log Cloud Proxy.
- **Consistency:** Detailed naming, structure, and communication patterns for multi-agent development.
- **Lean MVP:** Focus on core features with a clear roadmap for future growth.

**Areas for Future Enhancement:**
- Linux builds.
- Full OCR integration.
- Advanced telemetry strategies (anonymous, event-based).

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**

```bash
# 1. Create the Tauri App
npm create tauri-app@latest lingua-zen -- --template react-ts

# 2. Enter directory
cd lingua-zen

# 3. Install Tailwind CSS (The "Zen" styling engine)
npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p

# 4. Install Core Rust Deps (for Global Shortcuts, Keyring, Tauri API)
npm install @tauri-apps/api && cargo add tauri-plugin-global-shortcut && cargo add keyring && cargo add aes-gcm --features std

# 5. Begin implementing `src-tauri/src/global_shortcut/mod.rs` for Alt+Z trigger
```
