# Masterproef: LLM Codegeneratie met FnO-Steps en SHACL

- **Student:** Maxim Milet (02201406)
- **Onderwerp:** Automatische transformatie-codegeneratie uit semantische contracten
- **Status:** Wekelijkse voortgangsmeeting

---

## 1. De Onderzoeksvraag

- **Kernvraag:**
  - In welke mate kan een LLM correcte code genereren uit FnO Step shapes?
  - Hoe verandert de slaagkans naarmate de complexiteit van de taak stijgt?
- **Doel van het onderzoek:**
  - Een betrouwbare benchmark ontwerpen voor datatransformaties.
  - De rol van formele SHACL-contracten onderzoeken tegenover vrije tekst.

---

## 2. Wat is er gedaan sinds de vorige meeting?

- **Literatuur en definities geconsolideerd:**
  - Officiële specificaties van FnO, FnO-Steps en W3C SHACL geraadpleegd.
  - Centrale definitielijst opgesteld in de thesis-omgeving.
- **Duidelijk onderscheid vastgelegd:**
  - FnO-Steps = proces- en workflowmodel (welke stap mag draaien).
  - SHACL = datavalidatietaal (voldoet de RDF-data aan de regels).
  - `steps:hasStateShape` = formele koppeling en test-oracle.
- **Praktijkvoorbeelden uitgewerkt:**
  - Datumconversie gemodelleerd in Turtle en gekoppeld aan veilige Python-code.

---

## 3. De 4 Complexiteitsniveaus van Transformaties

- **Niveau 1: Syntactische formaattransformatie**
  - 1-op-1 string conversies via regex (bv. DD/MM/YYYY naar YYYY-MM-DD).
- **Niveau 2: Structuur en validatie**
  - Echte kalendercontrole (bv. schrikkeljaren) en velden splitsen/samenvoegen.
- **Niveau 3: Data cleaning & anomalieën**
  - Detecteren en herstellen van ontbrekende, inconsistente of dubbele waarden.
- **Niveau 4: Semantische mapping & context**
  - Betekenisvertaling met ontologieën, externe codelijsten en URI-lookups.

---

## 4. De 6 Fasen van de LLM Evaluatiepipeline

1. **Promptcontract:** FnO-definitie + SHACL-shapes als harde input.
2. **Codegeneratie:** LLM schrijft pure Python-code.
3. **Executability:** Compileert de code en draait ze zonder runtime crash?
4. **Shape Conformance:** Valideert de uitvoer tegen de SHACL OutputShape?
5. **Semantisch Test-Oracle:** Inhoudelijke asserts (bv. blijft de juiste datum bewaard?).
6. **Statistische evaluatie:** Kwantitatieve meting met pass@k over meerdere pogingen.

---

## 5. Volgende Stappen voor Komende Week

- [ ] Prototype script bouwen voor geautomatiseerde prompt- en validatiecyclus.
- [ ] Eerste proeftaken (pilot) ontwerpen per moeilijkheidsniveau.
- [ ] Contract met de professoren afstemmen (RDF adapter en foutgedrag).
- [ ] Feedback verwerken en testsuite bevriezen.
