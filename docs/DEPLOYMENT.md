# Aura Platform Deployment Guide

## Overview

This guide covers deploying the Aura Platform to production using Vercel, MongoDB Atlas, and various external services.

## Prerequisites

- Node.js 18+ installed locally
- GitHub account with repository access
- Vercel account
- MongoDB Atlas account
- Clerk account (for authentication)
- External service accounts (AWS, Datadog, etc.)

## Environment Setup

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/aura_platform?retryWrites=true&w=majority"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# External APIs
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"

DATADOG_API_KEY="..."
DATADOG_APPLICATION_KEY="..."

MICROSOFT_GRAPH_CLIENT_ID="..."
MICROSOFT_GRAPH_CLIENT_SECRET="..."

SLACK_BOT_TOKEN="xoxb-..."
SLACK_SIGNING_SECRET="..."

# AI/ML
OPENAI_API_KEY="sk-..."

# Monitoring
SENTRY_DSN="https://..."
POSTHOG_KEY="phc_..."
POSTHOG_HOST="https://app.posthog.com"

# Security
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://nobletechinc.com"

# Feature Flags
NEXT_PUBLIC_ENABLE_ALI="true"
NEXT_PUBLIC_ENABLE_AED="true"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
```

## Database Setup

### MongoDB Atlas

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (M0 free tier for development)
   - Choose your preferred region

2. **Configure Security**
   - Create a database user with read/write permissions
   - Whitelist your IP addresses (0.0.0.0/0 for Vercel)
   - Enable network access

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/aura_platform?retryWrites=true&w=majority
   ```

4. **Run Migrations**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed with sample data (optional)
   npm run db:seed
   ```

## Authentication Setup

### Clerk Configuration

1. **Create Application**
   - Sign up at [Clerk](https://clerk.com)
   - Create a new application
   - Choose "Next.js" as the framework

2. **Configure Organizations**
   - Enable organization support
   - Set up roles: `org:admin`, `org:member`, `ceo`
   - Configure domain settings

3. **Environment Variables**
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
   CLERK_SECRET_KEY="sk_live_..."
   ```

4. **Middleware Setup**
   ```typescript
   // middleware.ts
   import { authMiddleware } from "@clerk/nextjs";
   
   export default authMiddleware({
     publicRoutes: ["/", "/api/webhooks/(.*)"],
     ignoredRoutes: ["/api/trpc/(.*)"],
   });
   
   export const config = {
     matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
   };
   ```

## Vercel Deployment

### 1. Connect Repository

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Connect your GitHub repository
   - Select the repository: `narindanoble/nobletechinc`

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`

### 2. Environment Variables

Add all required environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable from your `.env.production` file
3. Set environment to "Production"
4. Click "Save"

### 3. Domain Configuration

1. **Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain: `nobletechinc.com`
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Ensure HTTPS is enforced

### 4. Deploy

```bash
# Deploy to production
git push origin main

