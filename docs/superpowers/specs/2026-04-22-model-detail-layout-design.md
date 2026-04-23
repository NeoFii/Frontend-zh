# Model Detail Layout Design

**Date:** 2026-04-22

**Goal:** Rework the `/model/[modelId]` detail page so the first screen emphasizes model-level decision data instead of descriptive copy.

## Current Problems

- The page reads like a loose stack of sections instead of a deliberate detail page.
- The first screen gives too much weight to general description and secondary metadata.
- `最大输出` is shown even though the user does not want it in the primary story.
- The current structure exposes model information but does not establish a strong information hierarchy.

## Approved Direction

Keep the current visual language:

- white background
- light neutral cards
- restrained tags
- simple spacing rhythm

Change only the page composition and information order.

## Information Priority

The detail page should follow this order:

1. Model identity
2. Core metrics
3. Unified pricing
4. Model introduction
5. Capability tags and supporting metadata

## Target Layout

### 1. Header Summary

Keep the back link.

Then show:

- vendor logo
- vendor name
- model name
- a short one-line positioning sentence when available

This section should answer “what model am I looking at?” without competing with the metric cards.

### 2. Core Information Row

Immediately below the header, show a compact row of primary cards.

Required cards:

- `上下文窗口`
- `每百万输入价格`
- `每百万输出价格`

Explicitly exclude:

- `最大输出`
- provider-level pricing breakdown

If unified pricing fields are not yet available in the API, keep the card positions and show a stable placeholder such as `待配置`.

### 3. Model Introduction

The model description becomes a second-layer section below the primary cards.

It keeps the existing restrained treatment:

- section title
- light gray content card
- markdown rendering

### 4. Capability Tags

Capability tags remain visible but move below the description.

They are supporting metadata, not headline information.

### 5. Future Extension Space

Reserve room below the main content for future model-level sections such as:

- pricing notes
- suitable use cases
- usage guidance

Do not add these sections now.

## Data Rules

- Do not show provider dimensions anywhere on the page.
- Do not show `最大输出` in the primary layout.
- Pricing is designed as model-level unified pricing, not as provider comparison.
- Until unified model pricing exists in the returned data, the page should render explicit placeholder values rather than inventing prices.

## Implementation Scope

- Modify the detail page client component only.
- Keep the existing route and data fetching entry point.
- Add focused tests for the new information order and the removal of `最大输出` from the primary card row.
