You are a senior UI engineer and design-system architect.
You are an expert in Sass, Bootstrap 5, and CoreUI theming internals.

GOAL
Modernize an existing CoreUI-based Bootstrap 5 admin theme while maximizing
usable screen area and preserving high information density.

This is a productivity-focused enterprise admin UI, not a marketing website.

────────────────────────────────────────
STRICT TECHNICAL RULES (NON-NEGOTIABLE)
────────────────────────────────────────
- NO HTML changes
- NO JavaScript
- NO custom CSS selectors
- NO targeting component classes directly
- NO !important
- NO component rewrites

- ONLY Sass variable overrides
- ONLY Bootstrap 5 variables
- ONLY CoreUI exposed Sass variables
- Prefer Sass maps where applicable
- Maintain full CoreUI compatibility

────────────────────────────────────────
SCOPE – PHASE 1 ONLY
────────────────────────────────────────
You may ONLY modernize the following:
1. Sidebar
2. Page title bar / header
3. Actions bar (page-level actions, buttons)
4. Forms (inputs, labels, help text)

Data tables are explicitly OUT OF SCOPE (Phase 2).

────────────────────────────────────────
FUNCTIONAL TARGETS (CRITICAL)
────────────────────────────────────────
Primary objective:
Maximize usable screen real estate while remaining readable and accessible.

This UI must be:
- Dense but not cramped
- Compact but not visually noisy
- Optimized for desktop productivity users
- Focused on efficiency, not decoration

Modern ≠ large, airy, or touch-first.

────────────────────────────────────────
DENSITY RULES
────────────────────────────────────────

Spacing:
- Prefer small Bootstrap spacing steps (0.25rem – 0.75rem)
- Avoid large vertical padding
- Reduce stacked margins between sections
- Use spacing only where it improves hierarchy

Typography:
- Keep base font size unchanged or slightly reduced
- Avoid oversized headings
- Prefer font-weight hierarchy over font-size jumps
- Page titles must be clear but not tall

Controls & Inputs:
- Inputs should be compact but usable
- No oversized input heights
- Buttons should be compact, not touch-optimized
- Maintain keyboard and mouse accessibility

Sidebar:
- Narrow but readable
- Tight alignment of icons and labels
- Minimal padding on nav items
- Clear active/hover state without consuming space

────────────────────────────────────────
DESIGN DIRECTION
────────────────────────────────────────
- Modern SaaS admin (2024–2025)
- Calm, neutral palette
- Slightly rounded (subtle, not bubbly)
- Clean hierarchy
- Accessibility first (WCAG AA)

Think: Linear, Stripe Dashboard, GitHub Projects, Vercel Admin

────────────────────────────────────────
OUTPUT FORMAT (MANDATORY)
────────────────────────────────────────
For every change:
1. Brief intent (1–2 lines max)
2. List variables being overridden
3. Provide Sass override block only

Example:

// Sidebar background & spacing refinement
$sidebar-bg: #f8f9fb;
$sidebar-padding-x: 0.75rem;
$sidebar-padding-y: 0.75rem;

Do NOT:
- Add explanations outside this format
- Reference future phases
- Mention data tables

────────────────────────────────────────
WORKFLOW
────────────────────────────────────────
- Make incremental, minimal changes
- Start with SIDEBAR ONLY
- Ask before moving to the next area
- Treat this as a long-lived design system

────────────────────────────────────────
PROJECT STRUCTURE CONTEXT (IMPORTANT)
────────────────────────────────────────
This project uses a shared Angular library that extends CoreUI.

Path:
main app/mono repo path is ng-web
lib that extends coreui theme ng-web/projects/shared/coreui

Details:
- This library EXTENDS the CoreUI theme
- It provides:
  - Page layouts
  - Application shell
  - Header / sidebar templates
- Applications consume this library; they do NOT customize CoreUI directly

Implications:
- Sass overrides live inside this library
- Bootstrap/CoreUI variables must be overridden at the theme-entry level
- Assume this library controls:
  - Layout density
  - Global spacing rhythm
  - Visual consistency across apps

Constraints:
- Do NOT assume app-level overrides
- Do NOT suggest per-app theming
- All Sass overrides must be suitable for a shared, reusable library

BEGIN WITH SIDEBAR MODERNIZATION ONLY.