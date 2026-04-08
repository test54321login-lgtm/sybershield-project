'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Shield, LogOut, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { ChecklistItem } from '@/types/database'

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([])
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
        .from('checklist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching checklist:', error)
      } else {
        setItems(data || [])
      }
      setIsLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleToggleComplete = async (itemId: string, completed: boolean) => {
    const { error } = await supabase
      .from('checklist_items')
      .update({ completed: !completed })
      .eq('id', itemId)

    if (!error) {
      setItems(items.map(item =>
        item.id === itemId ? { ...item, completed: !completed } : item
      ))
    }
  }

  const handleDelete = async (itemId: string) => {
    const { error } = await supabase
      .from('checklist_items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      setItems(items.filter(item => item.id !== itemId))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const completedCount = items.filter(i => i.completed).length
  const completionPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  const categories = ['account', 'device', 'network', 'data', 'password', 'software']
  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-8 w-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">Security Checklist</h2>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          <p className="text-slate-400">
            Complete security tasks to protect your digital life
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-lg border border-slate-700 bg-slate-800/50 p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white">Overall Progress</p>
            <p className="text-sm font-bold text-blue-400">{completionPercentage}%</p>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-green-500"
            ></motion.div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {completedCount} of {items.length} tasks completed
          </p>
        </motion.div>

        {/* Checklist Items by Category */}
        <AnimatePresence>
          {Object.entries(groupedItems).map(([category, categoryItems]) => 
            categoryItems.length > 0 && (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4 capitalize flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-blue-400"></span>
                  {category}
                </h3>

                <div className="space-y-2">
                  {categoryItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:border-blue-500 hover:bg-slate-800/80 transition-all duration-300"
                    >
                      <button
                        onClick={() => handleToggleComplete(item.id, item.completed)}
                        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          item.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-slate-500 hover:border-green-400'
                        }`}
                      >
                        {item.completed && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium transition-all ${
                            item.completed
                              ? 'text-slate-500 line-through'
                              : 'text-white'
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-sm text-slate-400 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.priority === 'critical'
                            ? 'bg-red-500/20 text-red-300'
                            : item.priority === 'high'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {item.priority}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-400 mb-4">No checklist items yet.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
