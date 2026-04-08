'use server'

import { createClient } from '@/lib/supabase/server'
import type { ChecklistItem, QuizResult, FeedPost, EncyclopediaArticle, Profile } from '@/types/database'

// Profile operations
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

// Checklist operations
export async function getChecklistItems(userId: string, completed?: boolean): Promise<ChecklistItem[]> {
  const supabase = await createClient()
  let query = supabase
    .from('checklist_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (completed !== undefined) {
    query = query.eq('completed', completed)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching checklist items:', error)
    return []
  }

  return data || []
}

export async function addChecklistItem(userId: string, item: Omit<ChecklistItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ChecklistItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('checklist_items')
    .insert([{ user_id: userId, ...item }])
    .select()
    .single()

  if (error) {
    console.error('Error adding checklist item:', error)
    return null
  }

  return data
}

export async function updateChecklistItem(itemId: string, userId: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('checklist_items')
    .update(updates)
    .eq('id', itemId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating checklist item:', error)
    return null
  }

  return data
}

export async function deleteChecklistItem(itemId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting checklist item:', error)
    return false
  }

  return true
}

// Quiz operations
export async function getQuizResults(userId: string, limit = 10): Promise<QuizResult[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching quiz results:', error)
    return []
  }

  return data || []
}

export async function addQuizResult(userId: string, result: Omit<QuizResult, 'id' | 'user_id' | 'created_at'>): Promise<QuizResult | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quiz_results')
    .insert([{ user_id: userId, ...result }])
    .select()
    .single()

  if (error) {
    console.error('Error adding quiz result:', error)
    return null
  }

  return data
}

export async function getQuizStats(userId: string): Promise<{ totalQuizzes: number; averageScore: number; bestScore: number }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quiz_results')
    .select('score')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching quiz stats:', error)
    return { totalQuizzes: 0, averageScore: 0, bestScore: 0 }
  }

  if (!data || data.length === 0) {
    return { totalQuizzes: 0, averageScore: 0, bestScore: 0 }
  }

  const scores = data.map((r: any) => r.score)
  const totalQuizzes = scores.length
  const averageScore = scores.reduce((a: number, b: number) => a + b, 0) / totalQuizzes
  const bestScore = Math.max(...scores)

  return { totalQuizzes, averageScore, bestScore }
}

// Feed operations
export async function getFeedPosts(limit = 20, offset = 0): Promise<FeedPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching feed posts:', error)
    return []
  }

  return data || []
}

export async function getUserFeedPosts(userId: string): Promise<FeedPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user feed posts:', error)
    return []
  }

  return data || []
}

export async function addFeedPost(userId: string, post: Omit<FeedPost, 'id' | 'user_id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>): Promise<FeedPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('feed_posts')
    .insert([{ user_id: userId, ...post }])
    .select()
    .single()

  if (error) {
    console.error('Error adding feed post:', error)
    return null
  }

  return data
}

// Encyclopedia operations
export async function getEncyclopediaArticles(): Promise<EncyclopediaArticle[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('encyclopedia_articles')
    .select('*')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching encyclopedia articles:', error)
    return []
  }

  return data || []
}

export async function getEncyclopediaArticle(slug: string): Promise<EncyclopediaArticle | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('encyclopedia_articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching encyclopedia article:', error)
    return null
  }

  return data
}

export async function incrementArticleViews(articleId: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('encyclopedia_articles')
    .update({ views_count: supabase.rpc('increment', { x: 1 }) })
    .eq('id', articleId)
}
