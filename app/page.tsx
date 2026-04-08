'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, CheckCircle2, Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)

      if (user) {
        router.push('/dashboard')
      }
    }

    checkUser()
  }, [supabase.auth, router])

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

  const features = [
    {
      icon: Shield,
      title: 'Learn Security Basics',
      description: 'Comprehensive guides on malware, phishing, ransomware, and more',
    },
    {
      icon: CheckCircle2,
      title: 'Track Your Progress',
      description: 'Use our security checklist to stay protected and monitor your growth',
    },
    {
      icon: Zap,
      title: 'Test Your Knowledge',
      description: 'Take quizzes and earn badges to validate your cybersecurity expertise',
    },
    {
      icon: Lock,
      title: 'Best Practices',
      description: 'Discover proven strategies to protect yourself and your data online',
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">CyberShield</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-400"></span>
              <span className="text-sm text-blue-300">Your Cybersecurity Journey Starts Here</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Master Cybersecurity
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Protect Your Digital Life
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Learn about cyber threats, malware, phishing attacks, and proven security strategies. 
              Track your progress with our interactive checklist and test your knowledge with quizzes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comprehensive Learning Platform
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to understand cybersecurity threats and protect yourself online
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative rounded-lg border border-slate-700 bg-slate-800/50 p-8 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity rounded-lg"></div>
                  
                  <div className="relative">
                    <div className="inline-flex rounded-lg bg-blue-500/20 p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-green-500/10 p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-5"></div>
            
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Secure Your Digital Future?
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users learning about cybersecurity and protecting their online presence.
              </p>
              
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create Your Account Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-700 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-white font-semibold">CyberShield</span>
            </div>
            
            <p className="text-sm text-slate-400">
              © 2024 CyberShield. Educating people about cybersecurity threats.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
