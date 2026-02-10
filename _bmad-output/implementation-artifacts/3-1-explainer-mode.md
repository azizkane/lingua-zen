# Story 3.1: Explainer Mode

Status: in-progress

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

- [ ] Task 1: Backend AI Implementation (AC: 2)
  - [ ] Implement the `explain` method in `src-tauri/src/ai/gemini.rs`.
  - [ ] Create a `translate_and_explain` or separate `explain_text` command.
- [ ] Task 2: Frontend Store Update (AC: 3)
  - [ ] Ensure `deduct(3)` is handled correctly.
- [ ] Task 3: UI Implementation (AC: 1, 5, 6)
  - [ ] Add "Explain" button to `App.tsx`.
  - [ ] Add visual feedback for the higher energy cost.

## Dev Notes

### Technical Stack
- **Prompt Engineering:** The prompt should be: "Explain the following text or concept simply and concisely in English: [TEXT]"
- **Energy Cost:** Logic already exists in `deduct_focus_points`.

### Implementation Guardrails
- **UX:** Clear distinction between "Translate" and "Explain".

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List

### File List
