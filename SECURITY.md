# Security Policy

## Overview

LinkFolio takes security seriously. This document outlines our security features, practices, and how to responsibly disclose vulnerabilities.

## Security Features Implemented

### 1. Authentication & Authorization

#### Password Security
- **Strong Password Requirements**: Passwords must be at least 8 characters and contain uppercase, lowercase, and numeric characters
- **Bcrypt Hashing**: All passwords are hashed using bcrypt with a cost factor of 12
- **No Timing Attacks**: Password comparison uses bcrypt's constant-time comparison
- **Mandatory Secret**: Application will not start without `AUTH_SECRET` environment variable set

#### JWT Token Security
- **HttpOnly Cookies**: Auth tokens are stored in HttpOnly cookies, preventing XSS attacks
- **Secure Flag**: Cookies are marked as Secure in production (HTTPS only)
- **SameSite Strict**: CSRF protection via `SameSite=strict` cookie attribute
- **7-Day Expiration**: Tokens automatically expire after 7 days
- **HS256 Algorithm**: Tokens signed with HMAC SHA-256

### 2. API Security

#### Input Validation
- **Zod Schema Validation**: All user inputs are validated using Zod schemas
- **Centralized Validation**: Reusable validation schemas in `/src/lib/validation.ts`
- **URL Protocol Filtering**: Only `http:` and `https:` protocols allowed (prevents `javascript:` and `data:` URIs)
- **String Sanitization**: HTML special characters are escaped to prevent XSS
- **Reserved Username Blocking**: System and common route names cannot be used as usernames

#### Authorization Checks
- **Session Verification**: All protected API routes verify user session
- **Resource Ownership**: Users can only modify their own resources
- **Link Validation**: Analytics endpoints verify link ownership before tracking

#### SQL Injection Prevention
- **Prisma ORM**: All database queries use Prisma's parameterized queries
- **No Raw SQL**: No raw SQL queries in the codebase
- **Type Safety**: TypeScript provides compile-time type checking

### 3. XSS Prevention

#### Output Encoding
- **React Auto-Escaping**: React automatically escapes all rendered content
- **No `dangerouslySetInnerHTML`**: Application does not use this dangerous feature
- **URL Sanitization**: User-provided URLs are validated before storage and rendering
- **Content Security Policy**: Strict CSP headers prevent inline script execution

#### Input Sanitization
- **HTML Character Escaping**: Special characters (`<`, `>`) are escaped in user input
- **URL Validation**: All URLs are validated to use safe protocols only
- **Length Limits**: All string inputs have maximum length constraints

### 4. CSRF Protection

- **SameSite Cookies**: `SameSite=strict` attribute on all authentication cookies
- **No State-Changing GET Requests**: All mutations use POST, PATCH, or DELETE methods
- **Token in HttpOnly Cookie**: Auth token inaccessible to JavaScript

### 5. Security Headers

The application sets the following security headers on all responses:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [strict policy with Stripe integration]
```

### 6. Stripe Payment Security

- **Server-Side Validation**: All payment requests validated server-side
- **Webhook Signature Verification**: Stripe webhooks verified using signing secret
- **No Client-Side Price Manipulation**: Prices determined server-side only
- **Billing Cycle Validation**: Only 'monthly' or 'yearly' cycles accepted

### 7. Environment Variables

- **No Hardcoded Secrets**: All secrets stored in environment variables
- **`.env` in `.gitignore`**: Environment files never committed to git
- **`.env.example` Provided**: Template file documents required variables
- **Required Secrets Check**: Application fails to start if required secrets missing

## Known Limitations

### Rate Limiting
- **Status**: Not implemented
- **Risk**: Potential for brute force attacks and API abuse
- **Mitigation**: Consider implementing rate limiting middleware (e.g., `@upstash/ratelimit`)
- **Recommended**: Add rate limits to authentication endpoints and API routes

### Email Verification
- **Status**: Not implemented
- **Risk**: Users can sign up with invalid email addresses
- **Mitigation**: Email verification recommended before full account activation

### Two-Factor Authentication (2FA)
- **Status**: Not implemented
- **Risk**: Single factor authentication only
- **Mitigation**: Consider adding TOTP-based 2FA for enhanced security

### Account Lockout
- **Status**: Not implemented
- **Risk**: No protection against repeated failed login attempts
- **Mitigation**: Implement account lockout after N failed attempts

### Session Management
- **Status**: Basic implementation
- **Limitations**:
  - No session revocation mechanism
  - No "logout all devices" feature
  - No session activity tracking
- **Mitigation**: Consider implementing session management database

### File Upload Security
- **Status**: Not implemented (no file uploads in current version)
- **Note**: If avatar upload is added, implement:
  - File type validation
  - File size limits
  - Malware scanning
  - Secure storage (e.g., S3 with proper ACLs)

## Responsible Disclosure Policy

We take security vulnerabilities seriously and appreciate responsible disclosure.

### Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security details to: [YOUR-SECURITY-EMAIL]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Updates**: We'll provide status updates every 7 days
- **Timeline**: We aim to resolve critical issues within 30 days
- **Credit**: We'll credit you in our security acknowledgments (unless you prefer to remain anonymous)

### Scope

**In Scope:**
- Authentication bypass
- SQL injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Session management issues
- Authorization bypass
- Payment manipulation
- Data exposure

**Out of Scope:**
- Social engineering attacks
- Physical security
- DDoS attacks
- Spam or abuse issues
- Issues in third-party dependencies (report to them directly)

## Security Best Practices for Developers

If you're contributing to LinkFolio:

1. **Never commit secrets** to version control
2. **Use the validation schemas** in `/src/lib/validation.ts` for all user input
3. **Always verify user ownership** before modifying resources
4. **Use Prisma for all database queries** (no raw SQL)
5. **Test authentication** on all protected routes
6. **Validate and sanitize** all user input
7. **Use TypeScript** for type safety
8. **Keep dependencies updated** regularly
9. **Review changes** for security implications before committing
10. **Use environment variables** for all configuration

## Security Checklist for Deployment

Before deploying to production:

- [ ] Set strong `AUTH_SECRET` (minimum 32 characters, cryptographically random)
- [ ] Configure `STRIPE_WEBHOOK_SECRET` for webhook verification
- [ ] Set `NODE_ENV=production` for production builds
- [ ] Enable HTTPS/SSL on your domain
- [ ] Verify `.env` is not committed to git
- [ ] Review and update Stripe webhook endpoints
- [ ] Set appropriate CORS policies
- [ ] Configure database backups
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Review and test all authentication flows
- [ ] Audit third-party dependencies for vulnerabilities

## Security Updates

This document is maintained and updated regularly. Last updated: 2025-12-17

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/security)
- [Stripe Security](https://stripe.com/docs/security)

## Contact

For security-related questions or concerns:
- Email: [YOUR-SECURITY-EMAIL]
- Security Advisory: Check our GitHub Security Advisories

---

Thank you for helping keep LinkFolio and our users safe!
