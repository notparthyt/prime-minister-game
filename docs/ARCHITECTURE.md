# Architecture

The game is a single-page app with no build step. Everything lives in three files.

## Files
- `index.html` has the header stats, the canvas, the side panels and a modal container.
- `style.css` has the theme (CSS variables in `:root`), layout grid and components.
- `game.js` has state, rules, AI, events, UI rendering and canvas drawing.

## Game state (`G`)
```
G.own[]     owner nation id per grid cell (-1 = sea). Grid is 18x11, cell size 40px
G.n[]       nations: { id, name, col, gold, mil, eco, aggr, cap, dead, trade }
G.rel[i][j] relations matrix, -100..100
G.war[i][j] true if at war
G.al[i][j]  true if allied
G.turn      quarter counter (0..60)
G.ap        actions left this quarter
G.app       player approval
G.tax       0 low, 1 normal, 2 high
```
Nation `0` is always the player.

## Main functions
| Function | Purpose |
|---|---|
| `init()` | Builds the map (nearest-seed Voronoi plus random sea), nations and relations |
| `endTurn()` | Economy, approval, AI moves, relation drift, elections, events |
| `battle(a, c)` | Resolves nation `a` attacking cell `c`, handles capital collapse |
| `declareWar`, `peace` | Update the war matrix and pull allies in |
| `act(type, nation)` | Handles diplomacy buttons from the side panel |
| `check()` | Evaluates win and lose conditions |
| `render()` | Updates the HUD and side panel, then calls `draw()` |
| `draw()` | Canvas drawing: territories, borders, capitals, war outlines, selection |
| `modal()` | Event, election and game-over dialogs |

## Data flow
User click -> `act()` or a button handler -> mutate `G` -> `render()` -> `check()`.
`draw()` also runs inside a `requestAnimationFrame` loop so selection and capture flashes animate.

## Adding content
- **New event:** push `[title, text, [[label, effectFn], [label, effectFn]]]` to the `EV` array.
- **New nation:** add an entry to `DEF` and a seed position in `init()`.
- **Bigger map:** change `W`, `H`, and the canvas width/height (`W*S`, `H*S`).
- **New action:** add a button in `side()`, handle its key in `act()`.
