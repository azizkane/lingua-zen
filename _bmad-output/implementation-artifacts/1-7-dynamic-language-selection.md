# Story 1.7: Dynamic Language Selection

Status: done

## Story

As a User,
I want to change my target language directly in the Ghost Popup,
so that I can quickly switch contexts without opening a full settings menu.

## Acceptance Criteria

1. The Ghost Popup header displays the current target language in a clickable "Pill" UI.
2. Clicking the pill opens a quick-selection list of top languages (e.g., French, English, Spanish, German, Japanese).
3. Selecting a new language updates the translation immediately if text is already present.
4. The language choice is session-based (Transient State) and resets on app restart (for now).
5. The prompt sent to Gemini dynamically uses the selected target language.

## Tasks / Subtasks

- [x] Task 1: Update Frontend Store (AC: 4)
  - [x] Added `targetLang` and `setTargetLang` to `useZenFocusStore.ts`
  - [x] Defaulted to 'French'
- [x] Task 2: Implement "Language Pill" UI (AC: 1, 2)
  - [x] Replaced static text in header with clickable pill
  - [x] Implemented absolute-positioned dropdown menu with scroll support
- [x] Task 3: Hook into Translation Logic (AC: 3, 5)
  - [x] Updated `handleTranslate` to use `targetLang`
  - [x] Added `useEffect` to trigger auto-retranslation on language change

## Dev Notes

### Implementation Summary
- **Pill UI:** Created a small, semi-transparent button in the header that displays the current language.
- **Dropdown:** Built a custom dropdown containing 10 major languages. It closes on selection or when `Esc` is pressed.
- **Reactive UX:** If you have text in the box and change the language, the translation refreshes automatically.

### Technical Decisions
- **Zustand:** Used session state for the language. It will be moved to persistent storage in Epic 2.
- **Z-Index:** Used `z-50` and `absolute` positioning to ensure the menu floats over the input area.

### References
- [Source: src/lib/stores/useZenFocusStore.ts]
- [Source: src/App.tsx]

## Dev Agent Record

### Agent Model Used

gpt-4o

### Debug Log References

### Completion Notes List
- Implemented language selection pill in header.
- Added 10-language quick-picker menu.
- Integrated dynamic language choice into Gemini API prompt.

### File List
- `src/lib/stores/useZenFocusStore.ts`
- `src/App.tsx`