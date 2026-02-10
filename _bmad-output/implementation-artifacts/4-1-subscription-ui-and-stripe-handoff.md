# Story 4.1: Subscription UI & Stripe Handoff

Status: done

## Story

As a Free User,
I want to upgrade to Lingua-Zen Pro,
So that I can remove the Zen Focus energy limits and unlock advanced features.

## Acceptance Criteria

1. The "Settings" window displays a clear "Upgrade to Pro" section.
2. Clicking "Upgrade" opens the default system browser to a Stripe Checkout Session URL.
3. The app uses **Stripe Test Mode** for all transactions.
4. The Ghost window shows an "Unlock Pro" nudge when Energy is low.
5. Technical: Checkout URL is currently generated via a hardcoded link or a simple backend call (MVP: use a Stripe Payment Link for simplicity).

## Tasks / Subtasks

- [x] Task 1: UI Implementation (AC: 1, 4)
  - [x] Added "Lingua-Zen Pro" card to `SettingsWindow.tsx`.
  - [x] Implemented a "Pro Nudge" in `GhostWindow.tsx` when energy balance is <= 2.
- [x] Task 2: Stripe Integration (AC: 2, 3, 5)
  - [x] Created a `open_checkout` Rust command that uses the `tauri-plugin-opener`.
  - [x] Configured the Stripe Test Mode Payment Link (using placeholder test URL).
- [x] Task 3: State Preparation
  - [x] Added `isPro` boolean to `useZenFocusStore.ts`.
  - [x] Ensured energy deduction logic is bypassed if `isPro` is true.

## Dev Notes

### Technical Stack
- **Payment:** Stripe Test Mode.
- **Navigation:** Used `tauri-plugin-opener` for native browser handoff.
- **Pro Logic:** `isPro` flag in Zustand store bypasses `deduct_focus_points` and displays infinite energy (∞).

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Implemented Pro upgrade path in Settings.
- Added contextual "Pro Nudge" in the ghost popup.
- Enabled infinite energy logic for Pro users.

### File List
- `src-tauri/src/commands/window_commands.rs`
- `src-tauri/src/lib.rs`
- `src/lib/stores/useZenFocusStore.ts`
- `src/components/settings/SettingsWindow.tsx`
- `src/components/ghost/GhostWindow.tsx`