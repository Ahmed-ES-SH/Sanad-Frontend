# Project Context: Sanad

This document outlines the design and architectural principles for the Sanad Technical Services project.

## Design Context

### Users
The primary users are **SME owners (Small and Medium Enterprises) and Operations Managers** in the MENA region. They are looking for reliable digital transformation services to streamline their business workflows. They value professional expertise, clear communication, and efficient results.

### Brand Personality
The Sanad brand is defined by three core pillars:
1. **Reliable**: Building trust (reflecting the meaning of "Sanad" or Support).
2. **Empowering**: Providing the tools and services for businesses to thrive.
3. **Intelligent**: Utilizing cutting-edge technology and smart strategies.

### Aesthetic Direction
**Balanced Modern**: Clean, solid surfaces with intentional depth through subtle shadows, borders, and background color shifts. Minimal clarity (high legibility, intentional white space).
- **Core Palette**: Modern Orange (`#f97316`), Amber (`#f59e0b`), and Stone-based neutrals.
- **Visual Language**: Solid card surfaces with defined borders, subtle shadow depth, and interactive feedback using Framer Motion.
- **Typography**: Inter (Body) and Plus Jakarta Sans (Display).

### Design Principles
1. **Mirroring Excellence**: Ensure a full RTL layout that goes beyond simple text alignment, maintaining an intuitive visual hierarchy (F-pattern) for both Arabic and English readers.
2. **Solid Depth**: Create depth and modernity through solid surfaces, defined borders, and subtle shadows — never through blur effects or transparency that compromise readability.
3. **Empowering Intelligence**: Design components that feel proactive and smart, using purposeful animations to guide the user rather than just decorate.
4. **Local Relevance**: Respect Arabic linguistic nuances and cultural context in icons, metaphors, and directional elements.
5. **Accessible by Design**: Prioritize high-contrast ratios, keyboard navigability, and screen-reader support as fundamental requirements for every component.

## Technical Standards

### Tech Stack
- **Framework**: Next.js 16.1 (with App Router)
- **Styling**: Tailwind CSS 4 (using CSS-based configuration in `globals.css`)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Auth**: Clerk
- **Internationalization**: Custom `[local]` routing with `ar` and `en` translations.

### Conventions
- Use CSS variables from `globals.css` (e.g., `--primary`, `--surface-card-bg`) to maintain consistency.
- Implement RTL support by checking the `dir` or `local` parameter from the layout.
- Prioritize client-side components for interactive/animated sections while maintaining server-side metadata for SEO.
- Follow the established solid surface patterns (`.surface-card`) and shadow depths for cards and navigation elements.
