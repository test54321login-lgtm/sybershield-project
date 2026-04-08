'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Shield, LogOut, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { EncyclopediaArticle } from '@/types/database'

export default function EncyclopediaPage() {
  const [articles, setArticles] = useState<EncyclopediaArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
        .from('encyclopedia_articles')
        .select('*')
        .order('title', { ascending: true })

      if (error) {
        console.error('Error fetching articles:', error)
      } else {
        setArticles(data || [])
      }
      setIsLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const categories = ['malware', 'threats', 'protection', 'tips']
  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category === selectedCategory)
    : articles

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'from-red-500 to-red-600'
      case 'high':
        return 'from-orange-500 to-orange-600'
      case 'medium':
        return 'from-yellow-500 to-yellow-600'
      default:
        return 'from-green-500 to-green-600'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Security Encyclopedia</h2>
          </div>
          <p className="text-slate-400">
            Learn about cybersecurity threats, protection strategies, and best practices
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden hover:border-blue-500 transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${getSeverityColor(article.severity_level)} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl rounded-full -mr-16 -mt-16`}></div>

              <div className="relative p-6">
                {/* Severity Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 capitalize`}>
                    <AlertTriangle className="h-3 w-3" />
                    {article.severity_level}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {article.description}
                </p>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 capitalize">
                    {article.category}
                  </span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-400">No articles found in this category.</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
