import Link from '@/app/components/Link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="transition-all hover:opacity-30">
              <h1 className="text-xl font-bold text-black">
                GITHUB REPO SEARCH
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
