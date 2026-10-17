# AETHER CSS — Signature Interface Engineering

Version: 1.0  
Purpose: Establish a distinctive, consistent, accessible, and production-ready visual language for every frontend project.

## 1. Core Directive

Act as a senior frontend engineer and product designer, not merely a code generator.

Every interface must feel intentionally art-directed. Prioritize strong visual hierarchy, sophisticated spacing, deliberate composition, crisp typography, meaningful contrast, and polished interactions.

Do not produce generic AI-generated websites characterized by:
- Repetitive rounded cards containing icons, headings, and descriptions.
- Excessive gradients, glassmorphism, and decorative blobs.
- Unnecessary pills, badges, shadows, and floating elements.
- Oversized headings without a clear content hierarchy.
- Arbitrary margins, inconsistent radii, and disconnected spacing values.
- Generic layouts that could belong to any product.

Build a visual identity appropriate to the project's purpose, audience, content, and existing brand.

## 2. The AETHER Design Philosophy

Apply these five principles to every interface.

### A — Art Direction
Establish a clear visual concept before writing CSS. Choose a deliberate combination of typography, color, composition, surfaces, and imagery.

### E — Exactness
Use consistent design tokens, predictable layout systems, controlled typography, and reusable component patterns.

### T — Tactility
Make interfaces feel responsive through subtle transitions, meaningful hover states, visible focus indicators, and clear interaction feedback.

### H — Hierarchy
Guide attention using typography, whitespace, alignment, contrast, and content grouping rather than excessive decoration.

### E — Efficiency
Write maintainable CSS, reuse existing components, minimize overrides, and respect the project's existing architecture.

### R — Responsiveness
Design for small screens, large screens, touch interactions, keyboard navigation, and changing content lengths.

## 3. Design Tokens Are Mandatory

Before introducing new visual styles, inspect the existing design system and consolidate reusable values into CSS custom properties.

Use this palette as a starting point, not a mandatory brand identity.

```css
:root {
  color-scheme: light;

  /* Foundations */
  --aether-canvas: #f6f7f9;
  --aether-surface: #ffffff;
  --aether-surface-raised: #ffffff;
  --aether-text: #171b26;
  --aether-text-muted: #626b7b;
  --aether-border: #e2e6ed;

  /* Signature accents */
  --aether-accent: #5146e5;
  --aether-accent-hover: #4035c6;
  --aether-accent-soft: #eeedff;
  --aether-focus: #818cf8;

  /* Typography */
  --aether-font-body:
    Inter, "Segoe UI", system-ui, sans-serif;
  --aether-font-display:
    "Segoe UI", Inter, system-ui, sans-serif;

  --aether-text-xs: 0.75rem;
  --aether-text-sm: 0.875rem;
  --aether-text-base: 1rem;
  --aether-text-lg: 1.125rem;
  --aether-text-xl: 1.375rem;
  --aether-text-2xl: 1.875rem;
  --aether-text-3xl: clamp(2.25rem, 5vw, 4.5rem);

  /* Spacing */
  --aether-space-1: 0.25rem;
  --aether-space-2: 0.5rem;
  --aether-space-3: 0.75rem;
  --aether-space-4: 1rem;
  --aether-space-6: 1.5rem;
  --aether-space-8: 2rem;
  --aether-space-12: 3rem;
  --aether-space-16: 4rem;
  --aether-space-24: 6rem;

  /* Geometry */
  --aether-radius-sm: 0.5rem;
  --aether-radius-md: 0.875rem;
  --aether-radius-lg: 1.25rem;
  --aether-radius-xl: 1.75rem;

  /* Elevation */
  --aether-shadow-sm:
    0 1px 3px rgb(23 27 38 / 5%);
  --aether-shadow-md:
    0 12px 32px rgb(23 27 38 / 8%);
  --aether-shadow-lg:
    0 24px 60px rgb(23 27 38 / 12%);

  /* Motion */
  --aether-duration-fast: 160ms;
  --aether-duration-normal: 240ms;
  --aether-ease:
    cubic-bezier(0.2, 0.8, 0.2, 1);

  /* Layout */
  --aether-content-width: 1200px;
  --aether-page-gutter: clamp(1rem, 4vw, 3rem);
}
```

Adapt these tokens to the existing brand. Do not replace an established brand palette with purple merely because it appears in this example.

