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
| Erkenntnisse & Grenzen | Drei Satzanfänge vervollständigen | Begründete menschliche Prüfentscheidung |
| Kompetenzen entdecken | Zwölf Karten sortieren, dann Modell vergleichen | Zuordnung mit beobachtbarer Handlung |
| Aufgaben verbessern | Eine Unterrichtsaufgabe überarbeiten | Arbeitsauftrag mit zwei belegbaren Bereichen |
| Unterricht gestalten | Canvas erstellen, Feedback einholen, überarbeiten | Eigenes Szenario, Revision und Transferabsicht |

## Gestaltung

Ruhige Arbeitsoberfläche mit dunkler petrolfarbener Typografie, warmem Hintergrund, weissen Karten und grünen Bedienelementen. Grosszügige Kapitelköpfe, dezente Schatten und klare Abstände unterstützen die Orientierung. Die Kapitelaktivität steht im Vordergrund. Zwei Spalten bei ausreichend Platz, eine Spalte auf kleinen Bildschirmen. Beschriftete Felder, sichtbarer Tastaturfokus, Textlabels zusätzlich zu Farben, bedienbare Kartenzuordnung über Auswahlfelder.

## Bewusste didaktische Entscheidungen

- Am Einstieg erscheinen die vier Bereiche nur als Selbsteinschätzung. Die theoretische Einordnung erfolgt nach Experimenten und Kartensortierung.
- Für das Obstexperiment ist der Algorithmus explizit definiert. Bei widersprüchlichen gleich nahen Beispielen wird keine Scheinsicherheit erzeugt.
- Das Nächster-Nachbar-Verfahren passt keine neuronalen Parameter an. Dieser Unterschied wird sichtbar erklärt.
- Die Token-Simulation verwendet erfundene Verteilungen und von Hand definierte Übergänge. Sie demonstriert schrittweise Auswahl, nicht die Berechnung eines echten Sprachmodells. Ihr vereinfachter Kontext wird ausdrücklich benannt.
- Training und Nutzung sind getrennte Prozesse. Die Tokenschätzung ist keine Schätzung von Wahrheit.
- Prompting bietet drei frei wählbare Aufträge zu Kontext, Quellenprüfung und Perspektiven.
- Nicht jeder KI-Einsatz bildet automatisch alle vier Bereiche. Fachliches Verständnis ist nicht automatisch Verständnis der KI-Funktionsweise.
- Niveaustufen werden anhand der Originalmatrix begründet, nicht aus Selbsteinschätzung oder Promptlänge abgeleitet.
- Der AILit-Rahmen wird als ergänzende Perspektive geführt, nicht als zweites Raster zum Ausfüllen. Seine drei Progressionsstufen bleiben von den Niveaus I–III getrennt, weil die Publikation sie ausdrücklich nicht an Altersgruppen oder Klassenstufen bindet.
- Der Ressourcenverbrauch von KI erscheint als Prüffrage vor dem Übernehmen eines Outputs, nicht als eigenes Umweltkapitel. Die Entscheidung über den Einsatz bleibt damit dort, wo sie im Ablauf ohnehin getroffen wird.
- Gallery Walk enthält eine verbindliche Überarbeitung.
- Die abschliessende Selbsteinschätzung braucht einen konkreten Beleg.

## Materialien

Die zentrale Inhaltsquelle ist app.js. Daraus werden Webseite, ausfüllbare und leere Druckvorlagen erzeugt. Dadurch bleiben Karten und Arbeitsaufträge konsistent.

Druckpaket: Kompass, Experimentprotokoll, Prompting-Aufträge, Prüftabelle, zwölf Karten, sechs Aufgaben, Verbesserungsraster, zweiseitiger Canvas, Feedbackkarten, Exit-Ticket und Quellen.

## Durchführung in 120 Minuten

Der Moderationsleitfaden liegt als eigene Seite neben der Lernumgebung, nicht in den Kapiteln. So bleibt die Lernumgebung ohne Zeitvorgaben nutzbar, während eine geleitete Durchführung trotzdem einen belastbaren Ablauf hat. Die neun Phasen decken nicht jedes Kapitel vollständig ab; der Canvas wird begonnen und danach selbstständig fertiggestellt. Der Beamermodus lädt dieselbe Inhaltsquelle und blendet aus, was nur am eigenen Gerät gebraucht wird. Dadurch kann keine zweite, abweichende Fassung der Simulationen entstehen.

