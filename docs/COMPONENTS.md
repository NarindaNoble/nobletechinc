# Aura Platform Component Documentation

## Overview

The Aura Platform uses a modular component architecture with the **AuraPunk** design system. Components are organized by module and functionality.

## Design System

### AuraPunk Theme

The design system combines Palantir's enterprise data visualization with NobleTech's cyberpunk aesthetic:

```css
/* Color Variables */
--aura-background: #0A0E27;        /* Deep navy-black */
--aura-surface: #1A1D2E;           /* Elevated cards */
--aura-accent-primary: #00E1F4;     /* Neon cyan */
--aura-accent-secondary: #7B61FF;   /* Electric purple */
--aura-accent-critical: #F5A623;     /* Amber alerts */
--aura-accent-success: #00FF9F;     /* Neon green */
--aura-accent-danger: #FF006E;       /* Neon magenta */
```

### Typography

- **Display Font**: Chakra Petch (headings, data labels)
- **Body Font**: JetBrains Mono (body text, code-like elements)

## Shared Components

### AuraNavigation

Floating navigation component for module switching.

```tsx
import AuraNavigation from '@/components/AuraNavigation'

// Usage
<AuraNavigation />
```

**Props:**
- None (uses `usePathname` for active state)

**Features:**
- Floating bottom navigation
- Active route highlighting
- Smooth animations with Framer Motion
- AuraPunk styling with neon glow effects

### AuraCard

Base card component with AuraPunk styling.

```tsx
import { AuraCard } from '@/components/aura/cards/AuraCard'

// Usage
<AuraCard className="p-6">
  <h3>Project Health</h3>
  <p>99.8% uptime</p>
</AuraCard>
```

**Props:**
```typescript
interface AuraCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'glass'
  glow?: boolean
}
```

**Variants:**
- `default`: Standard card with subtle border
- `elevated`: Raised card with shadow
- `glass`: Glassmorphism effect

### AuraButton

Interactive button with cyberpunk effects.

```tsx
import { AuraButton } from '@/components/aura/buttons/AuraButton'

// Usage
<AuraButton 
  variant="primary" 
  size="lg"
  onClick={handleClick}
>
  Deploy Project
</AuraButton>
```

**Props:**
```typescript
interface AuraButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}
```

### AuraMetric

KPI display component with trend indicators.

```tsx
import { AuraMetric } from '@/components/aura/metrics/AuraMetric'

// Usage
<AuraMetric
  label="Uptime"
  value="99.8%"
  trend="UP"
  change="+0.2%"
  status="HEALTHY"
/>
```

**Props:**
```typescript
interface AuraMetricProps {
  label: string
  value: string | number
  trend?: 'UP' | 'DOWN' | 'STABLE'
  change?: string
  status?: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  icon?: React.ReactNode
}
```

## ALI Components

### ProjectVitalSigns

Main dashboard component showing project health metrics.

```tsx
import { ProjectVitalSigns } from '@/components/ali/ProjectVitalSigns'

// Usage
<ProjectVitalSigns projectId="507f1f77bcf86cd799439011" />
```

**Features:**
- Real-time health scoring
- Trend indicators with color coding
- Interactive hover effects
- Responsive grid layout

**Data Structure:**
```typescript
interface ProjectVitals {
  projectId: string
  projectName: string
  uptime: number
  errorRate: number
  cloudSpend: number
  openTickets: number
  healthScore: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  trends: {
    uptime: 'UP' | 'DOWN' | 'STABLE'
    errorRate: 'UP' | 'DOWN' | 'STABLE'
    cloudSpend: 'UP' | 'DOWN' | 'STABLE'
  }
}
```

### LifecycleTimeline

Interactive timeline showing project events.

```tsx
import { LifecycleTimeline } from '@/components/ali/LifecycleTimeline'

// Usage
<LifecycleTimeline 
  projectId="507f1f77bcf86cd799439011"
  startDate={new Date('2024-01-01')}
  endDate={new Date()}
/>
```

**Features:**
- Deployment markers
- Incident indicators
- Metric correlation
- 3D event landscape (React Three Fiber)

