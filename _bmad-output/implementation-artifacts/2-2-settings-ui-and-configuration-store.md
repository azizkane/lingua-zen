# Story 2.2: Settings UI & Configuration Store

Status: done

## Story

As a User,
I want my settings (like target language) to be saved even after I close the app,
so that I don't have to reconfigure Lingua-Zen every time I start it.

## Acceptance Criteria

1. The "Settings" window displays a functional UI to change the default target language.
2. Settings are saved to a local file using `tauri-plugin-store`.
3. When the app starts, it loads the saved target language from the store.
4. Changes made in the Settings window are immediately reflected in the Ghost Popup (Cross-window sync).
5. [Stretch] Basic UI for shortcut display (re-registration logic reserved for next phase or Epic 2.3).

## Tasks / Subtasks

- [x] Task 1: Update Frontend Store for Persistence (AC: 2, 3)
  - [x] Modified `src-tauri/src/store/mod.rs` to add `target_lang` support.
  - [x] Implemented `get_target_lang` and `save_target_lang` Rust commands.
  - [x] Updated Zustand store to call `initSettings` on mount.
- [x] Task 2: Enhance Settings UI (AC: 1)
  - [x] Built a modern, two-column settings grid.
  - [x] Added visual language selector buttons.
  - [x] Implemented "✓ Preferences Auto-Saved" feedback.
- [x] Task 3: Cross-Window Synchronization (AC: 4)
  - [x] Added `settings-update` listener in the frontend store.
  - [x] Rust emits this event to all windows whenever a save occurs.

## Dev Notes

### Implementation Summary
- **Backend:** The `tauri-plugin-store` now manages `focus_balance` and `target_lang` in `zen_focus.json`.
- **Frontend:** The Settings window (`windowLabel === "settings"`) provides a rich interface for language selection and viewing system status.
- **Sync:** If you change the language in the Settings window, the Ghost window (if open) updates its state instantly via the event bridge.

### Technical Decisions
- **Auto-Save:** Chose an auto-save model for a smoother "Zen" experience, triggered immediately on language click.
- **Dual Support:** Supported both `GOOGLE_GEMINI_API_KEY` and `GEMINI_API_KEY` for convenience.

### References
- [Source: src-tauri/src/store/mod.rs]
- [Source: src/lib/stores/useZenFocusStore.ts]
- [Source: src/App.tsx]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Persisted target language selection.
- Created rich Settings UI.
- Implemented real-time synchronization between Ghost and Settings windows.

### File List
- `src-tauri/src/store/mod.rs`
- `src-tauri/src/lib.rs`
- `src/lib/stores/useZenFocusStore.ts`
- `src/App.tsx`