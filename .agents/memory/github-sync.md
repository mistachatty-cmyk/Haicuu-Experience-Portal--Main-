---
name: GitHub repository sync
description: Environment-specific constraints discovered while syncing this project to GitHub.
---

The configured GitHub connection can read repository data, but repository-write endpoints through the connector may return HTTP 403; the shell remote also requires a separately authenticated Git credential or GitHub CLI session.

**Why:** A direct push and authenticated REST writes were both rejected even though the connection was listed as added and read access worked.

**How to apply:** Verify write capability before planning a GitHub sync. Do not ask for tokens in chat; use the integration or an approved workspace authentication flow.