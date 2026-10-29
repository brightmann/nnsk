import type { Metadata } from 'next'

import { NotionPageRoute } from '@/components/NotionPageRoute'
import { getPageData } from '@/lib/get-page-data'
import { getSiteMap } from '@/lib/get-site-map'
import { isDev, pageUrlOverrides } from '@/lib/config'
import { createPageMetadata } from '@/lib/page-metadata'
import { stripPageCovers } from '@/lib/strip-covers'

interface DynamicPageProps {
  params: Promise<{
    pageId: string
  }>
}

export const revalidate = 10
export const dynamicParams = false

export async function generateStaticParams() {
  if (isDev) {
    return []
  }

  const siteMap = await getSiteMap()
  const pageIds = [
    ...new Set([
      ...Object.keys(siteMap.canonicalPageMap),
      ...Object.keys(pageUrlOverrides)
    ])
  ]

  return pageIds.map((pageId) => ({ pageId }))
}

export async function generateMetadata({
  params
}: DynamicPageProps): Promise<Metadata> {
  const { pageId } = await params

  return createPageMetadata(await getPageData(pageId))
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { pageId } = await params
  const pageProps = await getPageData(pageId)

  return (
    <NotionPageRoute
      pageProps={{
        ...pageProps,
        recordMap: pageProps.recordMap
          ? stripPageCovers(pageProps.recordMap)
          : pageProps.recordMap
      }}
    />
  )
}