### CostExplorer

Cloud spend breakdown with budget alerts.

```tsx
import { CostExplorer } from '@/components/ali/CostExplorer'

// Usage
<CostExplorer 
  projectId="507f1f77bcf86cd799439011"
  budget={50000}
  threshold={45000}
/>
```

**Features:**
- Stacked area chart
- Service-level breakdown
- Budget threshold indicators
- Glitch effects on overage

### TCOForecast

Total Cost of Ownership forecasting component.

```tsx
import { TCOForecast } from '@/components/ali/TCOForecast'

// Usage
<TCOForecast 
  projectId="507f1f77bcf86cd799439011"
  months={12}
  confidence={0.85}
/>
```

**Features:**
- Line chart with confidence intervals
- Best case/worst case scenarios
- ML-powered predictions
- Interactive time range selection

## AED Components

### ContextDetector

Location and mode detection for CEO context.

```tsx
import { ContextDetector } from '@/components/aed/ContextDetector'

// Usage
<ContextDetector 
  userId="507f1f77bcf86cd799439019"
  onContextChange={(context) => setContext(context)}
/>
```

**Features:**
- IP-based location detection
- Manual toggle (Home/Office)
- Focus mode activation
- Context persistence

### HomeBriefing

CEO dashboard for home mode.

```tsx
import { HomeBriefing } from '@/components/aed/HomeBriefing'

// Usage
<HomeBriefing 
  userId="507f1f77bcf86cd799439019"
  date={new Date()}
/>
```

**Features:**
- Virtual meeting links
- Focus block timer
- Top 3 priority tasks
- Deep work environment

### OfficeBriefing

CEO dashboard for office mode.

```tsx
import { OfficeBriefing } from '@/components/aed/OfficeBriefing'

// Usage
<OfficeBriefing 
  userId="507f1f77bcf86cd799439019"
  date={new Date()}
/>
```

**Features:**
- In-person meeting schedule
- Office presence widget
- Company KPI snapshot
- Leadership tools

### CommsTriage

AI-powered communication prioritization.

```tsx
import { CommsTriage } from '@/components/aed/CommsTriage'

// Usage
<CommsTriage 
  userId="507f1f77bcf86cd799439019"
  limit={10}
  sources={['EMAIL', 'SLACK']}
/>
```

**Features:**
- Smart inbox
- Urgency scoring (1-10)
- Suggested actions
- One-click responses

### FocusMode

Distraction-free work environment.

```tsx
import { FocusMode } from '@/components/aed/FocusMode'

// Usage
<FocusMode 
  userId="507f1f77bcf86cd799439019"
  duration={60}
  onComplete={(session) => handleSessionComplete(session)}
/>
```

**Features:**
- Full-screen mode
- Notification blocking
- Spotify integration
- Session tracking

## Chart Components

### AuraLineChart

Custom line chart with AuraPunk styling.

```tsx
import { AuraLineChart } from '@/components/aura/charts/AuraLineChart'

// Usage
<AuraLineChart
  data={chartData}
  xKey="timestamp"
  yKey="value"
  color="#00E1F4"
  showTrend={true}
/>
```

### AuraBarChart

Bar chart with neon glow effects.

```tsx
import { AuraBarChart } from '@/components/aura/charts/AuraBarChart'

// Usage
<AuraBarChart
  data={barData}
  xKey="category"
  yKey="value"
  colors={['#00E1F4', '#7B61FF', '#F5A623']}
/>
```

### AuraRadarChart

Radar chart for multi-dimensional metrics.

```tsx
import { AuraRadarChart } from '@/components/aura/charts/AuraRadarChart'

// Usage
<AuraRadarChart
  data={radarData}
  dimensions={['Uptime', 'Performance', 'Security', 'Cost']}
  maxValue={100}
/>
```

## Animation Components

### GlitchText

Animated text with glitch effects for data anomalies.

```tsx
import { GlitchText } from '@/components/aura/animations/GlitchText'

// Usage
<GlitchText 
  text="CRITICAL ALERT"
  variant="danger"
  animate={isAnomaly}
/>
```

