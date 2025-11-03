# Security Headers Implementation Guide

This guide explains how to implement security headers for the Gentelella admin template, including which headers can be set via meta tags and which require server configuration.

## Quick Reference

### ✅ Can be set via Meta Tags
- `Content-Security-Policy` (with limitations)
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

### ❌ Must be set via HTTP Headers
- `X-Frame-Options`
- `Strict-Transport-Security` (HSTS)
- `X-XSS-Protection` (deprecated but sometimes required)
- `frame-ancestors` CSP directive (ignored in meta tags)

## Current Implementation

### Meta Tags (in HTML files)
```html
<!-- Already implemented in index.html -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' ws: wss: http://localhost:* https://api.example.com https://*.googleapis.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com; media-src 'self' https: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()">
```

## Server Configuration Required

### Apache (.htaccess)
```apache
# Security Headers for Gentelella Admin Template

# X-Frame-Options (prevents clickjacking)
Header always set X-Frame-Options "SAMEORIGIN"

# Strict Transport Security (HTTPS only - enable only if using HTTPS)
# Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# Content Security Policy (more flexible than meta tag)
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' ws: wss: http://localhost:* https://api.example.com https://*.googleapis.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com; media-src 'self' https: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;"

# X-Content-Type-Options
Header always set X-Content-Type-Options "nosniff"

# Referrer Policy
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Permissions Policy
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

# X-XSS-Protection (legacy, but some scanners still check for it)
Header always set X-XSS-Protection "1; mode=block"
```

### Nginx
```nginx
# Security Headers for Gentelella Admin Template

# X-Frame-Options (prevents clickjacking)
add_header X-Frame-Options "SAMEORIGIN" always;

# Strict Transport Security (HTTPS only - enable only if using HTTPS)
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' ws: wss: http://localhost:* https://api.example.com https://*.googleapis.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com; media-src 'self' https: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;" always;

# X-Content-Type-Options
add_header X-Content-Type-Options "nosniff" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# X-XSS-Protection (legacy)
add_header X-XSS-Protection "1; mode=block" always;
```

### Express.js (Node.js)
```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

// Use Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 
                  "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", 
                 "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", 
                 "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", 
                "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'", "ws:", "wss:", "http://localhost:*", 
                   "https://api.example.com", "https://*.googleapis.com"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://player.vimeo.com"],
      mediaSrc: ["'self'", "https:", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  frameguard: { action: 'sameorigin' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Custom Permissions Policy
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
```

## Security Header Explanations

### Content Security Policy (CSP)
**Purpose**: Prevents XSS attacks by controlling resource loading
**Current Settings**:
- `default-src 'self'`: Only allow resources from same origin by default
- `script-src`: Allow scripts from self, inline scripts, and CDNs
- `style-src`: Allow styles from self, inline styles, and font/CDN sources
- `img-src`: Allow images from self, data URIs, HTTPS, and blobs
- `connect-src`: Allow AJAX/WebSocket connections to self, localhost, and APIs
- `frame-src`: Allow iframes from self and video platforms
- `object-src 'none'`: Block plugins (Flash, etc.)
- `upgrade-insecure-requests`: Upgrade HTTP to HTTPS automatically

### X-Frame-Options
**Purpose**: Prevents clickjacking attacks
**Setting**: `SAMEORIGIN` - only allow framing from same origin
**Note**: Must be set via HTTP header, not meta tag

### X-Content-Type-Options
**Purpose**: Prevents MIME type sniffing attacks
**Setting**: `nosniff` - browsers must not sniff content types

### Referrer-Policy
**Purpose**: Controls how much referrer information is sent with requests
**Setting**: `strict-origin-when-cross-origin` - balanced privacy and functionality

### Permissions-Policy
**Purpose**: Controls browser feature access
**Setting**: Disable camera, microphone, and geolocation for privacy

### Strict-Transport-Security (HSTS)
**Purpose**: Forces HTTPS connections
**Note**: Only enable if serving over HTTPS
**Recommended**: `max-age=31536000; includeSubDomains; preload`

## Development vs Production

### Development (Current)
- Meta tags used where possible for easy testing
- `'unsafe-inline'` and `'unsafe-eval'` allowed for development flexibility
- Localhost connections allowed for hot reload

### Production Recommendations
1. **Use HTTP headers instead of meta tags** for better security
2. **Remove `'unsafe-inline'` and `'unsafe-eval'`** from CSP
3. **Use nonces or hashes** for inline scripts/styles
4. **Enable HSTS** if using HTTPS
5. **Add specific API endpoints** instead of wildcards
6. **Set up CSP reporting** to monitor violations

## Testing Security Headers

### Online Tools
- [securityheaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com)

### Browser Developer Tools
1. Open DevTools → Console
2. Look for CSP violation warnings
3. Test frame embedding in different origins
4. Check network requests for blocked resources

### Command Line Testing
```bash
# Test with curl
curl -I https://your-domain.com

# Test CSP specifically
curl -H "User-Agent: Mozilla/5.0" -I https://your-domain.com | grep -i "content-security-policy"
```

## Common Issues and Solutions

### Issue: CSP Violations
**Symptoms**: Resources blocked, console warnings
**Solutions**:
- Add missing sources to CSP directives
- Use nonces for inline scripts: `<script nonce="random-value">`
- Move inline styles to external files

### Issue: Mixed Content Warnings
**Symptoms**: HTTP resources blocked on HTTPS pages
**Solutions**:
- Use `upgrade-insecure-requests` directive
- Update all resource URLs to HTTPS
- Use protocol-relative URLs: `//cdn.example.com`

### Issue: Frame Embedding Blocked
**Symptoms**: Site cannot be embedded in iframes
**Solutions**:
- Adjust `X-Frame-Options` header
- Use `frame-ancestors` CSP directive
- Allow specific domains if needed

### Issue: HSTS Errors
**Symptoms**: Cannot access site over HTTP after HSTS
**Solutions**:
- Only enable HSTS on HTTPS sites
- Use shorter max-age during testing
- Clear HSTS settings in browser for testing

## Monitoring and Maintenance

### CSP Reporting
```javascript
// Add to CSP header
"report-uri https://your-domain.com/csp-violations"

// Or use newer report-to
"report-to csp-endpoint"
```

### Regular Security Audits
1. **Monthly**: Run automated security header scans
2. **Quarterly**: Review CSP violations and adjust policies
3. **Annually**: Full security assessment including penetration testing

### Keeping Headers Updated
- Monitor browser compatibility changes
- Update CSP as new features/dependencies are added
- Review and tighten security policies periodically

## Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [CSP Reference](https://content-security-policy.com/)
- [Security Headers Quick Reference](https://securityheaders.com/)