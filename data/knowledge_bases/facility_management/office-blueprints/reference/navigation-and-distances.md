---
type: Reference
title: Navigation & Distance Methodology
description: How the "neighbour" and "distance" facts in this knowledge base were derived from the blueprint drawings, and how to use them.
tags: [navigation, distance, methodology]
timestamp: 2026-09-07T00:00:00Z
---

# Navigation & Distance Methodology

This knowledge base states, for every room type, its neighbours and its approximate distance to the
elevator lobby, to Stair B, and to the nearest illuminated emergency exit sign. This page explains how those
figures were produced, so a reader can judge how much weight to put on them.

## How "neighbour" was determined

The source drawings do not label adjacency directly. Neighbours in this knowledge base were inferred from
each room's position on the drawing's own column grid (see [Grid & dimension conventions](/reference/grid-system.md))
and its row position within the floor plate: rooms sharing a row are given as east/west neighbours, and
rooms sharing a column across rows are given as north/south neighbours. This is a reasonable reading of a
schematic space-planning drawing, but it is not the same as a verified adjacency/wall-sharing survey — two
rooms recorded as neighbours might be separated by a corridor or a service void rather than sharing a wall
directly.

## How "distance" was determined

Each room's approximate position is the (x, y) location of its name label on the floor plan SVG. Using the
drawing's own scale (40 px = 1 m — see [Grid & dimension conventions](/reference/grid-system.md)), this
knowledge base computes the straight-line ("as the crow flies") distance in metres from that label position
to:

- the Elevator Lobby label position (ELEV-1 / ELEV-2),
- the Stair B label position, and
- whichever illuminated EXIT sign symbol on that floor is nearest.

This is a straight-line estimate, not a walked/routed distance along corridors and around walls — actual
walking distance will be longer, especially for rooms not on a direct line to the core. Figures are rounded
to one decimal metre for consistency, which should not be read as claiming that level of real-world
precision; the source drawings themselves are schematic and marked "not to legal scale."

## How to use these figures

Treat them as relative/comparative wayfinding information — useful for "which room is closer to the stairs,
Office 01 or Office 06?" or "roughly how far is it from the Kitchen to the elevator lobby?" — rather than as
authoritative measurements for fire-safety travel-distance compliance calculations. The building's own fire
extinguisher provision is calculated by floor area (1 per 20 m²), not by travel distance, per
[Fire safety & egress](/reference/fire-safety-and-egress.md).

## Related

- [Grid & dimension conventions](/reference/grid-system.md)
- [Room types index](/room-types/index.md)
- [Fire safety & egress](/reference/fire-safety-and-egress.md)
