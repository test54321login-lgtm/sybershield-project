-- Create encyclopedia_articles table for malware/security knowledge base
create table if not exists public.encyclopedia_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null,
  description text,
  category text not null,
  icon_name text,
  severity_level text default 'medium',
  views_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_category check (category in ('malware', 'threats', 'protection', 'tips')),
  constraint valid_severity check (severity_level in ('low', 'medium', 'high', 'critical'))
);

-- Create indexes
create index if not exists encyclopedia_articles_slug_idx on public.encyclopedia_articles(slug);
create index if not exists encyclopedia_articles_category_idx on public.encyclopedia_articles(category);
create index if not exists encyclopedia_articles_severity_idx on public.encyclopedia_articles(severity_level);

-- Enable row level security
alter table public.encyclopedia_articles enable row level security;

-- Create policies - everyone can view articles
create policy "Everyone can view encyclopedia articles" on public.encyclopedia_articles
  for select using (true);

-- Insert some default encyclopedia articles
insert into public.encyclopedia_articles (slug, title, content, description, category, icon_name, severity_level) values
(
  'malware',
  'Malware',
  'Malware is malicious software designed to harm or exploit your computer. Learn how to identify and protect against it.',
  'Software designed to harm your computer and steal data',
  'malware',
  'virus',
  'critical'
),
(
  'phishing',
  'Phishing',
  'Phishing is a deceptive technique used to trick you into revealing personal information. Never click suspicious links.',
  'Deceptive emails and websites designed to steal information',
  'threats',
  'mail-alert',
  'high'
),
(
  'ransomware',
  'Ransomware',
  'Ransomware encrypts your files and demands payment for their release. Regular backups are essential protection.',
  'Malware that encrypts files and demands payment',
  'malware',
  'lock',
  'critical'
),
(
  'spyware',
  'Spyware',
  'Spyware secretly monitors your activities. Use strong passwords and keep software updated to prevent infection.',
  'Software that secretly monitors your activities',
  'malware',
  'eye',
  'high'
),
(
  'strong-passwords',
  'Creating Strong Passwords',
  'Use passwords with at least 12 characters including uppercase, lowercase, numbers, and symbols. Avoid personal information.',
  'Best practices for creating secure passwords',
  'protection',
  'shield-check',
  'high'
),
(
  'two-factor-auth',
  'Two-Factor Authentication',
  'Enable 2FA on all important accounts. This adds an extra layer of security beyond your password.',
  'Using 2FA to protect your accounts',
  'protection',
  'shield-alert',
  'high'
),
(
  'software-updates',
  'Keep Software Updated',
  'Regularly update your operating system and applications. Updates patch security vulnerabilities.',
  'Why software updates are critical for security',
  'tips',
  'refresh-cw',
  'high'
),
(
  'backup-strategy',
  'Backup Strategy',
  'Maintain regular backups of important data. Store backups offline to protect against ransomware.',
  'Creating a robust data backup plan',
  'protection',
  'save',
  'high'
);
