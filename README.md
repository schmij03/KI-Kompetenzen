# KI verstehen · Unterricht gestalten

Interaktive, deutschsprachige Weiterbildung für Lehrpersonen (120 Minuten).

**KI benutzen ≠ KI-kompetent sein.** Entscheidend ist, was Lernende nach der Unterstützung durch KI selbst erklären, beurteilen, entscheiden oder gestalten können.

## Starten

Repository herunterladen und `index.html` in einem aktuellen Browser öffnen. Keine Installation, keine Abhängigkeiten und kein Build erforderlich. Die Simulationen funktionieren lokal. Fobizz und Gemini benötigen Internet und einen geeigneten Zugang.

## GitHub Pages

Die Dateien sind für GitHub Pages vorbereitet. Zum Veröffentlichen im Repository:

1. **Settings → Pages** öffnen.
2. Unter **Build and deployment** die Quelle **Deploy from a branch** wählen.
3. Branch **main**, Ordner **/ (root)** auswählen und speichern.
4. Die von GitHub angezeigte Veröffentlichung abwarten.

Erwartete Adresse nach Aktivierung: https://schmij03.github.io/KI-Kompetenzen/

Das Vorhandensein der Dateien bedeutet noch nicht, dass GitHub Pages aktiviert ist.

## Verbesserungen der zweiten Fassung

- Kompakte Kapitelauswahl auf dem Smartphone; Materialien und Hinweise sind ausklappbar.
- Lernziel und Sprungmarken für jedes Kapitel.
- Gewichtsdiagramm mit markierten nächsten Nachbarn und Rückgängig-Funktion.
- Die gewählte Gewichtsregel und der Testfall bleiben beim Kapitelwechsel erhalten.
- Kontextabhängige, sprachlich nachvollziehbare Tokenpfade; erfundene Wahrscheinlichkeiten weiterhin ausdrücklich gekennzeichnet.
- Drei kurze Selbsttests mit erklärendem Feedback, auch in den Druckmaterialien und im Lernjournal.
- Eigene Gruppennamen und Zuordnungen aktualisieren die Kartenübersicht unmittelbar.
- Aufgabenwahl übernimmt den Ausgangsauftrag ins Raster und bewahrt eigene Überarbeitungen.
- Canvas-Beispiel und konkrete Fragen zur Qualität der geplanten Lernbelege.
- Kopierbestätigung direkt beim jeweiligen Prompt.

## Enthalten

- Acht Kapitel mit Schritt-für-Schritt-Navigation und Bearbeitungsfortschritt.
- Kompetenzkompass vor und nach der Weiterbildung.
- Obstexperiment: feste Regel versus Nächster-Nachbar-Klassifikator; uneindeutige Fälle sichtbar.
- Regelchatbot und ausdrücklich vereinfachte Token-Simulation.
- Prompting-Aufträge ausschliesslich für Fobizz oder Gemini.
- Quellenprüfung, Perspektivenvergleich und Reflexionsfelder.
- Zwölf Kompetenzkarten mit eigener Gruppensortierung und nachträglicher Modelleinsicht.
- Sechs Unterrichtsaufgaben mit Verbesserungsvorschlägen.
- Ausfüllbarer KI-Kompetenz-Canvas, Gallery Walk, Exit-Ticket.
- Moderationsleitfaden, druckbare Arbeitsmaterialien und sechs Präsentationsfolien.
- Export des persönlichen Lernjournals als Textdatei.

## PDF und Präsentation

**Arbeitsmaterialien drucken**, **Moderationsleitfaden** oder **Meinen Canvas drucken** wählen. Im Druckdialog **Als PDF speichern** auswählen. Druckeinstellungen: A4, 100 %, Browser-Kopf-/Fusszeilen bei Bedarf abschalten. Lange persönliche Eingaben können zusätzliche Seiten erzeugen.

**Präsentation · 6 Folien** öffnet die ergänzende Präsentation mit Moderationsnotizen. Sie lässt sich ebenfalls drucken. Es liegen keine vorab gerenderten PDF- oder PowerPoint-Dateien vor.

## Ablauf

