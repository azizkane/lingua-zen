# Story 1.1: Project Infrastructure Setup

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to initialize the Tauri project with React, TypeScript, and Tailwind,
so that I have a stable foundation for building the Ghost UI.

## Acceptance Criteria

1. `npm run tauri dev` launches a functional Tauri v2 window.
2. Tailwind CSS is integrated and styles are applied correctly in the frontend.
3. The Rust backend includes `tauri-plugin-global-shortcut` and `tauri-plugin-store`.
4. The Rust backend has `keyring` and `aes-gcm` crates added to `Cargo.toml`.
5. The project structure follows the Architecture Document (Multi-WebView ready).

## Tasks / Subtasks

- [ ] Task 1: Initialize Tauri Project (AC: 1, 5)
  - [ ] Run `npm create tauri-app@latest lingua-zen -- --template react-ts`
  - [ ] Verify basic window launch
- [ ] Task 2: Integrate Tailwind CSS (AC: 2)
  - [ ] Install `tailwindcss`, `postcss`, `autoprefixer`
  - [ ] Initialize and configure `tailwind.config.ts`
  - [ ] Add Tailwind directives to `index.css`
- [ ] Task 3: Configure Native Dependencies (AC: 3, 4)
  - [ ] Add `tauri-plugin-global-shortcut` and `tauri-plugin-store` to Tauri config
  - [ ] Add `keyring` and `aes-gcm` to `src-tauri/Cargo.toml`
  - [ ] Verify project builds successfully

## Dev Notes

### Technical Stack (Tauri v2)
- **Framework:** Tauri v2 (Stable)
- **Backend:** Rust 1.77.2+
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Local State:** Zustand (for UI) + Tauri Plugin Store (for persistence)

### Implementation Guardrails
- **Naming:** Rust `snake_case`, TS `camelCase`.
- **Logic:** Business logic (encryption, focus deduction) MUST be in Rust.
- **Security:** Use `keyring` crate for master key storage (don't hardcode).

### Project Structure Notes
- Alignment with unified project structure:
  - `src-tauri/src/commands/`
  - `src/features/`
  - `src/lib/stores/`

### References
- [Source: _bmad-output/planning-artifacts/prd.md#Technical Success]
- [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List

### File List
