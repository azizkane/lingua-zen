# Story 1.6: Zen Pulse Feedback

Status: done

## Story

As a User,
I want a subtle visual cue when I copy text,
so that I know Lingua-Zen is ready to translate.

## Acceptance Criteria

1. The Rust backend monitors the system clipboard for changes.
2. When new text is copied, the app emits a "zen-pulse" event.
3. The UI (Ghost Popup) displays a subtle glowing animation (pulse) to acknowledge the detection.
4. This feature can be disabled via a future settings toggle (logic prepared).

## Tasks / Subtasks

- [x] Task 1: Implement Clipboard Polling in Rust (AC: 1, 2)
  - [x] Created background thread in `clipboard/mod.rs`
  - [x] Implemented change detection with 500ms interval
  - [x] Emitted `zen-pulse` global event
- [x] Task 2: Implement Pulse UI in Frontend (AC: 3)
  - [x] Added `isPulsing` state to `App.tsx`
  - [x] Implemented ring-glow and scale animation via Tailwind
  - [x] Added status text feedback ("Zen detected a copy...")
- [x] Task 3: Optimization (AC: 3)
  - [x] Verified polling logic uses minimal resources by only comparing strings

## Dev Notes

### Implementation Summary
- **Backend:** Spawns a dedicated thread on startup that checks the clipboard twice per second. It only emits an event if the text has actually changed and isn't empty.
- **Frontend:** Listens for the pulse event and triggers a 1-second CSS transition that adds a ring light and a slight scale-up effect to the entire window.

### Technical Decisions
- **Polling vs OS Hooks:** Polling was chosen for its reliability and simplicity across Windows/macOS/Linux in a Tauri context.
- **Visuals:** Used a `ring-indigo-500/50` combined with `backdrop-blur` for a premium, integrated feel.

### References
- [Source: src-tauri/src/clipboard/mod.rs]
- [Source: src/App.tsx]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Implemented clipboard monitoring in Rust.
- Added visual "pulse" feedback in the frontend.
- Cleaned up compiler warnings and improved shortcut registration resilience.

### File List
- `src-tauri/src/clipboard/mod.rs`
- `src-tauri/src/lib.rs`
- `src-tauri/src/global_shortcut/mod.rs`
- `src-tauri/src/store/mod.rs`
- `src-tauri/src/ai/mod.rs`
- `src/App.tsx`