| Minuten | Aktivität |
| --- | --- |
| 0–10 | Kompetenzkompass und KI im Alltag |
| 10–28 | Regeln versus Lernen aus Daten |
| 28–40 | Regelchatbot und Sprachmodelle |
| 40–52 | Fobizz/Gemini: A für alle, B/C arbeitsteilig |
| 52–57 | Erkenntnisse sichern |
| 57–62 | Pause |
| 62–77 | Kompetenzkarten und Modell |
| 77–92 | Aufgaben verbessern |
| 92–110 | Eigene Lernaktivität gestalten |
| 110–116 | Gallery Walk und Überarbeitung |
| 116–120 | Kompetenzkompass und Exit-Ticket |

Inputs sind auf höchstens drei Minuten am Stück angelegt. Bei Verzögerungen zusätzliche Experimentrunden kürzen, die Gestaltung und den Abschluss erhalten.

## Vorbereitung

Zugänge vorab prüfen, ein Gerät pro Zweier- oder Dreiergruppe bereitstellen, Materialien und Post-its vorbereiten. Für die Quellenprüfung geeignete Lehrmittel oder Fachquellen bereithalten. Keine personenbezogenen Schülerdaten in die praktischen KI-Prompts eingeben. Bei fehlendem Zugang stehen Offline-Aufträge bereit; tatsächliches Prompting muss dann nachgeholt werden.

## Daten

Reflexionen, Canvas und Fortschritt bleiben im localStorage dieses Browsers. Sie werden nicht an einen Workshop-Server gesendet. Es gibt kein Analytics, keine eingebettete KI und keine extern geladenen Schriften oder Skripte. Externe Links öffnen die jeweiligen Dienste.

Browserdaten können gelöscht werden oder auf geteilten Geräten zugänglich bleiben. Das Lernjournal deshalb exportieren und Eingaben bei Bedarf über **Meine Eingaben löschen** entfernen. Die Simulationszustände selbst werden nicht über einen Browserneustart hinweg gespeichert.

## Dateien

- `index.html`: Grundgerüst.
- `styles.css`: Darstellung, mobile Ansichten und A4-Druck.
- `app.js`: Inhalte, Simulationen, Formulare, Export, Druckmaterialien, Präsentation.
- `KONZEPT.md`: Informationsarchitektur und didaktische Entscheidungen.
- `.nojekyll`: statische Auslieferung mit GitHub Pages.
- `checks.cjs`: reproduzierbare Prüfungen ohne zusätzliche Pakete; ausführen mit `node checks.cjs`.

## Quellen und Einordnung

- [DLH Zürich: KI-Kompetenzen für Lehrende und Lernende](https://dlh.zh.ch/home/wb-kompass/kompetenzmodelle/ki-kompetenzen-fuer-lehrende-und-lernende). Modell von **Susanne Alles, Joscha Falck, Manuel Flick und Regina Schulz**. Die Originalgrafiken sind nicht in dieses Repository kopiert. Karten und Kurzbeschreibungen sind didaktische Bearbeitungen.
- [Kompass digitaler Wandel: Informatik](https://kompassdigitalerwandel.ch/dk04/).
- [OECD/EU AILit Framework](https://ailiteracyframework.org/). Angaben zur deutschen Fassung 2026 beruhen auf der bereitgestellten Zusammenfassung; der Abgleich mit der Original-PDF steht aus.
- [KI Explained](https://schmij03.github.io/ki-explained/). Didaktische Inspiration auf Grundlage der bereitgestellten Beschreibung. Eigenständige Umsetzung; kein kopierter Quellcode.

Die beiden Kompetenzrahmen und ihre Progressionsstufen werden nicht gleichgesetzt. Die Selbsteinschätzung 1–4 ist keine Zuordnung zu den Modellniveaus I–III.

## Prüfung und Grenzen

JavaScript-Syntax und 298 Logik-/Strukturprüfungen wurden erfolgreich ausgeführt: alle erreichbaren Tokenpfade und ihre Verteilungen, Obstmodell und Rückgängig-Funktion, Selbsttests und Feedback, Kartenzuordnung, Aufgabenwahl, Wiederherstellung bestehender Eingaben, sichere Darstellung eigener Texte, Kapitelverweise, Druckmaterialien und zusammenhängender 120-Minuten-Zeitplan.

Die Prüfungen sind als `checks.cjs` enthalten und können mit Node.js über `node checks.cjs` erneut ausgeführt werden.

Diese Prüfungen liefen mit einem vereinfachten DOM-Ersatz. Ein echter Browser-, Mobilansichts- oder Drucklayouttest war in der Erstellungsumgebung nicht verfügbar. Vor dem ersten Workshop die Seite, Downloads und Druckvorschau auf den eingesetzten Geräten prüfen.
