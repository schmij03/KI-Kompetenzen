# Konzept und Informationsarchitektur

## Lernversprechen

Lehrpersonen der Sekundarstufe I erleben KI als Lerngegenstand, Werkzeug und Reflexionsanlass. Am Ende steht eine kleine eigene Unterrichtsaktivität für den Zyklus 3 mit beobachtbarem Lernbeleg.

## Ablauf innerhalb eines Kapitels

Kurze Orientierung → Experiment oder Tätigkeit → Reflexion → eigene Erklärung → Transfer. Die Erkenntnissicherung bleibt von der automatischen Bearbeitungsanzeige getrennt.

## Startseite

Die Startseite führt mit einem kurzen Lernversprechen, vier Kompetenzperspektiven und acht Kapitelkarten in die Lernumgebung ein. Die Kapitelkarten verlinken direkt auf das jeweilige Thema. Der allgemeine Einstieg übernimmt das zuletzt gespeicherte Kapitel. Logo und Startseitenlink führen aus der Lernumgebung zurück zur Übersicht. Bestehende Eingaben und Fortschritt bleiben erhalten.

## Navigation

| Kapitel | Primäre Tätigkeit | Lernbeleg |
| --- | --- | --- |
| Standort & Alltag | Ausgangslage einschätzen, Alltagsfälle begründet einordnen | Vier Ausgangswerte mit einem Beispiel |
| Lernen aus Daten | Trainingsbeispiele ändern und Vorhersagen vergleichen | Erklärung des Einflusses von Daten und Merkmalen |
| Sprachmodelle verstehen | Regeln anwenden und Fortsetzungen untersuchen | Training und Nutzung in eigenen Worten unterscheiden |
| Prompting ausprobieren | Fobizz/Gemini nutzen und Ergebnisse vergleichen | Promptvergleich plus Aussageprüfung oder Perspektivenanalyse |
| Chancen & Grenzen | Drei Satzanfänge zum Schulalltag vervollständigen, Chancen und Grenzen abwägen | Eine Chance für den eigenen Unterricht mit ihrer Grenze und der menschlichen Handlung |
| Kompetenzen entdecken | Eigene Tätigkeiten zuordnen; zwölf Karten offen sortieren oder den vier Bereichen mit Niveaustufe zuordnen; mit Modell und Matrix vergleichen | Zuordnung mit beobachtbarer Handlung |
| Aufgaben verbessern | Eine Unterrichtsaufgabe überarbeiten, mit einer anderen Gruppe prüfen | Arbeitsauftrag mit zwei belegbaren Bereichen und einer übernommenen Änderung |
| Unterricht gestalten | Canvas erstellen, Feedback einholen, eine Idee wählen | Eigenes Szenario, gewählte Idee mit Lernbeleg und Termin, Transferabsicht |

## Gestaltung

Ruhige Arbeitsoberfläche mit dunkler petrolfarbener Typografie, warmem Hintergrund, weissen Karten und grünen Bedienelementen. Grosszügige Kapitelköpfe, dezente Schatten und klare Abstände unterstützen die Orientierung. Die Kapitelaktivität steht im Vordergrund. Zwei Spalten bei ausreichend Platz, eine Spalte auf kleinen Bildschirmen. Beschriftete Felder, sichtbarer Tastaturfokus, Textlabels zusätzlich zu Farben, bedienbare Kartenzuordnung über Auswahlfelder.

## Bewusste didaktische Entscheidungen

