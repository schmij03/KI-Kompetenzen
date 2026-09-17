# KI verstehen · Unterricht gestalten

Interaktive, deutschsprachige Lernumgebung für Lehrpersonen ohne feste Zeitvorgaben.

**KI benutzen ≠ KI-kompetent sein.** Entscheidend ist, was Lernende nach der Unterstützung durch KI selbst erklären, beurteilen, entscheiden oder gestalten können.

## Starten

Repository herunterladen und `index.html` in einem aktuellen Browser öffnen. Die Startseite stellt die Lernumgebung vor und verlinkt alle acht Kapitel. **Lernumgebung öffnen** führt zum zuletzt geöffneten Kapitel oder beim ersten Besuch zum Einstieg. Keine Installation, keine Abhängigkeiten und kein Build erforderlich. Die Simulationen funktionieren lokal. Fobizz und Gemini benötigen Internet und einen geeigneten Zugang. Für die freiwillige Teachable-Machine-Aufgabe werden Internet, ein geeigneter Browser sowie eine Webcam oder eigene Bilddateien benötigt.

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
- Die gewählte Gewichtsregel, der Testfall, die Chat-Eingabe und die Token-Auswahl bleiben beim Kapitelwechsel innerhalb einer Sitzung erhalten.
- Kontextabhängige, sprachlich nachvollziehbare Tokenpfade; erfundene Wahrscheinlichkeiten weiterhin ausdrücklich gekennzeichnet.
- Drei kurze Selbsttests mit erklärendem Feedback, auch in den Druckmaterialien und im Lernjournal.
- Eigene Gruppennamen und Zuordnungen aktualisieren die Kartenübersicht unmittelbar.
- Aufgabenwahl übernimmt den Ausgangsauftrag ins Raster und bewahrt eigene Überarbeitungen.
- Canvas-Beispiel und konkrete Fragen zur Qualität der geplanten Lernbelege.
- Kopierbestätigung direkt beim jeweiligen Prompt.

## Enthalten

- Acht Kapitel mit Schritt-für-Schritt-Navigation und Bearbeitungsfortschritt.
- Kompetenzkompass vor und nach der Weiterbildung.
- Obstexperiment: feste Regel versus Nächster-Nachbar-Klassifikator; uneindeutige Fälle sichtbar. Dazu eine bildschirmfreie Variante mit mehreren Merkmalen.
- Freiwillige Zusatzaufgabe mit Teachable Machine: Bildmodell für Stift und Radiergummi trainieren, mit neuen Bildern prüfen und den Einfluss des Hintergrunds untersuchen. Reflexionen sind im Lernjournal enthalten; eine Druckvorlage ergänzt die Aufgabe.
- Regelchatbot und ausdrücklich vereinfachte Token-Simulation.
- Prompting-Aufträge ausschliesslich für Fobizz oder Gemini.
- Quellenprüfung, Perspektivenvergleich und Reflexionsfelder.
- Zwölf Kompetenzkarten mit eigener Gruppensortierung und nachträglicher Modelleinsicht.
- Sechs Unterrichtsaufgaben mit Verbesserungsvorschlägen.
- Ausfüllbarer KI-Kompetenz-Canvas, Gallery Walk, Exit-Ticket.
- Druckbare Arbeitsmaterialien.
- Export des persönlichen Lernjournals als Textdatei.

## PDF

**Arbeitsmaterialien drucken** oder **Meinen Canvas drucken** wählen. Im Druckdialog **Als PDF speichern** auswählen. Druckeinstellungen: A4, 100 %, Browser-Kopf-/Fusszeilen bei Bedarf abschalten. Lange persönliche Eingaben können zusätzliche Seiten erzeugen.

## Orientierung

Acht Kapitel verbinden Experimente, Reflexion und Unterrichtsgestaltung. Die Kapitel lassen sich über die Navigation frei aufrufen; es gibt keine Minutenpläne oder festen Bearbeitungsfristen.

## Vorbereitung

Zugänge vorab prüfen, ein Gerät pro Zweier- oder Dreiergruppe bereitstellen, Materialien und Post-its vorbereiten. Für die Quellenprüfung geeignete Lehrmittel oder Fachquellen bereithalten. Keine personenbezogenen Schülerdaten in die praktischen KI-Prompts eingeben. Bei fehlendem Zugang stehen Offline-Aufträge bereit; tatsächliches Prompting muss dann nachgeholt werden.