### NeonGlow

Neon glow effect for interactive elements.

```tsx
import { NeonGlow } from '@/components/aura/animations/NeonGlow'

// Usage
<NeonGlow 
  color="#00E1F4"
  intensity={0.8}
  pulse={true}
>
  <button>Interactive Element</button>
</NeonGlow>
```

### TechGrid

Animated tech grid background.

```tsx
import { TechGrid } from '@/components/aura/animations/TechGrid'

// Usage
<TechGrid 
  density="medium"
  speed="slow"
  opacity={0.1}
/>
```

## Layout Components

### AuraLayout

Base layout with AuraPunk styling.

```tsx
import { AuraLayout } from '@/components/aura/layout/AuraLayout'

// Usage
<AuraLayout 
  title="ALI Dashboard"
  breadcrumbs={breadcrumbs}
  actions={actions}
>
  {children}
</AuraLayout>
```

### AuraSidebar

Navigation sidebar with module switching.

```tsx
import { AuraSidebar } from '@/components/aura/layout/AuraSidebar'

// Usage
<AuraSidebar 
  modules={modules}
  activeModule="ali"
  onModuleChange={setActiveModule}
/>
```

### AuraHeader

Page header with context information.

```tsx
import { AuraHeader } from '@/components/aura/layout/AuraHeader'

// Usage
<AuraHeader 
  title="Project Phoenix"
  subtitle="E-Commerce Platform"
  status="HEALTHY"
  lastUpdated={new Date()}
/>
```

## Form Components

### AuraInput

Styled input with validation.

```tsx
import { AuraInput } from '@/components/aura/forms/AuraInput'

// Usage
<AuraInput
  label="Project Name"
  value={projectName}
  onChange={setProjectName}
  error={errors.projectName}
  required
/>
```

### AuraSelect

Dropdown with AuraPunk styling.

```tsx
import { AuraSelect } from '@/components/aura/forms/AuraSelect'

// Usage
<AuraSelect
  label="Priority"
  value={priority}
  onChange={setPriority}
  options={[
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'CRITICAL', label: 'Critical' }
  ]}
/>
```

### AuraTextarea

Multi-line text input.

```tsx
import { AuraTextarea } from '@/components/aura/forms/AuraTextarea'

// Usage
<AuraTextarea
  label="Description"
  value={description}
  onChange={setDescription}
  rows={4}
  maxLength={500}
/>
```

## Utility Components

### AuraLoading

Loading spinner with AuraPunk styling.

```tsx
import { AuraLoading } from '@/components/aura/utils/AuraLoading'

// Usage
<AuraLoading 
  size="lg"
  text="Loading project data..."
/>
```

### AuraEmpty

Empty state component.

```tsx
import { AuraEmpty } from '@/components/aura/utils/AuraEmpty'

// Usage
<AuraEmpty 
  icon={<ProjectIcon />}
  title="No Projects Found"
  description="Create your first project to get started"
  action={<AuraButton>Create Project</AuraButton>}
/>
```

### AuraError

Error state component.

```tsx
import { AuraError } from '@/components/aura/utils/AuraError'

// Usage
<AuraError 
  title="Failed to Load Data"
  description="Unable to fetch project metrics"
  onRetry={handleRetry}
/>
```

## Component Guidelines

### Naming Convention

- **PascalCase**: Component names (e.g., `ProjectVitalSigns`)
- **camelCase**: Props and variables
- **kebab-case**: CSS classes and file names

### Props Interface

```typescript
interface ComponentProps {
  // Required props first
  id: string
  title: string
  
  // Optional props with defaults
  variant?: 'default' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  
  // Event handlers
  onClick?: () => void
  onChange?: (value: string) => void
  
  // Children
  children?: React.ReactNode
}
```

### Styling Guidelines

- Use Tailwind CSS classes for layout and spacing
- Use CSS custom properties for AuraPunk colors
- Apply neon glow effects sparingly for emphasis
- Maintain consistent spacing using Tailwind's scale

### Accessibility

- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Provide focus indicators

---

For more information, see the [main documentation](../README.md) and [API documentation](./API.md).
