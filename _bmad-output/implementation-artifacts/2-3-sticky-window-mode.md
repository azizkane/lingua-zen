# Story 2.3: Sticky Window Mode

Status: done

## Story

As a User,
I want to pin a translation window to my screen,
so that I can reference it while reading or writing in another application without it disappearing.

## Acceptance Criteria

1. The Ghost Popup displays a "Pin" (or "Zen Lock") icon in the header.
2. Clicking the Pin icon toggles "Sticky Mode" for the current window.
3. In Sticky Mode, the window does NOT hide when it loses focus (auto-hide on blur is disabled).
4. In Sticky Mode, the window remains "Always on Top".
5. The Pin icon changes visual state (e.g., filled vs outline) to indicate status.
6. Pressing `Esc` or clicking the Pin again disables Sticky Mode and/or hides the window.

## Tasks / Subtasks

- [x] Task 1: Backend Sticky State (AC: 3)
  - [x] Added `IS_STICKY` atomic boolean in `window_commands.rs`.
  - [x] Modified `WindowEvent::Focused` listener in `lib.rs` to skip `hide()` if sticky.
- [x] Task 2: Implement `toggle_sticky` Command (AC: 2)
  - [x] Created `toggle_sticky` Rust command returning the new state.
- [x] Task 3: UI Implementation (AC: 1, 5)
  - [x] Added Pin SVG button to Ghost header.
  - [x] Connected button to `toggle_sticky` command.
  - [x] Implemented visual glow/fill state for the icon.
- [x] Task 4: Window Dragging Improvements (Additional)
  - [x] Implemented `start_drag` command using Tauri native API.
  - [x] Added a global Drag Handle at the absolute top of the window.
  - [x] Fixed "disappearing on drag" bug by adding `IS_DRAGGING` guard in Rust.

## Dev Notes

### Implementation Summary
- **Multi-State Guard:** The window now respects both `is_sticky` and `is_dragging` flags before deciding to auto-hide on blur.
- **Robust Drag:** Moved away from `data-tauri-drag-region` to a manual `start_dragging()` call triggered by a `DragHandle` component. This provides 100% reliable window movement.
- **Event Management:** Used event propagation stopping (`preventDrag`) to ensure header buttons work perfectly while the rest of the bar drags.

### Technical Decisions
- **Rust State:** `AtomicBool` with `Ordering::SeqCst` was used for thread-safe state sharing between commands and the event loop.
- **Z-Index:** The Drag Handle sits at `z-0` so header buttons (`z-10`) stay interactive.

### References
- [Source: src-tauri/src/commands/window_commands.rs]
- [Source: src-tauri/src/lib.rs]
- [Source: src/App.tsx]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Implemented Sticky Mode toggle.
- Implemented robust manual dragging via Rust command.
- Solved focus-loss bug during window drag.

### File List
- `src-tauri/src/commands/window_commands.rs`
- `src-tauri/src/lib.rs`
- `src/App.tsx`
- `src-tauri/Cargo.toml`