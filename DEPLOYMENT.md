# CyberShield - Deployment Guide

This guide covers all aspects of deploying CyberShield to production.

## Pre-Deployment Checklist

- [ ] All environment variables are configured
- [ ] Database migrations have been run
- [ ] Tests pass locally (`npm run type-check`, `npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in development mode
- [ ] Supabase RLS policies are properly configured
- [ ] Email verification is set up in Supabase
- [ ] Domain is ready (if using custom domain)

## Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase Configuration (from Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URLs (optional, auto-provided by Supabase)
POSTGRES_URL=postgresql://user:password@host:5432/postgres
POSTGRES_PRISMA_URL=postgresql://user:password@host:5432/postgres?schema=public
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/postgres

# Development
NODE_ENV=production
```

## Deploying to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your CyberShield repository
   - Click "Import"

2. **Configure Environment Variables**
   - In the import dialog, add all environment variables
   - Or go to Project Settings > Environment Variables after import
   - Add each variable from your `.env.local`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Your app is now live!

4. **Configure Custom Domain (Optional)**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables if not already configured
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Re-deploy with environment variables
vercel --prod
```

## Deploying to Docker

### Build Docker Image

```bash
# Build the image
docker build -t cybershield:latest .

# Tag for registry (e.g., Docker Hub)
docker tag cybershield:latest yourusername/cybershield:latest

# Push to registry
docker push yourusername/cybershield:latest
```

### Run Docker Container

```bash
# Run locally
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  -e SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
  cybershield:latest
```

### Deploy to Cloud Providers

#### AWS ECS
```bash
# Create ECS task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create ECS service
aws ecs create-service --cluster cybershield --service-name cybershield-app --task-definition cybershield:1 --desired-count 1
```

#### Google Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/cybershield

# Deploy
gcloud run deploy cybershield \
  --image gcr.io/PROJECT_ID/cybershield \
  --platform managed \
  --set-env-vars NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
```

#### DigitalOcean App Platform
1. Connect your GitHub repository
2. Create a new app
3. Select the CyberShield repository
4. Add environment variables
5. Deploy

## Supabase Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Fill in project details
- Wait for project initialization

### 2. Get API Keys
- Go to Project Settings > API
- Copy `Project URL` and `anon public key`
- Copy `service_role key` for server-side operations

### 3. Run Database Migrations

**Using Supabase Dashboard:**
1. Go to SQL Editor
2. Copy and paste each migration file (001-006) in order
3. Execute each one

**Using Supabase CLI:**
```bash
# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Configure Auth

1. Go to Authentication > Providers
2. Enable Email provider if not already enabled
3. Go to Email Templates
4. (Optional) Customize email templates

### 5. Configure RLS Policies

All RLS policies are created by the migrations. Verify they're in place:
1. Go to Authentication > RLS
2. Check that all tables have policies enabled
3. Review policies in each table

## Database Migrations

### Running Migrations

The migrations are located in `/supabase/migrations/` in this order:

1. `001_create_profiles.sql` - User profile table
2. `002_create_checklist_items.sql` - Checklist items table
3. `003_create_quiz_results.sql` - Quiz results table
4. `004_create_feed_posts.sql` - Feed posts table
5. `005_create_encyclopedia.sql` - Encyclopedia articles
6. `006_create_profile_trigger.sql` - Triggers and functions

### Verifying Migrations

```bash
# Connect to Supabase database
psql postgresql://user:password@host:5432/postgres

# List tables
\dt

# Verify RLS policies
\d profiles
```

## Health Checks

After deployment, verify the application:

1. **Visit the Application**
   - Navigate to your deployed URL
   - Check that pages load without errors

2. **Test Authentication**
   - Create a test account
   - Verify email confirmation works
   - Test login/logout

3. **Test Database Operations**
   - Try accessing the dashboard
   - Create a checklist item
   - Verify it appears in the database

4. **Check Logs**
   - Vercel: Project Settings > Logs
   - Docker: `docker logs <container-id>`
   - Check for any errors or warnings

## Monitoring & Maintenance

### Vercel Monitoring
- Go to Project Settings > Monitor
- Enable Vercel Analytics
- Set up error reporting with Sentry (optional)

### Database Monitoring
- Check Supabase usage in Project Settings > Billing
- Monitor database performance in Database > Query Performance
- Set up alerts for high usage

### Performance Optimization
- Enable Vercel Analytics
- Use Lighthouse to check page performance
- Optimize images with Next.js Image component
- Consider caching strategies for static content

## Rollback Strategy

### If Deployment Fails

**On Vercel:**
1. Go to Deployments
2. Find the last successful deployment
3. Click the three dots menu
4. Select "Promote to Production"

**With Git:**
```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main
# Vercel will auto-deploy the reverted version
```

### Database Rollback

If a migration causes issues:
1. Backup your data
2. Drop the problematic objects
3. Re-run the correct migration version
4. Verify data integrity

## Troubleshooting

### Common Issues

**"Supabase connection failed"**
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure network allows connections to Supabase

**"Authentication not working"**
- Verify email provider is enabled in Supabase
- Check email templates are configured
- Verify callback URL is correct

**"404 errors on deployed version"**
- Clear Vercel cache: Project Settings > Deployments > ... > Redeploy
- Verify all environment variables are set
- Check that migrations were run

**"Database errors"**
- Verify RLS policies are correct
- Check that user is authenticated
- Ensure service role key is only used server-side

### Getting Help

1. Check Supabase documentation: https://supabase.com/docs
2. Check Next.js documentation: https://nextjs.org/docs
3. Check Vercel documentation: https://vercel.com/docs
4. Open an issue on GitHub with error logs

## Production Best Practices

1. **Enable HTTPS** - Both Vercel and Supabase support this by default
2. **Regular Backups** - Supabase provides daily backups on Pro plan
3. **Monitor Usage** - Set up alerts for unusual traffic patterns
4. **Security Headers** - Configured in `next.config.ts`
5. **Rate Limiting** - Consider implementing with Upstash Redis
6. **Email Configuration** - Use a proper email service (SendGrid, Resend, etc.)
7. **Analytics** - Set up with Vercel Analytics or Google Analytics
8. **Error Tracking** - Integrate Sentry for error monitoring

## Cost Optimization

- **Vercel Free Tier**: Up to 100 GB bandwidth/month
- **Supabase Free Tier**: 500 MB storage, up to 50,000 monthly active users
- **Estimated Costs at Scale**:
  - Small app (< 10k users): ~$50/month
  - Medium app (10k-100k users): ~$200-500/month
  - Large app (> 100k users): ~$1000+/month

Consider upgrading to Pro plans when approaching limits.
