import type { ExtendedRecordMap } from 'notion-types'

// Block entries may be wrapped one or more levels deep ({ value: block }).
function unwrapBlock(entry: unknown): {
  format?: Record<string, unknown>
} | null {
  let v = entry as { value?: unknown } | null
  while (
    v &&
    typeof v === 'object' &&
    'value' in v &&
    v.value &&
    typeof v.value === 'object'
  ) {
    v = v.value as { value?: unknown }
  }
  return v as { format?: Record<string, unknown> } | null
}

// Returns a copy of the map with every page's cover removed, so neither
// post pages nor gallery cards render a cover image. Content image blocks
// are untouched, and metadata keeps using the unstripped map.
export function stripPageCovers(
  recordMap: ExtendedRecordMap
): ExtendedRecordMap {
  const clone = JSON.parse(JSON.stringify(recordMap)) as ExtendedRecordMap
  const blocks = (clone as unknown as Record<string, unknown>).block as
    | Record<string, unknown>
    | undefined
  if (!blocks) return clone
  for (const entry of Object.values(blocks)) {
    const block = unwrapBlock(entry)
    if (block && block.format && 'page_cover' in block.format) {
      delete block.format.page_cover
    }
  }
  return clone
}
