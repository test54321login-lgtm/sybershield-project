export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export type ChecklistItem = {
  id: string
  user_id: string
  title: string
  description: string | null
  category: 'account' | 'device' | 'network' | 'data' | 'password' | 'software'
  completed: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string | null
  created_at: string
  updated_at: string
}

export type QuizResult = {
  id: string
  user_id: string
  quiz_id: string
  quiz_title: string
  total_questions: number
  correct_answers: number
  score: number
  time_spent_seconds: number | null
  completed_at: string
  created_at: string
}

export type FeedPost = {
  id: string
  user_id: string
  title: string
  content: string
  category: 'malware' | 'phishing' | 'ransomware' | 'tips' | 'news' | 'other'
  tags: string[]
  likes_count: number
  comments_count: number
  published: boolean
  created_at: string
  updated_at: string
}

export type EncyclopediaArticle = {
  id: string
  slug: string
  title: string
  content: string
  description: string | null
  category: 'malware' | 'threats' | 'protection' | 'tips'
  icon_name: string | null
  severity_level: 'low' | 'medium' | 'high' | 'critical'
  views_count: number
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
  created_at: string
  updated_at: string
}
