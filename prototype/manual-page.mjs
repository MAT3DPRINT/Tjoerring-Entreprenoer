export const manualPage=`<!doctype html><html lang="da"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tjørring – stagingtest</title>
<style>body{font:18px system-ui;max-width:700px;margin:40px auto;padding:20px;background:#fafafa;color:#222}button{font:inherit;padding:12px;margin:12px 0;cursor:pointer}output{font-weight:bold}small{display:block}#status{min-height:3em}</style>
<h1>Tjørring – kun staging-data</h1><p>Denne side registrerer ét testbesøg ved åbning efter Turnstile-kontrol. Den gemmer et browser-ID til testen. Genindlæsning giver et nyt besøg, men samme unikke browser.</p>
<p>Sidevisninger: <output id="total">–</output><br>Unikke browsere · 30 dage: <output id="unique">–</output><br>Seneste 24 timer: <output id="today">–</output></p><p id="status" role="status">Indlæser Turnstile…</p><div id="verification"></div><div id="besog"></div>
<small>Tallene kan være op til 60 sekunder forsinkede. Efter et godkendt besøg opdateres de automatisk én gang. Likes opdateres straks. Behold browserdata under testen.</small>
<script src="/manual-test.js" defer></script><script src="/manual-likes.js" defer></script></html>`;
export const manualScript=`
(async()=>{
const status=document.getElementById('status');
const read=async()=>{const r=await fetch('/v2/stats',{cache:'no-store'});if(!r.ok)throw Error('Statistik: HTTP '+r.status);const d=await r.json();for(const [id,k]of [['total','pageviews'],['unique','uniqueVisitors'],['today','last24Hours']])document.getElementById(id).textContent=d[k];};
try{
 await read();const config=await fetch('/v2/config');if(!config.ok)throw Error('Konfiguration utilgængelig');const {sitekey}=await config.json();
 const key='tjoerring-manual-browser';let id=localStorage.getItem(key);if(!id){id=crypto.randomUUID();localStorage.setItem(key,id);}const eventId=crypto.randomUUID();let sent=false;
 await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
 status.textContent='Gennemfør kontrollen, hvis Turnstile beder om det.';
 window.turnstile.render('#verification',{sitekey,action:'counter_visit',callback:async proof=>{if(sent)return;sent=true;try{const r=await fetch('/v2/collect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({consent:true,browserId:id,eventId,proof}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('HTTP '+r.status);status.textContent='Testbesøg registreret. Tallene opdateres inden for cirka 60 sekunder.';await read();setTimeout(()=>read().then(()=>{status.textContent='Tallene er opdateret. Du kan nu genindlæse for at teste samme browser.';}).catch(()=>{status.textContent='Kunne ikke opdatere tallene. Genindlæs senere.';}),61000);}catch(e){status.textContent='Registrering mislykkedes: '+e.message+'. Ingen automatisk gensendelse.';}},'error-callback':()=>{status.textContent='Turnstile kunne ikke gennemføres. Prøv at genindlæse siden.';}});
}catch(e){status.textContent='Testen kunne ikke starte: '+e.message;}
})();`;
