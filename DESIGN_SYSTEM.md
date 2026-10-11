# 🎨 Visual Design Guide - UI System

## Color System Reference

### Primary Colors
```
--primary: #6366f1        → Main brand color (Indigo)
--primary-hover: #4f46e5  → Hover state
--primary-light: #e0e7ff  → Background/light variant
--primary-dark: #4c1d95   → Dark variant
```

### Semantic Colors
```
--secondary: #10b981           → Success/secondary actions
--secondary-light: #d1fae5     → Success light background
--error: #ef4444               → Error state
--error-light: #fee2e2         → Error light background
--success: #10b981             → Success state
--success-light: #d1fae5       → Success light background
```

### Text Colors
```
--text-primary: #0f172a        → Main text (headings, body)
--text-secondary: #475569      → Secondary text
--text-tertiary: #94a3b8       → Tertiary text (helpers, labels)
```

### Background Colors
```
--bg-primary: #ffffff          → Main background (white)
--bg-secondary: #f8fafc        → Light gray (subtle)
--bg-tertiary: #f1f5f9         → Medium gray (accent)
--border: #e2e8f0              → Border color
--border-light: #f1f5f9        → Light border
```

---

## Typography System

### Heading Sizes
```
H1: 3.5rem  (56px)  - Page title, brand
H2: 1.75rem (28px)  - Section titles
H3: 1.25rem (20px)  - Subsection titles
H4: 1rem    (16px)  - Card titles
```

### Text Sizes
```
Body:       0.9375rem (15px)   - Main content
Small:      0.8125rem (13px)   - Captions
Label:      0.95rem   (15.2px) - Form labels
```

### Font Weights
```
Light:   400
Regular: 500
Medium:  600
Bold:    700
Bolder:  800
Boldest: 900
```

---

## Spacing Scale

### Container Padding
```
--large:    3rem    (48px)  - Main sections
--medium:   2.5rem  (40px)  - Cards
--base:     2rem    (32px)  - Form groups
--compact:  1.5rem  (24px)  - Elements
--small:    1rem    (16px)  - Small gaps
--xs:       0.75rem (12px)  - Minimal
```

### Gap System
```
Large:      3.5rem  (56px)  - Major sections
Medium:     2.5rem  (40px)  - Form sections
Base:       2rem    (32px)  - Form groups
Compact:    1.5rem  (24px)  - Between items
Small:      1rem    (16px)  - Small gaps
Tiny:       0.75rem (12px)  - Minimal gaps
```

---

## Shadow System

### Layers (Depth)
```
--shadow-sm:
  0 1px 2px 0 rgba(0, 0, 0, 0.05)
  ↳ Subtle borders, separators

--shadow:
  0 1px 3px 0 rgba(0, 0, 0, 0.1),
  0 1px 2px 0 rgba(0, 0, 0, 0.06)
  ↳ Light elevation

--shadow-md:
  0 4px 6px -1px rgba(0, 0, 0, 0.08),
  0 2px 4px -1px rgba(0, 0, 0, 0.04)
  ↳ Card elevation

--shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.08),
  0 4px 6px -2px rgba(0, 0, 0, 0.03)
  ↳ Dialog elevation

--shadow-xl:
  0 20px 25px -5px rgba(0, 0, 0, 0.08),
  0 10px 10px -5px rgba(0, 0, 0, 0.04)
  ↳ Modal elevation
```

---

## Border Radius

### Scale
```
Extra Small: 5px     → Links, badges
Small:       8px     → Inputs, buttons
Medium:      10px    → Form elements
Large:       12px    → Cards
Extra Large: 14px    → Large containers
16px:                → Rounded
```

### Usage
```
Inputs:           8px
Buttons:          10px
Cards:            12px-16px
Containers:       16px
Large sections:   16px
```

---

## Transitions

### Durations
```
--transition-fast:  150ms
--transition:       200ms
--transition-slow:  300ms
```

### Easing
```
cubic-bezier(0.4, 0, 0.2, 1)
↳ Material Design easing
↳ Professional feel
↳ Smooth acceleration
```

### Applied To
```
Hover states:   200ms
Focus states:   200ms
Transitions:    200ms
Animations:     300ms+
```

---

## Component Styles

### Cards
```css
{
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 3rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  transition: var(--transition);
}

:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}
```

### Buttons
```css
Primary:
  Background: var(--primary)
  Color: white
  Shadow: 0 4px 12px rgba(99, 102, 241, 0.3)
  Hover: var(--primary-hover)

Secondary:
  Background: var(--bg-primary)
  Color: var(--text-primary)
  Border: 1.5px solid var(--border)
  Hover: var(--bg-tertiary)
```

### Inputs
```css
{
  padding: 1rem 1.25rem;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.9375rem;
  transition: var(--transition-fast);
}

:hover {
  border-color: var(--primary);
  background-color: #f8fafc;
}

:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
}
```

---

## Responsive Breakpoints

### Mobile First
```
320px-479px   → Small mobile
480px-767px   → Mobile
768px-1023px  → Tablet
1024px+       → Desktop
1200px+       → Large desktop
1920px+       → Ultra-wide
```

### Layout Changes
```
@media (max-width: 768px)
  - Single column layout
  - Stacked form inputs
  - Full-width buttons
  - Adjusted typography

@media (max-width: 480px)
  - Minimal padding
  - Smaller fonts
  - Single column grid
  - Simplified layout
```

---

## Accessibility

### Color Contrast
```
Text on Background:  WCAG AA (4.5:1 minimum)
Large Text:          WCAG AA (3:1 minimum)
UI Components:       WCAG AA (3:1 minimum)
```

### Touch Targets
```
Minimum:            44px × 44px
Recommended:        48px × 48px
Comfortable:        56px × 56px
```

