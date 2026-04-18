# ADR-003: @dnd-kit for drag-and-drop

**Status:** Accepted

## Decision
Use `@dnd-kit/core` and `@dnd-kit/sortable` for Kanban drag-and-drop interactions.

## Rationale
`@dnd-kit` is actively maintained, supports React 19, and works with Next.js server/client component boundaries. It does not rely on the HTML5 drag-and-drop API, giving consistent cross-browser pointer behaviour. `react-beautiful-dnd` was rejected as it is no longer actively maintained.

## Trade-offs
- More verbose setup than `react-beautiful-dnd` (requires manual collision detection and overlay configuration).
- Card IDs are prefixed (`card-`, `col-`) on the frontend to ensure stable droppable IDs; these prefixes are stripped before API calls.
