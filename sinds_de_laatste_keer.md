# Sinds de laatste keer

Dit bestand start na elke meeting leeg. Hier verzamelen we tussendoor notities, inzichten en gelezen zaken. Voor de volgende meeting zetten we dit om naar de slides.

---

### Notities voor de volgende meeting

- **Ik heb geleerd over FnO, FnO-Steps en SHACL:**
  - FnO beschrijft abstracte functies los van de programmeertaal (`fno:Function`, `fno:expects`, `fno:returns`, `fno:predicate`).
  - FnO-Steps modelleert het workflowproces en de volgorde (`steps:Step`, `steps:State`, `steps:requiresState`, `steps:producesState`).
  - SHACL valideert de datastructuur en datakwaliteit (`sh:NodeShape`, `sh:PropertyShape`, `sh:datatype`, `sh:pattern`, `sh:minCount`).
  - `steps:hasStateShape` verbindt de workflowtoestand aan een SHACL-shape als test-oracle.

- **Mijn onderzoeksvraag:**
  > In welke mate kan een LLM correcte code genereren uit FnO Step shapes, en hoe verandert de slaagkans naarmate de complexiteit van de transformatie stijgt? Er moet een benchmark worden ontworpen die transformaties indeelt in verschillende graden van complexiteit (eenvoudige regex, kalendervalidatie, multi-veldcombinaties en semantische URI-lookups).

- **Ik heb geleerd over de verschillende niveaus van transformatie:**
  - *Niveau 1 (Syntactisch formaat):* 1-op-1 stringconversies via reguliere expressies (bv. datumformaat omzetten).
  - *Niveau 2 (Validatie & Structuur):* Inhoudelijke validatie (bv. echte kalenderdagen controleren) en het splitsen of samenvoegen van velden.
  - *Niveau 3 (Data Cleaning & Anomalieën):* Opsporen en corrigeren van ontbrekende, foutieve of dubbele waarden in records.
  - *Niveau 4 (Semantische context & Lookups):* Gebruik van externe kennisbronnen, codelijsten of URI-lookups tussen ontologieën.

- **Ik heb geleerd over de fasen van de LLM evaluatiepipeline:**
  1. *Prompting & contractfase:* Het model krijgt de abstracte FnO-definitie en de SHACL-shapes als contract in plaats van vage instructies.
  2. *Codegeneratiefase:* Het LLM genereert de transformatiefunctie in Python.
  3. *Executability-fase (Syntaxis & Uitvoering):* Controle of de gegenereerde code zonder fouten compileert en uitvoert.
  4. *Shape Conformance-fase (SHACL validatie):* De uitvoerdata wordt getoetst aan de SHACL OutputShape via `pyshacl` (`sh:conforms true/false`).
  5. *Semantische validatie (Inhoudelijk Test-Oracle):* Onafhankelijke asserts en grensgevallen controleren of de data inhoudelijk klopt (bv. of dezelfde datum behouden bleef en niet vervangen is door een constante datum).
  6. *Statistische evaluatie (pass@k):* Berekenen van de kans dat minstens 1 van de $k$ gegenereerde codevarianten slaagt over verschillende moeilijkheidsgraden.
