

## Hero Section Redesign Plan

### Overview
Complete redesign of the hero section as a proper landing page with IIM Ranchi branding colors (dark charcoal/black + green), improved typography, persistent academic header, the IIM Ranchi logo displayed prominently, and the hero background image shown inline with a Business Law course description.

### Color System (from IIM Ranchi logo)
- **Primary**: Dark charcoal `#2D2D2D` (logo text)
- **Accent green**: `#6BB536` (logo leaf)
- **Secondary green**: `#4A8C2A` (darker leaf)
- Backgrounds remain clean white/light gray for the glass UI

### Changes

**1. Update color tokens in `src/index.css`**
- Change `--primary` from blue `220 65% 48%` to IIM green `~95 55% 47%`
- Update `--accent`, `--tint`, `--ring`, gradient-cta, text-gradient-hero to match green palette
- Update shadow-float to green-tinted
- Background body radials to subtle green tints

**2. Copy IIM Ranchi logo to project**
- Copy `user-uploads://IIM_Ranchi.png` → `src/assets/iim-ranchi-logo.png`

**3. Add persistent academic header bar (in `src/pages/Index.tsx`)**
- A slim, always-visible top bar above both hero and chat views containing:
  - IIM Ranchi logo (small, left)
  - "AI Assignment | Business Law | Prof. Angshuman Hazarika" (center)
  - "Mohammad Hamza Siddiqui — IPM29-24" (right)
- Stays visible on both hero and chat screens

**4. Redesign `HeroSection.tsx` completely**
- Remove parallax background image usage
- Structure as a proper landing page:
  - **Top**: Large title "UP IIEPP 2022 Policy Advisor" with improved serif/sans combo
  - **Subtitle**: Strategic consultant tagline
  - **CTA button**: Green gradient matching logo
  - **Stats grid**: Keep existing stats with green accent
  - **Course section**: A card with the hero-bg.jpeg image displayed inline (not as background), alongside a brief description of Business Law course and the academic context
- Remove the old academic credit block (moved to persistent header)

**5. Update typography in `src/index.css`**
- Import a more refined heading font (e.g., swap Playfair Display for DM Serif Display or keep Playfair but refine weights)
- Tighten letter-spacing, improve hierarchy

**6. Update chat header in `Index.tsx`**
- Change gradient-cta on the logo icon to green
- These will automatically follow from the CSS variable changes

### Files Modified
- `src/index.css` — color tokens, gradients
- `src/components/HeroSection.tsx` — full redesign
- `src/pages/Index.tsx` — add persistent academic header
- New asset: `src/assets/iim-ranchi-logo.png`