### Keyboard Navigation
```
Tab:           Navigate forward
Shift + Tab:   Navigate backward
Enter:         Activate button
Space:         Checkbox toggle
Escape:        Close modal
```

### Visual Indicators
```
Focus state:       Outline ring
Hover state:       Color change
Active state:      Transform
Disabled state:    Reduced opacity
Error state:       Red color + icon
```

---

## Animation Examples

### Hover Effect
```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
```

### Loading Spinner
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
animation: spin 0.8s linear infinite;
```

### Slide Down
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideDown 0.3s ease-out;
```

---

## Typography Hierarchy

### Page Title (H1)
```
Size:       3.5rem (56px)
Weight:     900
Color:      var(--text-primary)
Spacing:    Letter-spacing: -0.025em
Example:    "Auto README Generator"
```

### Section Title (H2)
```
Size:       1.75rem (28px)
Weight:     900
Color:      var(--primary)
Spacing:    Letter-spacing: -0.015em
Example:    "📚 Tech Stack"
```

### Subsection Title (H3)
```
Size:       1.25rem (20px)
Weight:     900
Color:      var(--text-primary)
Spacing:    Letter-spacing: -0.01em
Example:    "Features"
```

### Body Text
```
Size:       0.9375rem (15px)
Weight:     400
Color:      var(--text-secondary)
Line-height: 1.85
Example:    Paragraph content
```

### Label Text
```
Size:       0.95rem (15.2px)
Weight:     700
Color:      var(--text-primary)
Spacing:    Letter-spacing: 0px
Example:    Form labels
```

### Caption Text
```
Size:       0.8125rem (13px)
Weight:     500
Color:      var(--text-tertiary)
Line-height: 1.5
Example:    Helper text
```

---

## Icon Usage

### Emoji Replacements (Modern Approach)
```
✨ → Features
🏗️ → Architecture
📚 → Documentation
🚀 → Getting Started
🔧 → Configuration
🧪 → Testing
🐛 → Troubleshooting
📝 → Contributing
📞 → Contact
⭐ → Rating/Quality
✅ → Checkmarks
```

### Icon Placement
```
Before text:     Emoji + [2-4px gap] + Text
In headings:     Emoji + [1px gap] + Title
In lists:        • Emoji + [1px gap] + Item
In buttons:      Emoji + [1px gap] + Text
```

---

## Layout Grid

### Container Width
```
Max-width:     1400px
Padding:       2rem (desktop)
              1.5rem (tablet)
              1rem (mobile)

Inner width:   1400px - 4rem = 1312px (desktop)
              768px - 3rem = 742px (tablet)
              480px - 2rem = 444px (mobile)
```

### Vertical Rhythm
```
Sections:      4rem gap
Cards:         3rem gap
Form groups:   2.5rem gap
Elements:      1.5rem gap
```

---

## States & Feedback

### Hover States
```
Cards:    Lift shadow, change border color
Buttons:  Change background, transform
Inputs:   Change border color, background
Links:    Underline appears, color changes
```

### Focus States
```
All elements:  Outline ring (2px)
Outline color: var(--primary)
Outline offset: 2px
Example:       box-shadow + outline
```

### Active States
```
Buttons:   Press animation (translateY(0))
           Reduced shadow
Checkboxes: Filled appearance
Links:      Underline solid
```

### Disabled States
```
All:       opacity: 0.6
Inputs:    background: var(--bg-tertiary)
           cursor: not-allowed
Buttons:   cursor: not-allowed
           opacity: 0.6
```

### Error States
```
Background: var(--error-light) (#fee2e2)
Border:     var(--error) (#ef4444)
Text:       #991b1b (dark red)
Icon:       🚫 or ⚠️
```

### Success States
```
Background: var(--success-light) (#d1fae5)
Border:     var(--success) (#10b981)
Text:       #065f46 (dark green)
Icon:       ✅ or ✨
```

---

## Usage Examples

### Creating a New Component
```css
.new-component {
  /* Colors */
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  
  /* Spacing */
  padding: 2rem;
  margin-bottom: 2.5rem;
  border-radius: 12px;
  
  /* Shadows */
  box-shadow: var(--shadow-md);
  
  /* Transitions */
  transition: var(--transition);
}

.new-component:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}
```

### Creating a Button
```css
.btn {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.95rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}
```

---

## Best Practices

### Do's ✅
```
✅ Use CSS variables for all values
✅ Follow spacing scale consistently
✅ Apply shadows for depth
✅ Use smooth transitions
✅ Test on all breakpoints
✅ Maintain color contrast
✅ Use semantic colors
✅ Provide focus states
```

### Don'ts ❌
```
❌ Hardcode colors (use variables)
❌ Mix spacing scales
❌ Use heavy shadows everywhere
❌ Add too many animations
❌ Ignore mobile design
❌ Skip accessibility features
❌ Use inconsistent typography
❌ Forget focus states
```

---

## Quick Reference

### Most Used Values
```
Primary Color:      #6366f1
Background:         #ffffff / #f8fafc
Text Primary:       #0f172a
Card Padding:       3rem
Form Gap:           2.5rem
Button Padding:     1rem 1.5rem
Border Radius:      12px
Box Shadow:         var(--shadow-md)
Transition:         200ms
```

---

## Tools & Resources

### Figma (Design System)
- Color palette
- Component library
- Typography scale
- Spacing grid

### Code (Implementation)
- CSS variables
- Responsive queries
- Component styles
- Animation keyframes

### Testing
- Desktop: 1920px
- Tablet: 768px
- Mobile: 480px
- Accessibility: WCAG AA

---

**Design System v2.0**  
**Modern, Professional, Consistent**  
**Production Ready**

