import { mkdir, writeFile } from 'node:fs/promises'
import { isMeetingDate } from '../src/deck.js'

const [date, ...words] = process.argv.slice(2)
if (!isMeetingDate(date)) throw new Error('gebruik: npm run meeting:new -- JJJJ-MM-DD [titel]')
const folder = new URL(`../meetings/${date}/`, import.meta.url)
await mkdir(folder, { recursive: true })
const meeting = { schemaVersion: 1, date, title: words.join(' ') || `Meeting ${date}`, status: 'concept', slides: [] }
await writeFile(new URL('notes.compact.json', folder), `${JSON.stringify(meeting, null, 2)}\n`, { flag: 'wx' })
console.log(`meetings/${date}/notes.compact.json aangemaakt; bestaande bestanden worden nooit overschreven`)
