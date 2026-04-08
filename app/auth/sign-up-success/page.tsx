'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CheckCircle2, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl">
          <CardHeader className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75"
                ></motion.div>
                <div className="relative bg-slate-800 rounded-full p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold text-white">
                Account Created!
              </CardTitle>
              <CardDescription className="mt-2 text-slate-400">
                Welcome to the CyberShield community
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-4 rounded-lg bg-blue-500/10 border border-blue-500/30 p-4"
            >
              <Mail className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-400">
                  Check your email
                </p>
                <p className="text-xs text-blue-300/80">
                  We&apos;ve sent a confirmation link to your email address.
                  Click it to verify your account.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <p className="text-sm text-slate-300">
                <span className="font-medium">What&apos;s next?</span>
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-slate-600"></span>
                  Verify your email address
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-slate-600"></span>
                  Complete your profile
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-slate-600"></span>
                  Start learning about cybersecurity
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-2 pt-2"
            >
              <Link href="/auth/login" className="block">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Go to Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <p className="text-xs text-slate-400 text-center">
                Didn&apos;t receive the email?{' '}
                <button
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  onClick={() => alert('Resend email functionality would be implemented here')}
                >
                  Resend it
                </button>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-slate-500 mt-6"
        >
          By signing up, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  )
}
