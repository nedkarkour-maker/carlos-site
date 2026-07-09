# Sponsor pyramid data

The homepage sponsor section renders purely from `rank-1.json` through
`rank-4.json`. `rank-1` is the top (widest) row of the inverted pyramid;
each rank below renders narrower, with smaller logos, funneling into the
"Maybe you?" card at the tip. To re-rank a sponsor, cut its entry from one
file and paste it into another — nothing else to change.

Each entry is `{ "name", "logo", "url" }`: `logo` is a path under
`/public` (leave `""` to render the name as a text wordmark — used for
funds without a logo); `url` is optional and opens in a new tab. Entries
with `"placeholder": true` are invisible slots for sponsors still to be
added — fill in the fields and delete the flag to activate one.
