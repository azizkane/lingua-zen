# Story 3.2: Mnemonics Generator & Model Centralization

Status: done

## Story

As a Student,
I want a memory aid for a translated word,
So that I don't forget it again.

## Acceptance Criteria

1. The Ghost Popup displays a "Mnemonic" (or "Brain") button next to the Explain button.
2. Clicking the button sends a specialized prompt to Gemini: "Create a short, memorable mnemonic...".
3. This action costs 3 Zen Focus points.
4. The result is displayed in the "Zen Insight" overlay (reusing the Glimpse UI).
5. [New] Model list is centralized in Rust (`src-tauri/src/ai/models.rs`).
6. [New] Models include `id`, `name`, `source`, and `description`.
7. [New] Settings UI displays descriptions for the selected model.

## Tasks / Subtasks

- [x] Task 1: Backend AI Implementation (AC: 2)
  - [x] Added `mnemonic` method to `AIService` and `GeminiProvider`.
  - [x] Created `src-tauri/src/ai/models.rs` with full metadata (inc. descriptions).
  - [x] Registered `get_available_models` and `generate_mnemonic` commands.
- [x] Task 2: UI Implementation (AC: 1, 3, 4, 6, 7)
  - [x] Added "Mnemonic" (🧠) button to `GhostWindow.tsx`.
  - [x] Updated `SettingsWindow.tsx` with a dynamic header selector and detail card.
  - [x] Implemented description display in Settings.

## Dev Notes

### Technical Stack
- **Centralization:** Model metadata is now 100% managed in Rust. The frontend simply renders what the backend provides.
- **Dynamic Routing:** `init_ai` looks up the source of the selected model to determine whether to use the direct Gemini client or OpenRouter.

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Centralized all LLM configuration in Rust.
- Added descriptive metadata for each model.
- Integrated Mnemonics generation with the Glimpse overlay.

### File List
- `src-tauri/src/ai/models.rs`
- `src-tauri/src/ai/gemini.rs`
- `src-tauri/src/ai/openrouter.rs`
- `src-tauri/src/commands/ai_commands.rs`
- `src/lib/stores/useZenFocusStore.ts`
- `src/components/settings/SettingsWindow.tsx`
- `src/components/ghost/GhostWindow.tsx`