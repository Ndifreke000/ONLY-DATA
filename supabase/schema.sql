-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'analyst', 'admin');
CREATE TYPE project_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE visibility_type AS ENUM ('public', 'private', 'unlisted');
CREATE TYPE hackathon_status AS ENUM ('upcoming', 'active', 'ended');
CREATE TYPE notification_type AS ENUM ('query_fork', 'notebook_comment', 'project_application', 'hackathon_update', 'payment_received');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  role user_role DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallets table
CREATE TABLE public.wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  network TEXT DEFAULT 'starknet',
  provider TEXT, -- 'argent', 'braavos', etc.
  is_primary BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet balances table
CREATE TABLE public.wallet_balances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  address TEXT NOT NULL,
  strk_balance DECIMAL(20, 8) DEFAULT 0,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(address)
);

-- Social links table
CREATE TABLE public.social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'github', 'twitter', etc.
  username TEXT NOT NULL,
  profile_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Queries table
CREATE TABLE public.queries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sql_content TEXT NOT NULL,
  visibility visibility_type DEFAULT 'private',
  forked_from UUID REFERENCES public.queries(id),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  star_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Query runs table
CREATE TABLE public.query_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  query_id UUID REFERENCES public.queries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  execution_time_ms INTEGER,
  status TEXT, -- 'success', 'error', 'timeout'
  error_message TEXT,
  result_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notebooks table
CREATE TABLE public.notebooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  visibility visibility_type DEFAULT 'private',
  forked_from UUID REFERENCES public.notebooks(id),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  star_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notebook versions table
CREATE TABLE public.notebook_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  notebook_id UUID REFERENCES public.notebooks(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  changelog TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(notebook_id, version)
);

-- Notebook comments table
CREATE TABLE public.notebook_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  notebook_id UUID REFERENCES public.notebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyst profiles table
CREATE TABLE public.analyst_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  hourly_rate DECIMAL(10, 2),
  skills TEXT[],
  experience_years INTEGER,
  portfolio_url TEXT,
  availability_status TEXT DEFAULT 'available', -- 'available', 'busy', 'unavailable'
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table (marketplace)
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  deadline DATE,
  status project_status DEFAULT 'open',
  required_skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project applications table
CREATE TABLE public.project_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  analyst_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  pitch TEXT NOT NULL,
  proposed_rate DECIMAL(10, 2),
  estimated_hours INTEGER,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, analyst_id)
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  analyst_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reviewer_id, analyst_id, project_id)
);

-- Hackathons table
CREATE TABLE public.hackathons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  prize_amount DECIMAL(15, 2),
  prize_currency TEXT DEFAULT 'STRK',
  status hackathon_status DEFAULT 'upcoming',
  max_participants INTEGER,
  organizer_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hackathon entries table
CREATE TABLE public.hackathon_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  query_id UUID REFERENCES public.queries(id),
  notebook_id UUID REFERENCES public.notebooks(id),
  submission_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hackathon_id, user_id)
);

-- Hackathon judges table
CREATE TABLE public.hackathon_judges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hackathon_id, user_id)
);

-- Hackathon scores table
CREATE TABLE public.hackathon_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judge_id UUID REFERENCES public.hackathon_judges(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES public.hackathon_entries(id) ON DELETE CASCADE,
  criteria TEXT NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 10),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(judge_id, entry_id, criteria)
);

-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price_strk DECIMAL(10, 2) NOT NULL,
  features JSONB,
  max_queries_per_month INTEGER,
  max_notebooks INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  payment_tx_hash TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract extractions table
CREATE TABLE public.contract_extractions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  contract_address TEXT,
  file_url TEXT,
  extraction_data JSONB,
  status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_queries_user_id ON public.queries(user_id);
CREATE INDEX idx_queries_visibility ON public.queries(visibility);
CREATE INDEX idx_queries_created_at ON public.queries(created_at DESC);
CREATE INDEX idx_notebooks_user_id ON public.notebooks(user_id);
CREATE INDEX idx_notebooks_visibility ON public.notebooks(visibility);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_hackathons_status ON public.hackathons(status);
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, read);
CREATE INDEX idx_wallets_address ON public.wallets(address);
CREATE INDEX idx_wallet_balances_address ON public.wallet_balances(address);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyst_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_extractions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data and public profiles
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR role = 'user');

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Wallets - users can only access their own wallets
CREATE POLICY "Users can manage own wallets" ON public.wallets
  FOR ALL USING (auth.uid() = user_id);

-- Social links - users can only manage their own
CREATE POLICY "Users can manage own social links" ON public.social_links
  FOR ALL USING (auth.uid() = user_id);

-- Queries - public queries are readable by all, private only by owner
CREATE POLICY "Public queries are readable by all" ON public.queries
  FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can manage own queries" ON public.queries
  FOR ALL USING (auth.uid() = user_id);

-- Notebooks - similar to queries
CREATE POLICY "Public notebooks are readable by all" ON public.notebooks
  FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can manage own notebooks" ON public.notebooks
  FOR ALL USING (auth.uid() = user_id);

-- Projects - open projects are visible to analysts
CREATE POLICY "Open projects are visible to all" ON public.projects
  FOR SELECT USING (status = 'open' OR auth.uid() = client_id);

CREATE POLICY "Clients can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = client_id);

-- Notifications - users can only see their own
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Contract extractions - users can only see their own
CREATE POLICY "Users can view own extractions" ON public.contract_extractions
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queries_updated_at BEFORE UPDATE ON public.queries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notebooks_updated_at BEFORE UPDATE ON public.notebooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analyst_profiles_updated_at BEFORE UPDATE ON public.analyst_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
