# Aura Platform API Documentation

## Overview

The Aura Platform API is built using **tRPC** (TypeScript Remote Procedure Call) for end-to-end type safety. The API is organized into modules corresponding to the platform's main features.

## Base URL

```
Development: http://localhost:3000/api/trpc
Production: https://nobletechinc.com/api/trpc
```

## Authentication

All API endpoints require authentication via Clerk. The authentication middleware automatically validates tokens and provides user context.

```typescript
// Example: Protected procedure
const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
```

## ALI Module API

### Project Vital Signs

#### `getProjectVitals`

Get real-time project health metrics and trends.

**Input:**
```typescript
{
  projectId: string
}
```

**Output:**
```typescript
{
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

**Example:**
```typescript
const vitals = await trpc.ali.getProjectVitals.query({
  projectId: "507f1f77bcf86cd799439011"
})
```

#### `getProjectTimeline`

Get project timeline with deployments and incidents.

**Input:**
```typescript
{
  projectId: string
  startDate?: Date
  endDate?: Date
}
```

**Output:**
```typescript
{
  events: Array<{
    id: string
    type: 'DEPLOYMENT' | 'INCIDENT'
    title: string
    timestamp: Date
    impact: 'POSITIVE' | 'NEGATIVE' | 'WARNING'
  }>
  metrics: Array<{
    timestamp: Date
    type: string
    value: number
    unit: string
  }>
}
```

#### `setBudgetAlert`

Set budget alert threshold for a project.

**Input:**
```typescript
{
  projectId: string
  threshold: number
}
```

**Output:**
```typescript
{
  success: boolean
  message: string
}
```

#### `getTCOForecast`

Get Total Cost of Ownership forecast for a project.

**Input:**
```typescript
{
  projectId: string
  months: number // 1-24, default 12
}
```

**Output:**
```typescript
{
  projectId: string
  forecast: Array<{
    month: string // YYYY-MM format
    predicted: number
    confidence: number
    bestCase: number
    worstCase: number
  }>
  totalPredicted: number
  confidence: number
}
```

## AED Module API

### CEO Tasks

#### `getCEOTasks`

Get CEO's strategic tasks with AI prioritization.

**Input:**
```typescript
{
  userId: string
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}
```

**Output:**
```typescript
{
  tasks: Array<{
    id: string
    title: string
    description: string
    status: string
    priority: string
    dueDate: Date
    createdAt: Date
    updatedAt: Date
  }>
}
```

#### `createCEOTask`

Create a new CEO task.

**Input:**
```typescript
{
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  dueDate?: Date
}
```

**Output:**
```typescript
{
  id: string
  title: string
  description: string
  status: 'PENDING'
  priority: string
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}
```

### Communication Triage

#### `getCommunicationItems`

Get prioritized communication items.

**Input:**
```typescript
{
  userId: string
  limit?: number // default 10
  status?: 'UNREAD' | 'READ' | 'ACTED_UPON' | 'ARCHIVED'
}
```

**Output:**
```typescript
{
  items: Array<{
    id: string
    source: 'EMAIL' | 'SLACK' | 'CALENDAR'
    externalId: string
    subject: string
    content: string
    sender: string
    urgency: number // 1-10
    importance: number // 1-10
    status: string
    suggestedAction: string
    createdAt: Date
  }>
}
```

#### `updateCommunicationStatus`

Update the status of a communication item.

**Input:**
```typescript
{
  id: string
  status: 'READ' | 'ACTED_UPON' | 'ARCHIVED'
  action?: string
}
```

**Output:**
```typescript
{
  success: boolean
  message: string
}
```

### CEO Context

#### `getCEOContext`

Get CEO's current context (location, focus mode).

**Input:**
```typescript
{
  userId: string
}
```

**Output:**
```typescript
{
  id: string
  userId: string
  location: 'HOME' | 'OFFICE'
  focusMode: boolean
  lastActive: Date
  createdAt: Date
  updatedAt: Date
}
```

#### `updateCEOContext`

Update CEO's context.

**Input:**
```typescript
{
  userId: string
  location?: 'HOME' | 'OFFICE'
  focusMode?: boolean
}
```

**Output:**
```typescript
{
  success: boolean
  context: {
    id: string
    userId: string
    location: string
    focusMode: boolean
    lastActive: Date
  }
}
```

## Error Handling

### Standard Error Responses

```typescript
{
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `INTERNAL_ERROR`: Server error

### Example Error Response

```typescript
{
  error: {
    code: "NOT_FOUND",
    message: "Project not found",
    details: {
      projectId: "507f1f77bcf86cd799439011"
    }
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Heavy operations**: 10 requests per minute
- **Authentication**: 5 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Incoming Webhooks

External services can send data to the platform via webhooks:

#### Datadog Metrics Webhook
```
POST /api/webhooks/datadog
Content-Type: application/json

{
  "projectId": "507f1f77bcf86cd799439011",
  "metrics": [
    {
      "name": "uptime.percentage",
      "value": 99.8,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Jira Tickets Webhook
```
POST /api/webhooks/jira
Content-Type: application/json

{
  "projectId": "507f1f77bcf86cd799439011",
  "tickets": [
    {
      "id": "JIRA-123",
      "title": "Payment gateway timeout",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Outgoing Webhooks

The platform can send notifications to external services:

#### Slack Notifications
```typescript
{
  "channel": "#alerts",
  "text": "Project Phoenix: Budget threshold exceeded",
  "attachments": [
    {
      "color": "danger",
      "fields": [
        {
          "title": "Current Spend",
          "value": "$15,000",
          "short": true
        },
        {
          "title": "Threshold",
          "value": "$12,000",
          "short": true
        }
      ]
    }
  ]
}
```

## SDK and Client Libraries

### TypeScript/JavaScript

```typescript
import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from './lib/trpc/routers'

export const trpc = createTRPCReact<AppRouter>()

// Usage
const vitals = trpc.ali.getProjectVitals.useQuery({
  projectId: "507f1f77bcf86cd799439011"
})
```

### Python

```python
import requests

# Get project vitals
response = requests.get(
    "https://nobletechinc.com/api/trpc/ali.getProjectVitals",
    headers={
        "Authorization": "Bearer <token>",
        "Content-Type": "application/json"
    },
    json={
        "projectId": "507f1f77bcf86cd799439011"
    }
)

vitals = response.json()
```

## Testing

### Test Endpoints

Use the test endpoints for development and testing:

```bash
# Test ALI endpoints
curl -X POST http://localhost:3000/api/trpc/ali.getProjectVitals \
  -H "Content-Type: application/json" \
  -d '{"projectId": "507f1f77bcf86cd799439011"}'

# Test AED endpoints
curl -X POST http://localhost:3000/api/trpc/aed.getCEOTasks \
  -H "Content-Type: application/json" \
  -d '{"userId": "507f1f77bcf86cd799439019"}'
```

### Mock Data

The API includes comprehensive mock data for development:

- **Projects**: Sample e-commerce platform
- **Metrics**: Realistic uptime, error rates, costs
- **Tickets**: Various maintenance issues
- **CEO Tasks**: Strategic priorities
- **Communications**: Email and Slack messages

## Changelog

### v1.0.0 (Current)
- ✅ ALI project vital signs endpoint
- ✅ ALI project timeline endpoint
- ✅ ALI budget alert endpoint
- ✅ ALI TCO forecast endpoint
- ✅ AED CEO tasks endpoints
- ✅ AED communication triage endpoints
- ✅ AED CEO context endpoints
- ✅ Mock data system
- ✅ Error handling
- ✅ TypeScript types

### v1.1.0 (Planned)
- [ ] Authentication integration
- [ ] Real-time subscriptions
- [ ] Webhook endpoints
- [ ] Rate limiting
- [ ] Caching layer

### v1.2.0 (Planned)
- [ ] External API integrations
- [ ] Advanced analytics
- [ ] ML model endpoints
- [ ] File upload support
- [ ] Batch operations

---

For more information, see the [main documentation](../README.md).