# Or deploy from local
vercel --prod
```

## External Service Integration

### AWS Cost Explorer

1. **Create IAM User**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ce:GetCostAndUsage",
           "ce:GetDimensionValues",
           "ce:GetReservationCoverage",
           "ce:GetReservationPurchaseRecommendation",
           "ce:GetReservationUtilization",
           "ce:GetUsageReport"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Configure Credentials**
   ```bash
   AWS_ACCESS_KEY_ID="AKIA..."
   AWS_SECRET_ACCESS_KEY="..."
   AWS_REGION="us-east-1"
   ```

### Datadog APM

1. **Create API Key**
   - Go to Datadog → Organization Settings → API Keys
   - Create new API key
   - Note the Application Key

2. **Configure Integration**
   ```bash
   DATADOG_API_KEY="..."
   DATADOG_APPLICATION_KEY="..."
   ```

### Microsoft Graph API

1. **Register Application**
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to Azure Active Directory → App registrations
   - Create new registration

2. **Configure Permissions**
   - Microsoft Graph API permissions:
     - `Mail.Read`
     - `Calendars.Read`
     - `User.Read`

3. **Get Credentials**
   ```bash
   MICROSOFT_GRAPH_CLIENT_ID="..."
   MICROSOFT_GRAPH_CLIENT_SECRET="..."
   ```

### Slack Integration

1. **Create Slack App**
   - Go to [api.slack.com](https://api.slack.com/apps)
   - Create new app
   - Configure OAuth scopes: `channels:read`, `chat:read`, `users:read`

2. **Install App**
   - Install to workspace
   - Get Bot User OAuth Token

3. **Configure**
   ```bash
   SLACK_BOT_TOKEN="xoxb-..."
   SLACK_SIGNING_SECRET="..."
   ```

## Monitoring and Analytics

### Sentry Error Tracking

1. **Create Project**
   - Sign up at [Sentry](https://sentry.io)
   - Create new project for Next.js
   - Get DSN

2. **Configure**
   ```bash
   SENTRY_DSN="https://..."
   ```

3. **Install SDK**
   ```bash
   npm install @sentry/nextjs
   ```

### PostHog Analytics

1. **Create Project**
   - Sign up at [PostHog](https://posthog.com)
   - Create new project
   - Get API key

2. **Configure**
   ```bash
   POSTHOG_KEY="phc_..."
   POSTHOG_HOST="https://app.posthog.com"
   ```

## Security Configuration

### HTTPS Enforcement

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

### Content Security Policy

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://api.datadoghq.com;"
          }
        ]
      }
    ]
  }
}
```

## Performance Optimization

### Edge Caching

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/trpc/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300'
          }
        ]
      }
    ]
  }
}
```

### Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif']
  }
}
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: Run tests
        run: npm run test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Health Checks

### API Health Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check external services
    const services = await Promise.allSettled([
      checkAWSConnection(),
      checkDatadogConnection(),
      checkSlackConnection()
    ])
    
    const healthy = services.every(result => result.status === 'fulfilled')
    
    return NextResponse.json({
      status: healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        aws: services[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        datadog: services[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        slack: services[2].status === 'fulfilled' ? 'healthy' : 'unhealthy'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 })
  }
}
```

## Backup Strategy

### Database Backups

1. **MongoDB Atlas**
   - Enable continuous backups
   - Set retention period (30 days)
   - Configure point-in-time recovery

2. **Automated Backups**
   ```bash
   # Daily backup script
   mongodump --uri="mongodb+srv://..." --out=./backups/$(date +%Y%m%d)
   ```

### Code Backups

- GitHub provides automatic backups
- Enable branch protection rules
- Require pull request reviews

## Rollback Strategy

### Database Rollback

```bash
# Restore from backup
mongorestore --uri="mongodb+srv://..." ./backups/20240115
```

### Application Rollback

```bash
# Rollback to previous version
vercel rollback <deployment-url>
```

## Monitoring

### Uptime Monitoring

- Set up UptimeRobot or similar service
- Monitor key endpoints:
  - `https://nobletechinc.com/api/health`
  - `https://nobletechinc.com/ali/dashboard`
  - `https://nobletechinc.com/aed/command`

### Performance Monitoring

- Use Vercel Analytics for Core Web Vitals
- Monitor API response times
- Track error rates and exceptions

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has proper permissions

3. **Authentication Issues**
   - Verify Clerk configuration
   - Check environment variables
   - Ensure proper middleware setup

4. **External API Issues**
   - Verify API credentials
   - Check rate limits
   - Monitor API response times

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs <deployment-url>

# Test database connection
npm run db:test

# Check build locally
npm run build
```

## Maintenance

### Regular Tasks

- **Weekly**: Review error logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and rotate API keys
- **Annually**: Security audit and penetration testing

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update Prisma client
npx prisma generate
```

---

For more information, see the [main documentation](../README.md) and [API documentation](./API.md).
