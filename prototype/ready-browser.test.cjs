const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}});let posts=0;page.setDefaultTimeout(10000);
 await page.route('**/*',r=>{if(new URL(r.request().url()).origin!=='http://127.0.0.1:8787')return r.abort();if(r.request().url().endsWith('/v2/collect'))posts++;return r.continue();});
 await page.addInitScript(()=>{window.testConsent=false;window.TjoerringCounterConsent=()=>window.testConsent;window.turnstile={render(el,o){setTimeout(()=>{o.callback('local-valid');o.callback('local-valid');},10);return 'mock';},remove(){}};});
 await page.goto('http://127.0.0.1:8787');await page.waitForFunction(()=>/^\d/.test(document.getElementById('visitorTotal')?.textContent));assert.equal(posts,0);
 const like=page.getByRole('button',{name:/👍/});await like.click();await page.waitForFunction(()=>document.querySelector('button[aria-pressed="true"]'));await like.click();await page.waitForFunction(()=>document.querySelector('button[aria-pressed="false"]'));assert.equal(posts,0);
 await page.evaluate(()=>{window.testConsent=true;dispatchEvent(new Event('tjoerring:analytics-consent'));});await page.waitForResponse(r=>r.url().endsWith('/v2/collect'));assert.equal(posts,1);
 await page.evaluate(()=>dispatchEvent(new Event('tjoerring:analytics-consent')));assert.equal(posts,1);
 for(const [lang,label]of Object.entries({da:'Unikke browsere · 30 dage',en:'Unique browsers · 30 days',de:'Eindeutige Browser · 30 Tage',pl:'Unikalne przeglądarki · 30 dni'})){await page.evaluate(x=>TjoerringI18n.setLanguage(x),lang);await page.waitForFunction(x=>document.getElementById('visitorUnique').nextElementSibling.textContent===x,label);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await page.reload();await page.waitForFunction(()=>document.getElementById('visitorDevice')?.textContent==='2');
 console.log('PASS like/undo, no visit side effects, consent, duplicate callback, local device reload, four languages and mobile');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