- Erleben vor Einordnen: Am Einstieg erscheinen die vier Bereiche nur als Selbsteinschätzung. In der geleiteten Weiterbildung werden sie nach dem Input zu KI und dem eigenen Ausprobieren erklärt (Phase 5), dort an den eigenen Tätigkeiten des Tages festgemacht und danach angewendet (Phase 6). Im Selbststudium bleibt die offene Kartensortierung vor der Modelleinsicht möglich.
- Chancen und Grenzen erscheinen gleichwertig. Jede Chance im Bildungsalltag ist mit einer Grenze und einer menschlichen Handlung verbunden; das macht Prüfen und Entscheiden zu einem Teil kompetenter Nutzung.
- Die Zuordnungsaktivität «Was habe ich heute schon geübt?» hat keine Punktzahl. Mehrere Zuordnungen sind begründbar; ihre Pointe ist, dass Mitgestalten bis dahin kaum vorkam.
- Kapitel 6 bietet zwei Sortiervarianten. Die offene Sortierung zeigt die Matrix erst nach dem Vergleich. Die direkte Zuordnung zu den vier Bereichen mit geschätzter Niveaustufe setzt das Modell voraus. Für die Niveaustufen gibt es keine Musterlösung, weil die Karten Handlungen ohne Unterrichtskontext beschreiben. Die offene Sortierung bleibt Standard, damit gespeicherte Eingaben unverändert erscheinen.
- Für das Obstexperiment ist der Algorithmus explizit definiert. Bei widersprüchlichen gleich nahen Beispielen wird keine Scheinsicherheit erzeugt.
- Das Nächster-Nachbar-Verfahren passt keine neuronalen Parameter an. Dieser Unterschied wird sichtbar erklärt.
- Die Token-Simulation verwendet erfundene Verteilungen und von Hand definierte Übergänge. Sie demonstriert schrittweise Auswahl, nicht die Berechnung eines echten Sprachmodells. Ihr vereinfachter Kontext wird ausdrücklich benannt.
- Training und Nutzung sind getrennte Prozesse. Die Tokenschätzung ist keine Schätzung von Wahrheit.
- Prompting bietet drei frei wählbare Aufträge zu Kontext, Quellenprüfung und Perspektiven.
- Nicht jeder KI-Einsatz bildet automatisch alle vier Bereiche. Fachliches Verständnis ist nicht automatisch Verständnis der KI-Funktionsweise.
- Niveaustufen werden anhand der Originalmatrix begründet, nicht aus Selbsteinschätzung oder Promptlänge abgeleitet. Kapitel 6 enthält dafür eine gekürzte Matrix mit Kreismodell, Übergängen und Teilkompetenzen je Bereich. I bis III sind keine Klassenstufen.
- Der AILit-Rahmen wird als ergänzende Perspektive geführt, nicht als zweites Raster zum Ausfüllen. Seine drei Progressionsstufen bleiben von den Niveaus I–III getrennt, weil die Publikation sie ausdrücklich nicht an Altersgruppen oder Klassenstufen bindet.
- Der Ressourcenverbrauch von KI erscheint als Prüffrage vor dem Übernehmen eines Outputs, nicht als eigenes Umweltkapitel. Die Entscheidung über den Einsatz bleibt damit dort, wo sie im Ablauf ohnehin getroffen wird.
- Gallery Walk enthält eine verbindliche Überarbeitung. In der Kurzform «Gruppe trifft Gruppe» übernimmt jede Gruppe mindestens eine Änderung.
- Am Schluss steht eine gewählte Idee mit Klasse, Lernbeleg und Termin. Die Wahl aus der Ideensammlung überschreibt keine bereits getroffene Wahl.
- Die abschliessende Selbsteinschätzung braucht einen konkreten Beleg.

## Materialien

Die zentrale Inhaltsquelle ist app.js. Daraus werden Webseite, ausfüllbare und leere Druckvorlagen erzeugt. Dadurch bleiben Karten und Arbeitsaufträge konsistent.

Druckpaket: Kompass, Experimentprotokoll, Prompting-Aufträge, Prüftabelle, Chancen und Grenzen im Bildungsalltag, zwölf Karten mit Anleitung für beide Sortiervarianten, gekürzte Kompetenzmatrix, sechs Aufgaben, Verbesserungsraster, zweiseitiger Canvas, Feedbackkarten, Exit-Ticket mit der gewählten Idee und Quellen.

## Durchführung in 120 Minuten

