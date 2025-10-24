# Aura Platform - Enterprise SaaS Solution

> **Aura Lifecycle Intelligence (ALI) & Aura Executive Dynamics (AED)**  
> *Transforming enterprise project management with AI-powered insights*

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/narindanoble/nobletechinc)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🚀 Overview

The **Aura Platform** is a comprehensive enterprise-grade SaaS solution that combines **Aura Lifecycle Intelligence (ALI)** and **Aura Executive Dynamics (AED)** modules. Built with a unique "AuraPunk" design system that fuses Palantir's sophisticated data visualization patterns with NobleTech's cyberpunk aesthetic.

### 🎯 Core Modules

#### **ALI (Aura Lifecycle Intelligence)**
- **Client-facing B2B SaaS** for project lifecycle management
- **Real-time project health** monitoring and predictive analytics
- **Decommissioning command center** with EOL planning
- **Users**: Client CTOs, Operations Managers

#### **AED (Aura Executive Dynamics)**
- **AI-powered CEO command center** for strategic decision making
- **Context-aware briefing** with location detection
- **Communication triage** with AI prioritization
- **Focus productivity hub** for deep work
- **Users**: CEO Noble (internal only)

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **Next.js 14** (App Router) - Modern React framework
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling with AuraPunk design system
- **Framer Motion** - Smooth animations and transitions
- **tRPC** - End-to-end type-safe APIs
- **Prisma ORM** - Type-safe database access
- **MongoDB** - Document-based database

**Backend:**
- **Next.js API Routes** - Serverless functions
- **tRPC** - Type-safe API layer
- **Prisma** - Database ORM
- **MongoDB Atlas** - Cloud database

**External Integrations:**
- **AWS Cost Explorer** - Cloud spend analysis
- **Datadog APM** - Performance monitoring
- **Microsoft Graph** - CEO calendar and email
- **Slack API** - Communication triage
- **OpenAI GPT-4** - AI-powered insights

## 🎨 AuraPunk Design System

The design system combines Palantir's enterprise data visualization with NobleTech's cyberpunk aesthetic:

### Color Palette
```css
--aura-background: #0A0E27;        /* Deep navy-black */
--aura-surface: #1A1D2E;           /* Elevated cards */
--aura-accent-primary: #00E1F4;     /* Neon cyan */
--aura-accent-secondary: #7B61FF;   /* Electric purple */
--aura-accent-critical: #F5A623;    /* Amber alerts */
--aura-accent-success: #00FF9F;     /* Neon green */
--aura-accent-danger: #FF006E;      /* Neon magenta */
```

### Typography
- **Display Font**: Chakra Petch (headings, data labels)
- **Body Font**: JetBrains Mono (body text, code-like elements)

### Effects
- **Neon Glow**: Multi-layered shadow effects for interactive elements
- **Glitch Effects**: Animated text distortion for data anomalies
- **Tech Grid**: Subtle background patterns
- **Glass Morphism**: Frosted glass effects with cyber gradients

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone https://github.com/narindanoble/nobletechinc.git
cd nobletechinc

# Install dependencies
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:test      # Test MongoDB connection
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset and reseed database

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier
```

## 📊 Features

### ALI Module - Client Portal

#### Project Vital Signs Dashboard
- **Real-time Metrics**: Uptime %, Error Rate, Cloud Spend MTD, Open Tickets
- **Health Scoring**: Green/Yellow/Red status indicators
- **Trend Analysis**: UP/DOWN/STABLE indicators with color coding
- **Interactive Elements**: Hover effects with neon glow

#### Predictive Analytics
- **TCO Forecasting**: 6/12/24-month cost projections
- **Risk Assessment**: Component failure prediction
- **EOL Planning**: Optimal decommission date recommendations

#### Decommissioning Command Center
- **EOL Planner**: Wizard-style interface for project termination
- **Impact Analysis**: Dependency mapping and cost projections
- **Progress Tracking**: Kanban board for decommission tasks

### AED Module - CEO Command Center

#### Context-Aware Briefing
- **Home Mode**: Deep work focus with virtual meetings
- **Office Mode**: Leadership & collaboration tools
- **Location Detection**: Automatic or manual toggle

#### Executive KPIs
- **Active Projects**: Real-time project count
- **Pipeline Value**: Revenue pipeline tracking
- **Client Health**: Overall client satisfaction score
- **Team Capacity**: Resource utilization metrics

#### Communication Triage
- **Smart Inbox**: AI-powered message prioritization
- **Urgency Scoring**: 1-10 scale for message importance
- **Suggested Actions**: One-click responses and forwarding

#### Focus Productivity Hub
- **Focus Mode**: Distraction-free work environment
- **Pomodoro Timer**: Customizable focus sessions
- **Daily Summary**: End-of-day productivity reports

## 🗄️ Database Schema

### MongoDB Collections

```typescript
// Core Models
Organization    // Client companies
User           // All system users
Project        // Client projects

