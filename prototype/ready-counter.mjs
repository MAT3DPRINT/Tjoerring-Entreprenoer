const DAY=86400000,MINUTE=60000;
const hash=/^[a-f0-9]{64}$/;
export const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export class ReadyCounter {
 constructor(ctx,env){
  this.ctx=ctx;this.env=env;this.sql=ctx.storage.sql;this.cache=null;
  for(const q of [
   'CREATE TABLE IF NOT EXISTS meta (id INTEGER PRIMARY KEY, total INTEGER NOT NULL, unique_count INTEGER NOT NULL, started INTEGER NOT NULL, ready INTEGER NOT NULL)',
   'CREATE TABLE IF NOT EXISTS browsers (id TEXT PRIMARY KEY, minute INTEGER NOT NULL, hits INTEGER NOT NULL)',
   'CREATE INDEX IF NOT EXISTS browser_age ON browsers(minute)',
   'CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, at INTEGER NOT NULL)',
   'CREATE INDEX IF NOT EXISTS event_time ON events(at)',
   'CREATE TABLE IF NOT EXISTS likes (id TEXT PRIMARY KEY)',
   'CREATE TABLE IF NOT EXISTS buckets (minute INTEGER PRIMARY KEY, n INTEGER NOT NULL)',
   'CREATE TABLE IF NOT EXISTS limits (id TEXT PRIMARY KEY, n INTEGER NOT NULL, expires INTEGER NOT NULL)',
   'CREATE INDEX IF NOT EXISTS limit_expiry ON limits(expires)',
   'CREATE TABLE IF NOT EXISTS imports (table_name TEXT PRIMARY KEY, last_id TEXT NOT NULL)'])this.sql.exec(q);
  this.sql.exec('INSERT OR IGNORE INTO meta VALUES (1,0,0,?,1)',Date.now());
 }
 rows(q,...args){return this.sql.exec(q,...args).toArray();}
 gate(now){
  // Durable global admission budgets, not IP tracking. Invalid proofs consume
  // admission too. Rejected requests still incur platform request costs.
  const keys=[['m'+Math.floor(now/MINUTE),60],['d'+Math.floor(now/DAY),2000]];
  return this.ctx.storage.transactionSync(()=>{
   if(keys.some(([k,max])=>(this.rows('SELECT n FROM limits WHERE id=?',k)[0]?.n||0)>=max))return false;
   for(const [k]of keys)this.sql.exec('INSERT INTO limits VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET n=n+1',k,now+2*DAY);
   this.sql.exec('DELETE FROM limits WHERE expires < ?',now);return true;
  });
 }
 pruneBrowsers(now){
   const n=this.rows('SELECT COUNT(*) AS n FROM browsers WHERE minute < ?',now-30*DAY)[0].n;
   if(n){this.sql.exec('DELETE FROM browsers WHERE minute < ?',now-30*DAY);this.sql.exec('UPDATE meta SET unique_count=unique_count-? WHERE id=1',n);}
 }
 stats(now){
  if(this.cache&&now-this.cache.updatedAt<60000)return this.cache;
  this.pruneBrowsers(now);
  const meta=this.rows('SELECT * FROM meta WHERE id=1')[0];if(!meta.ready)return null;
  const cutoff=now-DAY,minute=Math.floor(cutoff/MINUTE)*MINUTE;
  const full=this.rows('SELECT COALESCE(SUM(n),0) AS n FROM buckets WHERE minute > ? AND minute <= ?',minute,Math.floor(now/MINUTE)*MINUTE)[0].n;
  const edge=this.rows('SELECT COUNT(*) AS n FROM events WHERE at > ? AND at < ?',cutoff,minute+MINUTE)[0].n;
  return this.cache={pageviews:meta.total,uniqueVisitors:meta.unique_count,last24Hours:full+edge,
   updatedAt:now,startedAt:meta.started,legacyPageviews:null,uniqueDefinition:'consenting-browsers-last-30-days',sampled:false};
 }
 record(data,now){
  return this.ctx.storage.transactionSync(()=>{
   if(typeof data.like==='boolean'){
    if(data.like)this.sql.exec('INSERT OR IGNORE INTO likes VALUES (?)',data.browser);
    else this.sql.exec('DELETE FROM likes WHERE id=?',data.browser);
    return response({liked:data.like,likes:this.rows('SELECT COUNT(*) AS n FROM likes')[0].n});
   }
   if(!this.rows('SELECT ready FROM meta WHERE id=1')[0].ready)return response({error:'Restore incomplete'},503);
   if(this.rows('SELECT id FROM events WHERE id=?',data.event)[0])return response({recorded:false},200);
   if(data.anonymous){
    this.sql.exec('INSERT INTO events VALUES (?,?)',data.event,now);
    this.sql.exec('INSERT INTO buckets VALUES (?,1) ON CONFLICT(minute) DO UPDATE SET n=n+1',Math.floor(now/MINUTE)*MINUTE);
    this.sql.exec('UPDATE meta SET total=total+1 WHERE id=1');
    this.sql.exec('DELETE FROM events WHERE at < ?',now-2*DAY);
    this.sql.exec('DELETE FROM buckets WHERE minute < ?',Math.floor((now-2*DAY)/MINUTE)*MINUTE);
    return response({recorded:true},202);
   }
   this.pruneBrowsers(now);
   const min=Math.floor(now/MINUTE)*MINUTE,browser=this.rows('SELECT * FROM browsers WHERE id=?',data.browser)[0];
   if(browser?.minute===min&&browser.hits>=6)return response({error:'Browser rate limit'},429);
   this.sql.exec('INSERT INTO browsers VALUES (?,?,1) ON CONFLICT(id) DO UPDATE SET minute=excluded.minute,hits=?',data.browser,min,browser?.minute===min?browser.hits+1:1);
   this.sql.exec('INSERT INTO events VALUES (?,?)',data.event,now);
   this.sql.exec('INSERT INTO buckets VALUES (?,1) ON CONFLICT(minute) DO UPDATE SET n=n+1',min);
   this.sql.exec('UPDATE meta SET total=total+1,unique_count=unique_count+? WHERE id=1',browser?0:1);
   this.sql.exec('DELETE FROM events WHERE at < ?',now-2*DAY);
   this.sql.exec('DELETE FROM buckets WHERE minute < ?',Math.floor((now-2*DAY)/MINUTE)*MINUTE);
   // Do not invalidate the shared read cache on writes: otherwise bursts of
   // visits also force repeated scans of the 24-hour buckets.
   return response({recorded:true},202);
  });
 }
 async fetch(request){
  const u=new URL(request.url),p=u.pathname,now=Date.now();
  if(p==='/likes')return response({likes:this.rows('SELECT COUNT(*) AS n FROM likes')[0].n});
  if(p==='/stats'){const data=this.stats(now);return data?response(data):response({error:'Restore incomplete'},503);}
  if(p==='/admit')return response({allowed:this.gate(now)});
  if(p==='/record')return this.record(await request.json(),now);
  if(p==='/manifest'){
   const meta=this.rows('SELECT * FROM meta WHERE id=1')[0];
   if(!meta.ready)return response({error:'Incomplete'},409);
   return response({version:2,meta,events:this.rows('SELECT COUNT(*) AS n FROM events')[0].n,browsers:this.rows('SELECT COUNT(*) AS n FROM browsers')[0].n});
  }
  if(p==='/export'){
   const meta=this.rows('SELECT * FROM meta WHERE id=1')[0],table=u.searchParams.get('table');
   if(!['events','browsers'].includes(table)||u.searchParams.get('revision')!==String(meta.total)||!meta.ready)return response({error:'Export revision changed'},409);
   return response({rows:this.rows(`SELECT * FROM ${table} WHERE id > ? ORDER BY id LIMIT 100`,u.searchParams.get('after')||'')});
  }
  if(p==='/import/start'){
   const d=await request.json(),m=d?.meta;
   if(d?.version!==2||!m||m.id!==1||m.ready!==1||![m.total,m.unique_count,m.started,d.events,d.browsers].every(Number.isSafeInteger)||m.total<0||m.unique_count<0||m.unique_count>m.total||m.started<=0||m.started>now||d.events<0||d.events>m.total||d.browsers!==m.unique_count)return response({error:'Invalid manifest'},400);
   if(this.rows('SELECT total FROM meta')[0].total!==0||this.rows('SELECT * FROM imports').length)return response({error:'Target not empty'},409);
   this.ctx.storage.transactionSync(()=>{
    this.sql.exec('UPDATE meta SET total=?,unique_count=?,started=?,ready=0 WHERE id=1',m.total,m.unique_count,m.started);
    this.sql.exec('INSERT INTO imports VALUES (?,?)','manifest',JSON.stringify(d));
   });this.cache=null;return response({started:true});
  }
  if(p==='/import/page'){
   const d=await request.json(),table=d?.table;
   if(!['events','browsers'].includes(table)||!Array.isArray(d.rows)||!d.rows.length||d.rows.length>100||this.rows('SELECT ready FROM meta')[0].ready)return response({error:'Invalid page'},400);
   const manifest=JSON.parse(this.rows('SELECT last_id FROM imports WHERE table_name=?','manifest')[0].last_id);
   let previous=this.rows('SELECT last_id FROM imports WHERE table_name=?',table)[0]?.last_id||'';
   for(const row of d.rows){if(!hash.test(row.id)||row.id<=previous||
     (table==='events'&&(!Number.isSafeInteger(row.at)||row.at<manifest.meta.started||row.at>now))||
     (table==='browsers'&&(!Number.isSafeInteger(row.minute)||row.minute<0||row.minute>now||!Number.isSafeInteger(row.hits)||row.hits<1||row.hits>6)))return response({error:'Invalid row'},400);previous=row.id;}
   if(this.rows(`SELECT COUNT(*) AS n FROM ${table}`)[0].n+d.rows.length>manifest[table])return response({error:'Too many rows'},400);
   this.ctx.storage.transactionSync(()=>{
    for(const row of d.rows){
     if(table==='events'){this.sql.exec('INSERT INTO events VALUES (?,?)',row.id,row.at);this.sql.exec('INSERT INTO buckets VALUES (?,1) ON CONFLICT(minute) DO UPDATE SET n=n+1',Math.floor(row.at/MINUTE)*MINUTE);}
     else this.sql.exec('INSERT INTO browsers VALUES (?,?,?)',row.id,row.minute,row.hits);
    }
    this.sql.exec('INSERT INTO imports VALUES (?,?) ON CONFLICT(table_name) DO UPDATE SET last_id=excluded.last_id',table,previous);
   });return response({lastId:previous});
  }
  if(p==='/import/finish'){
   const manifest=this.rows('SELECT last_id FROM imports WHERE table_name=?','manifest')[0];if(!manifest)return response({error:'No import'},409);
   const d=JSON.parse(manifest.last_id);
   if(this.rows('SELECT COUNT(*) AS n FROM events')[0].n!==d.events||this.rows('SELECT COUNT(*) AS n FROM browsers')[0].n!==d.browsers)return response({error:'Missing rows'},409);
   this.sql.exec('UPDATE meta SET ready=1 WHERE id=1');this.cache=null;return response({restored:true});
  }
  return response({error:'Not found'},404);
 }
}

