# Story 2.1: System Tray & Window Management

Status: in-progress

## Story

As a User,
I want to manage the app from the System Tray,
So that it stays out of my taskbar when not in use.

## Acceptance Criteria

1. The application displays an icon in the OS System Tray.
2. Left-clicking the Tray Icon toggles the "Ghost Window" visibility.
3. Right-clicking the Tray Icon opens a native menu with options:
    - **Show/Hide Lingua-Zen**
    - **Settings** (Opens separate Main Window)
    - **History** (Placeholder for now)
    - **Quit** (Terminates the application)
4. Selecting "Settings" opens a NEW window (the "Main" window) that is distinct from the Ghost popup (standard window with decorations).
5. The Ghost window remains "skipTaskbar: true", but the Settings window appears in the taskbar.

## Tasks / Subtasks

- [ ] Task 1: Implement System Tray in Rust (AC: 1, 2, 3)
  - [ ] Add `tauri-plugin-tray` dependency (if not present) or use native Tauri 2 tray builder.
  - [ ] Configure the menu items in `src-tauri/src/tray/mod.rs`.
  - [ ] Wire up "Quit" and "Show/Hide" logic.
- [ ] Task 2: Implement Settings Window Creation (AC: 4, 5)
  - [ ] Define a new window in `tauri.conf.json` or create it programmatically on "Settings" click.
  - [ ] Ensure it has `visible: false` by default and `decorations: true`.
  - [ ] Create a React route for `/settings`.
- [ ] Task 3: Tray Event Handling (AC: 3)
  - [ ] Handle menu click events in Rust.
  - [ ] Open the Settings window when requested.

## Dev Notes

### Technical Stack
- **Tauri:** `SystemTray`, `SystemTrayMenu` (or v2 equivalent `TrayIcon`).
- **Windowing:** Multi-window management is key here. The 'main' window is the Ghost. The 'settings' window is new.

### Implementation Guardrails
- **Ghost vs Main:** Be careful not to confuse the two windows.
- **Icons:** Ensure we have a valid icon for the tray (using existing resources).

### Project Structure Notes
- New module: `src-tauri/src/tray/mod.rs`

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List

### File List
