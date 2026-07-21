# Editable data files

## funding.json

Drives the funding progress bar under the budget block on the homepage.
When money comes in, edit the `raised` number (one-line change) and commit —
the bar and its "€X raised of €Y (Z%)" label update automatically. `goal`
is the season budget; `currency` is an ISO 4217 code (EUR, CAD, …) used
only for formatting.