// ALI Models
ProjectMetrics      // Time-series data
MaintenanceTicket   // Issue tracking
DecommissionPlan    // EOL planning

// AED Models
CEOTask            // Executive tasks
CEOContext         // Location/focus tracking
CommunicationItem  // Email/Slack triage
PredictiveModel    // ML model outputs
```

## 🔌 API Documentation

### tRPC Endpoints

#### ALI Router (`/api/trpc/ali`)
- `getProjectVitals` - Project health metrics
- `getProjectTimeline` - Deployment and incident timeline
- `setBudgetAlert` - Budget threshold configuration
- `getTCOForecast` - Total Cost of Ownership forecasting

#### AED Router (`/api/trpc/aed`)
- `getCEOTasks` - CEO task management
- `getCommunicationItems` - Communication triage
- `updateCEOContext` - Context management

### Example Usage

```typescript
// Get project vital signs
const vitals = await trpc.ali.getProjectVitals.query({
  projectId: "507f1f77bcf86cd799439011"
})

// Get CEO tasks
const tasks = await trpc.aed.getCEOTasks.query({
  userId: "507f1f77bcf86cd799439019"
})
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link GitHub repository to Vercel
2. **Configure Environment**: Set all required environment variables
3. **Database Setup**: Configure MongoDB Atlas connection
4. **Domain Setup**: Configure custom domain (optional)

### Environment Variables

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/aura_platform"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# External APIs
AWS_ACCESS_KEY_ID=""
DATADOG_API_KEY=""
MICROSOFT_GRAPH_CLIENT_ID=""
SLACK_BOT_TOKEN=""

# AI/ML
OPENAI_API_KEY=""

# Monitoring
SENTRY_DSN=""
POSTHOG_KEY=""
```

## 📚 Documentation

- **[Main Documentation](./docs/README.md)** - Comprehensive project overview
- **[API Documentation](./docs/API.md)** - Complete tRPC endpoint documentation
- **[Component Documentation](./docs/COMPONENTS.md)** - Detailed component usage
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Project Status](./docs/PROJECT_STATUS.md)** - Current development status

## 🗺️ Roadmap

### v1.1.0 - Authentication & Security
- [ ] Clerk integration with RBAC
- [ ] Security headers and validation
- [ ] Session management

### v1.2.0 - Real Data Integration
- [ ] AWS Cost Explorer integration
- [ ] Datadog APM integration
- [ ] Microsoft Graph API integration
- [ ] Slack API integration

### v1.3.0 - AI Features
- [ ] OpenAI GPT-4 integration
- [ ] Predictive analytics
- [ ] Smart recommendations
- [ ] Natural language processing

### v2.0.0 - Advanced Features
- [ ] Real-time data pipelines
- [ ] Advanced ML models
- [ ] 3D data visualizations
- [ ] Mobile applications

## 🤝 Contributing

### Development Workflow

1. **Fork Repository**: Create your own fork
2. **Create Branch**: `git checkout -b feature/your-feature`
3. **Make Changes**: Implement your feature
4. **Test Changes**: Ensure all tests pass
5. **Commit Changes**: Use conventional commit messages
6. **Push Changes**: Push to your fork
7. **Create PR**: Submit pull request for review

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 📞 Support

### Documentation
- **README**: This file
- **API Docs**: `/docs/api.md`
- **Component Docs**: `/docs/components.md`
- **Deployment Guide**: `/docs/deployment.md`

### Issues
- **Bug Reports**: Use GitHub Issues
- **Feature Requests**: Use GitHub Discussions
- **Security Issues**: Contact directly

### Contact
- **Email**: noble@nobletechinc.com
- **GitHub**: @narindanoble
- **Website**: https://nobletechinc.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Palantir**: Design inspiration for enterprise data visualization
- **Next.js Team**: Excellent framework and documentation
- **Vercel**: Deployment platform and optimization
- **MongoDB**: Database technology and Atlas platform
- **Open Source Community**: All the amazing libraries and tools used

---

**Built with ❤️ by NobleTech Inc.**

*Transforming enterprise project management with AI-powered insights*