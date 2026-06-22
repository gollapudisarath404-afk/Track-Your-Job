'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, ShoppingBag, BarChart2, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Applications', href: '/applications', icon: ClipboardList },
  { label: 'Products', href: '/products', icon: ShoppingBag },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
  { label: 'Archive', href: '/archive', icon: Archive },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-border flex items-center justify-around z-40 md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
              isActive
                ? "text-accent"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Icon className="w-6 h-6" />
          </Link>
        )
      })}
    </nav>
  )
}
