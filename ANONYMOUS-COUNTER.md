# Automatic pageviews and floating likes — review only

## Technical/privacy choice

Count a document load automatically through POST /v2/pageview. The only field is
a random per-document eventId, held in memory, never reused across reloads. It is
hashed server-side solely for duplicate suppression in the existing 48-hour event
window. There are no analytics cookies, localStorage/sessionStorage identifiers,
browser fingerprints, IP storage or request-body logs added by this implementation.
Cloudflare still processes network metadata to serve requests; not collecting IPs
in the application does not mean infrastructure processes no personal data.

The Cloudflare view removes unique-browser and device statistics. Their historical
backend data are not reset; no new browser rows are written by pageviews. Existing
legacy browser rows follow existing 30-day lazy pruning. Old local identifiers are
not read by the new counter. Counter cache is in memory/server only, with the
existing delayed refresh and neutral unavailable state on network failure. No
counting POST retries. The original CounterAPI provider, code and statistics remain
available for deliberate rollback.

The previous yes/no consent UI is no longer loaded. This is an engineering choice
to avoid statistics-related terminal storage/recognition, not a blanket legal
certification. Datatilsynet distinguishes cookie/terminal-access consent from
GDPR obligations. The site owner should provide proportionate privacy information
and assess the lawful basis for infrastructure processing. No fingerprinting-based
unique count or IP-derived identity is substituted.

Turnstile is not silently loaded for automatic statistics: it runs browser
challenges and processes browser signals. It remains server-verified for the
user-requested like/undo action. The existing like backend is unchanged. Only an
active like's separate functional browser token/state is remembered, with an
explicit explanation in the popup; undo removes the token. This storage is solely
to deliver the requested one-like/undo service, not to measure visits. Clearing
storage permits another vote; no claim of one person/one vote. Blocked storage
means like registration fails visibly rather than creating an unremembered vote.
The legacy `consent:true` API field is sent only after that explicit like/undo click;
it is not used to permit analytics tracking.

## Abuse and accuracy trade-off

Anonymous pageviews retain Origin checks, strict JSON/body validation, event
deduplication and the existing durable global 60/minute and 2,000/day admission
budgets. Origin is forgeable; this is intentionally weaker than verified Turnstile.
Bots generating fresh event IDs can inflate counts or exhaust the budget and
cause undercounting. Requests rejected by the budget still consume Free request
quota. No invisible security measure is claimed to prove human visits. The metric
means accepted pageview submissions, not unique people or guaranteed human visits.
There is no new paid service, library or account-level setting.

## Floating interaction

Small fixed black/yellow icon at lower right with safe-area spacing. Popup is
opened explicitly, closes through its close button or Escape, and auto-closes
4.5 seconds after a successful like. A check on the icon marks a remembered like;
reopen to undo. Animation runs briefly after interaction only and is disabled by
prefers-reduced-motion. All popup/button/status copy has da/en/de/pl versions.
Focus returns on manual close; auto-close does not steal focus from other content.

## Validation and rollout

17 backend tests pass, including anonymous concurrent deduplication, no browser
rows, invalid payload rejection and admission limiting. Real Chromium UI tests
use only mocked API responses at 1280, 390 and 320 px: automatic one-POST loads,
fresh nonce on reload, no counter storage/Turnstile before interaction, floating
position under scrolling, four languages, like/undo, auto-close, Escape, reduced
motion and API failure. These are not a new real Turnstile acceptance test.

No backend or website is deployed by this PR. On a separately approved rollout,
deploy the backend first (new endpoint, same production database and totals),
then publish the website. Deploying only the frontend would show aggregate reads
but new pageviews would fail against the old API. Never use staging snapshots.
CounterAPI rollback is still the explicit provider switch in counter-config.js.

Run: node --test prototype/ready.test.mjs prototype/worker.test.mjs
and node prototype/anonymous-floating.test.cjs with Playwright available.

## Official sources consulted

- https://www.datatilsynet.dk/regler-og-vejledning/cookies-og-lignende-teknologier/gode-raad-ved-brug-af-cookies-og-lignende-teknologier
- https://www.datatilsynet.dk/regler-og-vejledning/gdpr-univers-for-smaa-virksomheder/cookies-og-gdpr
- https://digst.dk/sikkerhed/digitale-tilsyn/tilsyn-med-sporingsteknologiomraadet/cookievejledningen/
- https://developers.cloudflare.com/turnstile/get-started/mobile-implementation/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
