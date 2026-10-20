# Guidelines: Thesis Presentatie & Slides

Dit document bevat de richtlijnen voor de wekelijkse thesispresentatie en beschrijft drie technische methodes om de slides online up-to-date te houden via code en de AI-assistent.

---

## 1. Stijl- en Presentatierichtlijnen

- **Houd het zo simpel mogelijk:**
  - De slides hoeven helemaal niet mooi te zijn.
  - Geen drukke layouts, complexe animaties of overbodige vormgeving.
  - Gewoon duidelijke tekst op een rustige achtergrond.
- **Korte zinnen en bullet points:**
  - Gebruik korte, directe zinnen.
  - Werk met beknopte opsommingstekens.
  - Geen lange lappen tekst of academische volzinnen.
- **Vaste structuur per meeting:**
  1. *Wat is er gedaan sinds de vorige meeting?* (concreet resultaat)
  2. *Belangrijkste inzichten of geleerde zaken* (technisch / literatuur)
  3. *Open vragen of keuzes voor de professoren* (waarop feedback nodig is)
  4. *Volgende stappen voor komende week*
- **Werkwijze met `sinds_de_laatste_keer.md`:**
  - Gedurende de week noteer je alles wat je leest, codeert of ontdekt in `sinds_de_laatste_keer.md`.
  - Vlak voor de meeting vraagt de student aan de AI-assistent om deze notities samen te vatten en om te zetten naar de slides.
  - Na afloop van de meeting wordt `sinds_de_laatste_keer.md` weer volledig leeggemaakt voor de volgende cyclus.

---

## 2. Drie Technische Methodes voor Online Slides

Het doel is dat de presentatie online bereikbaar is voor professoren via een vaste URL, en dat de AI-assistent of een lokaal script de inhoud automatisch kan bijwerken.

### Methode 1: Markdown Slides via GitHub Pages of GitLab Pages (Aanbevolen)
- **Hoe het werkt:**
  - De presentatie wordt geschreven in een puur tekstbestand: `slides.md` (met behulp van Marp of Reveal.js).
  - Een GitHub Action of GitLab CI pipeline zet dit Markdown-bestand bij elke commit automatisch om in een interactieve HTML-presentatie.
  - De presentatie staat live op een publieke webpagina (bijvoorbeeld `https://maximmilet.github.io/thesis-slides`).
- **Voordelen voor de AI en student:**
  - De AI-assistent kan een Markdown-bestand direct, foutloos en razendsnel lokaal aanpassen.
  - Volledig versiebeheer via Git: je kunt altijd zien wat er per meeting veranderd is.
  - Geen gedoe met tokens of inloggen via OAuth; een eenvoudige `git push` werkt de website online bij.
  - Marp kan vanuit hetzelfde Markdown-bestand met één commando ook een `.pptx` of `.pdf` exporteren.

### Methode 2: Rechtstreeks Google Slides bijwerken via de Google Slides API
- **Hoe het werkt:**
  - Je maakt een presentatie aan op Google Drive en deelt de link met de professoren.
  - In Google Cloud Console maak je een gratis project aan en activeer je de **Google Slides API**.
  - Je maakt een Service Account aan en downloadt de `credentials.json`.
  - Een lokaal Python-script (met `google-api-python-client`) kan via de API rechtstreeks dia's aanmaken, teksten aanpassen of nieuwe bullet points toevoegen op de live Google Slides presentatie.
- **Voordelen:**
  - Staat direct in Google Slides; professoren kunnen direct opmerkingen achterlaten op specifieke dia's.
  - Iedereen kan de presentatie bekijken via een vertrouwde Google Docs-omgeving.
- **Nadelen:**
  - Vraagt een eenmalige technische setup (service account, rechten toekennen aan het e-mailadres van het service account).

### Methode 3: Python-pptx Script + Cloud Synchronisatie (Google Drive / OneDrive)
- **Hoe het werkt:**
  - De AI-assistent gebruikt de Python-bibliotheek `python-pptx` om lokaal een `presentatie.pptx` te genereren of te bewerken.
  - Dit bestand bevindt zich in een map die automatisch gesynchroniseerd wordt met de cloud (bijvoorbeeld via de Google Drive for Desktop app of OneDrive).
  - De professoren krijgen een "View only" deellink naar dit bestand.
- **Voordelen:**
  - Geen API-sleutels of cloud-projecten nodig.
  - Zodra het Python-script een nieuwe `.pptx` wegschrijft, uploadt de desktop-app het bestand direct naar de cloudlink.
  - Kan zowel online bekeken worden (in PowerPoint for the Web / Google Slides) als offline gedownload worden.

---

## 3. Conclusie en Advies

- Voor **maximale eenvoud voor de programmeur en de AI**: kies **Methode 1 (Markdown + GitHub Pages)** of **Methode 3 (Python-pptx in gedeelde cloudmap)**.
- Als de professoren **strikt Google Slides eisen met commentaarmogelijkheid**: zet **Methode 2 (Google Slides API)** op.
