import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="p-6 text-center text-gray-600 dark:text-gray-200">
      <a
        className="inline-block transition-all hover:scale-110 hover:opacity-30"
        href="https://github.com/PerryM123"
        target="_blank"
      >
        <span className="flex flex-col">Built by</span>
        <span className="inline-block text-3xl">
          Perry
          <Image
            className="h-20 rounded-full"
            src="/footer-icon.jpg"
            alt="Footer icon"
            width={80}
            height={80}
          />
        </span>
      </a>
    </footer>
  )
}
