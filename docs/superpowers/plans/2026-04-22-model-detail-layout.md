# Model Detail Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-layout the model detail page so core metrics and unified pricing appear before descriptive content.

**Architecture:** Keep the current single-page client component and current visual language, but reorder the section structure and add model-level pricing cards with placeholder fallbacks. Tests will lock the new order and the removal of max-output from the primary metric row.

**Tech Stack:** Next.js App Router, React, SWR, Jest, Testing Library, Tailwind CSS

---

### Task 1: Lock the New Detail-Page Hierarchy

**Files:**
- Create: `src/app/(dynamic)/model/[modelId]/ModelDetailClient.test.ts`
- Modify: `src/app/(dynamic)/model/[modelId]/ModelDetailClient.tsx`

- [ ] **Step 1: Write the failing test**

Add a test that renders the detail client with a mocked model and asserts:

- model identity renders first
- `上下文窗口` appears in the primary metrics row
- `每百万输入价格` and `每百万输出价格` appear in the primary metrics row
- `最大输出` does not appear
- `模型介绍` renders after the metric row

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand --runTestsByPath 'src/app/(dynamic)/model/[modelId]/ModelDetailClient.test.ts'`

Expected: FAIL because the current component still renders `最大输出` and has no pricing cards.

- [ ] **Step 3: Write minimal implementation**

Rework the component layout:

- keep the back link
- rebuild the header summary
- replace the current metrics area with a fixed three-card row
- move the description section below the metrics row
- keep capability tags after description

- [ ] **Step 4: Run test to verify it passes**

Run the same test command and confirm it passes.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(dynamic)/model/[modelId]/ModelDetailClient.tsx' 'src/app/(dynamic)/model/[modelId]/ModelDetailClient.test.ts' docs/superpowers/specs/2026-04-22-model-detail-layout-design.md docs/superpowers/plans/2026-04-22-model-detail-layout.md
git commit -m "feat: reorder model detail page layout"
```

### Task 2: Add Pricing Fallback Behavior

**Files:**
- Modify: `src/app/(dynamic)/model/[modelId]/ModelDetailClient.tsx`
- Test: `src/app/(dynamic)/model/[modelId]/ModelDetailClient.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions for model-level pricing card values:

- when no unified pricing field exists, both pricing cards show `待配置`
- labels remain `每百万输入价格` and `每百万输出价格`

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runInBand --runTestsByPath 'src/app/(dynamic)/model/[modelId]/ModelDetailClient.test.ts'`

Expected: FAIL because placeholder pricing is not yet rendered.

- [ ] **Step 3: Write minimal implementation**

Add a local formatting helper that returns:

- formatted price when a future model-level field is available
- otherwise `待配置`

Do not surface provider data.

- [ ] **Step 4: Run test to verify it passes**

Run the same test command and confirm it passes.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(dynamic)/model/[modelId]/ModelDetailClient.tsx' 'src/app/(dynamic)/model/[modelId]/ModelDetailClient.test.ts'
git commit -m "test: add pricing fallback for model detail cards"
```
