'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone } from 'lucide-react'

const FIRST_NAMES = [
  'James', 'Michael', 'Robert', 'David', 'Chris', 'Daniel', 'Matthew', 'Andrew',
  'Joshua', 'Ryan', 'Tyler', 'Brandon', 'Justin', 'Nathan', 'Kevin', 'Brian',
  'Sarah', 'Jessica', 'Ashley', 'Amanda', 'Stephanie', 'Melissa', 'Nicole',
  'Jennifer', 'Lauren', 'Rachel', 'Megan', 'Brittany', 'Amber', 'Heather',
  'Carlos', 'Marcus', 'Anthony', 'Jordan', 'Derek', 'Trevor', 'Cody', 'Blake',
]

const LAST_INITIALS = 'ABCDEFGHJKLMNOPRSTW'.split('')

const LOCATIONS = [
  'Austin, TX', 'Dallas, TX', 'Miami, FL', 'Phoenix, AZ', 'Denver, CO',
  'Atlanta, GA', 'Charlotte, NC', 'Nashville, TN', 'Las Vegas, NV', 'Tampa, FL',
  'Chicago, IL', 'Houston, TX', 'Scottsdale, AZ', 'San Diego, CA', 'Portland, OR',
  'Columbus, OH', 'Raleigh, NC', 'Jacksonville, FL', 'Salt Lake City, UT', 'Seattle, WA',
]

const TIME_AGO = [
  'just now', '2 minutes ago', '4 minutes ago', '7 minutes ago', '11 minutes ago',
]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateNotification() {
  const first = randomFrom(FIRST_NAMES)
  const lastInit = randomFrom(LAST_INITIALS)
  const location = randomFrom(LOCATIONS)
  const time = randomFrom(TIME_AGO)
  return { first, lastInit, location, time, id: Math.random() }
}

interface SocialProofNotificationProps {
  /** Interval in milliseconds between notifications. Default: 45000 (45s) */
  intervalMs?: number
}

export default function SocialProofNotification({
  intervalMs = 45000,
}: SocialProofNotificationProps) {
  const [notification, setNotification] = useState<ReturnType<typeof generateNotification> | null>(null)
  const [visible, setVisible] = useState(false)

  const show = useCallback(() => {
    const n = generateNotification()
    setNotification(n)
    setVisible(true)

    // Auto-hide after 6 seconds
    setTimeout(() => setVisible(false), 6000)
  }, [])

  useEffect(() => {
    // Show first notification after a short delay on mount
    const initial = setTimeout(show, 8000)
    const interval = setInterval(show, intervalMs)
    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [show, intervalMs])

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {visible && notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -60, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -40, y: 10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-2xl max-w-[290px]"
            style={{
              backgroundColor: '#161108',
              border: '1px solid #3a2e14',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(180,141,56,0.08)',
            }}
          >
            {/* Icon */}
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: '#b38d3820', border: '1px solid #b38d3840' }}
            >
              <Phone className="h-4 w-4" style={{ color: '#b38d38' }} />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-snug text-white">
                {notification.first} {notification.lastInit}.{' '}
                <span style={{ color: '#b38d38' }}>booked a strategy call</span>
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: '#7a6a4a' }}>
                {notification.location} &middot; {notification.time}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setVisible(false)}
              className="ml-auto shrink-0 self-start text-[#4a3e24] hover:text-[#b38d38] transition-colors text-[16px] leading-none"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
