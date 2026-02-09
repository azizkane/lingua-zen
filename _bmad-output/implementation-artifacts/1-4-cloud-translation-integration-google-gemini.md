# Story 1.4: Cloud Translation Integration (Google Gemini)

Status: done

## Story

As a User,
I want to see the translation of my text in my target language,
so that I can understand it immediately.

## Acceptance Criteria

1. The Rust backend integrates with the Google Gemini API (via direct HTTP client or Cloud Proxy).
2. The user's text is sent to the API, and the translation is returned to the frontend.
3. The UI displays a "Breathing Loader" animation while waiting for the response.
4. If the API fails or the user is offline, a friendly "Zen connection lost" message is displayed (no crash).
5. The API key is securely loaded (from environment variable for dev, or later via Cloud Proxy).

## Tasks / Subtasks

- [x] Task 1: Create AI Service Interface in Rust (AC: 1, 5)
  - [x] Defined `AIService` trait for provider abstraction
  - [x] Implemented `GeminiProvider` struct using `reqwest`
  - [x] Added `reqwest`, `tokio`, `dotenvy` to `Cargo.toml`
- [x] Task 2: Implement Translation Command (AC: 2)
  - [x] Created `translate_text` Tauri command in `ai_commands.rs`
  - [x] Connected command to `GeminiProvider` using `Arc` for thread safety
- [x] Task 3: Frontend Integration & Loader (AC: 3)
  - [x] Created `BreathingLoader` component with Tailwind animations
  - [x] Updated `App.tsx` to call `translate_text` and manage loading state
- [x] Task 4: Error Handling (AC: 4)
  - [x] Handled Result in Rust and error catch in React
  - [x] Displayed "Zen connection lost" message on failure

## Dev Notes

### Implementation Summary
- **Abstraction:** Implemented an `AIService` trait in Rust to allow swapping Google Gemini for other providers (e.g., OpenAI) without changing command logic.
- **Security:** Loaded the API key using `dotenvy` from a `.env` file. (Note: Ensure `.env` is added to `.gitignore`).
- **UI:** The `BreathingLoader` uses `animate-ping` and `animate-pulse` to create a calming effect during the API call.
- **Auto-Trigger:** The app automatically triggers translation when the Ghost Popup is summoned with text selected.

### Technical Decisions
- **Arc State:** Used `Arc<dyn AIService>` in Tauri's managed state to share the AI service safely across threads.
- **Model:** Used `gemini-1.5-flash` for its high speed and low latency, fitting the "Zen" performance goal.

### References
- [Source: src-tauri/src/ai/mod.rs]
- [Source: src-tauri/src/ai/gemini.rs]
- [Source: src-tauri/src/commands/ai_commands.rs]
- [Source: src/App.tsx]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Integrated Google Gemini API for translations.
- Implemented trait-based AI service abstraction.
- Added "Breathing Loader" and error handling in the frontend.

### File List
- `src-tauri/Cargo.toml`
- `src-tauri/src/lib.rs`
- `src-tauri/src/ai/mod.rs`
- `src-tauri/src/ai/gemini.rs`
- `src-tauri/src/commands/mod.rs`
- `src-tauri/src/commands/ai_commands.rs`
- `src/components/BreathingLoader.tsx`
- `src/App.tsx`
- `.env`