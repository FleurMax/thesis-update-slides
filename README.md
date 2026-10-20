# Thesis slides

De presentatie staat op [GitHub Pages](https://fleurmax.github.io/thesis-update-slides/).

## Bestanden

- `meetings/JJJJ-MM-DD/notes.compact.json`: één compacte bron per meeting
- `src/Presentaties.jsx`: React-component voor losse meetings en het totaal
- `src/deck.js`: validatie en vaste volgorde

Uitgebreide notities staan lokaal buiten deze repository in `../meeting_notities.md`. Ze horen nooit in een commit. Oude gepubliceerde notities zijn uit de actuele repository verwijderd; eerdere commits zijn niet herschreven.

De bron voor 20 oktober bevat acht slides met de door Maxim geselecteerde voorbereiding. De uitgebreide achtergrond blijft alleen in het lokale notitiebestand.

## Werkwijze

1. Werk de ene lokale uitgebreide notitie bij onder de juiste periode.
2. Wacht op de vraag om die inhoud te comprimeren.
3. Bewerk alleen `notes.compact.json` van de bedoelde meeting.
4. Gebruik voor een nieuwe meeting `npm run meeting:new -- JJJJ-MM-DD`. Geef een echte afgesproken datum op. Het commando overschrijft geen bestaande bestanden.
5. Behoud vorige meetingbestanden. Na het gesprek kan hun status `vastgelegd` worden. Pas die inhoud alleen aan na een expliciete vraag.
6. Controleer de wijzigingen, voer tests uit en commit alleen het slidesysteem en compacte bronnen.

## JSON-formaat

`schemaVersion` is 1. Een meeting heeft `date`, `title`, `status` en `slides`. Status is `concept` of `vastgelegd`. Elke slide heeft een uniek `id`, een `title` en 1 tot 8 korte `bullets`. `ordered: true` maakt een genummerde lijst. Optionele `sources` bevatten `label` en een `https`-URL. Tekst wordt als gewone tekst getoond.

Optionele velden voor een slide:

- `lead`: één hoofdpunt boven de lijst, maximaal 400 tekens.
- `bulletStyle: "arrow"`: ingesprongen pijltjes voor de bullets. Niet combineren met `ordered: true`.
- `table`: `columns` met 2 tot 4 kolomtitels en `rows` met 1 tot 8 rijen. Elke rij bevat evenveel tekstcellen als er kolommen zijn.

De parser weigert onbekende velden, foutieve tabellen en te lange teksten. Gewone slides zonder deze velden blijven hetzelfde werken.

Eén object in `slides` is altijd één dia. De lijstvolgorde blijft behouden. Er is geen AI-samenvatting of automatische herverdeling tijdens het parsen. Meetings worden op datum gesorteerd. Standaard toont de app alle meetings als één presentatie. De keuzelijst filtert op één meeting. De overzichtsknop toont de dia's onder elkaar. De afdrukknop maakt ook een doorlopende PDF mogelijk.

## Lokaal starten

```sh
npm ci
npm run dev
```

Open het getoonde adres met `/thesis-update-slides/`. Gebruik de pijltjestoetsen, Home en End om te navigeren. De URL bewaart meeting en dia. Een link blijft daardoor naar dezelfde dia verwijzen als er later een meeting bijkomt.

## Controleren en publiceren

```sh
npm test
npm run build
npm run check:files
```

De bestandscontrole weigert gevolgde bestanden buiten de toegestane slidestructuur. GitHub Actions bouwt en publiceert naar Pages bij een push op `main`. De Pages-bron moet op GitHub Actions staan. `node_modules` en `dist` worden niet gecommit.