Der Moderationsleitfaden liegt als eigene Seite neben der Lernumgebung, nicht in den Kapiteln. So bleibt die Lernumgebung ohne Zeitvorgaben nutzbar, während eine geleitete Durchführung trotzdem einen belastbaren Ablauf hat. Er folgt dem Foliensatz v7 in acht Phasen plus Pause und löst die Ausschreibung ein: Funktionsweise, Chancen und Grenzen im Bildungsalltag, die vier Kompetenzen und ihre Förderung im eigenen Unterricht, mit Fokus auf Ausprobieren, Austausch und direkt umsetzbaren Ideen.

| Zeit | Phase | Kapitel |
| --- | --- | --- |
| 0–10 | 1 · Ankommen und Standort | 1 |
| 10–30 | 2 · Was ist KI? Input mit Abstimmen, Mitspielen und Vorführung im Beamermodus | 1–3 |
| 30–53 | 3 · Selber ausprobieren: Obstexperiment, Token-Simulation, Prompting, Prüffragen | 2–4 |
| 53–60 | 4 · Chancen und Grenzen im Bildungsalltag | 5 |
| 60–68 | Pause | – |
| 68–83 | 5 · KI-Kompetenzen im Detail: Kreismodell, Niveaustufen, Zuordnung der eigenen Tätigkeiten, Teilkompetenzen | 6 |
| 83–106 | 6 · Kompetenzen anwenden: Karten zuordnen, Aufgabe verbessern, Gruppe trifft Gruppe, Canvas beginnen | 6–8 |
| 106–115 | 7 · Unterrichtsideen: Überblick, Kurzversuch aus Idee 13, IT2School-Reihen, eigene Idee wählen | Unterrichtsideen, IT2School |
| 115–120 | 8 · Abschluss | 8 |

Der Bogen führt vom Erklären über das eigene Ausprobieren zum Modell: Das Kompetenzmodell wird erst vorgestellt, wenn alle eigene Erfahrungen haben, an denen sich die Bereiche festmachen lassen. Die Phasen decken nicht jedes Kapitel vollständig ab; der Canvas wird begonnen und danach selbstständig fertiggestellt. Der Beamermodus lädt dieselbe Inhaltsquelle und blendet aus, was nur am eigenen Gerät gebraucht wird. Dadurch kann keine zweite, abweichende Fassung der Simulationen entstehen.

Die Einstiegsübung «KI oder nicht KI» ersetzt eine statische Aufzählung. Zwei der sechs Fälle sind bewusst nicht entscheidbar: Die Erkenntnis, dass eine Oberfläche das Verfahren meistens nicht verrät, ist der Lerninhalt. Es gibt deshalb keine Punktzahl und keine Richtig-falsch-Rückmeldung, sondern eine Einordnung mit Begründung.

## Grundlage Kompetenzmodell

