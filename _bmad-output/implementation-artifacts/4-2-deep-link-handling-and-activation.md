# Story 4.2: Deep Link Handling & Activation

Status: done

## Story

As a Pro User,
I want the application to automatically activate my premium features after a successful purchase,
So that I don't have to manual enter a license key.

## Acceptance Criteria

1. The application registers a custom protocol `lingua-zen://` with the OS.
2. After a successful Stripe payment, the user is redirected to `lingua-zen://activate?session_id=...`.
3. The Rust backend intercepts this deep link.
4. The backend validates the activation (MVP: sets `is_pro` to true in the store).
5. The UI updates instantly to reflect "Pro Active" status.

## Tasks / Subtasks

- [x] Task 1: Protocol Registration
  - [x] Configured `tauri.conf.json` with `com.linguazen.app` and `lingua-zen` scheme.
- [x] Task 2: Deep Link Interceptor
  - [x] Integrated `tauri-plugin-deep-link` and `tauri-plugin-single-instance`.
  - [x] Implemented argument parsing in `lib.rs` to detect activation URLs.
- [x] Task 3: Activation Logic
  - [x] Added `get_pro_active` and `save_pro_status` commands in `store/mod.rs`.
  - [x] Implemented Zustand listener for `pro-update` to sync UI state live.

## Dev Notes

### Technical Stack
- **OS Integration:** `tauri-plugin-single-instance` handles secondary process launches and captures URL arguments.
- **Persistence:** `tauri-plugin-store` stores `is_pro` boolean.

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Successfully registered custom protocol.
- Implemented live activation via deep link interceptor.
- Synced Pro status across all application windows.

### File List
- `src-tauri/tauri.conf.json`
- `src-tauri/src/lib.rs`
- `src-tauri/src/store/mod.rs`
- `src/lib/stores/useZenFocusStore.ts`