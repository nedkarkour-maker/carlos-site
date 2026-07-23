# Editable data files

## funding.json

- `goal` — the yearly campaign cost. It drives the "$55k CAD/yr" line under
  the ring chart in the budget section (55000 renders as "$55k"). If the
  total ever changes, also review the four amounts in `budget.breakdown`
  in `config/content.ts` so the card stays consistent.
- `raised` — money received so far. Nothing on the page displays it right
  now (the old progress bar was removed with the budget redesign), but
  keep it up to date — a raised-vs-goal display can be brought back
  without touching anything else.
- `currency` — ISO 4217 code (CAD, EUR, …) used for formatting.
