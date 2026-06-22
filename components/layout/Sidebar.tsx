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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col h-screen bg-bg-surface border-r border-border md:w-[64px] lg:w-[260px] transition-all duration-150 shrink-0 select-none">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-4 border-b border-border lg:justify-start justify-center">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-accent fill-none stroke-current stroke-[2.5]">
              <path d="M4 20C4 11.1634 11.1634 4 20 4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="hidden lg:inline text-text-primary font-bold text-lg tracking-tight">
            ApplyArc
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors relative border-l-2",
                isActive
                  ? "border-accent bg-accent-soft text-text-primary"
                  : "border-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User block */}
      <div className="p-4 border-t border-border flex items-center gap-3 justify-center lg:justify-start">
        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-mono font-bold shrink-0">
          S
        </div>
        <div className="hidden lg:flex flex-col min-w-0">
          <span className="text-sm font-semibold text-text-primary truncate">Sarath</span>
          <span className="text-[11px] text-text-secondary truncate">sarath@applyarc.io</span>
        </div>
      </div>
    </aside>
  )
}
