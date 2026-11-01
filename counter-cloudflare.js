(() => {
 if(window.TjoerringCounterConfig?.provider!=='cloudflare'||window.TjoerringCloudflarePrototype)return;
 const base=window.TjoerringCounterConfig.apiBase;
 if(!base||!/^https:\/\//.test(base)||/staging|localhost|127\.0\.0\.1/i.test(new URL(base).hostname))return;
 let snapshot=null,pending=null;
 const visit=fetch(base+'/v2/pageview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({eventId:crypto.randomUUID()}),signal:AbortSignal.timeout(5000)}).then(r=>{if(r.ok)setTimeout(()=>{snapshot=null;pending=null;window.dispatchEvent(new Event('tjoerring:counter-refresh'));},61000);}).catch(()=>{});
 async function read(){await visit;if(snapshot&&Date.now()-snapshot.received<15000)return snapshot.data;
  if(!pending)pending=fetch(base+'/v2/stats',{cache:'no-store',signal:AbortSignal.timeout(5000)}).then(async r=>{if(!r.ok)throw Error('Statistics unavailable');const d=await r.json();for(const k of ['pageviews','last24Hours'])if(!Number.isSafeInteger(d[k])||d[k]<0)throw Error('Invalid statistics');snapshot={data:d,received:Date.now()};return d;}).finally(()=>setTimeout(()=>{pending=null;},1000));return pending;}
 window.TjoerringCloudflarePrototype={async getValue(url){const d=await read();return d[new URL(url,location.href).searchParams.has('timeline')?'last24Hours':'pageviews'];}};
})();
