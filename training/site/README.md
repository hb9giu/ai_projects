# Lajos Nyerges Portfolio

A modern, responsive portfolio website built with Next.js 16, featuring a dark theme, smooth animations, and an AI-powered digital twin chat.

## Features

- **Modern Tech Stack**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- **AI Chat**: Digital twin powered by OpenRouter API
- **Responsive Design**: Mobile-first approach with dark theme
- **Performance Optimized**: App Router, server components, optimized images
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Ready**: Comprehensive metadata and Open Graph tags

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Fonts**: Outfit, DM Sans, JetBrains Mono
- **AI**: OpenRouter API
- **Testing**: Jest, Playwright
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=openai/gpt-4o-mini
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright e2e tests
- `npm run analyze` - Analyze bundle size

## Project Structure

```
site/
├── app/                    # Next.js app directory
│   ├── api/chat/          # AI chat API route
│   ├── chat/              # Chat page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Hero.tsx
│   ├── AboutSection.tsx
│   ├── JourneySection.tsx
│   ├── PortfolioSection.tsx
│   ├── SiteHeader.tsx
│   └── SiteFooter.tsx
├── lib/                   # Utilities and data
│   └── content.ts         # Site content and profile data
├── public/                # Static assets
│   ├── profile.png
│   └── linkedin.pdf
└── tests/                 # Test files
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key for AI chat | Yes |
| `OPENROUTER_MODEL` | AI model to use (default: openai/gpt-4o-mini) | No |

## API Routes

### POST /api/chat
Handles AI chat messages with the digital twin.

**Request Body:**
```json
{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "reply": "AI response here"
}
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

This project is private and proprietary.

## Contact

For questions about the technical implementation, please refer to the code or create an issue.
