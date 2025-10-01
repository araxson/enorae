# Supabase Development Rules & Guidelines

A comprehensive guide of clean, organized rules and best practices for Supabase development. This documentation provides developers and Claude Code AI assistants with structured guidelines for building applications with Supabase.

## 📖 Table of Contents

### [01. Installation & Setup](./01-installation-setup/)
- **[01. Package Installation](./01-installation-setup/01-package-installation.md)** - JavaScript/TypeScript, Python, Swift, C#, Flutter installation rules
- **[02. Project Initialization](./01-installation-setup/02-project-initialization.md)** - Project creation, templates, and development server setup

### [02. Client Initialization](./02-client-initialization/)
- **[01. Basic Client Setup](./02-client-initialization/01-basic-client-setup.md)** - Standard client initialization patterns and environment variables
- **[02. Client Options](./02-client-initialization/02-client-options.md)** - Authentication, storage, network, and realtime configuration options

### [03. Authentication](./03-authentication/)
- **[01. Sign-Up Rules](./03-authentication/01-sign-up-rules.md)** - User registration patterns, validation, and error handling
- **[02. Sign-In Rules](./03-authentication/02-sign-in-rules.md)** - Authentication methods, OAuth, OTP, and session management
- **[03. User Management](./03-authentication/03-user-management.md)** - Profile updates, admin operations, and session monitoring

### [04. Database Operations](./04-database-operations/)
- **[01. Basic Queries](./04-database-operations/01-basic-queries.md)** - SELECT, filtering, pagination, ordering, and error handling
- **[02. Insert, Update, Delete](./04-database-operations/02-insert-update-delete.md)** - Data modification operations, upserts, and batch processing

### [05. Realtime](./05-realtime/)
- **[01. Realtime Setup](./05-realtime/01-realtime-setup.md)** - Channel configuration, subscriptions, and connection management
- **[02. Realtime Patterns](./05-realtime/02-realtime-patterns.md)** - Chat, collaboration, live dashboards, and gaming patterns

### [06. Edge Functions](./06-edge-functions/)
- **[01. Function Creation](./06-edge-functions/01-function-creation.md)** - TypeScript/Deno functions, routing, and local testing
- **[02. Function Deployment](./06-edge-functions/02-function-deployment.md)** - CLI deployment, monitoring, and production optimization

### [07. Local Development](./07-local-development/)
- **[01. Supabase CLI Setup](./07-local-development/01-supabase-cli-setup.md)** - Local services, database management, and development workflow

### [08. Environment Configuration](./08-environment-configuration/)
- **[01. Environment Variables](./08-environment-configuration/01-environment-variables.md)** - Framework-specific configs, security, and CI/CD setup

### [09. Framework Integration](./09-framework-integration/)
- **[01. Next.js Integration](./09-framework-integration/01-nextjs-integration.md)** - App Router, Pages Router, middleware, and TypeScript patterns

### [10. Security Best Practices](./10-security-best-practices/)
- **[01. Authentication Security](./10-security-best-practices/01-authentication-security.md)** - Key management, RLS policies, session security, and audit logging

### [11. Error Handling](./11-error-handling/)
- **[01. Error Patterns](./11-error-handling/01-error-patterns.md)** - Comprehensive error handling, logging, and monitoring patterns

### [12. Migration Patterns](./12-migration-patterns/)
- **[01. Schema Migrations](./12-migration-patterns/01-schema-migrations.md)** - Safe database schema changes, data migrations, and production deployment

## 🎯 How to Use This Guide

### For Developers
1. **Quick Reference**: Jump to specific sections for immediate answers
2. **Best Practices**: Follow the ✅ patterns and avoid ❌ anti-patterns
3. **Copy-Paste Ready**: All code examples are production-ready
4. **Progressive Learning**: Start with basics and advance to complex patterns

### For Claude Code AI
1. **Structured Rules**: Each section contains numbered, specific rules
2. **Context-Aware**: Rules include common use cases and error scenarios
3. **Framework-Specific**: Guidelines tailored for different frameworks
4. **Security-First**: Security considerations integrated throughout

## 🚀 Quick Start

### 1. Installation
```bash
npm install @supabase/supabase-js
```

### 2. Basic Setup
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

### 3. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📋 Rule Categories

### **Setup & Configuration Rules**
- Package installation patterns
- Environment variable management
- Client initialization options
- Local development setup

### **Database & API Rules**
- Query construction patterns
- Data modification best practices
- Error handling strategies
- Performance optimization

### **Authentication & Security Rules**
- Secure authentication flows
- Row Level Security (RLS) policies
- Session management
- Key security practices

### **Real-time & Functions Rules**
- WebSocket connection management
- Edge function development
- Deployment strategies
- Monitoring patterns

### **Framework Integration Rules**
- Next.js App/Pages Router
- Server-side rendering
- Middleware configuration
- TypeScript integration

### **Production & Maintenance Rules**
- Schema migration strategies
- Error monitoring
- Performance optimization
- Security auditing

## 🔧 Common Patterns

### **Always Check Errors**
```javascript
const { data, error } = await supabase.from('table').select('*')
if (error) {
  console.error('Database error:', error.message)
  throw new Error('Failed to fetch data')
}
```

### **Use RLS Policies**
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (auth.uid() = user_id);
```

### **Environment-Specific Configuration**
```javascript
const supabaseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:54321'
  : process.env.NEXT_PUBLIC_SUPABASE_URL
```

## 🛡️ Security Checklist

- [ ] Never expose service role keys to client-side
- [ ] Enable RLS on all user data tables
- [ ] Use environment variables for all credentials
- [ ] Implement proper error handling
- [ ] Validate user inputs before database operations
- [ ] Monitor authentication events
- [ ] Use HTTPS in production
- [ ] Regular security audits

## 📚 Additional Resources

- [Official Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub Repository](https://github.com/supabase/supabase)
- [Community Discord](https://discord.supabase.com)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

## 🤝 Contributing

This documentation is designed to be:
- **Comprehensive**: Covers all major Supabase development scenarios
- **Practical**: Every rule includes working code examples
- **Accessible**: Clear explanations for developers at all levels
- **Maintainable**: Organized structure for easy updates

## 📝 Documentation Standards

### Rule Formatting
Each rule follows this structure:
- **Rule Number**: Sequential numbering (e.g., Rule 1.1.1)
- **Clear Title**: Descriptive rule name
- **Code Example**: Working implementation
- **Context**: When and why to use the rule

### Code Examples
- ✅ **Good examples**: Recommended patterns
- ❌ **Bad examples**: Anti-patterns to avoid
- **Comments**: Explain important details
- **Error handling**: Always included

### Organization
- **Logical grouping**: Related concepts together
- **Progressive complexity**: Basic to advanced
- **Cross-references**: Links between related sections
- **Searchable**: Clear headings and keywords

---

*This documentation was generated to provide Claude Code AI assistants and developers with comprehensive, clean, and organized rules for Supabase development. Each section contains specific, actionable guidelines with practical examples.*