# Security Checklist for Developers

Use this checklist when adding new features or modifying existing code.

## Before Committing Code

### Authentication & Authorization
- [ ] Does this feature require authentication?
- [ ] Have I used `getSession()` to verify the user?
- [ ] Do I check resource ownership before modifications?
- [ ] Are password fields properly hashed with bcrypt?
- [ ] Are sensitive routes protected?

### Input Validation
- [ ] Have I imported validation schemas from `/src/lib/validation.ts`?
- [ ] Are all user inputs validated with Zod schemas?
- [ ] Are URLs validated to prevent XSS (http/https only)?
- [ ] Are string inputs sanitized (HTML characters escaped)?
- [ ] Do I have maximum length constraints on all string inputs?
- [ ] Are enums used for predefined values (themes, platforms, etc.)?

### Database Operations
- [ ] Am I using Prisma for all database queries? (No raw SQL)
- [ ] Are user inputs parameterized through Prisma?
- [ ] Do queries filter by `userId` to enforce data isolation?
- [ ] Are soft deletes used where appropriate?

### API Security
- [ ] Is this endpoint protected with authentication?
- [ ] Do I validate all request parameters?
- [ ] Do I return appropriate HTTP status codes?
- [ ] Am I not leaking sensitive data in error messages?
- [ ] Are file uploads validated (type, size, content)?

### XSS Prevention
- [ ] Am I using React's auto-escaping (no `dangerouslySetInnerHTML`)?
- [ ] Are user-provided URLs validated before rendering?
- [ ] Are user inputs sanitized before storage?
- [ ] Does my CSP allow this functionality?

### CSRF Protection
- [ ] Are state-changing operations using POST/PATCH/DELETE?
- [ ] Are cookies configured with `sameSite: 'strict'`?
- [ ] Am I not using GET requests for mutations?

### Secrets & Configuration
- [ ] Are secrets stored in environment variables?
- [ ] Have I added new env vars to `.env.example`?
- [ ] Is `.env` in `.gitignore`?
- [ ] Are there no hardcoded API keys or secrets?
- [ ] Are sensitive values not logged?

### Error Handling
- [ ] Do I catch and handle errors appropriately?
- [ ] Am I not exposing stack traces to users?
- [ ] Are errors logged for debugging?
- [ ] Do error messages not reveal sensitive information?

### Third-Party Integrations
- [ ] Are webhook signatures verified (Stripe)?
- [ ] Are API calls made server-side (not client-side)?
- [ ] Are third-party libraries up to date?
- [ ] Have I reviewed security of new dependencies?

## Before Deploying

### Environment
- [ ] Is `AUTH_SECRET` set to a strong random value (32+ chars)?
- [ ] Are all required environment variables configured?
- [ ] Is `NODE_ENV=production` set?
- [ ] Are Stripe keys (live, not test) configured?
- [ ] Is database backed up?

### Security Headers
- [ ] Are security headers configured in middleware?
- [ ] Does CSP allow required resources?
- [ ] Is HTTPS/SSL enabled?
- [ ] Are cookies marked as Secure in production?

### Testing
- [ ] Have I tested authentication flows?
- [ ] Have I verified authorization checks?
- [ ] Have I tested with invalid/malicious inputs?
- [ ] Have I checked for SQL injection vulnerabilities?
- [ ] Have I verified XSS prevention?
- [ ] Have I run `npm audit` for vulnerabilities?

### Monitoring
- [ ] Is error tracking configured (Sentry)?
- [ ] Are security events logged?
- [ ] Are alerts configured for critical errors?

## Common Security Pitfalls to Avoid

### Don't
- Use user input in database queries without validation
- Store passwords in plain text
- Use `eval()` or `dangerouslySetInnerHTML`
- Trust client-side data
- Expose sensitive data in API responses
- Use GET requests for state changes
- Hardcode secrets or API keys
- Disable security features for convenience
- Return detailed error messages to users
- Trust user-provided URLs without validation

### Do
- Use Zod schemas from `/src/lib/validation.ts`
- Hash passwords with bcrypt (cost factor 12)
- Verify user sessions on protected routes
- Validate all inputs server-side
- Use Prisma for database operations
- Set secure cookie attributes
- Follow the principle of least privilege
- Keep dependencies updated
- Log security events
- Use TypeScript for type safety

## Quick Reference: Validation Schemas

```typescript
import {
  emailSchema,        // Email with normalization
  passwordSchema,     // Strong password requirements
  usernameSchema,     // Username with reserved names check
  nameSchema,         // Sanitized name (max 100 chars)
  bioSchema,          // Sanitized bio (max 160 chars)
  urlSchema,          // URL with protocol validation (http/https only)
  linkTitleSchema,    // Sanitized link title (1-100 chars)
  themeSchema,        // Enum: predefined themes only
  platformSchema,     // Enum: predefined social platforms only
  buttonStyleSchema,  // Enum: predefined button styles only
} from '@/lib/validation'
```

## Quick Reference: Common Patterns

### Protect an API Route
```typescript
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Your logic here
}
```

### Validate User Input
```typescript
const schema = z.object({
  email: emailSchema,
  url: urlSchema,
  name: nameSchema,
})

const validatedData = schema.parse(body)
```

### Check Resource Ownership
```typescript
const resource = await db.resource.findFirst({
  where: { id: resourceId, userId: session.id }
})

if (!resource) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
```

### Set Secure Cookies
```typescript
cookieStore.set('auth-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
})
```

## Resources
- [SECURITY.md](../SECURITY.md) - Full security documentation
- [SECURITY_AUDIT_REPORT.md](../SECURITY_AUDIT_REPORT.md) - Detailed audit findings
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

## Questions?
If you're unsure about security implications of your code, ask for a review or consult the security documentation.

---

**Remember**: Security is everyone's responsibility. When in doubt, be conservative and ask for review.
