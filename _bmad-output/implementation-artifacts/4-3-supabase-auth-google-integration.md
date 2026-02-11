# Story 4.3: Supabase Auth Integration (Google Login)

Status: in-progress

## Story

As a User,
I want to sign in with my Google account,
So that my Pro status and history are preserved if I change devices.

## Acceptance Criteria

1. The Settings window displays a "Sign in with Google" button.
2. Clicking the button opens the OS browser for OAuth.
3. The app handles the redirect (`lingua-zen://auth-callback`) and captures the Supabase Session.
4. The UI displays the user's email when logged in.
5. Successful login triggers a check for Pro status (Story 4.4).

## Tasks / Subtasks

- [ ] Task 1: Supabase SDK Integration
  - [ ] Add `@supabase/supabase-js` to frontend.
  - [ ] Initialize Supabase client in `src/lib/supabase.ts`.
- [ ] Task 2: OAuth Flow Implementation
  - [ ] Create `handleGoogleLogin` in `useZenFocusStore.ts`.
  - [ ] Update `App.tsx` deep link listener to handle `auth-callback`.
- [ ] Task 3: UI Implementation
  - [ ] Add "Account" section to `SettingsWindow.tsx`.
  - [ ] Display Email and "Logout" button.

## Dev Notes

### Technical Stack
- **Auth:** Supabase OAuth (Google).
- **Redirection:** `lingua-zen://auth-callback`.

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List

### File List
