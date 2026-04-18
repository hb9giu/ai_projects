# ADR-002: FastAPI as the backend framework

**Status:** Accepted

## Decision
Use FastAPI (Python) for the backend API and static file serving.

## Rationale
FastAPI provides automatic request/response validation via Pydantic, OpenAPI docs out of the box, and async support. It also serves the Next.js static export from the same process, eliminating the need for a separate web server.

## Trade-offs
- Python adds a runtime dependency vs. a Node.js backend (which would share the language with the frontend).
- FastAPI's dependency injection model (used for `get_db`, `get_username`) keeps routes clean but adds indirection.
