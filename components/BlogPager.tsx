import Link from 'next/link'

import { pageHref } from '@/lib/blog-pagination'

// Numbered pager for the blog listing: Previous | 1 | 2 | … | N | Next.
// Hidden when there is a single page. Page 1 links to / (not /page/1).
export function BlogPager({
  current,
  total
}: {
  current: number
  total: number
}) {
  if (total <= 1) return null

  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <nav
      style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px'
      }}
    >
      {current > 1 ? (
        <Link href={pageHref(current - 1)}>Previous</Link>
      ) : (
        <span>Previous</span>
      )}
      {pages.map((p) =>
        p === current ? (
          <span key={p}>{p}</span>
        ) : (
          <Link key={p} href={pageHref(p)}>
            {p}
          </Link>
        )
      )}
      {current < total ? (
        <Link href={pageHref(current + 1)}>Next</Link>
      ) : (
        <span>Next</span>
      )}
    </nav>
  )
}
