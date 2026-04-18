# Code Review: Project Management MVP

Review Date: 2026-04-18
Scope: Full stack review of the PM MVP application

---

## Executive Summary

The codebase is well-structured for an MVP, with clear separation of concerns between frontend and backend. The implementation follows modern practices with TypeScript, React 19, FastAPI, and Docker. Test coverage is good with unit tests for both frontend and backend, plus integration tests.

**Overall Grade: B+** - Solid MVP implementation with minor areas for improvement.

---

## 1. Architecture & Design

### Strengths
- Clean separation between frontend (Next.js) and backend (FastAPI)
- Single-board-per-user constraint is well-enforced in the database schema
- ID prefixing strategy (`col-`, `card-`) for drag-and-drop stability is pragmatic
- Environment-based configuration with sensible defaults
- Static export approach for frontend simplifies deployment

### Concerns
- **Authentication is header-based only** (`X-User` header) - no session/token mechanism
- No rate limiting on API endpoints
- No request size limits on chat endpoint (could be abused)
- AI timeout is hardcoded at 25 seconds - no retry logic

---

## 2. Backend (FastAPI)

### File: `backend/app/main.py`

**Strengths:**
- Proper lifespan management for database initialization
- Request logging middleware with timing
- Clean router registration

**Issues:**
- Line 34-45: Static asset mounting happens at module import time, not in lifespan
- No CORS configuration - frontend must be served from same origin
- Missing request ID for tracing

### File: `backend/app/routes/board.py`

**Strengths:**
- Consistent error handling with 404 for missing resources
- Proper transaction handling with commit/rollback
- Good use of Pydantic models for validation

**Issues:**
- Lines 27-55: `create_column` duplicates position logic found in `resequence_positions`
- Lines 126-161: `create_card` has similar duplication
- No pagination on board fetch - could be problematic with many cards
- Column deletion (line 97-123) deletes cards without soft-delete option

### File: `backend/app/routes/chat.py`

**Strengths:**
- Clean separation of concerns with AI logic in separate module
- Proper use of dependencies

**Issues:**
- No validation of message length (could send very large payloads to OpenRouter)
- No conversation history limits (unbounded growth)
- Missing error handling for `apply_actions` failures

### File: `backend/app/ai.py`

**Strengths:**
- Structured output parsing with Pydantic validation
- Comprehensive action handling (create, update, move, delete)
- Good logging for debugging

**Issues:**
- Lines 37-72: `call_openrouter` has hardcoded timeout (25s) with no retry
- Lines 75-118: `build_structured_messages` builds large prompt on every call - could be cached
- Lines 121-257: `apply_actions` is very long (136 lines) - should be broken into smaller functions
- No validation that card titles/details don't exceed reasonable lengths before DB insert
- Move card logic (lines 182-235) is complex and hard to follow

### File: `backend/app/database.py`

**Strengths:**
- Parameterized queries throughout
- Proper connection management with context manager
- Index creation for performance

**Issues:**
- Lines 189-206: `resequence_positions` uses f-string SQL (acceptable here since inputs are validated)
- No connection pooling - creates new connection per request
- `ensure_seed_data` (line 107-128) runs on every board fetch - inefficient

### File: `backend/app/models.py`

**Strengths:**
- Good use of Pydantic v2 features
- Proper field validation (min/max lengths)
- Discriminated unions for actions

**Issues:**
- Line 37: `columnId` in `CreateCardAction` is string but represents numeric ID - inconsistent
- No validation that `position` values are reasonable (could be very large integers)

### File: `backend/app/config.py`

**Strengths:**
- Centralized configuration
- Environment variable support
- Sensible defaults

**Issues:**
- Line 6-7: `.env` file path is relative to config file location - fragile
- `INITIAL_COLUMNS` (lines 19-38) is defined in config but is data, not configuration

---

## 3. Frontend (Next.js/React)

### File: `frontend/src/app/page.tsx`

**Strengths:**
- Clean state management
- Proper error handling with user-friendly messages
- Good separation of concerns

**Issues:**
- Lines 25-355: File is very long (355 lines) - could extract LoginScreen and LoadingScreen components
- Lines 96-109: `handleRenameColumn` doesn't optimistically update UI
- Lines 155-187: `handleMoveCard` has complex ID conversion logic that could be extracted
- Hardcoded credentials (line 25) - acceptable for MVP but should be documented

### File: `frontend/src/components/KanbanBoard.tsx`

**Strengths:**
- Good use of dnd-kit primitives
- Proper measuring strategy for drag overlay
- Clean component props interface

**Issues:**
- Lines 55-74: Custom collision detection is complex - consider extracting to hook
- Lines 84-117: `handleDragEnd` is long and complex
- Lines 119-130: `handleDragOver` uses ref for lastOverId - could use state
- No keyboard accessibility for drag-and-drop

### File: `frontend/src/components/KanbanColumn.tsx`

**Strengths:**
- Clean presentation
- Good use of clsx for conditional classes

**Issues:**
- Line 48-53: Column title input updates on every keystroke - could debounce
- No loading state during rename

### File: `frontend/src/components/KanbanCard.tsx`

**Strengths:**
- Clean drag handle implementation
- Good visual feedback during drag

**Issues:**
- Line 52: Delete button uses unicode X character - should use SVG icon
- No confirmation before delete

