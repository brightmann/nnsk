// Postbuild: build sitemap.xml from the static export's own pages.
// Next's static export emits both slug.html and slug/index.html forms;
// each maps to one public URL. 404/_not-found pages are excluded.
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'out'
const BASE = 'https://nnsk.luckypoem.workers.dev'
const urls = new Set(['/'])
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name.startsWith('_')) continue
      walk(full)
    } else if (e.name.endsWith('.html')) {
      const rel = path.relative(OUT, full)
      if (rel === '404.html' || rel.startsWith('_not-found')) continue
      if (rel === 'index.html') urls.add('/')
      else if (rel.endsWith('/index.html')) urls.add('/' + rel.slice(0, -'/index.html'.length))
      else urls.add('/' + rel.slice(0, -'.html'.length))
    }
  }
}
walk(OUT)
const list = [...urls].sort()
const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map((u) => `  <url><loc>${BASE}${u}</loc></url>`).join('\n')}\n</urlset>\n`
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), body)
console.log(`sitemap.xml: ${list.length} urls`)
