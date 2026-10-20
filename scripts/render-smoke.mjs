import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readdir, readFile } from 'node:fs/promises'

const folders = await readdir(new URL('../meetings/', import.meta.url), { withFileTypes: true })
const meetings = await Promise.all(folders.filter((folder) => folder.isDirectory()).map(async (folder) =>
  JSON.parse(await readFile(new URL(`../meetings/${folder.name}/notes.compact.json`, import.meta.url), 'utf8'))))
const total = meetings.reduce((count, meeting) => count + meeting.slides.length, 0)
const sample = meetings.find((meeting) => meeting.slides.length > 0)
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [], include: [] } })
try {
  const { default: Presentaties } = await server.ssrLoadModule('/src/Presentaties.jsx')
  globalThis.window = { location: { hash: '' } }
  const all = renderToStaticMarkup(React.createElement(Presentaties))
  assert.ok(all.includes('Alle meetings'))
  assert.equal((all.match(/<section class="slide/g) || []).length, total)
  assert.equal((all.match(/class="slide is-current"/g) || []).length, total > 0 ? 1 : 0)
  const slides = meetings.flatMap((meeting) => meeting.slides)
  assert.equal((all.match(/class="arrow-list"/g) || []).length, slides.filter((slide) => slide.bulletStyle === 'arrow').length)
  assert.equal((all.match(/class="lead"/g) || []).length, slides.filter((slide) => slide.lead).length)
  assert.equal((all.match(/<table /g) || []).length, slides.filter((slide) => slide.table).length)
  assert.equal((all.match(/scope="row"/g) || []).length, slides.reduce((count, slide) => count + (slide.table?.rows.length || 0), 0))
  if (sample) {
    const last = sample.slides.at(-1)
    globalThis.window.location.hash = `#meeting=${sample.date}&slide=${encodeURIComponent(`${sample.date}/${last.id}`)}&view=overview`
    const selected = renderToStaticMarkup(React.createElement(Presentaties))
    assert.ok(selected.includes('presentation overview'))
    assert.ok(selected.includes(`Dia ${sample.slides.length} van ${sample.slides.length}`))
    assert.equal((selected.match(/<section class="slide/g) || []).length, sample.slides.length)
  }
  console.log('React-render geslaagd: totaal, meetingfilter, vaste dialink, overzicht, pijltjes en tabellen')
} finally {
  delete globalThis.window
  await server.close()
}