Susanne Alles, Joscha Falck, Manuel Flick und Regina Schulz (2025): «KI-Kompetenzen für Lehrende und Lernende». VK:KIWA. DOI [10.5281/zenodo.15047793](https://doi.org/10.5281/zenodo.15047793), Lizenz CC BY 4.0. Der DLH Zürich stellt das Modell im WB-Kompass vor; es ist kein Modell der PH Zürich. Die Matrix in Kapitel 6 ist gekürzt; Karten, Kurzbeschreibungen und Beispiele der Lernumgebung sind eigene didaktische Bearbeitungen.

## Zielstufe

Die Lernumgebung richtet sich an Lehrpersonen der Sekundarstufe I. Unterrichtsbeispiele, Fachbezeichnungen und Unterrichtsideen folgen dem Zyklus 3. Differenziert wird innerhalb dieser Stufe über Grundanspruch und erweiterte Anforderung; Verweise auf Primarstufe oder Sek II werden vermieden, weil sie die Auswahl verwässern statt sie zu schärfen. Wo Originalmaterialien für andere Altersgruppen entwickelt wurden, sind Auswertung und Lernbeleg angepasst, nicht bloss der Stufenhinweis.

## Abgrenzungen

Keine eingebaute Chatbot-Schnittstelle und keine automatisierte Bewertung von Kompetenz. Kein allgemeiner Informatikkurs. Keine gemeinsame Cloud-Sammlung von Teilnehmerdaten. Keine Gleichsetzung des Vier-Bereiche-Modells mit AILit. Keine übernommenen Originalgrafiken ohne separat geprüfte Verwendung.

## Weiterentwicklung

Jedes Kapitel beginnt mit einem konkreten Lernbeleg und bietet Sprungmarken. Die mobile Navigation reduziert die Fläche vor der eigentlichen Tätigkeit. Selbsttests unterstützen die eigene Prüfung; sie sind keine automatische Kompetenzmessung.

Das Obstdiagramm macht Abstände sichtbar, während Tabelle und Textausgabe die vollständige Information erhalten. Seine Achse folgt den vorhandenen Beispielen, damit ein ergänztes Beispiel als eigener Punkt erkennbar bleibt und nicht in einem festen Wertebereich verschwindet. Die Tokenpfade berücksichtigen nun ihren vollständigen Beispielkontext: sprachliche Fehler durch unverbundene Satzteile lenken nicht mehr vom Unterschied zwischen Plausibilität und Wahrheit ab. Weiterhin handelt es sich ausdrücklich um ein handgeschriebenes Spielzeugmodell.

Bei der Aufgabenwahl und beim Umbenennen von Kartengruppen werden vorhandene eigene Texte nicht überschrieben. Der Canvas zeigt ein konkretes Beispiel für die Beziehung zwischen Lernziel, Lernbeleg und Qualitätskriterium. Die ergänzenden Selbsttests sind auch druckbar.


## Eigene Seite für Unterrichtsideen

Die Sammlung ergänzt die acht Kapitel als frei zugänglicher Transferbereich. Jede Karte verbindet eine beobachtbare Lernleistung mit Vorbereitung, Ablauf, Differenzierung und Quelle. Suche sowie Filter nach Stufe, Ausstattung und Kompetenz helfen bei der Auswahl. Die Stufen sind didaktische Vorschläge, keine Ableitung von Kompetenzniveaus. Über den Canvas-Link wird die eigene Planung fortgesetzt; bestehende Notizen bleiben unberührt. Der Link «Diese Idee für meinen Unterricht wählen» wählt die Idee in Kapitel 8 vor, ohne eine bereits getroffene Wahl zu überschreiben. Idee 13 hat ein fertiges Einstiegsbild, damit sie ohne eigene Vorbereitung startbar ist. Einzeldruck ermöglicht die Nutzung als Unterrichtsvorbereitung. Original-PDFs und Grafiken werden nicht erneut veröffentlicht.

## AILit-Abgleich und Mitgestalten

Die deutsche Original-PDF 2026 wurde für die relevanten Aussagen ausgewertet (siehe AILIT-ABGLEICH.md). Die Modelleinsicht verbindet Wissen, Fähigkeiten/Fertigkeiten und Haltungen mit den vier AILit-Bereichen. Progressionsstufen werden weder gleichgesetzt noch an Klassenstufen gebunden. «Mitgestalten» benötigt einen konkreten Gestaltungsgegenstand, Kriterien und begründete Entscheidungen. Die gemeinsame Gestaltung von Nutzungspraxis und die Untersuchung bzw. Verbesserung eines KI-Systems werden unterschieden. Beide können ohne Programmierung stattfinden. Quellenhinweise erscheinen auch im bestehenden Druckpaket.

## IT2School-Module

Die Gesamtausgabe der IT2School-KI-Module wird als erweitertes Angebot neben den Unterrichtsideen geführt: Ideen für einzelne Lektionen, die Modulseite für ganze Reihen. Die Seite bewertet die Module für den Zyklus 3, ohne Originalstufen zu übernehmen, und benennt veraltete Werkzeuge, fehlende Dateien und Datenschutzfragen. Zwei Lücken der bisherigen Sammlung, unüberwachtes Lernen und Verzerrung durch Trainingsdaten, werden durch neue Unterrichtsideen auf Grundlage von KI-B3.5 und KI-B4.4 geschlossen.