Die Einstiegsübung «KI oder nicht KI» ersetzt eine statische Aufzählung. Zwei der sechs Fälle sind bewusst nicht entscheidbar: Die Erkenntnis, dass eine Oberfläche das Verfahren meistens nicht verrät, ist der Lerninhalt. Es gibt deshalb keine Punktzahl und keine Richtig-falsch-Rückmeldung, sondern eine Einordnung mit Begründung.

## Zielstufe

Die Lernumgebung richtet sich an Lehrpersonen der Sekundarstufe I. Unterrichtsbeispiele, Fachbezeichnungen und Unterrichtsideen folgen dem Zyklus 3. Differenziert wird innerhalb dieser Stufe über Grundanspruch und erweiterte Anforderung; Verweise auf Primarstufe oder Sek II werden vermieden, weil sie die Auswahl verwässern statt sie zu schärfen. Wo Originalmaterialien für andere Altersgruppen entwickelt wurden, sind Auswertung und Lernbeleg angepasst, nicht bloss der Stufenhinweis.

## Abgrenzungen

Keine eingebaute Chatbot-Schnittstelle und keine automatisierte Bewertung von Kompetenz. Kein allgemeiner Informatikkurs. Keine gemeinsame Cloud-Sammlung von Teilnehmerdaten. Keine Gleichsetzung des Vier-Bereiche-Modells mit AILit. Keine übernommenen Originalgrafiken ohne separat geprüfte Verwendung.

## Weiterentwicklung

Jedes Kapitel beginnt mit einem konkreten Lernbeleg und bietet Sprungmarken. Die mobile Navigation reduziert die Fläche vor der eigentlichen Tätigkeit. Selbsttests unterstützen die eigene Prüfung; sie sind keine automatische Kompetenzmessung.

Das Obstdiagramm macht Abstände sichtbar, während Tabelle und Textausgabe die vollständige Information erhalten. Seine Achse folgt den vorhandenen Beispielen, damit ein ergänztes Beispiel als eigener Punkt erkennbar bleibt und nicht in einem festen Wertebereich verschwindet. Die Tokenpfade berücksichtigen nun ihren vollständigen Beispielkontext: sprachliche Fehler durch unverbundene Satzteile lenken nicht mehr vom Unterschied zwischen Plausibilität und Wahrheit ab. Weiterhin handelt es sich ausdrücklich um ein handgeschriebenes Spielzeugmodell.

Bei der Aufgabenwahl und beim Umbenennen von Kartengruppen werden vorhandene eigene Texte nicht überschrieben. Der Canvas zeigt ein konkretes Beispiel für die Beziehung zwischen Lernziel, Lernbeleg und Qualitätskriterium. Die ergänzenden Selbsttests sind auch druckbar.


## Eigene Seite für Unterrichtsideen

Die Sammlung ergänzt die acht Kapitel als frei zugänglicher Transferbereich. Jede Karte verbindet eine beobachtbare Lernleistung mit Vorbereitung, Ablauf, Differenzierung und Quelle. Suche sowie Filter nach Stufe, Ausstattung und Kompetenz helfen bei der Auswahl. Die Stufen sind didaktische Vorschläge, keine Ableitung von Kompetenzniveaus. Über den Canvas-Link wird die eigene Planung fortgesetzt; bestehende Notizen bleiben unberührt. Einzeldruck ermöglicht die Nutzung als Unterrichtsvorbereitung. Original-PDFs und Grafiken werden nicht erneut veröffentlicht.

## AILit-Abgleich und Mitgestalten

Die deutsche Original-PDF 2026 wurde für die relevanten Aussagen ausgewertet (siehe AILIT-ABGLEICH.md). Die Modelleinsicht verbindet Wissen, Fähigkeiten/Fertigkeiten und Haltungen mit den vier AILit-Bereichen. Progressionsstufen werden weder gleichgesetzt noch an Klassenstufen gebunden. «Mitgestalten» benötigt einen konkreten Gestaltungsgegenstand, Kriterien und begründete Entscheidungen. Die gemeinsame Gestaltung von Nutzungspraxis und die Untersuchung bzw. Verbesserung eines KI-Systems werden unterschieden. Beide können ohne Programmierung stattfinden. Quellenhinweise erscheinen auch im bestehenden Druckpaket.
