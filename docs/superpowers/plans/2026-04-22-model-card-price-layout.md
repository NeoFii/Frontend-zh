# Model Card Price Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the model directory card so the primary category moves to the top-right and the bottom metrics row shows `CTX`, `IN / 1M`, and `OUT / 1M`.

**Architecture:** Keep the existing `ModelCardV2` structure and styling language, but reorder the header and metrics layout. Reuse the existing `*_fen` model fields on the frontend and format them directly in the card component.

**Tech Stack:** Next.js, React, Jest, Testing Library

---

### Task 1: Lock the card layout in tests

**Files:**
- Modify: `src/components/model/ModelCardV2.test.ts`
- Test: `src/components/model/ModelCardV2.test.ts`

- [ ] **Step 1: Write the failing test**

Update the existing card test to expect:
- category text rendered in the header area
- `Max Output` removed
- metrics labels changed to `CTX`, `IN / 1M`, and `OUT / 1M`
- input/output prices formatted from fen as two-decimal yuan strings

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand --runTestsByPath src/components/model/ModelCardV2.test.ts`
Expected: FAIL because the component still renders `Max Output` and not the price metrics layout.

### Task 2: Implement the card layout change

**Files:**
- Modify: `src/components/model/ModelCardV2.tsx`
- Test: `src/components/model/ModelCardV2.test.ts`

- [ ] **Step 1: Write minimal implementation**

Update the card to:
- move the primary category badge into the top-right corner of the header row
- remove the old bottom `Category` and `Max Output` metrics
- add a local helper to format `price_input_per_m_fen` and `price_output_per_m_fen`
- render the bottom row as exactly three metrics: `CTX`, `IN / 1M`, `OUT / 1M`

- [ ] **Step 2: Run test to verify it passes**

Run: `npm test -- --runInBand --runTestsByPath src/components/model/ModelCardV2.test.ts`
Expected: PASS

### Task 3: Verify no regression in model page usage

**Files:**
- Test: `src/app/(static)/model/page.test.ts`

- [ ] **Step 1: Run the page-level test**

Run: `npm test -- --runInBand --runTestsByPath src/app/(static)/model/page.test.ts`
Expected: PASS