### File: `frontend/src/components/ChatSidebar.tsx`

**Strengths:**
- Clean message rendering
- Good accessibility with aria-labels
- Enter key handling for submit

**Issues:**
- Lines 82-106: Form could be extracted to separate component
- No message length limit
- No scroll-to-bottom on new messages

### File: `frontend/src/lib/api.ts`

**Strengths:**
- Centralized API client
- Proper timeout handling with AbortController
- Type-safe API functions

**Issues:**
- Lines 35-69: `apiFetch` doesn't handle network errors specifically
- No request/response interceptors for auth
- Line 32: `DEFAULT_TIMEOUT` is 30s but AI calls might need longer

### File: `frontend/src/lib/kanban.ts`

**Strengths:**
- Clean type definitions
- Good utility functions for ID conversion
- Well-tested move logic

**Issues:**
- Lines 28-82: `initialData` is unused in production (seeded from backend)
- Lines 94-172: `moveCard` function is complex - consider breaking down

---

## 4. Database

### Schema (from `docs/kanban-schema.json`)

**Strengths:**
- Proper foreign key relationships
- Indexes on foreign keys
- Soft-delete support via `archived` flag
- Timestamps on all tables

**Issues:**
- No constraints on string lengths (enforced in app layer only)
- `position` columns have no uniqueness constraint within parent scope
- No audit logging

### Migration Strategy

**Issues:**
- No migration system implemented - schema changes require manual intervention
- `init_db` in `database.py` only creates tables if missing - no schema versioning

---

## 5. Testing

### Backend Tests

**Strengths:**
- Good coverage of API endpoints (`test_board_api.py`)
- Integration tests for live server (`test_integration.py`)
- AI action testing with mocking (`test_ai_actions.py`)
- Schema validation test (`test_schema.py`)

**Issues:**
- `test_chat_api.py` only has 1 test - needs more coverage
- No tests for concurrent operations
- No performance/load tests
- `test_integration.py` requires manual setup (not self-contained)

### Frontend Tests

**Strengths:**
- Unit tests for components (`KanbanBoard.test.tsx`, `ChatSidebar.test.tsx`)
- Utility function tests (`kanban.test.ts`)
- E2E tests with Playwright (`kanban.spec.ts`)

**Issues:**
- No tests for error boundaries
- No tests for API error handling
- Drag-and-drop not tested in unit tests (only E2E)
- `page.test.tsx` mocks fetch globally - could interfere with other tests

---

## 6. Docker & DevOps

### File: `Dockerfile`

**Strengths:**
- Multi-stage build (Node for frontend, Python for backend)
- Non-root user (`appuser`)
- Healthcheck configured
- Read-only filesystem with tmpfs

**Issues:**
- Line 1: Node version pinned to 20.18.0 - consider using LTS tag
- Line 11: Python version pinned to 3.12.7 - consider using 3.12-slim
- No `.dockerignore` optimization for backend (copies entire directory)

### Scripts

**Strengths:**
- Platform-specific scripts (Mac, Linux, Windows)
- Consistent naming convention
- Health check wait loop

**Issues:**
- Mac and Linux scripts are identical - could be unified
- No script to run tests in container
- No log aggregation from container

---

## 7. Documentation

**Strengths:**
- Comprehensive PLAN.md with checklist
- ADRs in `docs/decisions/`
- AGENTS.md files for context
- JSON schema for database

**Issues:**
- No API documentation (though FastAPI provides auto-generated docs at `/docs`)
- No troubleshooting guide
- No contribution guidelines

---

## 8. Security Review

### Issues Found

1. **No input sanitization on chat messages** - user input sent directly to AI
2. **No rate limiting** - could be abused
3. **Header-based auth is trivially forgeable** - acceptable for local MVP but document this
4. **No CSRF protection** - not needed for API-only but should be noted
5. **SQL injection risk is low** - all queries use parameterized statements
6. **No HTTPS** - acceptable for local development only

### Recommendations

1. Add rate limiting (e.g., slowapi)
2. Add request size limits
3. Document security model (local-only, no sensitive data)

---

## 9. Performance Observations

### Backend
- No connection pooling - each request creates new SQLite connection
- Board fetch queries are N+1 (columns, then cards) - acceptable for small boards
- AI calls are blocking - consider background tasks for heavy operations

### Frontend
- No virtualization for large card lists
- No debouncing on column rename input
- Static export means no SSR benefits

---

## 10. Recommendations (Prioritized)

### High Priority
1. Add rate limiting to API endpoints
2. Add request size limits (especially chat endpoint)
3. Extract long functions in `ai.py` into smaller units
4. Add debouncing to column rename input

### Medium Priority
5. Implement proper migration system
6. Add connection pooling for database
7. Extract collision detection logic to custom hook
8. Add more backend tests for chat endpoint

### Low Priority
9. Unify Mac/Linux start scripts
10. Add API documentation
11. Consider React Query for server state management
12. Add keyboard accessibility for drag-and-drop

---

## Conclusion

The codebase is a solid MVP implementation that meets its requirements. The architecture is clean, tests are present, and the Docker setup is production-ready for a local deployment. The main areas for improvement are around security hardening (rate limiting), code organization (long functions), and developer experience (migration system).

The project successfully implements all features from the PLAN.md checklist and maintains good code quality throughout.
