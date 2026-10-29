# Prime Minister: Rule Valoria

A browser-based 2D grand strategy game. You are the Prime Minister of an imaginary nation surrounded by rivals and potential allies. Manage the economy, keep voters happy, sign treaties, wage war, and try to dominate the map before your term runs out.

Built with plain **HTML, CSS and JavaScript**. No frameworks, no build step, no dependencies.

## Play

- **Locally:** download or clone the repo and open `index.html` in any modern browser.
- **GitHub Pages:** push to GitHub, then go to *Settings → Pages → Deploy from branch → `main` / root*. Your game will be live at `https://<your-username>.github.io/<repo-name>/`.

```bash
git clone https://github.com/<your-username>/prime-minister-game.git
cd prime-minister-game
# open index.html, or serve it locally:
python3 -m http.server 8000   # then visit http://localhost:8000
```

## How to play

Time passes in quarters. Each quarter you have **3 actions**, then you end the quarter to collect taxes and watch the AI nations move.

| Area | What you can do |
|---|---|
| Cabinet | Set tax level, invest in industry, recruit troops, fund welfare |
| Diplomacy | Send aid, sign trade deals, propose alliances, declare war, offer peace |
| War | Attack enemy provinces that border your land; capture a capital to collapse a nation |
| Events | Random crises and opportunities with trade-offs |

**Win:** hold 55% of the land, or be the largest nation after 15 years (60 quarters).
**Lose:** lose an election (approval under 45% every 12 quarters), suffer a coup (approval 0), or lose your capital.

See [docs/GAMEPLAY.md](docs/GAMEPLAY.md) for full rules and strategy tips.

## Project structure

```
index.html      Page layout
style.css       Styling
game.js         All game logic and rendering
docs/           Gameplay, architecture and contribution guides
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the code works.

## Roadmap ideas

- Sea invasions and naval units
- Spies, sabotage and espionage
- Tech tree and difficulty levels
- Sound effects and animated battles
- World news ticker and more event types
- Selectable starting nations, save/load via `localStorage`

## Contributing

Pull requests are welcome. Read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) first.

## License

MIT. See [LICENSE](LICENSE).
