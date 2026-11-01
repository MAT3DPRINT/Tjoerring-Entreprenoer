import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {ReadyCounter,collect} from './ready-counter.mjs';import {storage} from './sqlite-adapter.mjs';
const hash=n=>n.toString(16).padStart(64,'0');
const setup=()=>{const s=storage();return {s,o:new ReadyCounter({storage:s},{})};};
const req=(p,d)=>new Request('https://test'+p,{method:d?'POST':'GET',body:d?JSON.stringify(d):undefined});
test('likes are idempotent, reversible and independent of visits',async()=>{
 const {s,o}=setup(),data={browser:hash(9),event:hash(8),like:true};
 for(let i=0;i<5;i++)assert.equal((await o.record(data,Date.now()).json()).likes,1);
 assert.equal(o.stats(Date.now()).pageviews,0);
 assert.equal((await o.record({...data,like:false},Date.now()).json()).likes,0);
 assert.equal((await o.record({...data,like:false},Date.now()).json()).likes,0);
 assert.equal(o.rows('SELECT * FROM likes').length,0);s.db.close();
});
test('browser identities expire after thirty days while pageviews survive',()=>{
 const {s,o}=setup(),now=Date.now();o.record({event:hash(1),browser:hash(2)},now);
 const stats=o.stats(now+31*86400000);assert.equal(stats.pageviews,1);assert.equal(stats.uniqueVisitors,0);
 assert.equal(o.rows('SELECT * FROM browsers').length,0);s.db.close();
});
test('concurrent duplicate IDs, six/browser/minute, persisted admission limit',async()=>{
 const {s,o}=setup(),now=Date.now();
 for(let i=0;i<6;i++)assert.equal(o.record({event:hash(i),browser:hash(99)},now).status,202);
 assert.equal(o.record({event:hash(0),browser:hash(99)},now).status,200);
 assert.equal(o.record({event:hash(7),browser:hash(99)},now).status,429);
 assert.equal(o.stats(now).pageviews,6);assert.equal(o.stats(now).uniqueVisitors,1);
 for(let i=0;i<60;i++)assert.equal(o.gate(now),true);
 const restored=new ReadyCounter({storage:s},{});assert.equal(restored.gate(now),false);s.db.close();
});
test('minute buckets match exact timestamp window, cache is bounded',()=>{
 const {s,o}=setup(),now=Math.floor(Date.now()/60000)*60000+30000,day=86400000;
 for(const [i,at]of [now-day-1,now-day,now-day+1,now-1000].entries())o.record({event:hash(i),browser:hash(i+100)},at);
 assert.equal(o.stats(now).last24Hours,2);assert.equal(o.stats(now).pageviews,4);
 assert.equal(o.stats(now+10000).updatedAt,now);assert.equal(o.stats(now+61000).updatedAt,now+61000);s.db.close();
});
test('Turnstile validates action/hostname and fails closed; raw IDs/IP never forwarded to storage',async()=>{
 const {s,o}=setup(),env={TURNSTILE_SECRET:'test-secret',IDENTITY_SECRET:'test-identity',TURNSTILE_HOSTNAME:'127.0.0.1'};
 const payload={eventId:randomUUID(),browserId:randomUUID(),consent:true,proof:'test-proof'};
 const request=()=>new Request('https://test/v2/collect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const verify=data=>async(url,options)=>{assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');assert.equal(JSON.parse(options.body).remoteip,undefined);return Response.json(data);};
 for(const data of [{success:false},{success:true,hostname:'evil',action:'counter_visit'},{success:true,hostname:'127.0.0.1',action:'wrong'}])assert.equal((await collect(request(),env,o,verify(data))).status,403);
 assert.equal((await collect(request(),env,o,async()=>{throw new Error('network');})).status,503);
 const good=verify({success:true,hostname:'127.0.0.1',action:'counter_visit'});
 assert.equal((await collect(request(),env,o,good)).status,202);
 assert.equal((await collect(request(),env,o,good)).status,200);
 assert.equal(o.stats(Date.now()).pageviews,1);
 assert.ok(!JSON.stringify(o.rows('SELECT * FROM browsers')).includes(payload.browserId));
 payload.consent=false;assert.equal((await collect(request(),env,o,good)).status,400);s.db.close();
});
test('paged backup consistency and empty-target restore, no overwrite',async()=>{
 const {s,o}=setup(),target=setup(),now=Date.now();
 for(let i=0;i<120;i++)o.record({event:hash(i),browser:hash(i+1000)},now);
 const manifest=await(await o.fetch(req('/manifest'))).json();
 assert.equal((await target.o.fetch(req('/import/start',manifest))).status,200);
 assert.equal((await target.o.fetch(req('/stats'))).status,503);
 assert.equal((await target.o.fetch(req('/import/finish',{}))).status,409);
 for(const table of ['events','browsers']){
  let after='';for(;;){const r=await o.fetch(req('/export?table='+table+'&revision=120&after='+after));const {rows}=await r.json();if(!rows.length)break;
   assert.equal((await target.o.fetch(req('/import/page',{table,rows}))).status,200);after=rows.at(-1).id;}
 }
 assert.equal((await target.o.fetch(req('/import/finish',{}))).status,200);
 const restored=await(await target.o.fetch(req('/manifest'))).json();assert.deepEqual(restored,manifest);
 assert.equal((await target.o.fetch(req('/import/start',manifest))).status,409);
 o.record({event:hash(200),browser:hash(2000)},Date.now());assert.equal((await o.fetch(req('/export?table=events&revision=120'))).status,409);
 s.db.close();target.s.db.close();
});
test('concurrent verified submissions deduplicate; case variants do not evade IDs',async()=>{
 const {s,o}=setup(),env={TURNSTILE_SECRET:'test',IDENTITY_SECRET:'test',TURNSTILE_HOSTNAME:'127.0.0.1'};
 const data={eventId:randomUUID(),browserId:randomUUID(),consent:true,proof:'mock-valid'};
 const verify=async()=>Response.json({success:true,hostname:'127.0.0.1',action:'counter_visit'});
 const send=d=>collect(new Request('https://test/v2/collect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}),env,o,verify);
 const responses=await Promise.all(Array.from({length:20},(_,i)=>send(i%2?data:{...data,eventId:data.eventId.toUpperCase(),browserId:data.browserId.toUpperCase()})));
 assert.equal(responses.filter(r=>r.status===202).length,1);assert.equal(responses.filter(r=>r.status===200).length,19);
 assert.equal(o.stats(Date.now()).pageviews,1);s.db.close();
});
test('daily admission limit survives minute changes; writes do not invalidate read cache',()=>{
 const {s,o}=setup(),now=Math.floor(Date.now()/86400000)*86400000;
 for(let i=0;i<2000;i++)assert.equal(o.gate(now+Math.floor(i/50)*60000),true);
 assert.equal(o.gate(now+41*60000),false);
 assert.equal(o.stats(now).pageviews,0);o.record({event:hash(1),browser:hash(2)},now+1);
 assert.equal(o.stats(now+1000).pageviews,0);assert.equal(o.stats(now+61000).pageviews,1);s.db.close();
});
