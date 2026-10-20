import test from 'node:test'
import assert from 'node:assert/strict'
import { createDeck, validateMeeting, isMeetingDate } from '../src/deck.js'

const fixture = (date, id = 'eerste') => ({ schemaVersion: 1, date, title: `Meeting ${date}`, status: 'concept', slides: [{ id, title: 'Voorbeeld', bullets: ['Een punt'] }] })

test('combineert meetings chronologisch en behoudt volgorde en inhoud', () => {
  const first = fixture('2026-10-20')
  first.slides.push({ id: 'tweede', title: 'Tweede', bullets: ['B', 'A'] })
  const later = fixture('2027-01-15')
  const before = JSON.stringify([later, first])
  assert.deepEqual(createDeck([later, first]).map((slide) => slide.key), ['2026-10-20/eerste', '2026-10-20/tweede', '2027-01-15/eerste'])
  assert.deepEqual(createDeck([later, first])[1].bullets, ['B', 'A'])
  assert.equal(JSON.stringify([later, first]), before)
  assert.deepEqual(createDeck([later, first]), createDeck([first, later]))
})

test('een toekomstige meeting verandert de eerdere slides niet', () => {
  const first = fixture('2026-10-20')
  const before = createDeck([first])
  const after = createDeck([fixture('2027-01-15'), first], '2026-10-20')
  assert.deepEqual(after, before)
})

test('weigert foutieve data in plaats van inhoud te raden', () => {
  assert.throws(() => validateMeeting({ ...fixture('2026-10-20'), schemaVersion: 2 }))
  assert.throws(() => validateMeeting(fixture('2026-10-20'), 'meetings/2026-10-21/notes.compact.json'))
  assert.throws(() => validateMeeting({ ...fixture('2026-10-20'), privateNotes: 'mag niet mee' }))
  const duplicate = fixture('2026-10-20')
  duplicate.slides.push(duplicate.slides[0])
  assert.throws(() => validateMeeting(duplicate))
  assert.throws(() => createDeck([fixture('2026-10-20'), fixture('2026-10-20')]))
  const unsafe = fixture('2026-10-20')
  unsafe.slides[0].sources = [{ label: 'bron', url: 'javascript:alert(1)' }]
  assert.throws(() => validateMeeting(unsafe))
})

test('valideert echte kalenderdatums en staat een leeg concept toe', () => {
  assert.equal(isMeetingDate('2026-02-29'), false)
  assert.equal(isMeetingDate('2028-02-29'), true)
  assert.equal(isMeetingDate('2026-13-01'), false)
  assert.equal(isMeetingDate('20-10-2026'), false)
  const empty = { ...fixture('2026-10-20'), slides: [] }
  assert.deepEqual(createDeck([empty]), [])
  assert.throws(() => validateMeeting({ ...empty, status: 'vastgelegd' }))
})
