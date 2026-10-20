# Masterproef: LLM Codegeneratie met FnO-Steps en SHACL

- Student: Maxim Milet (02201406)
- Onderwerp: Codegeneratie uit semantische contracten
- Doel: Wekelijkse voortgangsmeeting

---

## 1. De Onderzoeksvraag

- **Kernvraag:** Kan een LLM correcte code schrijven vanuit FnO-Steps shapes?
- **Effect van complexiteit:** Hoe verandert de slaagkans bij moeilijkere transformaties?
- **Doel:** Een formele benchmark ontwerpen voor datatransformaties
- **Aanpak:** Vergelijken van formele shapes tegenover gewone tekstprompts

---

## 2. Stand van Zaken (Sinds Vorige Keer)

- Specificaties bestudeerd: FnO, FnO-Steps en W3C SHACL
- Centrale definitielijst opgesteld
- Scherp onderscheid vastgelegd:
  - **FnO-Steps:** procesmodel (welke stap mag draaien)
  - **SHACL:** datavalidatietaal (voldoet de RDF-data aan de regels)
  - **Koppeling:** `steps:hasStateShape` verbindt stap aan test-oracle
- Werkend datumvoorbeeld uitgewerkt in Turtle en Python

---

## 3. Vier Niveaus van Complexiteit

- **Niveau 1:** Syntaxis & regex (bv. datumformaat omzetten)
- **Niveau 2:** Validatie & structuur (kalenderdagen controleren, velden splitsen)
- **Niveau 3:** Data cleaning (fouten, ontbrekende en dubbele waarden)
- **Niveau 4:** Semantiek & lookups (externe codelijsten en URI-mappings)

---

## 4. De Zes Fasen van de LLM Pipeline

1. **Promptcontract:** FnO-specificatie + SHACL input/output shapes
2. **Codegeneratie:** LLM schrijft pure Python-code
3. **Executability:** Code compileert en draait zonder runtime crash
4. **Shape Conformance:** Output valideert tegen SHACL via `pyshacl`
5. **Test-Oracle:** Onafhankelijke asserts (behoud van juiste datumwaarde)
6. **Statistiek:** pass@k evaluatie over meerdere pogingen

---

## 5. Volgende Stappen

- Prototype script bouwen voor de automatische prompt- en validatiecyclus
- Eerste pilot-taken opstellen per moeilijkheidsniveau
- RDF-adapter en foutgedrag bespreken met professoren
- Testcases en prompts bevriezen voor de evaluatie
