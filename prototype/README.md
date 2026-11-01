# Cloudflare counter preparation

See [COUNTER-INTEGRATION.md](../COUNTER-INTEGRATION.md) for activation, rollback,
privacy and remaining production configuration. The real managed-Turnstile staging
acceptance test was passed by the user. This PR does not enable production.

Production entrypoint: production.mjs with wrangler.production.jsonc. Staging uses
staging.mjs and its separate config, namespaces, secrets and manual test page.
Never import staging data or deploy the staging config as production.

Tests (Node 24+):

```powershell
node --test prototype/ready.test.mjs prototype/worker.test.mjs
# Set PLAYWRIGHT_MODULE if Playwright is installed outside this directory.
node prototype/integration-browser.test.cjs
```

The integration browser test uses synthetic mocked responses and blocks external
requests. It covers the actual root page adapter, four languages, 390px layout,
likes/undo, reload identity and the local device counter. Backend tests cover
validation, deduplication, rate limits, exact rolling 24h, retention and recovery.

Local preview from this directory:

```powershell
$env:READY_PREVIEW='1'
node preview.mjs
```

Open http://127.0.0.1:8787. Local successful Turnstile is mocked only by tests.
Never serve the original root directly for testing, because its default provider
remains CounterAPI. Test databases, credentials and backup snapshots are not
included in the commit. Backup operator tools only address the authorized staging
Worker and must not be repointed to production without review.
