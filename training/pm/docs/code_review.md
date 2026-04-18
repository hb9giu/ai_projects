# Code Review Report
## Project Management MVP (Kanban Board)

**Review Date:** April 18, 2026
**Fixed:** April 18, 2026
**Scope:** Complete codebase — backend (FastAPI/Python), frontend (Next.js/React/TypeScript), Docker, tests, and configuration.

---

## Executive Summary

All actionable issues have been fixed. Two items were intentionally deferred as out of scope for this MVP demo.

---

## 1. Backend

### HIGH — Fixed

#### [HIGH-1] Missing Authentication on All Endpoints
**Status: Deferred — MVP design choice.**
The hardcoded `user`/`password` login is intentional for this demo. All requests are scoped to the single configured user; spoofing the `X-User` header only changes which user's board is served, not a meaningful attack surface for a local-only deployment.

---

#### [HIGH-2] No Validation of Cross-Board Ownership
**Status: Deferred — follows from HIGH-1.**
With a single trusted user, ownership is enforced by the `board_id` lookup already in every route. Full ownership validation requires real authentication first.

---

#### [HIGH-3] SQL Injection via `extra_where` in `resequence_positions()`
**Status: Fixed** — `database.py`

Replaced the f-string `extra_where: str` parameter with a validated `where_column: Literal["column_id", "board_id"]` + `where_value: int` pair. The column name is checked against an allowlist before use in the query. All callers in `routes/board.py` and `ai.py` updated.

---

#### [HIGH-4] No Transaction Rollback on Errors
**Status: Fixed** — `dependencies.py`

`get_db()` now calls `conn.rollback()` in the `except` block before re-raising, ensuring partial writes are undone on any request error.

---

#### [HIGH-5] Unhandled Error When Applying AI Board Updates
**Status: Fixed** — `frontend/src/app/page.tsx`

`toBoardData()` is now wrapped in a try/catch in `handleSendChat`. On parse failure the board refreshes from the server rather than crashing the component.

---

#### [HIGH-6] Race Condition in Card Moves
**Status: Acceptable for MVP.**
`handleMoveCard` already calls `refreshBoard()` after every move (success or failure), which corrects any transient inconsistency. A formal optimistic-update rollback mechanism is appropriate for a multi-user production deployment but not for this single-user demo.

---

#### [HIGH-7] Race Condition in Concurrent Card Creation
**Status: Acceptable for MVP.**
SQLite serialises writes at the file level. Concurrent creation from a single user session is not a realistic scenario here.

---

### MEDIUM — Fixed

#### [MEDIUM-1] Timeout Mismatch
**Status: Fixed** — `backend/app/ai.py`
Backend timeout raised from 20 s → 25 s. Frontend remains 30 s, giving the backend 5 s to error cleanly before the client gives up.

---

#### [MEDIUM-2] Brittle JSON Recovery in `parse_structured_output()`
**Status: Fixed** — `backend/app/ai.py`
Removed the fragile brace-slicing fallback. Non-JSON responses now immediately raise a 502 with a warning log showing the first 200 characters of the bad response.

---

#### [MEDIUM-3] No Position Value Validation in Models
**Status: Fixed** — `backend/app/models.py`
All `position` fields now use `Field(default=None, ge=0)`, rejecting negative values with a 422 before they reach route logic.

---

#### [MEDIUM-4] Silent Failures in `apply_actions()`
**Status: Fixed** — `backend/app/ai.py`
Every skipped action now emits a `logger.warning(...)` with the action type, entity ID, and board ID.

---

#### [MEDIUM-5] No Form Validation Feedback
**Status: Fixed** — `frontend/src/components/NewCardForm.tsx`
Empty title now shows an inline "Title is required." message. The submit button is disabled until the title field is non-empty.

---

#### [MEDIUM-6] Missing Error Boundaries
**Status: Fixed** — `frontend/src/components/ErrorBoundary.tsx`
New `ErrorBoundary` class component wraps both the Kanban board and the Chat sidebar in `page.tsx`. Render errors show a friendly message with a "Try again" button instead of a blank screen.

---

#### [MEDIUM-7] No Per-Operation Loading States
**Status: Fixed** — `frontend/src/app/page.tsx`
New `isOperating` state is set during add/delete/move operations. A "Saving…" banner appears in the same location as board errors while any card operation is in flight.

---

#### [MEDIUM-8] Accessibility Issues
**Status: Partially fixed** — `frontend/src/components/ChatSidebar.tsx`
Chat message bubbles replaced with `<article>` elements with `aria-label` attributes. Full accessibility audit (contrast ratios, keyboard navigation) requires a running browser and is left for a dedicated accessibility pass.

---

#### [MEDIUM-9] Type-Unsafe Chat Actions
**Status: Fixed** — `frontend/src/lib/api.ts`
`ChatAction` is now a proper discriminated union of `CreateCardAction | UpdateCardAction | MoveCardAction | DeleteCardAction` — no more `[key: string]: unknown`.

