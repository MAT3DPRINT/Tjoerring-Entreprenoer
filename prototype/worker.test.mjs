import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import worker,{VisitorCounter} from './worker.mjs';
import {storage} from './sqlite-adapter.mjs';
const origin='http://127.0.0.1:8787';
function setup(extra={}){
 const store=storage(),env={ALLOWED_ORIGIN:origin,ENABLE_WRITES:'local-test-only',...extra};
 const object=new VisitorCounter({storage:store},env);
 env.COUNTER={idFromName:x=>x,get:()=>object};
 const request=(path,body,headers={})=>worker.fetch(new Request(origin+path,{method:body===undefined?'GET':'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body:body===undefined?undefined:JSON.stringify(body)}),env);
 return {store,env,object,request,stats:async()=> (await request('/stats')).json()};
}
test('one event, duplicate suppression, reload, unique browsers and reads',async()=>{
 const s=setup(),visitorId=randomUUID(),eventId=randomUUID();
 assert.equal((await s.stats()).pageviews,0);
 await s.request('/visit',{eventId,visitorId});
 await Promise.all(Array.from({length:10},()=>s.request('/visit',{eventId,visitorId})));
 assert.equal((await s.stats()).pageviews,1);
 await s.request('/visit',{eventId:randomUUID(),visitorId});
 await s.request('/visit',{eventId:randomUUID(),visitorId:randomUUID()});
 for(let i=0;i<10;i++){const result=await s.stats();assert.equal(result.pageviews,3);assert.equal(result.uniqueVisitors,2);assert.equal(result.last24Hours,3);}
 s.store.db.close();
});
test('rolling 24h is timestamp-based, includes no future events, lifetime survives pruning',async()=>{
 const s=setup(),now=Date.now(),day=86400000;
 for(const [i,at] of [now-day-1,now-day,now-day+1,now,now+1].entries())s.store.sql.exec('INSERT INTO events VALUES (?,?)',String(i),at);
 assert.equal(s.object.stats(now).last24Hours,2);
 s.store.sql.exec('INSERT INTO events VALUES (?,?)','old',now-3*day);
 await s.request('/visit',{eventId:randomUUID(),visitorId:randomUUID()});
 assert.equal(s.store.sql.exec('SELECT id FROM events WHERE id=?','old').toArray().length,0);
 const restored=new VisitorCounter({storage:s.store},s.env);
 assert.equal(restored.stats(Date.now()).pageviews,1);
 assert.equal(restored.stats(Date.now()).uniqueVisitors,1);
 s.store.db.close();
});
test('invalid bodies/origins cannot count; preflight is read-only; writes disabled by default',async()=>{
 const s=setup();
 assert.equal((await s.request('/visit',{eventId:'bad',visitorId:null})).status,400);
 assert.equal((await s.request('/visit',{eventId:randomUUID(),visitorId:null},{Origin:'https://aahnej.dk'})).status,403);
 assert.equal((await worker.fetch(new Request(origin+'/visit',{method:'OPTIONS',headers:{Origin:origin}}),s.env)).status,204);
 assert.equal((await s.stats()).pageviews,0);
 s.env.ENABLE_WRITES='disabled';
 assert.equal((await s.request('/visit',{eventId:randomUUID(),visitorId:null})).status,403);
 assert.equal((await s.stats()).pageviews,0);s.store.db.close();
});
test('blocked browser storage can count views without inventing unique identities',async()=>{
 const s=setup();await s.request('/visit',{eventId:randomUUID(),visitorId:null});
 const stats=await s.stats();assert.equal(stats.pageviews,1);assert.equal(stats.uniqueVisitors,0);s.store.db.close();
});
test('legacy total remains separate; no legacy unique/24h invented',async()=>{
 const s=setup({LEGACY_PAGEVIEWS:'1000'});await s.request('/visit',{eventId:randomUUID(),visitorId:randomUUID()});
 const stats=await s.stats();assert.equal(stats.legacyPageviews,1000);assert.equal(stats.combinedPageviews,1001);assert.equal(stats.pageviews,1);assert.equal(stats.uniqueVisitors,1);assert.equal(stats.last24Hours,1);s.store.db.close();
});
test('database failure yields neutral 503 and CORS, no fake zero',async()=>{
 const s=setup();s.env.COUNTER.get=()=>({fetch(){throw new Error('storage down');}});
 const r=await s.request('/stats');assert.equal(r.status,503);assert.equal(r.headers.get('Access-Control-Allow-Origin'),origin);assert.equal((await r.json()).pageviews,undefined);s.store.db.close();
});
test('SQL transaction rolls back partially recorded event on failure',async()=>{
 const s=setup(),eventId=randomUUID();
 s.store.sql.exec("CREATE TRIGGER reject_total BEFORE UPDATE ON totals BEGIN SELECT RAISE(ABORT, 'test failure'); END");
 assert.equal((await s.request('/visit',{eventId,visitorId:randomUUID()})).status,503);
 assert.equal(s.store.sql.exec('SELECT * FROM events').toArray().length,0);
 assert.equal(s.store.sql.exec('SELECT * FROM visitors').toArray().length,0);
 assert.equal((await s.stats()).pageviews,0);s.store.db.close();
});
