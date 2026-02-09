# Story 2.1: System Tray & Window Management

Status: ready-for-dev

## Story

As a User,
I want to manage the app from the System Tray,
so that it stays out of my taskbar when not in use.

## Acceptance Criteria

1.  **Tray Icon:** The application displays an icon in the system tray upon launch.
2.  **Tray Menu:** Right-clicking the tray icon shows a menu with:
    *   **Settings**
    *   **History** (Disabled for now)
    *   **Quit**
3.  **Quit Action:** Clicking "Quit" terminates the application completely.
4.  **Settings Action:** Clicking "Settings" opens the "Main Window".
    *   If the window is closed, it opens.
    *   If the window is hidden/minimized, it shows and focuses.
    *   This window is distinct from the "Ghost Popup" (standard window with decorations).
5.  **Main Window Content:** The Main Window loads a dedicated route (e.g., `/settings`) distinct from the Ghost Popup.

## Tasks / Subtasks

- [ ] Task 1: Configure `tauri.conf.json` (AC: 1, 4)
  - [ ] Add `tray` configuration (icon path).
  - [ ] Define a new window `settings` in `windows` array (visible: false, decorated: true).
- [ ] Task 2: Implement Rust Tray Logic (AC: 2, 3, 4)
  - [ ] Create `src-tauri/src/tray/mod.rs`.
  - [ ] Define menu items.
  - [ ] Implement event handler:
    - [ ] `Quit` -> `app.exit(0)`
    - [ ] `Settings` -> `get_window("settings").show()`
  - [ ] Register tray in `lib.rs`.
- [ ] Task 3: Setup Frontend Routing (AC: 5)
  - [ ] Install `react-router-dom`.
  - [ ] Update `main.tsx` to wrap App in Router.
  - [ ] Refactor `App.tsx` to handle routes:
    - [ ] `/` -> Ghost Popup (Current App component)
    - [ ] `/settings` -> New Settings Placeholder Component
- [ ] Task 4: Verify Multi-Window Behavior
  - [ ] Ensure Ghost Popup still works via shortcut.
  - [ ] Ensure Settings window opens via Tray.

## Dev Notes

### Technical Stack
- **Rust:** `tauri::tray`, `tauri::menu`.
- **Frontend:** `react-router-dom`.

### Implementation Guardrails
- **Icon:** Use the existing `icons/icon.ico` or similar for the tray.
- **Routing:** Ensure the "Ghost" window defaults to `/` and "Settings" window defaults to `/settings` (via `url` param in `tauri.conf.json`).

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List

### File List
