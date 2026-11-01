// Prototype only. No production hostname is allowed by the supplied config.
const DAY = 86400000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (data, status = 200) => Response.json(data, {status, headers:{'Cache-Control':'no-store'}});

export class VisitorCounter {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    this.sql = ctx.storage.sql;
    this.sql.exec('CREATE TABLE IF NOT EXISTS totals (id INTEGER PRIMARY KEY, views INTEGER NOT NULL, uniques INTEGER NOT NULL, started INTEGER NOT NULL)');
    this.sql.exec('INSERT OR IGNORE INTO totals VALUES (1, 0, 0, ?)', Date.now());
    this.sql.exec('CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, at INTEGER NOT NULL)');
    this.sql.exec('CREATE INDEX IF NOT EXISTS events_time ON events(at)');
  }
  stats(now) {
    const total = this.sql.exec('SELECT * FROM totals WHERE id=1').toArray()[0];
    const recent = this.sql.exec('SELECT COUNT(*) AS n FROM events WHERE at > ? AND at <= ?', now-DAY, now).toArray()[0].n;
    // A legacy balance is separate, never silently added to unique or recent counts.
    const raw = this.env.LEGACY_PAGEVIEWS;
    const legacy = raw === undefined || raw === '' ? null : Number(raw);
    if (legacy !== null && (!Number.isSafeInteger(legacy) || legacy < 0)) throw new Error('Invalid legacy balance');
    return {pageviews:total.views, uniqueVisitors:total.uniques, last24Hours:recent,
      legacyPageviews:legacy, combinedPageviews:legacy === null ? null : legacy+total.views,
      startedAt:total.started, updatedAt:now, uniqueDefinition:'browser-id-since-start', sampled:false};
  }
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (request.method === 'GET' && path === '/stats') return json(this.stats(Date.now()));
    if (request.method !== 'POST' || path !== '/visit') return json({error:'Not found'},404);
    if (this.env.ENABLE_WRITES !== 'local-test-only') return json({error:'Prototype writes disabled'},403);
    if (!(request.headers.get('content-type') || '').startsWith('application/json')) return json({error:'JSON required'},415);
    const body = await request.text();
    if (body.length > 512) return json({error:'Request too large'},413);
    let data;
    try {data=JSON.parse(body);} catch {return json({error:'Invalid JSON'},400);}
    if (!data || !uuid.test(data.eventId) || (data.visitorId !== null && !uuid.test(data.visitorId))) return json({error:'Invalid identifiers'},400);
    // Server time is authoritative; no client timestamp or arbitrary count allowed.
    const now = Date.now();
    const recorded = this.ctx.storage.transactionSync(() => {
      if (this.sql.exec('SELECT id FROM events WHERE id=?',data.eventId).toArray().length) return false;
      this.sql.exec('INSERT INTO events VALUES (?,?)',data.eventId,now);
      let isNew = 0;
      if (data.visitorId !== null && !this.sql.exec('SELECT id FROM visitors WHERE id=?',data.visitorId).toArray().length) {
        this.sql.exec('INSERT INTO visitors VALUES (?)',data.visitorId);
        isNew=1;
      }
      this.sql.exec('UPDATE totals SET views=views+1, uniques=uniques+? WHERE id=1',isNew);
      // 48h idempotency window, longer than any client retry window. Read-only
      // requests never alter records. Lifetime totals and browser IDs survive pruning.
      this.sql.exec('DELETE FROM events WHERE at < ?',now-2*DAY);
      return true;
    });
    return json({recorded},202);
  }
}

export default {
  async fetch(request,env) {
    const origin=request.headers.get('Origin');
    if (!origin || origin !== env.ALLOWED_ORIGIN) return json({error:'Origin not allowed'},403);
    const path=new URL(request.url).pathname;
    if (!['/visit','/stats'].includes(path)) return json({error:'Not found'},404);
    const headers={'Access-Control-Allow-Origin':origin,'Vary':'Origin',
      'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
    if (request.method==='OPTIONS') return new Response(null,{status:204,headers});
    try {
      const object=env.COUNTER.get(env.COUNTER.idFromName('aahnej-prototype-v1'));
      const response=await object.fetch(request);
      const output=new Response(response.body,response);
      for (const [key,value] of Object.entries(headers)) output.headers.set(key,value);
      return output;
    } catch {
      return new Response(JSON.stringify({error:'Counter temporarily unavailable'}),{status:503,headers:{...headers,'Content-Type':'application/json','Cache-Control':'no-store'}});
    }
  }
};
