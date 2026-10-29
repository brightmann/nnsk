import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { NotionPageRoute } from '@/components/NotionPageRoute'
import { BlogPager } from '@/components/BlogPager'
import { getPageData } from '@/lib/get-page-data'
import { createPageMetadata } from '@/lib/page-metadata'
import { getBlogPageCount, sliceRecordMapForPage } from '@/lib/blog-pagination'
import { stripPageCovers } from '@/lib/strip-covers'

export const revalidate = 10

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata(await getPageData())
}

export default async function HomePage() {
  const pageProps = await getPageData()
  if (!pageProps.recordMap) {
    notFound()
  }
  const total = getBlogPageCount(pageProps.recordMap)
  const sliced = stripPageCovers(sliceRecordMapForPage(pageProps.recordMap, 1))

  return (
    <NotionPageRoute
      pageProps={{ ...pageProps, recordMap: sliced }}
      pager={<BlogPager current={1} total={total} />}
    />
  )
}
