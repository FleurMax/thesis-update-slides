const keys = (value, allowed, path) => {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) throw new Error(`${path}: onbekend veld ${key}`)
  }
}

const object = (value, path) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path}: object verwacht`)
}

const text = (value, path, limit = 260) => {
  if (typeof value !== 'string' || !value.trim() || value.length > limit) {
    throw new Error(`${path}: tekst van 1 tot ${limit} tekens verwacht`)
  }
}

export function isMeetingDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number(value.slice(0, 4)) >= 2000
    && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
    && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
}

export function validateMeeting(meeting, path = 'meeting') {
  object(meeting, path)
  keys(meeting, ['schemaVersion', 'date', 'title', 'status', 'slides'], path)
  if (meeting.schemaVersion !== 1) throw new Error(`${path}: schemaVersion moet 1 zijn`)
  if (!isMeetingDate(meeting.date)) throw new Error(`${path}: geldige datum als JJJJ-MM-DD verwacht`)
  const folderDate = path.match(/meetings\/(\d{4}-\d{2}-\d{2})\//)?.[1]
  if (folderDate && folderDate !== meeting.date) throw new Error(`${path}: datum verschilt van mapnaam`)
  text(meeting.title, `${path}.title`, 100)
  if (!['concept', 'vastgelegd'].includes(meeting.status)) throw new Error(`${path}: ongeldige status`)
  if (!Array.isArray(meeting.slides)) throw new Error(`${path}.slides: lijst verwacht`)
  if (meeting.status === 'vastgelegd' && meeting.slides.length === 0) throw new Error(`${path}: vastgelegde meeting heeft geen slides`)
  const ids = new Set()
  meeting.slides.forEach((slide, i) => {
    const location = `${path}.slides[${i}]`
    object(slide, location)
    keys(slide, ['id', 'title', 'lead', 'bullets', 'bulletStyle', 'ordered', 'table', 'sources'], location)
    if (typeof slide.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slide.id)) throw new Error(`${location}: ongeldig id`)
    if (ids.has(slide.id)) throw new Error(`${location}: dubbel id ${slide.id}`)
    ids.add(slide.id)
    text(slide.title, `${location}.title`, 120)
    if (!Array.isArray(slide.bullets) || slide.bullets.length < 1 || slide.bullets.length > 8) throw new Error(`${location}: 1 tot 8 bullets verwacht`)
    slide.bullets.forEach((bullet, j) => text(bullet, `${location}.bullets[${j}]`))
    if (slide.lead !== undefined) text(slide.lead, `${location}.lead`, 400)
    if (slide.bulletStyle !== undefined && slide.bulletStyle !== 'arrow') throw new Error(`${location}.bulletStyle: arrow verwacht`)
    if (slide.ordered !== undefined && typeof slide.ordered !== 'boolean') throw new Error(`${location}.ordered: boolean verwacht`)
    if (slide.ordered && slide.bulletStyle === 'arrow') throw new Error(`${location}: kies een genummerde lijst of pijltjes`)
    if (slide.table !== undefined) {
      object(slide.table, `${location}.table`)
      keys(slide.table, ['columns', 'rows'], `${location}.table`)
      const { columns, rows } = slide.table
      if (!Array.isArray(columns) || columns.length < 2 || columns.length > 4) throw new Error(`${location}.table: 2 tot 4 kolommen verwacht`)
      columns.forEach((column, j) => text(column, `${location}.table.columns[${j}]`, 80))
      if (!Array.isArray(rows) || rows.length < 1 || rows.length > 8) throw new Error(`${location}.table: 1 tot 8 rijen verwacht`)
      rows.forEach((row, j) => {
        if (!Array.isArray(row) || row.length !== columns.length) throw new Error(`${location}.table.rows[${j}]: aantal cellen verschilt van kolommen`)
        row.forEach((cell, k) => text(cell, `${location}.table.rows[${j}][${k}]`, 160))
      })
    }
    if (slide.sources !== undefined) {
      if (!Array.isArray(slide.sources) || slide.sources.length > 3) throw new Error(`${location}.sources: maximaal 3 bronnen`)
      slide.sources.forEach((source) => {
        object(source, `${location}.source`)
        keys(source, ['label', 'url'], `${location}.source`)
        text(source.label, `${location}.source.label`, 100)
        if (typeof source.url !== 'string' || !/^https:\/\//.test(source.url)) throw new Error(`${location}.source: https-url verwacht`)
        try { new URL(source.url) } catch { throw new Error(`${location}.source: ongeldige url`) }
      })
    }
  })
  return meeting
}

export function createDeck(meetings, selection = 'all') {
  const dates = new Set()
  const sorted = [...meetings].map((meeting) => {
    validateMeeting(meeting)
    if (dates.has(meeting.date)) throw new Error(`Dubbele meetingdatum: ${meeting.date}`)
    dates.add(meeting.date)
    return meeting
  }).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0)
  return sorted.filter((meeting) => selection === 'all' || meeting.date === selection)
    .flatMap((meeting) => meeting.slides.map((slide) => ({
      ...slide,
      key: `${meeting.date}/${slide.id}`,
      meetingDate: meeting.date,
      meetingTitle: meeting.title,
      status: meeting.status,
    })))
}
