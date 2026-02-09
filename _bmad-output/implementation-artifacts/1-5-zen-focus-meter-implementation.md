# Story 1.5: Zen Focus Meter Implementation

Status: done

## Story

As a User,
I want to see my current "Energy" balance,
so that I know how many free translations I have left.

## Acceptance Criteria

1. The system tracks a local "Zen Focus" balance (points) for the user.
2. The balance is stored persistently and securely using `tauri-plugin-store`.
3. Each successful translation deducts 1 point from the balance.
4. Each successful explanation (Explainer Mode) deducts 3 points from the balance.
5. The Ghost Popup UI displays the remaining points in a subtle, non-intrusive way.
6. If the balance is zero, the "Translate" and "Explain" buttons are disabled, and a "Recharge" message is shown.

## Tasks / Subtasks

- [x] Task 1: Setup Local Store for Usage Tracking (AC: 1, 2)
  - [x] Initialized `tauri-plugin-store` in `lib.rs`
  - [x] Implemented `get_balance` helper in Rust using `zen_focus.json`
- [x] Task 2: Implement Deduction Logic in Rust (AC: 3, 4)
  - [x] Created `deduct_focus_points` Tauri command with safety checks
  - [x] Implemented cross-window event emission (`focus-update`) on deduction
- [x] Task 3: Create Frontend Focus Store (AC: 5)
  - [x] Created Zustand store `useZenFocusStore.ts`
  - [x] Implemented auto-sync with Rust backend via listeners and invokes
- [x] Task 4: UI Implementation (AC: 5, 6)
  - [x] Added "Energy" pill indicator to the header
  - [x] Implemented disabled states and "Locked" messaging for zero balance

## Dev Notes

### Implementation Summary
- **Source of Truth:** The Rust backend (`src-tauri/src/store/mod.rs`) is the authoritative source for the balance to ensure persistence and consistency.
- **Sync Strategy:** Used a hybrid approach:
    1.  `fetchBalance()` on component mount.
    2.  `listen("focus-update")` in Zustand to receive real-time updates from Rust (crucial for multi-window support).
- **UX:** Added a glowing indicator when energy is available and a red warning state when depleted.

### Technical Decisions
- **Default Balance:** Set to 10 points for the MVP.
- **Deduction Timing:** Balance is deducted *after* a successful translation but *before* displaying the result to ensure the user "pays" for the token usage.

### References
- [Source: src-tauri/src/store/mod.rs]
- [Source: src/lib/stores/useZenFocusStore.ts]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Implemented persistent Zen Focus tracking using Tauri Plugin Store.
- Created Zustand store for frontend state management.
- Integrated Energy indicator and lock logic in the UI.

### File List
- `src-tauri/src/lib.rs`
- `src-tauri/src/store/mod.rs`
- `src/lib/stores/useZenFocusStore.ts`
- `src/App.tsx`