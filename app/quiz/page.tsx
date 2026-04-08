'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, LogOut, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { QuizResult } from '@/types/database'

const quizzes = [
  {
    id: 'malware-basics',
    title: 'Malware Basics',
    description: 'Test your knowledge about different types of malware',
    difficulty: 'Beginner',
    questions: 10,
    category: 'malware',
  },
  {
    id: 'phishing-detection',
    title: 'Phishing Detection',
    description: 'Learn to identify phishing attempts and social engineering',
    difficulty: 'Intermediate',
    questions: 15,
    category: 'threats',
  },
  {
    id: 'password-security',
    title: 'Password Security',
    description: 'Master the art of creating and managing secure passwords',
    difficulty: 'Beginner',
    questions: 12,
    category: 'protection',
  },
  {
    id: 'ransomware-protection',
    title: 'Ransomware Protection',
    description: 'Understand ransomware and how to protect against it',
    difficulty: 'Advanced',
    questions: 20,
    category: 'malware',
  },
]

export default function QuizPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ totalQuizzes: 0, averageScore: 0, bestScore: 0 })
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
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setResults(data)

        // Calculate stats
        if (data.length > 0) {
          const scores = data.map(r => r.score)
          setStats({
            totalQuizzes: data.length,
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            bestScore: Math.max(...scores),
          })
        }
      }
      setIsLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'from-green-500 to-green-600'
      case 'Intermediate':
        return 'from-yellow-500 to-yellow-600'
      case 'Advanced':
        return 'from-red-500 to-red-600'
      default:
        return 'from-blue-500 to-blue-600'
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
            <BarChart3 className="h-8 w-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">Security Quizzes</h2>
          </div>
          <p className="text-slate-400">
            Test your knowledge and track your learning progress
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Quizzes Completed', value: stats.totalQuizzes },
            { label: 'Average Score', value: `${stats.averageScore}%` },
            { label: 'Best Score', value: `${stats.bestScore}%` },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-center"
            >
              <p className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Available Quizzes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Available Quizzes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden hover:border-blue-500 transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${getDifficultyColor(quiz.difficulty)} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl rounded-full -mr-16 -mt-16`}></div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {quiz.title}
                    </h4>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(quiz.difficulty)} text-white`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-4">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      {quiz.questions} questions
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">Recent Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 transition-all"
                >
                  <div>
                    <p className="font-medium text-white">{result.quiz_title}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(result.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-400">{result.score}%</p>
                    <p className="text-xs text-slate-400">
                      {result.correct_answers} of {result.total_questions}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
