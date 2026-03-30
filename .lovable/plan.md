

## Redesign: Black & White Theme (OpenAI/ChatGPT-inspired)

Inspired by the ElevenLabs screenshot — clean, minimal, monochrome with strong typography and generous whitespace. No green, no colored accents. Pure black and white.

### Color System
- **Background**: Pure white `#FFFFFF`
- **Foreground/text**: Near-black `#0D0D0D`
- **Muted text**: `#6B6B6B`
- **Borders**: `#E5E5E5`
- **Primary (buttons)**: Black `#0D0D0D`
- **Primary foreground**: White
- **Glass effects**: Simplified to subtle gray borders + light backgrounds (no colored tints)
- **Accent**: Remove all green — everything monochrome

### Files to Modify

**1. `src/index.css`** — Complete color token overhaul
- All `--primary`, `--accent`, `--tint`, `--ring` → black/dark gray
- `--muted`, `--border` → neutral grays
- Remove green from all gradients, shadows, body background radials
- `.gradient-cta` → solid black or dark gray gradient
- `.text-gradient-hero` → solid black (no gradient needed)
- `.glass` → white/95% opacity + thin gray border, minimal blur
- `.shadow-float` → neutral black shadow, no color tint
- Remove colored orb hues from body background

**2. `src/components/AnimatedBackground.tsx`** — Remove or make grayscale
- Change orb hues to 0 saturation (neutral gray orbs) for subtle movement without color

**3. `src/components/HeroSection.tsx`** — Redesign layout inspired by ElevenLabs
- Clean, left-aligned or centered large headline with strong contrast
- Remove colored badge pulse dot or make it black
- Stats cards: thin borders, no colored icons — use black icons
- Course card: clean white card with subtle border, no glass-strong tinting
- CTA button: solid black with white text, rounded

**4. `src/pages/Index.tsx`** — Academic header + chat header
- Header: clean white bar with thin bottom border
- Chat header icon: black instead of green gradient
- "AI Online" indicator: black dot instead of green pulse
- Logo icon background: black instead of gradient-cta

**5. `src/components/ChatMessage.tsx`** — Monochrome message styling
- User messages: black background, white text (instead of green gradient)
- Assistant: white/light gray card with black text
- Table headers: light gray background, black text (not green)
- Links: black with underline (not green)
- List bullets: black (not green)
- Section icon backgrounds: light gray (not green tint)

**6. `src/components/ChatInput.tsx`** — Monochrome input
- Send button: solid black, white icon
- Sparkles icon: gray
- Focus ring: black/dark gray

**7. `src/components/ModelSelector.tsx`** — Monochrome dropdown
- CPU icon: black/gray (not green)
- Selected state: light gray background (not green tint)
- Check icon: black

**8. `src/components/QuickActionsGrid.tsx`** — Monochrome action cards
- Icon backgrounds: light gray (not green)
- Hover chevron: black

**9. `src/components/KnowledgeSidebar.tsx`** — Monochrome sidebar
- All `text-tint` → black/foreground
- Hover states: light gray (not green)

**10. `src/components/FollowUpSuggestions.tsx`** — Monochrome chips
- Remove green hover effects, use gray/black

### Typography
- Keep DM Serif Display for headings + Inter for body (already good)
- Increase font weight contrast between headings and body
- Keep JetBrains Mono for code

### Summary
Every instance of green (`text-tint`, `bg-tint`, `bg-tint-light`, `gradient-cta`, `text-gradient-hero`, `shadow-float`) becomes black, dark gray, or light gray. The result is a clean, professional monochrome UI similar to OpenAI/ChatGPT's aesthetic.

