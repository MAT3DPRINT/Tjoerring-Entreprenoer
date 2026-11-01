# Cloudflare counter integration for review

The user has passed the real managed-Turnstile staging test for visits, likes,
undo and browser uniqueness. No production deployment is included in this PR.

Root integration:
- counter-config.js is the explicit provider switch, currently counterapi.
- counter-cloudflare.js adapts the existing counter display, cache and animations.
- counter-likes.js adds black/yellow likes with short jokes in da/en/de/pl.
- Existing CounterAPI namespace/action/key and request implementation remain intact.
  Cloudflare errors never trigger an automatic counting fallback.
- Uniqueness is consenting browsers in the last 30 days; clearing storage or
  another browser profile can count again. Active likes retain a separate hash
  until undone. No IP storage is added. This is not a count of individual people.

Before separately approving production activation:
1. Review the PR; do not merge or deploy automatically.
2. Configure a NEW Worker using prototype/wrangler.production.jsonc, with a new
   production SQLite namespace, fresh identity secret and production Turnstile
   widget/secret. This config deliberately has workers_dev disabled and a blank
   public sitekey. Do not deploy the staging config to production.
3. Set the narrow ALLOWED_ORIGIN and hostname for aahnej.dk. The production
   entrypoint contains no manual test page. Admin operations fail closed without
   a secret; do not reuse staging credentials. Do not import any staging backups.
4. Wire window.TjoerringCounterConsent() to the approved consent choice and send
   tjoerring:analytics-consent on changes. Without consent there is no visit write.
   Review the local device counter/cache storage and privacy information too.
5. Set provider='cloudflare' and apiBase to the new production URL. Staging/local
   hostnames are rejected. Deploy only after separate approval. Verify the new
   counter starts from zero; an evidenced historical CounterAPI balance may be
   displayed separately later. No historical figures have been invented.

Rollback: explicitly switch provider back to counterapi. Do not record with both
providers or combine unique counts. Production has no automatic test-data import.

Worker/DO quotas are shared on Free; the existing admission limits mitigate writes,
but cannot guarantee availability under abusive read traffic. Counter backups do
not include likes yet; accept likes as disposable or add their export before launch.
No changes to MAT3D services or DNS are required by this PR.

Source and tests under prototype/ are isolated preparation/staging tools. They
contain no database snapshots, actual secrets or production visit records. Existing
local test-data files remain untracked/ignored and must never be published.
