

## Fix: Race Condition & Anti-Pattern in Chat Message Handling

### Problem
`streamChat()` is called inside a `setMessages()` updater function — a React anti-pattern that can cause duplicate API calls in Strict Mode and creates a race condition with `setIsStreaming`.

### Changes

**File: `src/pages/Index.tsx` — `handleSend` function (lines 86-142)**

Restructure to:
1. Add user message to state first with `setMessages(prev => [...prev, userMsg])`
2. Build `chatHistory` from current messages + new user message (computed outside setter)
3. Call `streamChat()` outside the state setter
4. Set `setIsStreaming(true)` *before* calling `streamChat()`
5. Use a stable prefix like `__welcome__` for welcome message IDs to avoid accidental collisions

```text
Before:
  setMessages((prev) => {
    const updated = [...prev, userMsg];
    // ... builds chatHistory inside setter
    streamChat({ ... });  // ← side effect inside setter!
    return updated;
  });
  setIsStreaming(true);  // ← runs AFTER stream starts

After:
  // 1. Compute chat history from current state
  const chatHistory = messages
    .filter(m => !m.id.startsWith("__welcome"))
    .map(m => ({ role: m.role, content: m.content }));
  chatHistory.push({ role: "user", content: trimmedQuery });

  // 2. Update state
  setMessages(prev => [...prev, userMsg]);
  setIsStreaming(true);  // ← before stream starts

  // 3. Start stream outside setter
  abortRef.current = new AbortController();
  streamChat({ messages: chatHistory, ... });
```

**Welcome message IDs**: Change `"welcome"` → `"__welcome__"` and `"welcome-" + Date.now()` → `"__welcome__" + Date.now()` to avoid collisions.

### Files Modified
- `src/pages/Index.tsx` — refactor `handleSend`, update welcome ID prefixes

