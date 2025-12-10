# Testanleitung für das Jump and Run 2D

Diese Anleitung hilft dir, das Spiel lokal zu testen oder anderen zum Testen bereitzustellen.

## 1) Spiel lokal starten

1. Wechsel in dieses Verzeichnis:
   ```bash
   cd /workspace/JumpandRunGame
   ```
2. Starte einen simplen lokalen Server (verhindert CORS-Probleme beim Laden von Assets):
   ```bash
   python -m http.server 8000
   ```
3. Öffne im Browser `http://localhost:8000` und klicke das Spielfenster an, damit die Tastatureingaben ankommen.

> Tipp: Wenn du keinen Python-Server nutzen möchtest, kannst du jedes andere statische File-Serving-Tool verwenden (z.B. `npx serve`).

## 2) Schneller Smoke-Test (ca. 2 Minuten)

Folge diesen Schritten, um die wichtigsten Spielmechaniken zu prüfen:

1. **Bewegung prüfen** – Mit Pfeil links/rechts oder A/D laufen und sicherstellen, dass sich die Figur flüssig bewegt und die Kamera folgt.
2. **Sprung & Gravitation** – Mit W/▲/Leertaste springen; prüfen, dass Sprünge reagieren und die Figur nach unten fällt.
3. **Plattform-Kollision** – Auf eine Plattform springen und sicherstellen, dass die Figur darauf stehen bleibt, statt hindurchzufallen.
4. **Gefahren erkennen** – In einen Stachel laufen und bestätigen, dass die HUD „Game Over“ zeigt und die Figur zurückgesetzt wird.
5. **Münzen sammeln** – Eine Münze berühren und beobachten, dass sie verschwindet und der Zähler im HUD hochzählt.
6. **Ziel erreichen** – Alle Münzen einsammeln, zum Portal laufen und prüfen, dass „Level geschafft“ eingeblendet wird.
7. **Neustart** – Den „Neustart“-Button drücken und sicherstellen, dass das Level neu geladen wird und der Münzzähler zurückgesetzt ist.

## 3) Weitergeben zum Testen

- Verteile einfach den Ordnerinhalt oder hoste ihn auf einem beliebigen statischen Webserver.
- Für schnelle Vorschauen kann auch ein ZIP des Ordners in einem Browser geöffnet werden (`index.html`).

Viel Spaß beim Testen!
