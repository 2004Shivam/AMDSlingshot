# Skill: Design UI & Tokens

## Agent
`@designer`

## Objective
Establish the complete visual design system before any frontend code is written. This ensures UI consistency throughout the app.

## Instructions
1. **Analyze the Product**: Read `production_artifacts/Technical_Specification.md` to understand the product's mood, audience, and purpose.

2. **Select a Visual Direction**: Choose ONE of these archetypes and justify it:
   - **Glassmorphism Dark** (Blur, transparency, dark backgrounds)
   - **Neomorphic Light** (Soft shadows, monochromatic, minimal)
   - **Vibrant SaaS** (Bold gradients, high contrast, energetic)
   - **Corporate Minimal** (Clean, whitespace-heavy, professional)
   - **Custom** (Describe thoroughly)

3. **Define Design Tokens** and save to `production_artifacts/design_tokens.md`:
   ```markdown
   ## Colors
   | Token | Value | Usage |
   |---|---|---|
   | --color-primary | #... | CTAs, active states |
   | --color-bg | #... | Page background |
   | ... | | |

   ## Typography
   | Token | Value |
   |---|---|
   | --font-primary | 'Inter', sans-serif |
   | --font-size-base | 16px |
   | ... | |

   ## Spacing Scale
   (4px base grid: 4, 8, 12, 16, 24, 32, 48, 64, 96px)

   ## Shadow System
   | Token | Value |
   |---|---|
   | --shadow-sm | ... |
   | --shadow-md | ... |

   ## Border Radius
   | Token | Value |
   |---|---|
   | --radius-sm | 6px |
   | --radius-md | 12px |
   | --radius-lg | 24px |
   ```

4. **Define Animation Principles**:
   - Default easing curve
   - Standard durations (fast: 150ms, base: 250ms, slow: 400ms)
   - Key micro-interactions to implement (e.g., button press scale, input focus glow)

5. **Save** the complete system to `production_artifacts/design_tokens.md`.
6. **Notify**: "Design system is ready. @frontend can now begin with tokens from `design_tokens.md`."