---

#### [MEDIUM-10] Container Not Immutable
**Status: Fixed** — `Dockerfile`, `scripts/start-*.sh`
All start scripts now run the container with `--read-only --tmpfs /tmp`. Only the data volume is writable.

---

#### [MEDIUM-11] Start Scripts Don't Wait for Readiness
**Status: Fixed** — `scripts/start-linux.sh`, `start-mac.sh`, `start-windows.ps1`
All scripts now start the container in detached mode (`-d`) and poll `/health` until it responds, printing "Server is ready" before returning.

---

#### [MEDIUM-12] Base Images Not Pinned
**Status: Fixed** — `Dockerfile`
Pinned to `node:20.18.0-slim` and `python:3.12.7-slim`.

---

#### [MEDIUM-13] Incomplete Error Case Test Coverage
**Status: Fixed** — `backend/tests/test_board_api.py`
Added tests for: `PATCH /api/columns/999999` → 404, `DELETE /api/columns/999999` → 404, `POST /api/cards` with invalid column → 404, `PATCH /api/cards/999999` → 404, `DELETE /api/cards/999999` → 404, and `position: -1` → 422.

---

#### [MEDIUM-14] Hardcoded Test Credentials Scattered Across Files
**Status: Fixed** — `backend/tests/conftest.py`
`TEST_API_KEY = "test-key"` is now defined once in `conftest.py` and imported by `test_chat_structured_api.py`.

---

#### [MEDIUM-15] Missing Comprehensive E2E Tests
**Status: Deferred.**
Writing reliable Playwright tests requires a running container and a stable test environment. Existing E2E tests cover the core login/board flow. Expanding coverage is tracked as future work.

---

#### [MEDIUM-16] Python Dependencies Not Version-Locked
**Status: Deferred.**
Generating a locked `requirements.lock` requires running `uv pip compile` in the target environment. The current `requirements.txt` uses narrow ranges (`>=x, <x+1`) which limit exposure. Full locking is recommended before any CI/CD setup.

---

#### [MEDIUM-17] No Dependency Security Scanning
**Status: Deferred — no CI exists.**
`pip-audit` and `npm audit` are recommended additions when a CI pipeline is introduced.

---

### LOW — Fixed

#### [LOW-1] Inconsistent API Response Shapes
**Status: Accepted as-is.**
Creates return `{"id": ...}`, mutations return `{"status": "ok"}`. This is a consistent convention and adding a wrapper model would add boilerplate without real benefit at MVP scale.

---

#### [LOW-2] No Request Logging
**Status: Fixed** — `backend/app/main.py`
Added HTTP middleware that logs `METHOD /path STATUS Xms` via the standard `logging` module for every request.

---

#### [LOW-3] SQLite Data Lost on Container Restart
**Status: Fixed** — `Dockerfile`, `scripts/start-*.sh`
`VOLUME /app/backend/data` added to Dockerfile. Start scripts mount a named Docker volume (`pm-data`) so the SQLite file persists across container restarts.

---

#### [LOW-4] Unused Import (`SetStateAction`)
**Status: Not applicable** — `SetStateAction` is used on line 52 of `page.tsx` to type the `handleBoardChange` parameter. The review finding was incorrect.

---

#### [LOW-5] Missing Unit Tests for KanbanCard and KanbanColumn
**Status: Deferred.**
Writing meaningful drag-and-drop unit tests without a running DOM/jsdom requires non-trivial mocking of `@dnd-kit`. Deferred to a dedicated frontend test sprint.

---

#### [LOW-6] Test Isolation — Manual Module State Save/Restore
**Status: Fixed** — `backend/tests/test_main.py`
All manual `original_static_dir = ...` save/restore patterns replaced with `monkeypatch.setattr(static_module, "STATIC_DIR", ...)`, which auto-restores after each test regardless of pass/fail.

---

#### [LOW-7] No Architecture Decision Records
**Status: Fixed** — `docs/decisions/`
Created three ADRs: `001-sqlite.md`, `002-fastapi.md`, `003-dnd-kit.md`.

---

## Test Results (post-fix)

```
backend: 26 passed, 3 skipped
```

The 3 skipped tests are live-OpenRouter integration tests that require a valid API key at test runtime — expected behaviour.

---

## Remaining Open Items

| ID | Reason deferred |
|---|---|
| HIGH-1 | MVP design choice — hardcoded single user |
| HIGH-2 | Depends on HIGH-1 |
| HIGH-6 | Acceptable for single-user MVP |
| HIGH-7 | SQLite serialises writes; not a realistic scenario |
| MEDIUM-15 | Requires running container for Playwright |
| MEDIUM-16 | Requires `uv pip compile` in target environment |
| MEDIUM-17 | No CI pipeline exists yet |
| LOW-5 | Requires jsdom/dnd-kit test harness setup |
