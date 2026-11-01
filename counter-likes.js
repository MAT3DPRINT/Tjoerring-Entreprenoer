(() => {
 if(window.TjoerringCounterConfig?.provider!=='cloudflare'||!window.TjoerringCloudflarePrototype)return;
 const base=window.TjoerringCounterConfig?.apiBase||location.origin;
 const key='tjoerring-like-v1';let busy=false,likes=null,cancelProof=null,epoch=0;
 const consent=()=>window.TjoerringCounterConsent?.()===true;
 const get=()=>{if(!consent())return null;try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
 const button=document.createElement('button');button.type='button';button.className='counter-like-button';
 const intro=document.createElement('p'),thanks=document.createElement('p');thanks.setAttribute('role','status');
 const copy={da:['Kan du lide siden? Giv os et 👍. Det koster ikke engang diesel!','Tak! Chefen er allerede ved at bestille en større gravemaskine.'],en:['Like the page? Give us a 👍. It does not even cost diesel!','Thanks! The boss is already ordering a bigger excavator.'],de:['Gefällt dir die Seite? Gib uns ein 👍. Kostet nicht einmal Diesel!','Danke! Der Chef bestellt schon einen größeren Bagger.'],pl:['Podoba Ci się strona? Zostaw 👍. Nie kosztuje nawet kropli diesla!','Dzięki! Szef już zamawia większą koparkę.']};
 const labels={da:['Giv siden et like','Fortryd like','Prøv igen senere'],en:['Like this page','Unlike','Try again later'],de:['Seite liken','Like zurücknehmen','Später erneut versuchen'],pl:['Polub stronę','Cofnij polubienie','Spróbuj później']};
 function render(error=false){const c=copy[document.documentElement.lang]||copy.da;intro.textContent=c[0];thanks.textContent=get()?.liked?c[1]:'';const text=labels[document.documentElement.lang]||labels.da;button.textContent='👍 '+(error?text[2]:text[get()?.liked?1:0])+(likes===null?'':` · ${likes}`);button.setAttribute('aria-pressed',String(!!get()?.liked));button.disabled=busy||!consent();}
 async function proof(){
  const r=await fetch(base+'/v2/config',{signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error();const {sitekey}=await r.json();
  if(!window.turnstile)await new Promise((resolve,reject)=>{const existing=document.querySelector('script[src*="challenges.cloudflare.com/turnstile/"]');const s=existing||document.createElement('script');const timer=setTimeout(reject,10000);s.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});s.addEventListener('error',reject,{once:true});if(!existing){s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';document.head.appendChild(s);}});
  return new Promise((resolve,reject)=>{const box=document.createElement('div');button.after(box);let widget;const timer=setTimeout(()=>finish(null),120000);const finish=value=>{cancelProof=null;clearTimeout(timer);if(widget!==undefined)window.turnstile.remove(widget);box.remove();value?resolve(value):reject(Error());};cancelProof=()=>finish(null);widget=window.turnstile.render(box,{sitekey,action:'counter_visit',appearance:'interaction-only',retry:'never','refresh-expired':'never',callback:finish,'error-callback':()=>finish(null),'timeout-callback':()=>finish(null)});});
 }
 button.onclick=async()=>{if(busy||!consent())return;busy=true;const run=epoch;render();try{
  const previous=get()||{id:crypto.randomUUID(),liked:false};const next=!previous.liked;
  // Retain the same ID even after an uncertain response, making the next intent idempotent.
  localStorage.setItem(key,JSON.stringify(previous));
  const token=await proof();if(!consent()||run!==epoch)throw Error();const r=await fetch(base+'/v2/likes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({consent:true,browserId:previous.id,eventId:crypto.randomUUID(),proof:token,like:next}),signal:AbortSignal.timeout(5000)});
  if(!r.ok)throw Error();const d=await r.json();if(!Number.isSafeInteger(d.likes)||d.likes<0||d.liked!==next)throw Error();likes=d.likes;
  if(!consent()||run!==epoch){busy=false;render();return;}
  if(next)localStorage.setItem(key,JSON.stringify({...previous,liked:true}));else localStorage.removeItem(key);
  busy=false;render();
 }catch{busy=false;render(true);}};
 let mounted=false;
 function mount(){if(mounted)return;const host=document.querySelector('#besog .visitor-counter-wrap');if(!host)return;mounted=true;const box=document.createElement('div');box.className='counter-likes';box.append(intro,button,thanks);host.appendChild(box);render();fetch(base+'/v2/likes',{signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{if(Number.isSafeInteger(d.likes)&&d.likes>=0){likes=d.likes;render();}}).catch(()=>{});}
 window.addEventListener('tjoerring:analytics-consent',()=>{epoch++;if(!consent())cancelProof?.();render();});
 new MutationObserver(()=>render()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 window.addEventListener('tjoerring:counter-mounted',mount,{once:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
