# Code Review: Site Project

## Overview
This is a Next.js 16 portfolio website for Lajos Nyerges, featuring a dark theme, Framer Motion animations, and an AI chat feature powered by OpenRouter. The project uses TypeScript, Tailwind CSS, and follows modern React patterns.

## Strengths
- **Modern Tech Stack**: Uses latest Next.js 16, React 19, TypeScript 5
- **Performance**: App Router, server components where appropriate
- **Accessibility**: Skip links, proper ARIA labels, semantic HTML
- **Design**: Clean, professional dark theme with smooth animations
- **SEO**: Comprehensive metadata and Open Graph tags
- **Type Safety**: Strict TypeScript configuration
- **Code Organization**: Well-structured components and clear separation of concerns

## Issues and Recommendations

### High Priority

#### 1. API Security & Rate Limiting
**Issue**: The `/api/chat` endpoint has no rate limiting or input validation, making it vulnerable to abuse.
**Remedial Actions**:
- Implement rate limiting (e.g., using `express-rate-limit` or Vercel Edge Functions)
- Add input sanitization and length limits
- Consider API key rotation and monitoring

#### 2. Error Handling & User Experience
**Issue**: Chat errors show technical details to users (e.g., "OpenRouter API error: 401")
**Remedial Actions**:
- Sanitize error messages for user-facing display
- Add retry mechanisms with exponential backoff
- Implement proper loading states and error boundaries

#### 3. Missing Tests
**Issue**: No test scripts in package.json, test files exist but aren't integrated
**Remedial Actions**:
- Add test scripts: `"test": "jest"`, `"test:e2e": "playwright test"`
- Ensure test coverage for critical components (Hero, Chat, API routes)
- Add CI/CD pipeline for automated testing

### Medium Priority

#### 4. Chat Component Issues
**Issues**:
- Uses `key={i}` for message mapping (unstable keys)
- `onKeyPress` is deprecated, use `onKeyDown`
- No form element for input (accessibility issue)
- No message persistence or conversation history
**Remedial Actions**:
- Use unique IDs for message keys (e.g., timestamp or UUID)
- Replace `onKeyPress` with `onKeyDown`
- Wrap input in `<form>` with proper submission
- Consider adding message timestamps and export functionality

#### 5. Image Optimization
**Issue**: Profile image lacks optimization attributes
**Remedial Actions**:
- Use Next.js `<Image>` component with `priority`, `sizes`, and lazy loading
- Add proper alt text and consider WebP format

#### 6. Environment Configuration
**Issue**: API key hardcoded in code, no validation
**Remedial Actions**:
- Add environment variable validation on startup
- Use proper error handling for missing keys
- Consider using a config validation library like `zod`

#### 7. Content Security
**Issue**: Email address exposed in content.ts, potential for spam
**Remedial Actions**:
- Use contact forms instead of direct email links
- Implement email obfuscation or use services like Formspree

### Low Priority

#### 8. TypeScript Configuration
**Issue**: Target ES2017 could be updated to ES2020+
**Remedial Actions**:
- Update `tsconfig.json` target to "ES2020" for better modern JS support

#### 9. Bundle Analysis
**Issue**: No bundle size monitoring
**Remedial Actions**:
- Add `@next/bundle-analyzer` for build size tracking
- Optimize imports and tree-shaking

#### 10. Documentation
**Issue**: Limited documentation for setup and deployment
**Remedial Actions**:
- Add comprehensive README with setup instructions
- Document environment variables and API setup
- Add component documentation and storybook

## Security Considerations
- API keys should never be committed (ensure .env is in .gitignore)
- Implement CSP headers for additional security
- Regular dependency updates to patch vulnerabilities
- Consider adding authentication for admin features if expanded

## Performance Optimizations
- Implement proper code splitting for chat page
- Add service worker for caching static assets
- Optimize fonts loading with `display: swap`
- Consider implementing ISR for static content

## Accessibility Improvements
- Add focus management for chat interactions
- Ensure sufficient color contrast (verify with tools like axe-core)
- Add ARIA live regions for dynamic chat updates
- Test with screen readers

## Deployment Recommendations
- Use Vercel or Netlify for optimal Next.js support
- Set up proper environment variables in deployment platform
- Configure domain and SSL
- Add analytics (e.g., Vercel Analytics, Google Analytics 4)
- Set up monitoring and error tracking (e.g., Sentry)

## Overall Assessment
The codebase is well-structured and follows modern best practices. The main concerns are around security (API protection) and testing. With the recommended fixes, this would be a production-ready portfolio site with an innovative AI feature.