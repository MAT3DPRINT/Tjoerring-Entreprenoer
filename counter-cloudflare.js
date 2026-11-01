(() => {
 if(window.TjoerringCounterConfig?.provider!=='cloudflare'||window.TjoerringCloudflarePrototype)return;
 const cfg=window.TjoerringCounterConfig||{};
 const base=cfg.apiBase;
 if(!base||!/^[h]ttps:\/\//.test(base)||/staging|localhost|127\.0\.0\.1/i.test(new URL(base).hostname))return;
 let started=false,sent=false,generation=0,snapshot=null,pending=null,widget=null;
 const consent=()=>window.TjoerringCounterConsent?.()===true;
 const safeGet=k=>{try{return localStorage.getItem(k);}catch{return null;}};
 const safeSet=(k,v)=>{try{localStorage.setItem(k,v);return true;}catch{return false;}};
 const browserKey='tjoerring-counter-browser-v2';
 function read(){
  if(snapshot&&Date.now()-snapshot.received<15000)return Promise.resolve(snapshot.data);
  if(!pending)pending=fetch(base+'/v2/stats',{cache:'no-store',signal:AbortSignal.timeout(5000)})
   .then(async r=>{if(!r.ok)throw new Error('Statistics unavailable');const d=await r.json();
    for(const k of ['pageviews','uniqueVisitors','last24Hours'])if(!Number.isSafeInteger(d[k])||d[k]<0)throw new Error('Invalid statistics');
    snapshot={data:d,received:Date.now()};return d;
   }).finally(()=>setTimeout(()=>{pending=null;},1000));
  return pending;
 }
 async function start(){
  if(started||sent||!consent())return;started=true;const run=++generation;const active=()=>consent()&&run===generation;
  let browserId=safeGet(browserKey);
  const expires=Number(safeGet(browserKey+':expires'));
  if(!Number.isFinite(expires)||expires<=Date.now())browserId=null;
  if(!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(browserId||'')){browserId=crypto.randomUUID();if(!safeSet(browserKey,browserId))return;}
  if(!safeSet(browserKey+':expires',String(Date.now()+30*86400000)))return;
  const eventId=crypto.randomUUID();let submitted=false;
  try{
   const r=await fetch(base+'/v2/config',{signal:AbortSignal.timeout(5000)});if(!r.ok)return;
   const {sitekey}=await r.json();if(!sitekey||!active())return;
   if(!window.turnstile)await new Promise((resolve,reject)=>{
    const script=document.createElement('script'),timer=setTimeout(()=>reject(new Error('Widget timeout')),10000);
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
    script.onload=()=>{clearTimeout(timer);resolve();};script.onerror=()=>{clearTimeout(timer);reject(new Error('Widget unavailable'));};document.head.appendChild(script);
   });
   if(!active())return;
   const container=document.createElement('div');container.id='counterVerification';
   (document.getElementById('besog')||document.body).appendChild(container);
   widget=window.turnstile.render(container,{sitekey,action:'counter_visit',appearance:'interaction-only',retry:'never','refresh-expired':'never',
    callback:async proof=>{
     if(submitted||!active())return;submitted=true;sent=true;
     try{
      const result=await fetch(base+'/v2/collect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({eventId,browserId,consent:true,proof}),signal:AbortSignal.timeout(5000)});
      // One read-only refresh after the server cache expires, never a write retry.
      if(result.ok)setTimeout(()=>{snapshot=null;pending=null;window.dispatchEvent(new Event('tjoerring:counter-refresh'));},61000);
     }
     catch{/* Never resend an uncertain write or fall back to CounterAPI. */}
     finally{window.turnstile.remove(widget);container.remove();}
    },'error-callback':()=>{},'timeout-callback':()=>{}});
  }catch{/* Statistics remain readable when verification is unavailable. */}
 }
 window.addEventListener('tjoerring:analytics-consent',()=>{
  if(consent())start();else{generation++;started=false;try{localStorage.removeItem(browserKey);localStorage.removeItem(browserKey+':expires');}catch{}if(widget!==null)window.turnstile?.remove(widget);document.getElementById('counterVerification')?.remove();}
 });
 window.TjoerringCloudflarePrototype={async getValue(url){
  const d=await read(),p=new URL(url,location.href).searchParams;
  return d[p.has('unique')?'uniqueVisitors':p.has('timeline')?'last24Hours':'pageviews'];
 }};
 start();
})();
