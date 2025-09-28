# Tasks: Copy Response Messages

**Input**: Design documents from `/specs/002-add-a-copy/`
**Prerequisites**: spec.md (completed)

## Technical Context
- **Project Type**: Next.js 14 Web Application  
- **Language**: TypeScript/React 18
- **Framework**: Next.js with App Router
- **UI Library**: Tailwind CSS with @tailwindcss/typography
- **Testing**: Playwright for integration, React Testing Library for components
- **Structure**: Frontend components in `/components/`, utilities in `/lib/`

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup & Dependencies
- [x] T001 Install clipboard API dependencies and types for copy functionality
- [x] T002 [P] Add clipboard utilities to lib/clipboard.ts
- [x] T003 [P] Configure TypeScript types for clipboard API in next-env.d.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Integration test: Copy icon visibility for assistant messages in tests/integration/copy-icon-display.spec.ts
- [x] T005 [P] Integration test: Copy action and clipboard content in tests/integration/copy-functionality.spec.ts  
- [x] T006 [P] Integration test: Visual feedback on copy success in tests/integration/copy-feedback.spec.ts
- [x] T007 [P] Integration test: Copy error handling when clipboard denied in tests/integration/copy-error-handling.spec.ts
- [x] T008 [P] Unit test: CopyButton component rendering in tests/unit/CopyButton.test.tsx
- [x] T009 [P] Unit test: Clipboard utility functions in tests/unit/clipboard.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T010 [P] Create CopyButton component in components/CopyButton.tsx
- [x] T011 [P] Implement clipboard utility functions in lib/clipboard.ts
- [x] T012 [P] Create copy success feedback component in components/CopyFeedback.tsx
- [x] T013 Integrate CopyButton into Chat.tsx for assistant messages only
- [x] T014 Add copy icon styling with Tailwind classes
- [x] T015 Extract raw text content from message.parts for copying

## Phase 3.4: Integration & Error Handling
- [x] T016 Implement copy error states and user feedback
- [x] T017 Add keyboard accessibility support (Enter/Space on copy button)
- [x] T018 Handle clipboard permissions and browser compatibility
- [x] T019 Add copy button hover and focus states
- [x] T020 Ensure copy button doesn't interfere with message selection

## Phase 3.5: Polish & Validation
- [x] T021 [P] Add unit tests for edge cases (long messages, empty content) in tests/unit/copy-edge-cases.test.ts
- [x] T022 [P] Performance test: Copy operation under 100ms in tests/performance/copy-performance.spec.ts
- [x] T023 [P] Update README.md with copy feature documentation
- [x] T024 Visual regression test for copy button placement and styling
- [x] T025 Manual testing checklist execution from acceptance scenarios

## Dependencies
- Setup (T001-T003) before tests (T004-T009)
- Tests (T004-T009) before implementation (T010-T015)
- Core implementation (T010-T015) before integration (T016-T020)
- Integration complete before polish (T021-T025)
- T010 (CopyButton) blocks T013 (Chat integration)
- T011 (clipboard utils) blocks T016 (error handling)

## Parallel Execution Examples

### Phase 3.2 - All Tests in Parallel:
```bash
# Launch T004-T009 together:
Task: "Integration test: Copy icon visibility in tests/integration/copy-icon-display.spec.ts"
Task: "Integration test: Copy functionality in tests/integration/copy-functionality.spec.ts"  
Task: "Integration test: Visual feedback in tests/integration/copy-feedback.spec.ts"
Task: "Integration test: Error handling in tests/integration/copy-error-handling.spec.ts"
Task: "Unit test: CopyButton component in tests/unit/CopyButton.test.tsx"
Task: "Unit test: Clipboard utilities in tests/unit/clipboard.test.ts"
```

### Phase 3.3 - Independent Component Creation:
```bash
# Launch T010-T012 together:
Task: "Create CopyButton component in components/CopyButton.tsx"
Task: "Implement clipboard utilities in lib/clipboard.ts"
Task: "Create copy feedback component in components/CopyFeedback.tsx"
```

## Specific Implementation Requirements

### T010 - CopyButton Component Requirements:
- Accept `content: string` and `onCopySuccess?: () => void` props
- Use clipboard API with fallback for older browsers  
- Show visual feedback on successful copy
- Handle clipboard permission errors gracefully
- Use lucide-react or heroicons for copy icon
- Always visible (not hover-only) as per specification

### T013 - Chat.tsx Integration Requirements:
- Add CopyButton only to assistant messages (role === 'assistant')
- Extract raw text from `message.parts` (no markdown formatting)
- Position copy button in message header or footer
- Maintain existing message rendering and styling
- Preserve markdown rendering for display while copying raw text

### T016 - Error Handling Requirements:
- Show toast notification for clipboard permission denied
- Fallback to text selection if clipboard API unavailable
- Graceful degradation for unsupported browsers
- Clear error messaging for user understanding

## File Structure Impact
```
components/
├── Chat.tsx              # Modified (T013)
├── CopyButton.tsx        # New (T010)
└── CopyFeedback.tsx      # New (T012)

lib/
└── clipboard.ts          # New (T011)

tests/
├── integration/
│   ├── copy-icon-display.spec.ts       # New (T004)
│   ├── copy-functionality.spec.ts      # New (T005)
│   ├── copy-feedback.spec.ts           # New (T006)
│   └── copy-error-handling.spec.ts     # New (T007)
├── unit/
│   ├── CopyButton.test.tsx             # New (T008)
│   ├── clipboard.test.ts               # New (T009)
│   └── copy-edge-cases.test.ts         # New (T021)
└── performance/
    └── copy-performance.spec.ts         # New (T022)
```

## Validation Checklist
- [x] All functional requirements from spec have corresponding tests
- [x] All tests come before implementation (TDD)
- [x] Parallel tasks modify different files
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Copy functionality isolated to reusable components
- [x] Error handling and edge cases covered

## Notes
- Focus on raw text copying (no markdown formatting)
- Always visible copy icons as specified
- Visual feedback required for copy success
- No mobile-specific considerations needed
- Accessibility features marked as not required
- Use existing project patterns and styling conventions
