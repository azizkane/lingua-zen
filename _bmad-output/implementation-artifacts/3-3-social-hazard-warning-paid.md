# Story 3.3: Social Hazard Warning (Bundled)

Status: done

## Story

As a Professional User,
I want to be warned instantly if my translation carries a risk of cultural offense or misunderstanding,
So that I can communicate safely without waiting for a separate check.

## Acceptance Criteria

1. The translation prompt is updated to request a JSON response.
2. The JSON schema includes:
    - `translation`: The translated text.
    - `hazard_level`: Enum ["safe", "low", "medium", "high"].
    - `hazard_reason`: Brief explanation (if level > safe).
3. The UI parses this JSON.
4. If `hazard_level` is "medium" or "high", a warning icon appears in the result area.
5. Hovering/Clicking the icon reveals the `hazard_reason`.
6. Backward compatibility: If the model returns plain text (fallback), treat it as "safe".

## Tasks / Subtasks

- [x] Task 1: Update Prompts (AC: 1, 2)
  - [x] Modified `TRANSLATION_PROMPT` in `prompts.rs` to enforce JSON.
- [x] Task 2: Update Backend Parsing (AC: 6)
  - [x] Implemented `clean_json` helper in `GeminiProvider` and `OpenRouterProvider`.
  - [x] Ensured plain-text fallback handling.
- [x] Task 3: Frontend Integration (AC: 3, 4, 5)
  - [x] Updated `useZenTranslation.ts` to parse structured responses.
  - [x] Implemented reactive "Explain" button with hazard dots (amber/red).
  - [x] Color-coded the "Zen Insight" header based on hazard level.
  - [x] Injected hazard context into the Explainer prompt for nuanced warnings.

## Dev Notes

### Implementation Summary
- **Bundled Intelligence:** Hazard analysis is now part of the primary translation lifecycle.
- **Visual Language:** The "Explain" button acts as a pre-emptive warning system (solid/pulsing/pinging dots).
- **Contextual Awareness:** The AI now "knows" about the hazard when explaining the concept, leading to safer outcomes.

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Bundled cultural risk analysis into main translation loop.
- Implemented reactive UI indicators for hazard levels.
- Synced hazard context with Explainer Mode.

### File List
- `src-tauri/src/ai/prompts.rs`
- `src-tauri/src/ai/gemini.rs`
- `src-tauri/src/ai/openrouter.rs`
- `src/hooks/useZenTranslation.ts`
- `src/components/ghost/GhostWindow.tsx`