## Daten

Reflexionen, Canvas und Fortschritt bleiben im localStorage dieses Browsers. Sie werden nicht an einen Workshop-Server gesendet. Es gibt kein Analytics, keine eingebettete KI und keine extern geladenen Schriften oder Skripte. Externe Links öffnen die jeweiligen Dienste.

Browserdaten können gelöscht werden oder auf geteilten Geräten zugänglich bleiben. Das Lernjournal deshalb exportieren und Eingaben bei Bedarf über **Meine Eingaben löschen** entfernen. Die Simulationszustände selbst werden nicht über einen Browserneustart hinweg gespeichert.

## Dateien

- `index.html`: Startseite mit Einführung, Kompetenzkompass und Kapitelübersicht.
- `lernen.html`: Grundgerüst der interaktiven Lernumgebung; direkte Kapitelwahl über `?kapitel=0` bis `?kapitel=7`.
- `styles.css`: Darstellung der Lernumgebung, gemeinsame Grundlagen, mobile Ansichten und A4-Druck.
- `home.css`: zusätzliche Startseiten-Gestaltung; wird nur auf der Startseite geladen.
- `app.js`: Inhalte, Simulationen, Formulare, Export, Druckmaterialien.
- `KONZEPT.md`: Informationsarchitektur und didaktische Entscheidungen.
- `.nojekyll`: statische Auslieferung mit GitHub Pages.
- `checks.cjs`: reproduzierbare Prüfungen ohne zusätzliche Pakete; ausführen mit `node checks.cjs`.

## Quellen und Einordnung

