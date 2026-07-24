# Sponsor pyramid data

The homepage sponsor section renders purely from `rank-1.json` through
`rank-4.json`. The ranks group backers by category, top to bottom:
`rank-1` = sponsors, `rank-2` = associations, `rank-3` = federations &
clubs, `rank-4` = the tip (e.g. memorial funds), funneling into the
"Maybe you?" card. Each rank down renders narrower, with smaller logos. To
re-rank a sponsor, cut its entry from one file and paste it into another —
nothing else to change.

Each entry is `{ "name", "logo", "url" }`: `logo` is a path under
`/public` (leave `""` to render the name as a text wordmark — used for
funds without a logo); `url` is optional and opens in a new tab. Add
`"dark": true` to sit a light/white logo (e.g. Vela LA) on a dark panel so
it stays visible on the cream page background. Entries with
`"placeholder": true` are invisible slots for sponsors still to be added —
fill in the fields and delete the flag to activate one.
