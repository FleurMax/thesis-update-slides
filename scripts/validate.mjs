import { readdir, readFile } from 'node:fs/promises'
import { validateMeeting, createDeck } from '../src/deck.js'

const root = new URL('../meetings/', import.meta.url)
const meetings = []
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const path = `meetings/${entry.name}/notes.compact.json`
  const value = JSON.parse(await readFile(new URL(`${entry.name}/notes.compact.json`, root), 'utf8'))
  meetings.push(validateMeeting(value, path))
}
const deck = createDeck(meetings)
console.log(`${meetings.length} meeting(s), ${deck.length} dia's; JSON geldig`)
