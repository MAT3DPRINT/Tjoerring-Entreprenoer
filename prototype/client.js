(() => {
  if (window.TjoerringCloudflarePrototype) return;
  if (!['localhost','127.0.0.1'].includes(location.hostname)) throw new Error('Local prototype only');
  const safeGet = key => {try{return localStorage.getItem(key);}catch{return null;}};
  const safeSet = (key,value) => {try{localStorage.setItem(key,value);return true;}catch{return false;}};
  let visitorId=safeGet('tjoerring-cf-prototype-browser');
  if (!/^[0-9a-f-]{36}$/i.test(visitorId || '')) {
    visitorId=crypto.randomUUID();
    if (!safeSet('tjoerring-cf-prototype-browser',visitorId)) visitorId=null;
  }
  // One POST per document load, never retried. Reload = a new view, same browser.
  const record=fetch('/visit',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({eventId:crypto.randomUUID(),visitorId}),signal:AbortSignal.timeout(5000)})
    .then(r=>{if(!r.ok)throw new Error(`record HTTP ${r.status}`);})
    .catch(error=>console.warn('[Cloudflare prototype record]',error.message));
  let snapshot=null,pending=null;
  window.TjoerringCloudflarePrototype={
    async getValue(url) {
      await record;
      if (!snapshot || Date.now()-snapshot.receivedAt > 1000) {
        if (!pending) pending=fetch('/stats',{cache:'no-store',signal:AbortSignal.timeout(5000)})
          .then(async r=>{
            if(!r.ok)throw new Error(`HTTP ${r.status}`);
            const data=await r.json();
            for(const key of ['pageviews','uniqueVisitors','last24Hours']) if(!Number.isSafeInteger(data[key]) || data[key]<0) throw new Error('Invalid statistics');
            snapshot={data,receivedAt:Date.now()};
          // Share failures too, so three display fields do not multiply retries.
          }).finally(()=>{setTimeout(()=>{pending=null;},1000);});
        await pending;
      }
      const params=new URL(url,location.href).searchParams;
      return snapshot.data[params.has('unique')?'uniqueVisitors':params.has('timeline')?'last24Hours':'pageviews'];
    }
  };
})();
