(() => {
 if(window.TjoerringCounterConfig?.provider!=='cloudflare')return;
 const key='tjoerring-counter-consent';let choice=null;
 try{const saved=localStorage.getItem(key);if(saved==='yes'||saved==='no')choice=saved;}catch{}
 window.TjoerringCounterConsent=()=>choice==='yes';
 const copy={da:['Må vi tælle dit besøg og huske dit 👍 på denne browser?','Ja tak','Nej tak','Du kan altid ændre dit valg her.'],en:['May we count your visit and remember your 👍 in this browser?','Yes please','No thanks','You can change your choice here anytime.'],de:['Dürfen wir deinen Besuch zählen und dein 👍 in diesem Browser speichern?','Ja bitte','Nein danke','Du kannst deine Wahl hier jederzeit ändern.'],pl:['Czy możemy zliczyć wizytę i zapamiętać Twoje 👍 w tej przeglądarce?','Tak','Nie, dziękuję','Możesz tu zmienić wybór w każdej chwili.']};
 const box=document.createElement('div'),text=document.createElement('p'),note=document.createElement('small');box.className='counter-likes';box.dataset.counterOwned='true';const yes=document.createElement('button'),no=document.createElement('button');
 for(const b of [yes,no]){b.type='button';b.className='counter-like-button';}
 yes.dataset.counterConsent='yes';no.dataset.counterConsent='no';box.append(text,yes,document.createTextNode(' '),no,note);
 function render(){const c=copy[document.documentElement.lang]||copy.da;text.textContent=c[0];yes.textContent=c[1];no.textContent=c[2];note.textContent=c[3];yes.setAttribute('aria-pressed',String(choice==='yes'));no.setAttribute('aria-pressed',String(choice==='no'));}
 function set(value){choice=value;try{localStorage.setItem(key,value);if(value==='no')for(const k of Object.keys(localStorage))if(k==='tjoerring-like-v1'||k==='tjoerring-device-visits'||k.startsWith('tjoerring-counter-browser-v2')||k.startsWith('tjoerring-cloudflare-v1:'))localStorage.removeItem(k);}catch{}render();window.dispatchEvent(new Event('tjoerring:analytics-consent'));}
 yes.onclick=()=>set('yes');no.onclick=()=>set('no');
 function mount(){const host=document.querySelector('#besog .visitor-counter-wrap');if(host&&!box.isConnected){host.appendChild(box);render();}}
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 window.addEventListener('tjoerring:counter-mounted',mount,{once:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
