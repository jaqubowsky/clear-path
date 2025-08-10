# ClearPath Design System Specification
*Comprehensive UX/UI Design System for AI-Powered Personalized Learning Platform*

---

## Design Philosophy

ClearPath's design system embodies **bold simplicity with intuitive navigation**, creating frictionless experiences that prioritize user needs over decorative elements. Our approach balances:

- **Progressive Learning Focus**: Every interface element supports the user's learning journey
- **Cognitive Load Management**: Strategic information architecture reduces mental overhead
- **Accessibility-First**: Universal design principles ensure inclusive experiences
- **Trust Through Clarity**: Transparent AI interactions build user confidence
- **Motivational Design**: Visual feedback systems encourage continued engagement

## Core Design Principles

### 1. **Clarity Over Complexity**
- Information hierarchy guides attention to primary tasks
- Progressive disclosure reveals complexity gradually
- Clear visual language communicates system status and next steps

### 2. **Consistency Breeds Confidence**
- Systematic design tokens ensure predictable interactions
- Pattern reusability reduces learning curve
- Cohesive visual language across all touchpoints

### 3. **Accessibility Enables Everyone**
- WCAG AA compliance minimum, AAA where feasible
- Keyboard navigation and screen reader optimization
- Color-independent information communication

### 4. **Performance Empowers Users**
- Optimized loading states maintain engagement
- Responsive design works seamlessly across devices
- Progressive enhancement ensures universal access

---

## Color System

### Brand Colors
Our color palette reflects learning progression, growth, and achievement while maintaining professional credibility.

