import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { NotionPageRoute } from '@/components/NotionPageRoute'
import { BlogPager } from '@/components/BlogPager'
import { getPageData } from '@/lib/get-page-data'
import { createPageMetadata } from '@/lib/page-metadata'
import { getBlogPageCount, sliceRecordMapForPage } from '@/lib/blog-pagination'

export const revalidate = 10
export const dynamicParams = false

// Page 1 lives at /; this route only generates pages 2..N.
export async function generateStaticParams() {
  const pageProps = await getPageData()
  if (!pageProps.recordMap) return []
  const total = getBlogPageCount(pageProps.recordMap)
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    pageNum: String(i + 2)
  }))
}

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata(await getPageData())
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ pageNum: string }>
}) {
  const { pageNum } = await params
  const page = Number.parseInt(pageNum, 10)
  const pageProps = await getPageData()
  if (!pageProps.recordMap) {
    notFound()
  }
  const total = getBlogPageCount(pageProps.recordMap)

  if (!Number.isInteger(page) || page < 2 || page > total) {
    notFound()
  }

  const sliced = sliceRecordMapForPage(pageProps.recordMap, page)

  return (
    <NotionPageRoute
      pageProps={{ ...pageProps, recordMap: sliced }}
      pager={<BlogPager current={page} total={total} />}
    />
  )
}
