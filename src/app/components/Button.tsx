import Link from '@/app/components/Link'
import { ReactNode } from 'react'
import { isExternalLink } from '@/app/utils'

type ButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  variant?: 'button' | 'link'
  target?: string
  rel?: string
}

export default function Button({
  children,
  href,
  onClick,
  disabled = false,
  className = '',
  variant = 'button',
  target,
  rel,
}: ButtonProps) {
  const baseClasses =
    'rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-900'
  const disabledClasses = 'disabled:cursor-not-allowed disabled:opacity-50'
  const linkClasses = variant === 'link' ? 'inline-block' : 'cursor-pointer'
  const combinedClasses = `${baseClasses} ${linkClasses} ${
    disabled ? disabledClasses : ''
  } ${className}`.trim()
  if (href) {
    if (isExternalLink(href)) {
      return (
        <a href={href} className={combinedClasses} target={target} rel={rel}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={combinedClasses} target={target} rel={rel}>
        {children}
      </Link>
    )
  }
  return (
    <button onClick={onClick} disabled={disabled} className={combinedClasses}>
      {children}
    </button>
  )
}
