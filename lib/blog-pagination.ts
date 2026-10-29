import type { ExtendedRecordMap } from 'notion-types'

export const POSTS_PER_PAGE = 4

// Row IDs of the site's blog collection, in the view's order.
// The homepage gallery renders rows from collection_query results;
// this site has a single blog collection.
export function getBlogRowIds(recordMap: ExtendedRecordMap): string[] {
  const queries = (recordMap as unknown as Record<string, unknown>)
    .collection_query as
    | Record<
        string,
        Record<string, { collection_group_results?: { blockIds?: unknown } }>
      >
    | undefined
  if (!queries) return []
  for (const byView of Object.values(queries)) {
    for (const view of Object.values(byView)) {
      const ids = view?.collection_group_results?.blockIds
      if (Array.isArray(ids) && ids.length > 0) return ids as string[]
    }
  }
  return []
}

export function getBlogPageCount(recordMap: ExtendedRecordMap): number {
  return Math.max(
    1,
    Math.ceil(getBlogRowIds(recordMap).length / POSTS_PER_PAGE)
  )
}

// Deep-clone the map with the gallery trimmed to one page's rows, in order.
// Every view's blockIds are filtered to the page slice (views share one order).
export function sliceRecordMapForPage(
  recordMap: ExtendedRecordMap,
  page: number
): ExtendedRecordMap {
  const rowIds = getBlogRowIds(recordMap)
  const pageIds = new Set(
    rowIds.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
  )
  const clone = JSON.parse(JSON.stringify(recordMap)) as ExtendedRecordMap
  const queries = (clone as unknown as Record<string, unknown>)
    .collection_query as
    | Record<
        string,
        Record<string, { collection_group_results?: { blockIds?: unknown } }>
      >
    | undefined
  if (queries) {
    for (const byView of Object.values(queries)) {
      for (const view of Object.values(byView)) {
        const results = view?.collection_group_results
        if (results && Array.isArray(results.blockIds)) {
          results.blockIds = (results.blockIds as string[]).filter((id) =>
            pageIds.has(id)
          )
        }
      }
    }
  }
  return clone
}

export function pageHref(page: number): string {
  return page <= 1 ? '/' : `/page/${page}`
}
