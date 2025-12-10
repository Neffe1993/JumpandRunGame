# Jump and Run 2D

Ein kleines 2D Jump-and-Run-Spiel im Browser. Steuere die Spielfigur mit den Pfeiltasten (oder A/D) und springe mit W bzw. Leertaste. Sammle alle Münzen, weiche Stacheln aus und erreiche das Portal am Ende des Levels.

## Start

Öffne einfach die `index.html` in einem aktuellen Browser oder nutze ein lokales Static-File-Serving-Tool wie:

```bash
python -m http.server 8000
# dann im Browser http://localhost:8000 öffnen
```

codex/create-2d-jump-and-run-game-zt9zmz
Eine ausführliche Testanleitung inkl. kurzer Smoke-Tests findest du in [TESTING.md](TESTING.md).

=======
main
## Bedienung

- **Links/Rechts:** Pfeiltasten oder A/D
- **Springen:** W, Pfeil nach oben oder Leertaste
- **Neustart:** Button oben in der HUD

## Anpassungen

Die Leveldaten sind in `main.js` in den Arrays `platforms`, `coins` und `hazards` hinterlegt und können leicht angepasst werden.
