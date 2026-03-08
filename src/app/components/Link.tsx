import Link from 'next/link'
import { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof Link>

export default function CustomLink({ prefetch = false, ...props }: LinkProps) {
  return <Link prefetch={prefetch} {...props} />
}
