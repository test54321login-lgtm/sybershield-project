# CyberShield - Cyber Awareness Platform

A modern, production-ready Next.js 15 application for teaching cybersecurity awareness. Built with Supabase for authentication and database, featuring interactive checklists, quizzes, a security encyclopedia, and a community feed.

## Overview

CyberShield is a comprehensive platform designed to educate users about cybersecurity threats, malware, and protection strategies. It combines learning materials with interactive tools to help users track their security knowledge and habits.

### Key Features

- **User Authentication** - Secure email/password signup and login with Supabase Auth
- **Security Checklist** - Track security tasks organized by category (account, device, network, data, password, software)
- **Interactive Quizzes** - Test knowledge with difficulty levels and progress tracking
- **Security Encyclopedia** - Comprehensive guides on malware, phishing, ransomware, and best practices
- **Community Feed** - Share security news, tips, and insights
- **Progress Dashboard** - Visualize learning progress and statistics
- **Modern UI** - Beautiful, responsive design with Framer Motion animations
- **Production-Ready** - TypeScript, validation, error handling, and security best practices

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **Authentication**: Supabase Auth
- **Form Validation**: Zod
- **Icons**: Lucide React
- **Theme**: Next Themes (light/dark mode support)

## Project Structure

```
cybershield/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles and design tokens
│   ├── auth/                    # Authentication pages
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── sign-up-success/page.tsx
│   │   ├── error/page.tsx
│   │   └── callback/route.ts
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── checklist/page.tsx       # Security checklist
│   ├── quiz/page.tsx            # Quiz hub
│   ├── encyclopedia/page.tsx    # Knowledge base
│   └── feed/page.tsx            # Community feed
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── card.tsx
│   └── theme-provider.tsx       # Theme provider wrapper
├── lib/                         # Utilities and configurations
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase
│   │   ├── server.ts           # Server-side Supabase
│   │   └── middleware.ts       # Auth middleware
│   ├── db/
│   │   └── operations.ts       # Database operations
│   ├── validations/
│   │   └── auth.ts             # Zod schemas
│   └── utils.ts                # Utility functions
├── types/
│   └── database.ts             # TypeScript type definitions
├── supabase/
│   └── migrations/             # SQL migration files
│       ├── 001_create_profiles.sql
│       ├── 002_create_checklist_items.sql
│       ├── 003_create_quiz_results.sql
│       ├── 004_create_feed_posts.sql
│       ├── 005_create_encyclopedia.sql
│       └── 006_create_profile_trigger.sql
├── middleware.ts               # Next.js middleware for auth
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm, yarn, or pnpm
- Supabase account and project

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cybershield.git
cd cybershield
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by copying `.env.example`:
```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

5. Run database migrations:

Option A: Using Supabase Dashboard
- Go to your Supabase project
- Navigate to SQL Editor
- Run each migration file in `supabase/migrations/` in order (001 → 006)

Option B: Using Supabase CLI
```bash
supabase db push
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

- **profiles** - User profile information with RLS policies
- **checklist_items** - User security tasks with categories and priorities
- **quiz_results** - Quiz attempt history with scores and timing
- **feed_posts** - Community posts with likes and comments
- **encyclopedia_articles** - Knowledge base articles with severity levels

All tables include RLS (Row-Level Security) policies to ensure users can only access their own data.

## Authentication Flow

1. User signs up → Creates auth.users record
2. Profile auto-created via trigger
3. Email confirmation link sent
4. After confirmation → User can sign in
5. Session stored in secure HTTP-only cookie
6. Middleware refreshes session on each request

## Key Features in Detail

### Security Checklist
- Organize tasks by category
- Track completion status with visual progress
- Set priority levels (low, medium, high, critical)
- Delete completed tasks

### Quizzes
- Multiple quizzes with varying difficulty
- Real-time score tracking
- Quiz history and statistics
- Average score calculation

### Encyclopedia
- Filterable by category (malware, threats, protection, tips)
- Severity level indicators
- Comprehensive descriptions
- View count tracking

### Community Feed
- Browse published security posts
- Like and comment functionality
- Tag-based filtering
- Category-based organization

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables from your `.env.local`
6. Click "Deploy"

Vercel will automatically:
- Build your Next.js app
- Deploy to a global CDN
- Set up HTTPS
- Enable automatic deployments on push

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
```

**Docker:**
```bash
docker build -t cybershield .
docker run -p 3000:3000 cybershield
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
npm run format     # Format code with Prettier
```

## Security Considerations

- All passwords hashed with Supabase Auth
- Row-Level Security (RLS) enabled on all tables
- HTTP-only session cookies
- CSRF protection via Supabase
- Input validation with Zod
- SQL injection prevention via parameterized queries
- XSS protection via React escaping

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind (minimal bundle)
- Server-side rendering where appropriate
- Caching headers configured

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, open an issue on GitHub.

## Roadmap

- [ ] Email verification and password reset
- [ ] User profiles with avatars
- [ ] Quiz custom creation by users
- [ ] Comments on feed posts
- [ ] Achievements and badges system
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Advanced analytics dashboard

