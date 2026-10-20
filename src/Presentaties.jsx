import React, { useEffect, useMemo, useState } from 'react'
import { createDeck, validateMeeting } from './deck.js'

const files = import.meta.glob('../meetings/*/notes.compact.json', { eager: true, import: 'default' })
const meetings = Object.entries(files).map(([path, value]) => validateMeeting(value, path))
  .sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0)

function readLocation() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const requested = params.get('meeting') || 'all'
  return {
    meeting: meetings.some((item) => item.date === requested) ? requested : 'all',
    key: params.get('slide') || '',
    view: params.get('view') === 'overview' ? 'overview' : 'slides',
  }
}

function Slide({ slide, active, number, total }) {
  const List = slide.ordered ? 'ol' : 'ul'
  return <section className={`slide${active ? ' is-current' : ''}`} aria-label={`Dia ${number} van ${total}`}>
    <div className="slide-meta"><span>{slide.meetingDate}</span><span>{slide.status === 'concept' ? 'Concept' : 'Vastgelegd'}</span></div>
    <h1>{slide.title}</h1>
    <List>{slide.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}</List>
    {slide.sources?.length > 0 && <div className="sources">{slide.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div>}
    <div className="slide-bottom"><span>Masterproef · Maxim Milet</span><span>{number} / {total}</span></div>
  </section>
}

export default function Presentaties() {
  const [location, setLocation] = useState(readLocation)
  const deck = useMemo(() => createDeck(meetings, location.meeting), [location.meeting])
  const found = deck.findIndex((slide) => slide.key === location.key)
  const index = Math.max(0, found)
  const current = deck[index]

  const navigate = (next) => {
    const slide = deck[Math.max(0, Math.min(deck.length - 1, next))]
    if (slide) setLocation((value) => ({ ...value, key: slide.key }))
  }

  useEffect(() => {
    const params = new URLSearchParams({ meeting: location.meeting })
    if (current) params.set('slide', current.key)
    if (location.view === 'overview') params.set('view', 'overview')
    window.history.replaceState(null, '', `#${params}`)
  }, [location, current?.key])

  useEffect(() => {
    const onHashChange = () => setLocation(readLocation())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, select, textarea, button, a')) return
      if (location.view !== 'slides') return
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); navigate(index + 1) }
      if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); navigate(index - 1) }
      if (event.key === 'Home') { event.preventDefault(); navigate(0) }
      if (event.key === 'End') { event.preventDefault(); navigate(deck.length - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deck, index, location.view])

  return <main className={`presentation ${location.view}`}>
    <header className="toolbar">
      <label>Presentatie<select aria-label="Meeting kiezen" value={location.meeting} onChange={(event) => setLocation((value) => ({ ...value, meeting: event.target.value, key: '' }))}>
        <option value="all">Alle meetings</option>
        {meetings.map((meeting) => <option key={meeting.date} value={meeting.date}>{meeting.title}</option>)}
      </select></label>
      <div className="toolbar-actions">
        <button aria-pressed={location.view === 'overview'} onClick={() => setLocation((value) => ({ ...value, view: value.view === 'slides' ? 'overview' : 'slides' }))}>{location.view === 'slides' ? 'Alle dia’s onder elkaar' : 'Eén dia tegelijk'}</button>
        <button onClick={() => window.print()}>Afdrukken / PDF</button>
      </div>
    </header>
    <div className="deck">
      {deck.length === 0 ? <section className="empty"><h1>Nog geen compacte slides</h1><p>De inhoud voor deze meeting is nog niet geselecteerd.</p></section>
        : deck.map((slide, i) => <Slide key={slide.key} slide={slide} active={i === index} number={i + 1} total={deck.length} />)}
    </div>
    <footer className="navigation">
      <span aria-live="polite">{current ? `${current.meetingDate} · Dia ${index + 1} van ${deck.length}` : 'Geen dia’s'}</span>
      <div><button onClick={() => navigate(index - 1)} disabled={index === 0 || !current}>← Vorige</button><button onClick={() => navigate(index + 1)} disabled={!current || index === deck.length - 1}>Volgende →</button></div>
    </footer>
  </main>
}