export async function boundedJSON(request,max=4096){
 if(!(request.headers.get('content-type')||'').startsWith('application/json'))throw new Error('json');
 const reader=request.body?.getReader();if(!reader)throw new Error('body');let size=0,parts=[];
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new Error('size');}parts.push(value);}
 const bytes=new Uint8Array(size);let at=0;for(const p of parts){bytes.set(p,at);at+=p.length;}return JSON.parse(new TextDecoder().decode(bytes));
}
export async function collect(request,env,stub,verifyFetch=fetch){
 let data;try{data=await boundedJSON(request);}catch{return response({error:'Invalid request'},400);}
 const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
 if(!data||data.consent!==true||!uuid.test(data.eventId)||!uuid.test(data.browserId)||typeof data.proof!=='string'||data.proof.length<1||data.proof.length>2048||Object.keys(data).some(k=>!['consent','eventId','browserId','proof','like'].includes(k)))return response({error:'Invalid submission'},400);
 if(data.like!==undefined&&typeof data.like!=='boolean')return response({error:'Invalid like'},400);
 if(!env.TURNSTILE_SECRET||!env.IDENTITY_SECRET)return response({error:'Collection not configured'},503);
 const admitted=await stub.fetch(new Request('https://internal/admit',{method:'POST'}));
 if(!(await admitted.json()).allowed)return response({error:'Admission rate limit'},429);
 let verification;
 try{
  const r=await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:data.proof}),signal:AbortSignal.timeout(4000)});
  if(!r.ok)throw new Error('upstream');verification=await r.json();
 }catch{return response({error:'Verification unavailable'},503);}
 if(verification.success!==true||verification.hostname!==env.TURNSTILE_HOSTNAME||verification.action!=='counter_visit')return response({error:'Invalid proof'},403);
 const encode=new TextEncoder(),key=await crypto.subtle.importKey('raw',encode.encode(env.IDENTITY_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const hmac=async value=>Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,encode.encode(value))),x=>x.toString(16).padStart(2,'0')).join('');
 const event=await hmac('event:'+data.eventId.toLowerCase()),browser=await hmac('browser:'+data.browserId.toLowerCase());
 return stub.fetch(new Request('https://internal/record',{method:'POST',body:JSON.stringify({event,browser,...(typeof data.like==='boolean'?{like:data.like}:{})})}));
}

// Page-document nonce only: no browser ID, IP, fingerprint, cookie or Turnstile.
export async function anonymousView(request,stub){
 let d;try{d=await boundedJSON(request,512);}catch{return response({error:'Invalid request'},400);}
 if(!d||Object.keys(d).length!==1||typeof d.eventId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(d.eventId))return response({error:'Invalid event'},400);
 const gate=await stub.fetch(new Request('https://internal/admit',{method:'POST'}));if(!(await gate.json()).allowed)return response({error:'Admission rate limit'},429);
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('anonymous:'+d.eventId.toLowerCase()));const event=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
 return stub.fetch(new Request('https://internal/record',{method:'POST',body:JSON.stringify({anonymous:true,event})}));
}
