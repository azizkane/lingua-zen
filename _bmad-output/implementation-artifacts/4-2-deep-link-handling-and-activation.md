# Story 4.2: Deep Link Handling & Activation

Status: in-progress

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

- [ ] Task 1: Protocol Registration
  - [ ] Configure `tauri.conf.json` to register the `lingua-zen` scheme.
- [ ] Task 2: Deep Link Interceptor
  - [ ] Implement the `on_uri_scheme` or `single_instance` listener in `main.rs`.
  - [ ] Parse the activation parameter.
- [ ] Task 3: Activation Logic
  - [ ] Add `save_pro_status` command in `store/mod.rs`.
  - [ ] Trigger store update and frontend notification on activation.

## Dev Notes

### Technical Stack
- **OS Integration:** `tauri-plugin-single-instance` or standard protocol registry.
- **Deep Link:** `lingua-zen://activate`.

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List

### File List
