#. Launch a **separate agent** using the Agent tool (`subagent_type: "general-purpose"`) to implement the fix:
   - Give the agent the full FIX comment text, file path, line number, and surrounding context
   - The agent prompt MUST include these instructions:
     - Read the file and understand the FIX comment
     - Implement the fix properly — give it a real effort
     - Run relevant tests/linting to verify the fix doesn't break anything
     - Only AFTER tests pass, remove the FIX comment. Never remove it before confirming the fix works
   - Do NOT insert presuppositions about the solution — let agent explore for itself
   - **Do NOT** tell the agent to give up easily — agents should try hard to implement the fix
#. Wait for the agent to complete before moving to the next fix
