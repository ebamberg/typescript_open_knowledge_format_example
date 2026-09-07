---
type: Reference
title: Grid & Dimension Conventions
description: The column grid, structural module and scale used across the Nelson Sim FM blueprint drawing set.
tags: [grid, dimensions, drawings]
timestamp: 2026-09-07T00:00:00Z
---

# Grid & Dimension Conventions

Every floor plan drawing (A-101 through A-107) shares the same conventions, per Drawing A-000.

## Column grid

A lettered column grid runs west→east across every floor plate: **A, B, C, D, E, F, G, H, I** (9 reference
lines), spaced on the building's 4.0 m x 4.0 m structural module. Row/reference lines are numbered similarly
in the drawings' title-block margins (1–5). Use "column X" to describe a room's east–west position; this
knowledge base uses that same convention throughout (e.g. "Stair B — column E").

## Scale

- Drawings are 1:100 @ A2 (schematic, not to legal scale); the building section (A-900) is 1:150.
- A printed scale bar on each floor plan shows 0 to 10 m. In the SVG source files this knowledge base was
  built from, that scale bar and the column grid both resolve to **40 px = 1 m** (160 px column spacing =
  4.0 m module) — the conversion factor used for every distance figure in this knowledge base.
- Overall building footprint: 32,000 mm (32 m) x 16,000 mm (16 m), per the dimension strings on Drawing A-101.

## Floor-to-floor

- Floor-to-floor height: 3.6 m (typical), per Drawing A-000 and the Building Section (A-900).
- 7 storeys total; Floor 1 = reception & building maintenance; Floors 2–7 = typical office floors.
- The vertical core (elevators + fire stair) runs full height, aligned in the same grid position on every
  floor — see [Building overview](/building/nelson-sim-fm-corporate-offices.md).

## Caveats

All dimensions in the source drawings are explicitly marked **nominal** and **subject to structural
verification** (Drawing A-000, General Note 2); the drawings are schematic space-planning diagrams, not
construction documents (General Note 1). Treat every distance/position figure in this knowledge base as an
estimate suitable for wayfinding and space-planning discussion, not for construction or regulatory
compliance measurement.

## Related

- [Navigation & distance methodology](/reference/navigation-and-distances.md)
- [Building overview](/building/nelson-sim-fm-corporate-offices.md)
