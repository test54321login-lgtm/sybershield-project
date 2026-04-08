'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, LogOut, Share2, Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { FeedPost } from '@/types/database'

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      const { data, error } = await supabase
        .from('feed_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data || [])
      }
      setIsLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'malware':
        return 'bg-red-500/20 text-red-300'
      case 'phishing':
        return 'bg-orange-500/20 text-orange-300'
      case 'ransomware':
        return 'bg-purple-500/20 text-purple-300'
      case 'tips':
        return 'bg-green-500/20 text-green-300'
      case 'news':
        return 'bg-blue-500/20 text-blue-300'
      default:
        return 'bg-slate-500/20 text-slate-300'
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-2 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">CyberShield</h1>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-slate-400 hover:text-slate-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Security Feed</h2>
          <p className="text-slate-400">
            Stay updated with the latest security news, tips, and community insights
          </p>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
              >
                {/* Post Header */}
                <div className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold">
                      {post.id.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Community Post</p>
                      <p className="text-xs text-slate-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>

                {/* Post Content */}
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 text-slate-400">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Footer - Engagement */}
                <div className="border-t border-slate-700 px-6 py-3 flex items-center justify-between bg-slate-900/30">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.likes_count}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.comments_count}</span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-slate-400 hover:text-green-400 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-400 mb-4">No posts yet. Be the first to share!</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create a Post
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
