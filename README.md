# De Moestuin — installeerbare web-app (PWA)

Dit is je moestuin-app, klaar om op je iPhone te zetten als app-icoon.
Het is een *Progressive Web App*: een website die zich gedraagt als een app
(eigen icoon, schermvullend, werkt offline). Geen App Store of kosten nodig.

## Wat zit erin

- `index.html` — de pagina die de app laadt
- `app.jsx` — de hele app
- `manifest.json` — app-naam, kleuren en iconen
- `sw.js` — service worker (zorgt dat de app offline werkt)
- `icon-*.png` — de app-iconen

-----

## Stap 1 — Op GitHub Pages zetten

1. Ga naar <https://github.com> en klik op **New repository**.
1. Geef hem een naam, bijvoorbeeld `moestuin`. Zet hem op **Public**. Klik **Create repository**.
1. Klik op **uploading an existing file** (of: Add file → Upload files).
1. Sleep **alle bestanden uit deze map** (index.html, app.jsx, manifest.json, sw.js
   en alle icon-*.png) in het venster. Let op: de losse bestanden, niet de map zelf.
1. Klik **Commit changes**.
1. Ga in de repo naar **Settings → Pages**.
1. Bij **Build and deployment → Source** kies je **Deploy from a branch**.
   Kies branch **main** en map **/ (root)**. Klik **Save**.
1. Wacht 1–2 minuten. Bovenaan diezelfde Pages-pagina verschijnt het adres, iets als:
   `https://JOUWNAAM.github.io/moestuin/`

Open dat adres in **Safari op je iPhone**.

-----

## Stap 2 — Op je iPhone-beginscherm zetten

1. Open het adres in **Safari** (dit werkt niet in Chrome op iPhone).
1. Tik onderaan op het **deelknopje** (vierkantje met pijltje omhoog).
1. Scrol en tik op **Zet op beginscherm**.
1. Geef het de naam “Moestuin” en tik **Voeg toe**.

Je hebt nu een Moestuin-icoon op je beginscherm. Het opent schermvullend,
zonder Safari-balken, en werkt ook zonder internet.

-----

## Belangrijk om te weten

- **Je gegevens staan op je telefoon**, in de opslag van de browser. Ze blijven
  bewaard tussen sessies. Ze worden *niet* automatisch naar GitHub gestuurd —
  GitHub host alleen de app zelf, niet jouw tuingegevens.
- Omdat de gegevens lokaal staan, zie je je tuin alleen terug op het apparaat
  en in de app waar je hem hebt aangemaakt. (Wil je je tuin kunnen meenemen naar
  een ander apparaat of een back-up maken, vraag dan om een export/import-knop —
  die kan ik toevoegen.)
- Foto’s nemen relatief veel opslag in. Als je een waarschuwing ziet dat opslaan
  niet lukt, verwijder dan een paar foto’s of gearchiveerde groenten.
- Wil je later iets aan de app wijzigen, dan upload je het aangepaste bestand
  opnieuw naar de repo. Op je telefoon kun je de app daarna verversen door hem
  te sluiten en opnieuw te openen (soms moet je even wachten op de service worker).

-----

## Een echte App Store-app?

Dat kan, maar vereist meer: een Mac met Xcode, een Apple Developer-account
(€99/jaar) en het verpakken met een tool als Capacitor. Voor persoonlijk gebruik
geeft deze PWA je in de praktijk dezelfde ervaring zonder die drempels. Wil je
toch de App Store-route, dan kan ik het Capacitor-project voor je voorbereiden.