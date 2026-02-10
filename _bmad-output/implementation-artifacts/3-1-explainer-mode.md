# Story 3.1: Explainer Mode

Status: done

## Story

As a User,
I want to get a simplified explanation of a complex term or concept,
so that I can truly understand the meaning beyond just a direct translation.

## Acceptance Criteria

1. The Ghost Popup displays an "Explain" button (or "Zen Insight" icon) next to the translation.
2. Clicking "Explain" sends a specialized prompt to Gemini (e.g., "Explain this concept simply in English...").
3. This action costs 3 Zen Focus points (vs 1 for standard translation).
4. If points are insufficient, the button is disabled or triggers a "Recharge" prompt.
5. The explanation is displayed in the same insight area as the translation, replacing it or appended (preference: replacing for MVP clarity).
6. A distinct loading state or label indicates "Zen Explaining...".

## Tasks / Subtasks

- [x] Task 1: Backend AI Implementation (AC: 2)
  - [x] Implemented `explain` method in `src-tauri/src/ai/gemini.rs`.
  - [x] Created `explain_text` command.
- [x] Task 2: Frontend Store Update (AC: 3)
  - [x] Handled `deduct(3)` in `useZenTranslation.ts`.
- [x] Task 3: UI Implementation (AC: 1, 5, 6)
  - [x] Added "Explain" button to `GhostWindow.tsx`.
  - [x] Implemented split-pane layout with smooth animation.
  - [x] Added loading state for explanation.

## Dev Notes

### Technical Stack
- **Prompt Engineering:** Centralized in `src-tauri/src/ai/prompts.rs`.
- **UI:** Modularized into components and custom hooks.
- **Layout:** Responsive split-pane with CSS transitions.

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Implemented Explainer Mode with side-by-side view.
- Centralized prompting logic.
- Refactored frontend into modular components.
- Fixed layout bugs and improved z-index management.

### File List
- `src-tauri/src/ai/prompts.rs`
- `src-tauri/src/ai/gemini.rs`
- `src-tauri/src/commands/ai_commands.rs`
- `src/hooks/useZenTranslation.ts`
- `src/components/ghost/GhostWindow.tsx`
- `src/components/settings/SettingsWindow.tsx`
- `src/App.tsx`