#### Primary Palette
- **Primary**: `oklch(0.488 0.243 264.376)` (#4F46E5) – Indigo for primary actions, progress indicators
- **Primary Light**: `oklch(0.627 0.152 264.376)` (#6366F1) – Hover states, secondary emphasis
- **Primary Dark**: `oklch(0.398 0.283 264.376)` (#4338CA) – Active states, strong emphasis

#### Secondary Palette  
- **Success**: `oklch(0.646 0.222 41.116)` (#10B981) – Completed modules, achievements
- **Success Light**: `oklch(0.769 0.188 70.08)` (#34D399) – Success backgrounds, highlights
- **Warning**: `oklch(0.828 0.189 84.429)` (#F59E0B) – Attention items, caution states
- **Error**: `oklch(0.577 0.245 27.325)` (#EF4444) – Errors, destructive actions

#### Semantic Colors
- **Info**: `oklch(0.6 0.118 184.704)` (#3B82F6) – Information, tips, AI suggestions
- **Learning**: `oklch(0.696 0.17 162.48)` (#06B6D4) – Learning resources, progress tracking
- **Focus**: `oklch(0.645 0.246 16.439)` (#F97316) – Active learning, current focus areas

#### Neutral Palette (Extended Grayscale)
- **Neutral-50**: `oklch(0.985 0 0)` (#FAFAFA) – Page backgrounds
- **Neutral-100**: `oklch(0.97 0 0)` (#F5F5F5) – Card backgrounds
- **Neutral-200**: `oklch(0.922 0 0)` (#E5E5E5) – Borders, dividers
- **Neutral-300**: `oklch(0.858 0 0)` (#D4D4D4) – Input borders
- **Neutral-400**: `oklch(0.708 0 0)` (#A3A3A3) – Placeholders
- **Neutral-500**: `oklch(0.556 0 0)` (#737373) – Secondary text
- **Neutral-600**: `oklch(0.439 0 0)` (#525252) – Label text
- **Neutral-700**: `oklch(0.342 0 0)` (#404040) – Body text
- **Neutral-800**: `oklch(0.269 0 0)` (#262626) – Headings
- **Neutral-900**: `oklch(0.205 0 0)` (#171717) – High emphasis text
- **Neutral-950**: `oklch(0.145 0 0)` (#0A0A0A) – Maximum contrast

#### Dark Mode Adaptations
- **Background**: `oklch(0.145 0 0)` – Deep neutral for reduced eye strain
- **Surface**: `oklch(0.205 0 0)` – Card and component backgrounds
- **Surface Variant**: `oklch(0.269 0 0)` – Elevated surfaces
- **Primary Dark**: `oklch(0.627 0.152 264.376)` – Adjusted for dark contrast
- **Text Primary**: `oklch(0.985 0 0)` – High contrast text
- **Text Secondary**: `oklch(0.708 0 0)` – Reduced emphasis text

### Accessibility Compliance
All color combinations meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **Critical interactions**: 7:1 contrast ratio for enhanced accessibility
- **Color-blind testing**: Verified across Protanopia, Deuteranopia, and Tritanopia

---

## Typography System

### Font Stack
**Primary Typeface**: Inter (Web)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Monospace Typeface**: JetBrains Mono (Code/Technical)
```css
font-family: 'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', monospace;
```

### Font Weights
- **Light**: 300 – Subtle headings, decorative text
- **Regular**: 400 – Body text, standard UI elements
- **Medium**: 500 – Emphasized body text, subheadings
- **Semibold**: 600 – Headings, important labels
- **Bold**: 700 – Major headings, strong emphasis

### Type Scale & Hierarchy

#### Display Typography
- **Display Large**: `clamp(3.5rem, 5vw, 5rem)/1.1, 700` – Hero sections, landing page titles
- **Display Medium**: `clamp(2.75rem, 4vw, 4rem)/1.1, 700` – Section headers, feature titles
- **Display Small**: `clamp(2.25rem, 3vw, 3rem)/1.2, 600` – Page titles, major sections

#### Heading Typography  
- **H1**: `clamp(2rem, 2.5vw, 2.5rem)/1.2, 600` – Page titles, primary headings
- **H2**: `clamp(1.75rem, 2vw, 2rem)/1.3, 600` – Section headings, card titles
- **H3**: `clamp(1.5rem, 1.5vw, 1.625rem)/1.3, 600` – Subsection headings
- **H4**: `clamp(1.25rem, 1.25vw, 1.375rem)/1.4, 500` – Component headings
- **H5**: `1.125rem/1.4, 500` – Small headings, labels
- **H6**: `1rem/1.4, 500` – Micro headings, tags

#### Body Typography
- **Body Large**: `1.125rem/1.6, 400` – Article body, important content
- **Body**: `1rem/1.6, 400` – Standard UI text, form inputs
- **Body Small**: `0.875rem/1.5, 400` – Secondary information, captions
- **Caption**: `0.75rem/1.4, 400` – Timestamps, metadata, micro content

#### UI Typography
- **Label Large**: `0.875rem/1.2, 500, uppercase` – Form labels, section labels
- **Label**: `0.75rem/1.2, 500, uppercase` – Input labels, tags
- **Button Large**: `1rem/1, 500` – Primary buttons, calls-to-action
- **Button**: `0.875rem/1, 500` – Standard buttons
- **Button Small**: `0.75rem/1, 500` – Compact buttons, chips

### Responsive Typography Scaling
- **Mobile** (320-767px): Base scale with 10% reduction for readability
- **Tablet** (768-1023px): Standard scale with optimized line lengths
- **Desktop** (1024-1439px): Full scale with maximum readability
- **Wide** (1440px+): Enhanced scale with increased white space

### Reading Optimization
- **Optimal line length**: 45-75 characters for body text
- **Line height**: 1.6 for body text, 1.2-1.4 for headings
- **Paragraph spacing**: 1.5rem between paragraphs
- **Letter spacing**: -0.02em for large text, 0 for body text

---

## Spacing & Layout System

### Base Unit System
**Foundation**: 4px base unit for mathematical consistency
**Scaling Factor**: Powers of 2 and Fibonacci-inspired ratios

### Spacing Scale
- **XS**: `4px` – Micro spacing, icon padding
- **SM**: `8px` – Small spacing, compact layouts
- **MD**: `16px` – Standard spacing, component padding
- **LG**: `24px` – Medium spacing, section separation
- **XL**: `32px` – Large spacing, major sections
- **2XL**: `48px` – Extra large spacing, page sections
- **3XL**: `64px` – Huge spacing, hero sections
- **4XL**: `96px` – Massive spacing, full-page sections

### Grid System
**Responsive Grid Framework**
- **Columns**: 12 (desktop), 8 (tablet), 4 (mobile)
- **Column Width**: Fluid with minimum content width constraints
- **Gutters**: 24px (desktop), 20px (tablet), 16px (mobile)
- **Margins**: 5% (mobile), 8% (tablet), 10% (desktop)

### Container Specifications
- **Small**: `640px` max-width – Content-focused pages
- **Medium**: `768px` max-width – Article layouts
- **Large**: `1024px` max-width – Application layouts  
- **Extra Large**: `1280px` max-width – Wide dashboards
- **Full**: `1536px` max-width – Maximum application width

### Breakpoint Strategy
- **Mobile**: `320px - 767px` – Single column, stacked layout
- **Tablet**: `768px - 1023px` – Mixed layout, sidebar options
- **Desktop**: `1024px - 1439px` – Multi-column, full features
- **Wide**: `1440px+` – Enhanced layouts, expanded sidebars

---

## Component System Architecture

### Component Hierarchy
Components are organized into four tiers:

#### Tier 1: Foundational Elements
- **Button**: All button variants and states
- **Input**: Text inputs, textareas, selects
- **Icon**: Consistent iconography system
- **Typography**: Text styling components

#### Tier 2: Interface Components  
- **Card**: Content containers and information cards
- **Modal**: Dialogs, overlays, confirmations
- **Navigation**: Menus, breadcrumbs, pagination
- **Form**: Complete form layouts and validation

#### Tier 3: Feature Components
- **Progress Tracking**: Learning progress indicators
- **Plan Visualization**: Learning plan displays
- **Resource Cards**: Content recommendation layouts
- **Onboarding**: Guided setup flows

#### Tier 4: Page Templates
- **Dashboard**: Main application layout
- **Onboarding**: User setup templates  
- **Learning Plan**: Plan management templates
- **Profile**: User profile templates

---

## Core Component Specifications

### Button Component System

#### Variants & Visual Design
**Primary Button**
- **Background**: `bg-primary` with `hover:bg-primary-dark`
- **Text**: `text-primary-foreground`, weight `font-medium`
- **Border Radius**: `rounded-lg` (10px)
- **Shadow**: `shadow-sm` with `hover:shadow-md` elevation
- **Padding**: `px-4 py-2.5` (medium), `px-3 py-2` (small), `px-6 py-3` (large)

**Secondary Button**
- **Background**: `bg-secondary` with `hover:bg-secondary/80`
- **Text**: `text-secondary-foreground`
- **Border**: `border border-border`
- **Interaction**: `hover:border-neutral-300` transition

**Ghost Button**
- **Background**: `transparent` with `hover:bg-accent`
- **Text**: `text-accent-foreground`
- **Border**: None
- **Padding**: Same as primary but with `hover:bg-accent/10`

**Destructive Button**
- **Background**: `bg-destructive` with `hover:bg-destructive/80`
- **Text**: `text-destructive-foreground`
- **Shadow**: `shadow-sm` with danger indication

#### State Specifications
**Default State**
- All visual properties as defined above
- `cursor-pointer` with smooth `transition-all duration-200`

**Hover State**
- Background color shifts as specified per variant
- `transform: translateY(-1px)` subtle lift effect
- Shadow elevation increases appropriately

**Active State**
- `transform: translateY(0px)` pressed effect
- Background slightly darker than hover
- `ring-2 ring-primary/20` for accessibility

**Focus State**
- `ring-2 ring-primary ring-offset-2` focus indicator
- No background change, maintains accessibility
- `outline: transparent` to rely on ring indicator

**Disabled State**
- `opacity-50 cursor-not-allowed pointer-events-none`
- `bg-muted text-muted-foreground` regardless of variant
- No hover or interaction effects

**Loading State**
- Spinner icon with `animate-spin` class
- Text hidden or replaced with "Loading..."
- `cursor-wait pointer-events-none` interaction prevention

### Input Component System

#### Text Input Specifications
**Visual Design**
- **Background**: `bg-input` with `border border-input`
- **Text**: `text-foreground` with `placeholder:text-muted-foreground`
- **Border Radius**: `rounded-md` (6px)
- **Padding**: `px-3 py-2` for optimal touch targets
- **Height**: `h-10` (40px) for accessibility compliance

**State Management**
- **Default**: Standard border and background
- **Focus**: `ring-2 ring-ring ring-offset-2 border-ring`
- **Error**: `border-destructive ring-destructive` with error message
- **Success**: `border-success ring-success/30` with success indicator
- **Disabled**: `opacity-50 cursor-not-allowed bg-muted`

#### Form Validation Integration
**Error Display**
- Error message in `text-sm text-destructive` below input
- Icon indicator using Lucide alert icons
- `aria-describedby` linking to error message

**Success Feedback**  
- Subtle success indicator without overwhelming user
- Check icon in `text-success` color
- Success message when appropriate

### Card Component System

#### Layout Specifications
**Base Card Structure**
- **Background**: `bg-card` with `border border-border`
- **Border Radius**: `rounded-xl` (12px) for modern feel
- **Shadow**: `shadow-sm` with `hover:shadow-md` interaction
- **Padding**: `p-6` for comfortable content spacing

**Content Hierarchy**
- **Card Header**: `pb-4 mb-4 border-b border-border`
- **Card Title**: `text-xl font-semibold text-card-foreground`
- **Card Description**: `text-sm text-muted-foreground mt-1`
- **Card Content**: Standard spacing with optimal typography
- **Card Footer**: `pt-4 mt-4 border-t border-border`

#### Variant Specifications
**Elevated Card**
- Enhanced shadow: `shadow-lg hover:shadow-xl`
- Subtle border: `border border-border/50`
- Background lift: `bg-card/95 backdrop-blur-sm`

**Outlined Card**
- Strong border: `border-2 border-border`
- No shadow initially: `shadow-none hover:shadow-sm`
- Clean background: `bg-background`

**Interactive Card**
- Cursor indicator: `cursor-pointer`
- Hover lift: `hover:-translate-y-1 transition-transform`
- Active feedback: `active:translate-y-0`

---

## Motion & Animation System

### Animation Principles
1. **Purpose-Driven**: Every animation serves a functional purpose
2. **Performance-First**: 60fps minimum, hardware acceleration where possible  
3. **Respectful**: Honors `prefers-reduced-motion` user preferences
4. **Consistent**: Similar actions use similar timing and easing

### Timing Functions
**Ease-Out Curve**: `cubic-bezier(0.0, 0, 0.2, 1)`
- Usage: Element entrances, expanding content, showing information
- Feel: Quick start, gentle finish for natural appearance

**Ease-In-Out Curve**: `cubic-bezier(0.4, 0, 0.6, 1)`  
- Usage: Element movements, transitions between states
- Feel: Smooth acceleration and deceleration for polished interactions

**Spring Function**: Custom spring physics for playful interactions
- Usage: Button presses, modal appearances, success celebrations
- Configuration: `tension: 300, friction: 30` for balanced feel

### Duration Scale
**Micro Animations**: `100-150ms`
- State changes: button hover, input focus, icon color shifts
- Feedback: form validation, toggle switches, checkbox states

**Short Animations**: `200-300ms`
- Local transitions: dropdown appearance, tooltip display, card hover
- Navigation: tab switching, accordion expansion, drawer slides

**Medium Animations**: `400-500ms`
- Page transitions: route changes, modal entrance/exit
- Content changes: loading state transitions, content swaps

**Long Animations**: `600-800ms`
- Complex transitions: onboarding flow steps, plan generation reveals
- Celebration: achievement unlocks, completion animations

### Animation Patterns

#### Loading States
**Skeleton Loading**
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.skeleton { animation: skeleton-pulse 2s ease-in-out infinite; }
```

**Spinner Animation**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.loading-spinner { animation: spin 1s linear infinite; }
```

#### Transition Patterns
**Fade Transitions**
- Enter: `opacity-0 → opacity-100` over 200ms
- Exit: `opacity-100 → opacity-0` over 150ms
- Usage: Modal overlays, tooltip appearance, alert messages

**Slide Transitions**
- Enter: `translate-x-full → translate-x-0` over 300ms
- Exit: `translate-x-0 → -translate-x-full` over 250ms  
- Usage: Sidebar navigation, mobile menus, notification slides

**Scale Transitions**
- Enter: `scale-95 opacity-0 → scale-100 opacity-100` over 200ms
- Exit: `scale-100 opacity-100 → scale-95 opacity-0` over 150ms
- Usage: Modal dialogs, dropdown menus, popover content

---

## Accessibility Standards & Implementation

### WCAG 2.1 AA Compliance Framework

#### Color & Contrast Requirements
**Minimum Contrast Ratios**
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt): 3.1 contrast ratio
- UI components: 3:1 contrast ratio for boundaries
- Focus indicators: 3:1 contrast ratio against adjacent colors

**Enhanced Accessibility (AAA where feasible)**
- Normal text: 7:1 contrast ratio for critical interfaces
- Large text: 4.5:1 contrast ratio for improved readability
- Color-independent communication: Icons, patterns, or text accompany color coding

#### Keyboard Navigation Standards
**Focus Management**
- Visible focus indicators on all interactive elements
- Focus trap within modals and dropdown menus
- Skip links for main content navigation
- Logical tab order following visual hierarchy

**Keyboard Shortcuts**
- `Tab` / `Shift + Tab`: Navigate forward/backward through interactive elements
- `Enter` / `Space`: Activate buttons and form controls
- `Escape`: Close modals, dropdowns, and overlays
- `Arrow keys`: Navigate within component groups (tabs, menus, lists)

#### Screen Reader Optimization
**Semantic HTML Structure**
```html
<!-- Proper heading hierarchy -->
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

<!-- Meaningful link text -->
<a href="/learning-plan">View your personalized learning plan</a>
<!-- NOT: <a href="/learning-plan">Click here</a> -->

<!-- Form associations -->
<label for="learning-goal">What would you like to learn?</label>
<input id="learning-goal" type="text" aria-describedby="goal-help" />
<p id="goal-help">Be specific about your learning objectives</p>
```

**ARIA Implementation Standards**
```html
<!-- Dynamic content updates -->
<div aria-live="polite" id="status">Plan generation in progress...</div>

<!-- Interactive components -->
<button 
  aria-expanded="false" 
  aria-controls="plan-details"
  aria-describedby="plan-summary"
>
  Learning Plan Overview
</button>

<!-- Complex widgets -->
<div 
  role="progressbar" 
  aria-valuenow="65" 
  aria-valuemin="0" 
  aria-valuemax="100"
  aria-label="Learning progress: 65% complete"
>
  <div style="width: 65%"></div>
</div>
```

#### Motor Accessibility
**Touch Target Requirements**
- Minimum size: 44×44px for all interactive elements
- Adequate spacing: 8px minimum between adjacent targets
- Error tolerance: Generous click/tap areas for precise interaction

**Alternative Input Methods**
- Voice control compatibility through proper labeling
- Switch navigation support via keyboard accessibility
- Eye-tracking support through focus management

---

## Responsive Design Strategy

### Mobile-First Approach
Design and develop starting with the most constrained viewport, progressively enhancing for larger screens.

#### Mobile Design Patterns (320-767px)
**Layout Constraints**
- Single column layout with full-width components
- Collapsible navigation with hamburger menu
- Touch-friendly interaction areas (minimum 44px)
- Simplified forms with stacked labels

**Content Prioritization**
- Essential actions prominently featured
- Progressive disclosure for secondary features
- Condensed information architecture
- Thumb-friendly navigation placement

**Performance Optimization**
- Optimized images with responsive srcsets
- Reduced animation complexity
- Critical path CSS prioritization
- Lazy loading for below-fold content

#### Tablet Design Adaptations (768-1023px)
**Hybrid Layout Patterns**
- Adaptive sidebar that can collapse or remain visible
- Two-column layouts where content permits
- Tab navigation for complex feature sets
- Mixed touch/mouse interaction patterns

**Content Strategy**
- Expanded information without overwhelming
- Contextual sidebars for supplementary content
- Improved data tables with horizontal scroll
- Enhanced form layouts with inline validation

#### Desktop Optimization (1024px+)
**Full-Feature Experience**
- Multi-column layouts with efficient space usage
- Hover states and micro-interactions
- Keyboard shortcuts and power user features
- Comprehensive data visualization

**Advanced Interactions**
- Drag-and-drop functionality where appropriate
- Right-click context menus for power users
- Tooltips with detailed information
- Multi-window/tab workflow support

### Breakpoint Implementation Strategy
```css
/* Mobile-first media queries */
/* Base styles: Mobile 320px+ */

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */  
}

@media (min-width: 1440px) {
  /* Wide desktop enhancements */
}

/* Accessibility-friendly reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Platform-Specific Considerations

### Web Application Focus
ClearPath is designed as a web-first application with progressive web app capabilities.

#### Progressive Web App Features
**Offline Capability**
- Service worker for essential functionality
- Local storage for plan data and progress
- Graceful degradation when connectivity is limited
- Sync queuing for when connection returns

**Native-like Experience**
- App shell architecture for instant loading
- Full-screen mode capability
- Home screen installation prompts
- Push notifications for learning reminders (future)

#### Browser Compatibility Strategy
**Modern Browser Support**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- ES2020+ feature usage with appropriate polyfills
- CSS Grid and Flexbox for layout systems
- Progressive enhancement for advanced features

**Graceful Degradation**
- Core functionality works without JavaScript
- CSS fallbacks for advanced features
- Alternative content for unsupported browsers
- Clear messaging about browser requirements

---

## Implementation Guidelines for Development Team

### Tailwind CSS Integration Strategy

#### Design Token Mapping
Map design system tokens to Tailwind CSS custom properties:

```css
/* In packages/ui/src/styles/globals.css */
:root {
  /* Primary colors aligned with design system */
  --color-primary: oklch(0.488 0.243 264.376);
  --color-primary-light: oklch(0.627 0.152 264.376);
  --color-primary-dark: oklch(0.398 0.283 264.376);
  
  /* Success/Progress colors */
  --color-success: oklch(0.646 0.222 41.116);
  --color-learning: oklch(0.696 0.17 162.48);
  --color-focus: oklch(0.645 0.246 16.439);
  
  /* Spacing system */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;
  
  /* Typography scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

#### Component Implementation Pattern
```typescript
// Example: Button component implementation
// File: packages/ui/src/components/button.tsx

import { cn } from "@repo/ui/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border hover:border-neutral-300",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
      size: {
        small: "h-9 px-3 text-xs",
        medium: "h-10 px-4 py-2.5",
        large: "h-11 px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Feature-Specific Implementation Notes

#### Onboarding System Implementation
**Multi-step Form Pattern**
```typescript
// Progressive disclosure with clear visual hierarchy
const OnboardingStep = ({ 
  title, 
  description, 
  children, 
  currentStep, 
  totalSteps 
}: OnboardingStepProps) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Step content */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
```

#### Learning Plan Display Pattern
```typescript
// Hierarchical content with progressive disclosure
const LearningPlanModule = ({ 
  module, 
  isExpanded, 
  onToggle, 
  completionStatus 
}: ModuleProps) => {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      completionStatus === 'completed' && "border-success/50 bg-success/5",
      completionStatus === 'in-progress' && "border-primary/50 bg-primary/5"
    )}>
      <CardHeader 
        className="cursor-pointer" 
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Completion indicator */}
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              completionStatus === 'completed' && "bg-success text-white",
              completionStatus === 'in-progress' && "bg-primary text-white",
              completionStatus === 'pending' && "bg-secondary text-muted-foreground"
            )}>
              {completionStatus === 'completed' ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">
                  {module.order}
                </span>
              )}
            </div>
            
            <div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                <span>{module.estimatedHours}h</span>
                <span>•</span>
                <span className="capitalize">{module.difficulty}</span>
              </CardDescription>
            </div>
          </div>
          
          <ChevronDown 
            className={cn(
              "w-5 h-5 transition-transform",
              isExpanded && "transform rotate-180"
            )}
          />
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{module.description}</p>
            
            {/* Resources */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground">Resources</h4>
              <div className="space-y-2">
                {module.resources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
```

This comprehensive design system specification provides the foundation for creating a cohesive, accessible, and user-centered learning platform. The system balances visual appeal with functional clarity, ensuring that users can focus on their learning journey while feeling confident and motivated throughout their experience.