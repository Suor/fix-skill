---
name: fix
description: Find and implement all FIX: and FIX0: comments in the codebase
disable-model-invocation: true
allowed-tools: Bash(node */fix/parts.js *), Bash(git add *), Bash(git commit *)
---

# Fix All FIX: Comments

Find and implement all `FIX:` and `FIX0:` comments in the codebase, then fix them one by one.

## Step 1: Find All FIX Comments

Use Grep to search for `\bFIX\d*:` across ALL files (any type — code, markdown, config, etc.). Collect every match with its file path, line number, and the full comment text. Include multi-line FIX comments (read surrounding lines for context).

## Step 2: Sort Them

Sort the collected FIX comments:
1. **FIX0** comments go first (they are highest priority)
2. Among remaining FIX comments, sort from **easiest to hardest** to implement based on your assessment of scope and complexity

## Step 3: Create Todo Items

Create a todo item for each FIX comment using the TaskCreate tool. This gives visibility into progress.

## Step 4: Implement Fixes One by One

For each FIX comment, **sequentially** (never in parallel):

!`node ${CLAUDE_SKILL_DIR}/parts.js render step4 --renumber -- $ARGUMENTS`

## Important Rules

- **NEVER remove a FIX comment unless the issue it describes is actually fixed**
- If a fix cannot be fully implemented, add a `RES:` comment below the FIX comment explaining what was tried, what blocked it, and what alternatives were considered — but try hard before resorting to this. Do NOT remove FIX comment in this case
- Process fixes strictly one at a time
- If a FIX comment references other FIX comments or depends on them, handle dependencies in order

!`node ${CLAUDE_SKILL_DIR}/parts.js rest -a/--agents -c/--commits -- $ARGUMENTS`
