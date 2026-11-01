import fs from 'node:fs';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const base='https://tjoerring-counter-staging.mateusz-szulczik.workers.dev';
const token=fs.readFileSync(new URL('./.dev.vars.staging',import.meta.url),'utf8').match(/^STAGING_TOKEN=(\S+)/m)[1];
let requests=0;const timings=[];
async function call(path,body,options={}){
 const start=performance.now();requests++;
 const r=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',...options.headers},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 const text=await r.text();timings.push(performance.now()-start);
 let data;try{data=JSON.parse(text);}catch{throw new Error('Non-JSON staging response HTTP '+r.status);}
 return {status:r.status,data};
}
const initial=await call('/stats');assert.equal(initial.status,200,JSON.stringify(initial.data));
assert.equal(initial.data.pageviews,0,'Fresh isolated staging expected; do not silently repeat this write test');
assert.equal((await call('/stats',undefined,{headers:{Authorization:''}})).status,401);
assert.equal((await call('/visit',{eventId:randomUUID(),visitorId:null},{headers:{Authorization:'Bearer wrong',Origin:'http://127.0.0.1:8787'}})).status,401);
assert.equal((await call('/visit',{eventId:randomUUID(),visitorId:null},{headers:{Origin:'https://aahnej.dk'}})).status,403);
assert.equal((await call('/visit',{eventId:'bad',visitorId:null})).status,400);
assert.equal((await call('/visit',{oversized:'x'.repeat(1000)})).status,413);
assert.equal((await call('/stats?target=production')).status,400);
assert.equal((await call('/stats')).data.pageviews,0);
console.log('PASS missing/wrong credentials, forged Origin, production Origin, malformed IDs, oversized body and unknown target');
const visitorId=randomUUID(),eventId=randomUUID();
assert.equal((await call('/visit',{eventId,visitorId})).data.recorded,true);
const duplicates=await Promise.all(Array.from({length:8},()=>call('/visit',{eventId,visitorId})));
assert.ok(duplicates.every(x=>x.status===202&&x.data.recorded===false));
assert.equal((await call('/stats')).data.pageviews,1);
await call('/visit',{eventId:randomUUID(),visitorId}); // reload, same browser
await call('/visit',{eventId:randomUUID(),visitorId:randomUUID()});
let result=(await call('/stats')).data;assert.equal(result.pageviews,3);assert.equal(result.uniqueVisitors,2);assert.equal(result.last24Hours,3);
console.log('PASS pageviews, unique browser IDs, reload and concurrent duplicate protection');
const visitors=Array.from({length:5},()=>randomUUID()),loadStart=performance.now();
for(let batch=0;batch<10;batch++){
 const responses=await Promise.all(visitors.map(visitorId=>call('/visit',{eventId:randomUUID(),visitorId})));
 assert.ok(responses.every(r=>r.status===202&&r.data.recorded===true));
}
const loadMs=performance.now()-loadStart;
await call('/visit',{eventId:randomUUID(),visitorId:null});
result=(await call('/stats')).data;assert.equal(result.pageviews,54);assert.equal(result.uniqueVisitors,7);assert.equal(result.last24Hours,54);
console.log('PASS bounded load: 50 writes, concurrency 5, '+Math.round(loadMs)+' ms; blocked storage does not invent unique visitors');
const backup=(await call('/backup')).data;
fs.writeFileSync(new URL('./staging-test-backup.json',import.meta.url),JSON.stringify(backup,null,2));
assert.equal((await call('/restore',backup)).status,403);
assert.equal((await call('/restore?target=restore-test',backup)).status,200);
const restored=(await call('/backup?target=restore-test')).data;assert.deepEqual(restored,backup);
assert.equal((await call('/restore?target=restore-test',backup)).status,409);
assert.equal((await call('/stats?target=restore-test')).data.pageviews,54);
console.log('PASS backup -> new isolated restore target, identical rows, overwrite protection');
const now=(await call('/stats')).data.updatedAt-10000,day=86400000;
const fixture={version:1,totals:[{id:1,views:3,uniques:1,started:now-2*day}],visitors:[{id:randomUUID()}],events:[{id:randomUUID(),at:now-25*3600000},{id:randomUUID(),at:now-23*3600000},{id:randomUUID(),at:now-1000}]};
assert.equal((await call('/restore?target=boundary-test',fixture)).status,200);
const boundary=(await call('/stats?target=boundary-test')).data;assert.equal(boundary.pageviews,3);assert.equal(boundary.last24Hours,2);
assert.equal((await call('/stats')).data.pageviews,54);
console.log('PASS rolling 24 hours excludes 25h-old event while lifetime total retains it');
const report={at:new Date().toISOString(),url:base,requests,load:{writes:50,concurrency:5,durationMs:Math.round(loadMs)},latencyMs:{min:Math.round(Math.min(...timings)),max:Math.round(Math.max(...timings)),mean:Math.round(timings.reduce((a,b)=>a+b,0)/timings.length)},primary:result,backup:{bytes:Buffer.byteLength(JSON.stringify(backup)),events:backup.events.length,visitors:backup.visitors.length},boundary};
fs.writeFileSync(new URL('./staging-test-results.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
