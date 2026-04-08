'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Shield, BookOpen, CheckSquare, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
        setIsLoading(false)
      }
    }

    getUser()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="relative h-12 w-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-full w-full border-2 border-blue-500 border-t-transparent rounded-full"
          ></motion.div>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: CheckSquare,
      title: 'Security Checklist',
      description: 'Track your security tasks and stay on top of your cyber hygiene',
      href: '/checklist',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Quizzes',
      description: 'Test your knowledge and earn badges in cybersecurity',
      href: '/quiz',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: BookOpen,
      title: 'Encyclopedia',
      description: 'Learn about malware, threats, and protection strategies',
      href: '/encyclopedia',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Security Feed',
      description: 'Stay updated with the latest security news and tips',
      href: '/feed',
      color: 'from-red-500 to-red-600',
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">CyberShield</h1>
                <p className="text-xs text-slate-400">Cyber Awareness Platform</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.email}</p>
                <p className="text-xs text-slate-400">Security enthusiast</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-slate-400 hover:text-slate-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-slate-400">
            Continue your journey to becoming a cybersecurity expert.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div key={feature.href} variants={item}>
                <Link href={feature.href}>
                  <div className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative">
                      <div className={`inline-flex rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Get Started</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Your Progress</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Tasks Completed', value: '0' },
              { label: 'Quizzes Taken', value: '0' },
              { label: 'Articles Read', value: '0' },
              { label: 'Security Score', value: '0%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-blue-400 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