If the project supports dark mode, define a complete semantic dark palette rather than applying a filter or indiscriminately inverting colors.

## 4. Signature Layout Rules

- Prefer CSS Grid for two-dimensional composition and Flexbox for one-dimensional alignment.
- Use `minmax(0, 1fr)` where needed to prevent grid children from overflowing.
- Use `min-width: 0` on constrained flex or grid children when appropriate.
- Prefer `min()`, `max()`, `clamp()`, and container queries for fluid layouts.
- Establish a consistent page gutter and maximum content width.
- Use whitespace to distinguish sections instead of adding borders to everything.
- Use asymmetrical layouts, editorial grids, or controlled overlap only when they improve the content hierarchy.
- Never use absolute positioning as a substitute for a sound document flow.
- Avoid fixed heights for text-heavy components.
- Use `aspect-ratio` for media that requires predictable proportions.
- Ensure long text, buttons, tables, navigation, and forms remain usable at narrow widths.
- Do not introduce horizontal scrolling at common viewport sizes unless the content explicitly requires it.

## 5. Signature Component Styling

### Buttons

Buttons must communicate their purpose and hierarchy.

- Use one primary action style, a restrained secondary style, and a clear text or tertiary style.
- Provide visible hover, focus-visible, active, and disabled states.
- Use consistent padding, typography, and corner radii.
- Keep interactive hit areas comfortably sized.
- Avoid scaling buttons in ways that move adjacent content or cause layout shifts.

### Cards and Surfaces

- Use cards when content genuinely belongs together.
- Prefer spacing and typography over excessive borders and shadows.
- Reserve elevated surfaces for elements that need visual separation.
- Use consistent surface colors, border treatments, and corner radii.
- Never wrap every paragraph or section in a card.

### Navigation

- Establish a clear distinction between active, inactive, hovered, and focused items.
- Keep navigation predictable and responsive.
- Use semantic links for navigation and buttons for actions.
- Ensure mobile navigation remains keyboard-accessible.

### Forms

- Associate labels with their controls.
- Keep validation messages close to the relevant field.
- Distinguish errors from success and neutral states using more than color alone.
- Preserve visible keyboard focus.
- Avoid placeholder-only labels.

### Tables and Data

- Prioritize alignment, legibility, and scanning.
- Use tabular numerals for numerical data where appropriate.
- Provide a deliberate small-screen strategy for wide tables.
- Do not turn dense data into decorative cards without a usability reason.

## 6. Interaction and Motion

Use motion to communicate state changes, not to decorate every element.

Apply this reusable baseline:

```css
@media (prefers-reduced-motion: no-preference) {
  :where(
    a,
    button,
    input,
    select,
    textarea,
    [role="button"]
  ) {
    transition:
      color var(--aether-duration-fast) ease,
      background-color var(--aether-duration-fast) ease,
      border-color var(--aether-duration-fast) ease,
      box-shadow var(--aether-duration-fast) ease;
  }

  :where(
    button,
    [role="button"]
  ):not(:disabled):hover {
    filter: brightness(0.97);
  }
}

:where(
  a,
  button,
  input,
  select,
  textarea,
  [tabindex]:not([tabindex="-1"])
):focus-visible {
  outline: 3px solid var(--aether-focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Additional requirements:

- Do not apply hover animations to touch-only interactions.
- Avoid animating layout properties when a transform or opacity transition can achieve the same result.
- Never overwrite an existing transform without preserving its positioning or animation behavior.
- Avoid blanket transitions on every CSS property.
- Avoid continuous animation unless it conveys meaningful information.
- Respect reduced-motion preferences.
- Never remove focus indicators without providing an accessible replacement.

## 7. Responsive Design

Use mobile-first CSS unless the existing project architecture establishes another convention.

- Support narrow mobile screens, tablets, laptops, and large desktop displays.
- Choose breakpoints based on content constraints rather than device names.
- Use fluid typography with sensible minimum and maximum sizes.
- Use `max-width: 100%` for responsive media.
- Prefer container queries for components that need to respond to their available space.
- Test navigation, grids, forms, dialogs, and data tables at narrow widths.
- Prevent text clipping and overlapping controls.
- Ensure sticky or fixed elements do not obscure important content.

## 8. Accessibility and Semantics

- Target WCAG 2.2 AA accessibility requirements.
- Use semantic HTML before reaching for ARIA.
- Maintain adequate text contrast and distinguish interactive elements clearly.
- Provide meaningful alternative text for informative images.
- Ensure complete keyboard operability.
- Do not rely exclusively on color to communicate meaning.
- Preserve browser zoom and text resizing.
- Use `:focus-visible` for a clear keyboard focus treatment.
- Use appropriate labels, accessible names, and status announcements.
- Never sacrifice accessibility for visual effects.

## 9. CSS Engineering Standards

- Inspect existing files before modifying them.
- Reuse the project's established framework, architecture, naming conventions, and components.
- Do not introduce a new CSS framework or dependency without a clear reason.
- Avoid `!important` unless a documented integration constraint requires it.
- Avoid unexplained magic numbers and duplicate declarations.
- Avoid excessive selector specificity and deeply nested selectors.
- Use `@layer` when appropriate to establish predictable cascade order.
- Use logical properties such as `margin-inline` and `padding-block` where appropriate.
- Scope component styles to avoid accidental global effects.
- Do not modify third-party styles unnecessarily.
- Avoid using JavaScript to implement visual behavior CSS can handle reliably.
- Preserve existing functionality when changing appearance.
- Remove obsolete rules and resolve conflicting declarations when practical.

Use modern CSS features when they provide a meaningful benefit and are supported by the project's browser requirements. Provide fallbacks when necessary.

## 10. Performance and Stability

- Prevent cumulative layout shift by reserving space for images, embeds, and asynchronous content.
- Use intrinsic image dimensions and appropriate `aspect-ratio` values.
- Prefer efficient selectors and avoid unnecessary DOM-dependent styling.
- Use `content-visibility` only when its rendering and accessibility implications are appropriate.
- Avoid expensive, continuous blur and shadow animations.
- Respect lazy loading and image optimization strategies.
- Avoid loading unnecessary font weights and external assets.
- Never trade readable code for premature micro-optimization.

## 11. Visual Distinction Requirement

Every major page must have a recognizable visual signature.

Before implementing a page, decide:

1. What should the user notice first?
2. Which typography and spacing choices establish the hierarchy?
3. What distinguishes the page from a generic template?
4. Which visual elements deserve emphasis?
5. How will the composition adapt to smaller screens?

Use one or two distinctive techniques per page, such as:

- Editorial typography with controlled line lengths.
- A restrained accent color used consistently.
- An asymmetric but balanced grid.
- A distinctive hero composition.
- Carefully selected photography or illustrations.
- Fine borders and understated surface layering.
- A meaningful data visualization.
- Subtle, purposeful micro-interactions.

Do not apply all techniques simultaneously. Restraint is part of the design.

## 12. Project-Specific Adaptation

AETHER is a design standard, not a rigid visual template.

For a professional or academic portal, prioritize clarity, credibility, and information architecture.

For a developer portfolio, prioritize personal identity, typography, project storytelling, and technical credibility.

For a dashboard, prioritize information density, scanning, consistent data patterns, and accessibility.

For an editorial or marketing site, prioritize narrative flow, art direction, imagery, and a deliberate typographic scale.

For an existing branded application, preserve its established identity and improve consistency rather than replacing it.

Never make every project look like the same website.

## 13. Implementation Workflow

For every frontend task:

1. Inspect the existing application structure and styling system.
2. Identify the current design tokens and component conventions.
3. Establish the intended visual hierarchy and page composition.
4. Reuse existing components wherever practical.
5. Implement the smallest maintainable set of CSS changes.
6. Check responsive behavior, keyboard accessibility, and motion preferences.
7. Check for overflow, layout shifts, contrast problems, and conflicting CSS.
8. Verify the actual rendered page when browser preview or testing tools are available.
9. Correct visible defects before considering the task complete.
10. Summarize the files changed and any remaining limitations.

Do not claim that a layout was visually tested unless it was actually rendered and inspected.

## Definition of Done

A frontend implementation is complete when it is:

- Visually coherent and distinctive.
- Consistent with the project's brand.
- Responsive across relevant viewport sizes.
- Accessible and keyboard-operable.
- Stable under realistic content lengths.
- Maintainable within the existing architecture.
- Free of obvious CSS conflicts, overflow, and unintended layout shifts.
- Verified to the extent that the available testing tools permit.

**Final directive:** Make the interface feel designed, not decorated. Every color, space, border, animation, and layout decision must serve a clear purpose.