- [DLH Zürich: KI-Kompetenzen für Lehrende und Lernende](https://dlh.zh.ch/home/wb-kompass/kompetenzmodelle/ki-kompetenzen-fuer-lehrende-und-lernende). Modell von **Susanne Alles, Joscha Falck, Manuel Flick und Regina Schulz**. Die Originalgrafiken sind nicht in dieses Repository kopiert. Karten und Kurzbeschreibungen sind didaktische Bearbeitungen.
- [Kompass digitaler Wandel: Informatik](https://kompassdigitalerwandel.ch/dk04/).
- OECD / Europäische Union (2026): «Lernende für das KI-Zeitalter befähigen. Ein KI-Kompetenzrahmen für die Primar- und Sekundarstufe» (AILit-Framework). Die Aussagen dieser Lernumgebung wurden mit der deutschen Fassung der Publikation abgeglichen. Empfohlene Quellenangabe der Herausgeber: OECD / European Union (2026), «Empowering learners for the age of AI: An AI literacy framework for primary and secondary education», OECD Publishing, Paris, [doi.org/10.1787/65cd27d4-en](https://doi.org/10.1787/65cd27d4-en). Lizenz CC BY 4.0; bei Abweichungen gilt gemäss Lizenz allein die Originalfassung. Übersicht: [ailiteracyframework.org](https://ailiteracyframework.org/)
- [AI Unplugged](https://aiunplugged.org/). Annabel Lindner und Stefan Seegerer, Professur für Didaktik der Informatik, Friedrich-Alexander-Universität Erlangen-Nürnberg. Lizenz CC BY-NC 3.0. Grundlage für die bildschirmfreie Variante des Klassifikationsexperiments.
- [KI Explained](https://schmij03.github.io/ki-explained/). Didaktische Inspiration auf Grundlage der bereitgestellten Beschreibung. Eigenständige Umsetzung; kein kopierter Quellcode.

Weitere vom Kursleiter bereitgestellte Materialien liegen vor, sind in dieser Fassung aber nicht inhaltlich ausgewertet: [Soekia](https://www.soekia.ch/), [code.org zu künstlicher Intelligenz](https://code.org/de/artificial-intelligence), die Unit [AI for Oceans](https://studio.code.org/courses/oceans/units/1) und [Quick, Draw!](https://quickdraw.withgoogle.com/). Diese Adressen waren aus der Bearbeitungsumgebung nicht erreichbar und wurden deshalb nicht geprüft.

Die beiden Kompetenzrahmen und ihre Progressionsstufen werden nicht gleichgesetzt. Die Selbsteinschätzung 1–4 ist keine Zuordnung zu den Modellniveaus I–III.

## Korrekturen und Optimierungen

- Kapitelwechsel aktualisieren die URL; Neuladen sowie Browser-Zurück/Vorwärts bleiben beim passenden Kapitel.
- Die Tab-Überschrift nennt das aktive Kapitel. Das Löschen setzt Eingaben, Simulationen und Kapitel-URL zurück.
- Unveränderte Eingaben lösen keine zusätzlichen Schreibvorgänge aus. Speicherfehler sind direkt in der Navigation sichtbar; der Export bleibt verfügbar.
- Ungültige gespeicherte Auswahlwerte werden bereinigt; eigene Texte bleiben erhalten.
- Dezimalgewichte werden unterstützt; Rundungsfehler verfälschen gleich nahe Nachbarn nicht.
- Gruppenbezeichnungen erscheinen auch bei den Kartenzuordnungen im Lernjournal.
- Schmale Ansichten berücksichtigen lange Texte, skalierte Schrift und mobile Eingabefelder.
- Startseiten-CSS wird separat geladen. Versionskennungen an CSS und JavaScript verhindern veraltete Dateien nach einem Update; eine Prüfung hält sie aktuell.
- Das Gewichtsdiagramm skaliert seine Achse nach den vorhandenen Beispielen statt über einen festen Bereich von 50 bis 400 g. Hinzugefügte Beispiele bleiben dadurch unterscheidbar. Auf schmalen Bildschirmen wird eine höhere Variante mit grösserer Beschriftung gezeichnet, die bei Grössenänderung neu aufgebaut wird.
- Die Aussagen zum AILit-Rahmen beruhen auf der Originalpublikation statt auf einer Zusammenfassung. Wissen, Fähigkeiten und Haltungen, die vier Bereiche und die drei Progressionsstufen sind belegt benannt.
- Ergänzt: die Ressourcen- und Umweltfrage als fünfte Prüffrage, ein Hinweis zu menschenähnlich wirkenden Systemen und eine bildschirmfreie Variante des Klassifikationsexperiments.
- Die fünf Prüffragen stehen an einer Stelle im Quelltext und erscheinen dadurch identisch auf der Webseite und im Druckmaterial.

## Prüfung und Grenzen

JavaScript-Syntax und 350 Logik-/Strukturprüfungen wurden erfolgreich ausgeführt. Die Prüfungen decken unter anderem Kapitel-URLs, Zurück/Vorwärts, Wiederherstellung von Eingaben, ausgefallenen Browserspeicher, Löschen und Abbrechen, Dezimalgewichte, Diagrammskalierung, Tokenpfade, Selbsttests, Kartenzuordnung, Druckauswahl und Teachable-Machine-Reflexionen ab.

Die Prüfungen sind als `checks.cjs` enthalten und können mit `node checks.cjs` erneut ausgeführt werden. Zusätzlich wurden die erzeugten Kapitel- und Druckinhalte auf eindeutige IDs, passende Formularbeschriftungen, Sprungmarken und lokale Links geprüft. Eine eigene Prüfung vergleicht die Versionskennungen an CSS und JavaScript mit dem tatsächlichen Dateiinhalt, damit nach einem Update keine veralteten Dateien ausgeliefert werden.

Ergänzend wurde die Darstellung erstmals in einem echten Browser geprüft (Chromium): Startseite und alle acht Kapitel auf 1440 px, 360 px und 320 px Breite, dazu Obstexperiment, Regelchatbot, Tokensimulation, Selbsttest, Kartensortierung und Wiederherstellung nach dem Neuladen. Dabei traten keine Skriptfehler und keine horizontalen Überläufe auf. Auch die Druckansicht wurde im Browser erzeugt und als PDF ausgegeben.

Offen bleibt: Die Prüfung erfolgte nur in Chromium, nicht in Safari oder Firefox. Ein Ausdruck auf Papier wurde nicht vorgenommen. Die Logikprüfungen in `checks.cjs` verwenden weiterhin einen DOM-Ersatz.
