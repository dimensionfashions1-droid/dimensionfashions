import Link from 'next/link'

export function AuthHeader() {
  return (
    <header className="absolute top-0 w-full z-50 py-6 px-8 flex items-center justify-between">
      <Link href="/" className="text-xl font-medium tracking-[0.2em] text-gray-900">
        DIMENSIONS
      </Link>
      <Link href="/" className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors">
        Return to Store
      </Link>
    </header>
  )
}
