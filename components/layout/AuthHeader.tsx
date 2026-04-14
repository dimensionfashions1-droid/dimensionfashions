'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AuthHeader() {
  const pathname = usePathname()
  const isRegister = pathname?.includes('/register')

  return (
    <header className="absolute top-0 w-full z-50 py-6 px-8 flex items-end justify-end">

      <Link
        href="/"
        className={'text-xs uppercase tracking-wider transition-colors  text-gray-800 hover:text-accent'}
      >
        Return to Store
      </Link>
    </header>
  )
}
