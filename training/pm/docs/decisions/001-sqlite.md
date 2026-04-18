# ADR-001: SQLite as the database

**Status:** Accepted

## Decision
Use SQLite for persistent storage, with the database file stored at `backend/data/pm.db`.

## Rationale
This is a local Docker-only MVP with a single user and a single board. SQLite requires no external service, has zero setup cost, and ships as part of Python's stdlib. All queries use parameterised statements.

## Trade-offs
- Not suitable for multi-instance or high-concurrency deployments.
- Concurrent writes are serialised at the file level; acceptable for MVP load.
- Migration to PostgreSQL would require replacing `sqlite3` with `psycopg2`/`asyncpg` and rewriting connection management.
