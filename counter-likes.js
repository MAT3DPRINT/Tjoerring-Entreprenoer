(() => {
 if(window.TjoerringCounterConfig?.provider!=='cloudflare'||!window.TjoerringCloudflarePrototype)return;
 const base=window.TjoerringCounterConfig.apiBase,key='tjoerring-like-v1';let busy=false,likes=null,cancelProof=null,closeTimer=null;
 const get=()=>{try{const d=JSON.parse(localStorage.getItem(key));return d&&/^[a-f0-9-]{36}$/i.test(d.id)?d:null;}catch{return null;}};
 const root=document.createElement('aside');root.className='floating-like';root.dataset.counterOwned='true';
 const launcher=document.createElement('button'),panel=document.createElement('div'),close=document.createElement('button'),button=document.createElement('button'),intro=document.createElement('p'),thanks=document.createElement('p'),hint=document.createElement('small'),machine=document.createElement('span');
 launcher.type=close.type=button.type='button';launcher.className='like-launcher';launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-controls','likePanel');panel.id='likePanel';panel.className='like-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','likeIntro');intro.id='likeIntro';close.className='like-close';close.textContent='×';button.className='counter-like-button';thanks.setAttribute('role','status');machine.textContent='🚜';machine.className='like-excavator';machine.setAttribute('aria-hidden','true');panel.append(close,intro,button,thanks,machine,hint);root.append(launcher,panel);
 const copy={da:['Kan du lide siden? Giv os et 👍. Det koster ikke engang diesel!','Tak! Chefen er allerede ved at bestille en større gravemaskine.'],en:['Like the page? Give us a 👍. It does not even cost diesel!','Thanks! The boss is already ordering a bigger excavator.'],de:['Gefällt dir die Seite? Gib uns ein 👍. Kostet nicht einmal Diesel!','Danke! Der Chef bestellt schon einen größeren Bagger.'],pl:['Podoba Ci się strona? Zostaw 👍. Nie kosztuje nawet kropli diesla!','Dzięki! Szef już zamawia większą koparkę.']};
 const labels={da:['Giv siden et like','Fortryd like','Prøv igen senere'],en:['Like this page','Unlike','Try again later'],de:['Seite liken','Like zurücknehmen','Später erneut versuchen'],pl:['Polub stronę','Cofnij polubienie','Spróbuj później']};

 const extra={da:['Åbn likes','Luk','Gemmer kun dit like i denne browser.'],en:['Open likes','Close','Only your like is remembered in this browser.'],de:['Likes öffnen','Schließen','Nur dein Like wird in diesem Browser gespeichert.'],pl:['Otwórz polubienia','Zamknij','Zapamiętujemy tylko polubienie w tej przeglądarce.']};
 function render(error=false){const lang=document.documentElement.lang,c=copy[lang]||copy.da,l=labels[lang]||labels.da,e=extra[lang]||extra.da,liked=!!get()?.liked;intro.textContent=c[0];thanks.textContent=error?l[2]:liked?c[1]:'';button.textContent=(liked?l[1]:l[0])+(likes===null?'':' · '+likes);button.disabled=busy;button.setAttribute('aria-pressed',String(liked));launcher.textContent=liked?'👍 ✓':'👍';launcher.setAttribute('aria-label',e[0]+(liked?' ✓':''));launcher.setAttribute('aria-expanded',String(!panel.hidden));close.setAttribute('aria-label',e[1]);hint.textContent=e[2];}
 function shut(restore=true){clearTimeout(closeTimer);panel.hidden=true;panel.classList.remove('liked');render();if(restore)launcher.focus();}
 launcher.onclick=()=>{if(!panel.hidden)return shut();clearTimeout(closeTimer);panel.hidden=false;panel.classList.remove('liked');render();button.focus();};close.onclick=()=>shut();
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();shut();}});
 async function proof(){
  const r=await fetch(base+'/v2/config',{signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error();const {sitekey}=await r.json();
  if(!window.turnstile)await new Promise((resolve,reject)=>{const existing=document.querySelector('script[src*="challenges.cloudflare.com/turnstile/"]');const s=existing||document.createElement('script');const timer=setTimeout(reject,10000);s.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});s.addEventListener('error',reject,{once:true});if(!existing){s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';document.head.appendChild(s);}});
  return new Promise((resolve,reject)=>{const box=document.createElement('div');button.after(box);let widget;const timer=setTimeout(()=>finish(null),120000);const finish=value=>{cancelProof=null;clearTimeout(timer);if(widget!==undefined)window.turnstile.remove(widget);box.remove();value?resolve(value):reject(Error());};cancelProof=()=>finish(null);widget=window.turnstile.render(box,{sitekey,action:'counter_visit',appearance:'interaction-only',retry:'never','refresh-expired':'never',callback:finish,'error-callback':()=>finish(null),'timeout-callback':()=>finish(null)});});
 }

 button.onclick=async()=>{if(busy)return;busy=true;clearTimeout(closeTimer);render();try{
  const previous=get()||{id:crypto.randomUUID(),liked:false},next=!previous.liked;
  localStorage.setItem(key,JSON.stringify(previous));
  const token=await proof();const r=await fetch(base+'/v2/likes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({consent:true,browserId:previous.id,eventId:crypto.randomUUID(),proof:token,like:next}),signal:AbortSignal.timeout(5000)});
  if(!r.ok)throw Error();const d=await r.json();if(!Number.isSafeInteger(d.likes)||d.likes<0||d.liked!==next)throw Error();likes=d.likes;
  if(next)localStorage.setItem(key,JSON.stringify({...previous,liked:true}));else localStorage.removeItem(key);
  busy=false;render();panel.classList.toggle('liked',next);if(next&&!panel.hidden)closeTimer=setTimeout(()=>shut(panel.contains(document.activeElement)),4500);
 }catch{busy=false;render(true);}};
 function mount(){document.body.appendChild(root);render();fetch(base+'/v2/likes',{signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{if(Number.isSafeInteger(d.likes)&&d.likes>=0){likes=d.likes;render();}}).catch(()=>{});}
 new MutationObserver(()=>render()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
