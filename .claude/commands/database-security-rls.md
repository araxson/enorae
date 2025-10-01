ULTRATHINK to implement and optimize Row Level Security policies and database security using Context7 MCP for Supabase documentation and Supabase MCP for all operations. Keep token usage under 20000 by using pagination and filtering.

## Objective
Comprehensively review and optimize database security through proper Row Level Security (RLS) implementation, secure function configuration, and least privilege access patterns.

**Note:** No need to worry about backward compatibility or existing application code - the application has not been built yet.

## Phase 1: Documentation Research
Use Context7 MCP to fetch latest Supabase documentation on:
- Row Level Security best practices
- Policy design patterns
- Performance optimization for RLS policies
- SECURITY DEFINER vs SECURITY INVOKER
- Function security considerations
- Auth helper function usage
- Policy testing strategies
- Common security vulnerabilities
- Least privilege principles

## Phase 2: Security Analysis
Use Supabase MCP to identify security issues:

### Missing RLS Protection:
- Tables without RLS enabled
- Tables with RLS enabled but no policies
- Public tables that should be protected
- Tables accessible without authentication
- Tables missing appropriate INSERT/UPDATE/DELETE policies

### Policy Performance Issues:
- Policies with unoptimized conditions
- Direct auth helper function calls causing performance issues
- Complex policy expressions needing simplification
- Policies causing initPlan optimization problems
- Policies with expensive subqueries
- Missing indexes supporting policy filters

### Policy Coverage Gaps:
- Missing SELECT policies for read protection
- Missing INSERT policies allowing unauthorized creation
- Missing UPDATE policies allowing unauthorized modification
- Missing DELETE policies allowing unauthorized removal
- Policies not covering all access scenarios
- Gaps in multi-tenant isolation

### Function Security Issues:
- SECURITY DEFINER functions without explicit search_path
- Functions with elevated privileges without validation
- Functions missing input sanitization
- Functions with SQL injection vulnerabilities
- Functions bypassing RLS unintentionally

### Over-Permissive Access:
- Policies granting broader access than necessary
- Functions with unnecessary privileges
- Missing validation in policies
- Policies not following least privilege
- Cross-tenant data leakage possibilities

## Phase 3: Security Implementation
Use Supabase MCP to implement security improvements:

### Enable RLS Protection:
1. Enable RLS on all tables requiring protection
2. Create comprehensive policy set for each table
3. Ensure policies cover all operations (SELECT, INSERT, UPDATE, DELETE)
4. Test policy effectiveness
5. Verify no unauthorized access paths

### Optimize Policy Performance:
1. Wrap auth helper function calls for initPlan optimization
2. Simplify complex policy expressions
3. Add indexes supporting policy filter conditions
4. Use policy-level caching where appropriate
5. Eliminate expensive subqueries in policies
6. Test policy query plans

### Implement Least Privilege:
1. Design policies granting minimum necessary access
2. Implement role-based policy patterns
3. Add tenant isolation policies
4. Validate user permissions in policies
5. Separate read and write policy logic
6. Implement cascading permission checks

### Secure Functions:
1. Add explicit search_path to SECURITY DEFINER functions
2. Use SECURITY INVOKER for views respecting RLS
3. Validate and sanitize all function inputs
4. Implement proper error handling
5. Document security considerations for each function
6. Audit functions bypassing RLS

### Policy Organization:
1. Name policies descriptively indicating purpose
2. Group related policies logically
3. Document policy intent and coverage
4. Implement consistent policy patterns across schema
5. Use policy templates for common patterns

## Phase 4: Security Testing
Use Supabase MCP to validate security:
- Test policies with various user roles
- Verify tenant isolation effectiveness
- Confirm no unauthorized access paths exist
- Test policy performance under load
- Validate function security restrictions
- Check for privilege escalation possibilities
- Test edge cases and boundary conditions

## Phase 5: Documentation
Generate security audit report:
- Tables protected with RLS (count)
- Policies created or modified (count by type)
- Security vulnerabilities fixed (count by severity)
- Function security improvements (count)
- Performance optimizations applied (metrics)
- Access control coverage (percentage)
- Remaining security recommendations
- Testing results summary

## Guidelines:
- Enable RLS on all tables by default unless explicitly public
- Design policies following principle of least privilege
- Optimize policy performance with appropriate wrapping and indexing
- Use SECURITY INVOKER for views to respect RLS
- Set explicit search_path on SECURITY DEFINER functions
- Test policies thoroughly with different user contexts
- Document security model and policy purposes
- Regular security audits and policy reviews
- Monitor for policy bypass attempts
- Keep security documentation current
- Use consistent policy naming conventions
- Implement defense in depth
- Validate all inputs in functions
- Avoid overly complex policy expressions