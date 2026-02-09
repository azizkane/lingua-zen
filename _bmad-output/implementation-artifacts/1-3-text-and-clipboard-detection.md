# Story 1.3: Text & Clipboard Detection

Status: done

## Story

As a User,
I want the popup to automatically contain the text I selected,
so that I don't have to manually paste it.

## Acceptance Criteria

1. When the Ghost Popup is triggered, it auto-detects the currently selected text in the active window.
2. If no text is selected, the popup falls back to the current clipboard content.
3. The detected text is pre-filled into the translation input field.
4. The input field is automatically focused for immediate editing or confirmation.

## Tasks / Subtasks

- [x] Task 1: Implement Selection Grabbing in Rust (AC: 1)
  - [x] Added `enigo` for key simulation
  - [x] Implemented `grab_selection` command in `data_commands.rs`
- [x] Task 2: Implement Clipboard Fallback (AC: 2)
  - [x] Added `tauri-plugin-clipboard-manager`
  - [x] Integrated clipboard reading in `grab_selection` command
- [x] Task 3: Bridge to Frontend (AC: 3, 4)
  - [x] Updated `global_shortcut/mod.rs` to emit `ghost-shown` event
  - [x] Updated `App.tsx` to listen for `ghost-shown` and call `grab_selection`
- [x] Task 4: UI Update
  - [x] Implemented a "Zen" styled textarea with auto-focus logic

## Dev Notes

### Implementation Summary
- **Native Hook:** Created a Rust command that simulates `Ctrl+C` via `enigo` and then reads the clipboard using the official Tauri plugin.
- **Event Flow:** The global shortcut now emits a `ghost-shown` event. The React frontend listens for this, fetches the grabbed text, and focuses the textarea.
- **UI:** Switched to a dark, translucent "Glass" theme for the input area.

### Technical Decisions
- **100ms Delay:** Added a small thread sleep in Rust between the copy simulation and the clipboard read to ensure OS stability.

### References
- [Source: src-tauri/src/commands/data_commands.rs]
- [Source: src/App.tsx]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Integrated `enigo` and `tauri-plugin-clipboard-manager`.
- Implemented auto-detection of selection on popup trigger.
- Focused input field automatically.

### File List
- `src-tauri/Cargo.toml`
- `src-tauri/capabilities/default.json`
- `src-tauri/src/lib.rs`
- `src-tauri/src/commands/mod.rs`
- `src-tauri/src/commands/data_commands.rs`
- `src-tauri/src/global_shortcut/mod.rs`
- `src/App.tsx`