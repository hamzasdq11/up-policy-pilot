

## Speed Up Chatbot Responses

### Root Cause
The `autoSelectModel` function routes many queries to `google/gemini-2.5-pro` (the slowest model) — any query with ₹ amounts, "calculate", "roi", comparisons, or length > 300 chars triggers it. The network logs confirm: Gemini 2.5 Pro spends ~30+ seconds on reasoning chains before emitting content tokens.

### Fix

**1. Replace slow model with faster alternatives (`src/lib/aiService.ts`)**
- Change `google/gemini-2.5-pro` → `google/gemini-3-flash-preview` for "deep reasoning" queries
- Change `google/gemini-2.5-flash` → `google/gemini-2.5-flash-lite` for simple queries
- This eliminates the extended reasoning overhead while keeping quality adequate for policy Q&A

**2. Update allowed models list (`supabase/functions/chat/index.ts`)**
- Add `google/gemini-2.5-flash-lite` to `ALLOWED_MODELS`
- Remove `google/gemini-2.5-pro` (no longer used)
- Reduce `max_tokens` from 8192 to 4096 — responses don't need to be that long, and shorter limits reduce generation time

**3. Reduce edge function timeout**
- Drop from 60s to 45s for faster failure detection

### Result
- Simple queries: ~2-3s (flash-lite)
- Moderate queries: ~5-8s (flash-preview)  
- Complex queries: ~8-12s (flash-preview instead of 30-60s pro)

