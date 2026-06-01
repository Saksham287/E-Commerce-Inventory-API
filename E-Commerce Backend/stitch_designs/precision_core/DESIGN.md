---
name: Precision Core
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for high-velocity inventory management where clarity, speed, and reliability are paramount. It adopts a **Modern Corporate** aesthetic—heavily influenced by industry leaders like Stripe and Shopify—prioritizing functional minimalism over decorative flair. 

The visual language communicates authority and precision through a disciplined use of white space, a restricted color palette, and high-contrast typography. The interface should feel "invisible," allowing the user’s data to take center stage while providing a robust, tactile framework for complex workflows. The emotional goal is to instill confidence in the user that their operations are organized, scalable, and secure.

## Colors

The palette is anchored by a high-performance **Indigo 600** as the primary action color, chosen for its professional associations and excellent legibility against white backgrounds. 

- **Primary (Indigo):** Used for main CTAs, active navigation states, and critical paths.
- **Secondary (Sky Blue):** Utilized for secondary information, data visualization, and progress indicators to provide a subtle cooling effect to the UI.
- **Status Colors:** Standardized semantic colors for Success (Emerald), Warning (Amber), and Error (Rose) are used sparingly to maintain the minimalist vibe.
- **Neutrals:** A "Slate" grey scale is used for text and borders to avoid the harshness of pure black, ensuring a sophisticated, high-contrast reading experience.

## Typography

This design system utilizes **Inter** exclusively. It is a typeface designed for user interfaces, offering exceptional tall x-height for readability in data-heavy inventory tables.

- **Headlines:** Use tighter letter spacing and semi-bold/bold weights to create a strong visual anchor for page titles.
- **Body:** Standardized at 16px for optimal desktop reading, dropping to 14px for dense data environments or secondary descriptions.
- **Labels:** Small caps or medium-weight 12px labels are used for metadata, table headers, and form titles to create a clear hierarchical distinction from user input.
- **Contrast:** Maintain a minimum 4.5:1 contrast ratio for all body text to ensure accessibility standards are met.

## Layout & Spacing

The layout philosophy follows a **fixed-fluid hybrid** model. On desktop, content is typically housed within a 12-column grid with a maximum container width of 1440px to prevent excessive line lengths. 

- **The 8px Rule:** All spacing, padding, and margins must be multiples of 8px (or 4px for micro-adjustments).
- **Grid:** Use a 24px gutter to provide significant breathing room between data panels.
- **Responsiveness:** On mobile (below 768px), the 12-column grid collapses to a single-column stack. Sidebars transform into bottom-sheet menus or hidden drawers.
- **Dashboard Density:** For inventory lists, use a "comfortable" vertical padding of 16px for rows, but provide a "compact" toggle at 8px for power users managing thousands of SKUs.

## Elevation & Depth

To maintain a clean, professional aesthetic, this design system uses **Tonal Layers** combined with **Ambient Shadows**. We avoid heavy black shadows in favor of soft, tinted shadows that blend into the background.

- **Level 0 (Background):** Used for the main canvas, typically a very light cool grey (#F8FAFC).
- **Level 1 (Surface):** The primary card and container level. Pure white (#FFFFFF) with a 1px border (#E2E8F0) and a subtle 4px blur shadow.
- **Level 2 (Overlay):** Used for dropdowns, tooltips, and popovers. These feature a more pronounced 12px blur shadow with a 5% opacity to signify they are physically closer to the user.
- **Interaction:** Hover states on interactive cards should subtly increase shadow depth (lift effect) rather than changing the background color.

## Shapes

The shape language is "Soft-Modern." We use a base radius of 8px for small components and 12-16px for large containers to evoke a friendly yet professional feel.

- **Components (Buttons, Inputs):** 8px (0.5rem) corner radius.
- **Large Containers (Cards, Modals):** 12px (0.75rem) or 16px (1rem) for outer containers.
- **Chips/Badges:** Pill-shaped (fully rounded) to differentiate them from interactive buttons.
- **Consistency:** Ensure nested elements have a smaller radius than their parent container to maintain visual harmony (e.g., an 8px button inside a 16px card).

## Components

### Buttons
- **Primary:** Solid Indigo 600 with white text. No gradient.
- **Secondary:** White background, Slate 200 border, Slate 900 text.
- **Ghost:** Transparent background, Indigo 600 text. Used for less prominent actions like "Cancel."

### Input Fields
- **Default State:** 1px border (#CBD5E1), 8px radius, white background.
- **Focus State:** 1px Indigo 600 border with a 3px Indigo 100 soft outer glow (ring).
- **Validation:** Error states use a red border and a small icon for accessibility.

### Cards
- Standard containers for inventory items. Must include a 1px Slate 200 border. 
- Internal padding should be a minimum of 24px (md) to maintain the "generous white space" requirement.

### Lists & Tables
- **Table Headers:** Use `label-sm` typography (uppercase) with a subtle grey background (#F1F5F9).
- **Rows:** Thin 1px bottom border (#F1F5F9). Avoid alternating row colors; use white space and clear dividers instead.

### Inventory Chips
- Use color-coded status chips (e.g., "In Stock" = Emerald, "Low Stock" = Amber) with low-opacity backgrounds and high-contrast text for maximum legibility at small sizes.