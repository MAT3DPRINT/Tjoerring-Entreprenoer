const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),calls=[];
 page.on('response',r=>{if(r.url().includes('.workers.dev/v2/'))calls.push({path:new URL(r.url()).pathname,status:r.status()});});
 await page.goto('http://127.0.0.1:8787');await page.waitForFunction(()=>/^\d/.test(document.getElementById('visitorTotal')?.textContent));
 const likes=page.getByRole('button',{name:/👍/});await likes.click();
 let accepted=false;try{const response=await page.waitForResponse(r=>r.url().endsWith('/v2/likes')&&r.request().method()==='POST',{timeout:30000});accepted=response.ok();}catch{}
 if(accepted){await page.waitForFunction(()=>document.querySelector('button[aria-pressed="true"]'));await likes.click();const undo=await page.waitForResponse(r=>r.url().endsWith('/v2/likes')&&r.request().method()==='POST',{timeout:30000});assert.ok(undo.ok());}
 const invalid=await page.evaluate(async()=>{const base=window.TjoerringCounterConfig.apiBase;const body={consent:true,eventId:crypto.randomUUID(),browserId:crypto.randomUUID(),proof:'invalid-browser-test'};const result=[];for(const path of ['/v2/collect','/v2/likes']){const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,...(path.endsWith('likes')?{like:true}:{})})});result.push(r.status);}return result;});assert.deepEqual(invalid,[403,403]);
 const result={realBrowserCalls:true,acceptedLikeAndUndo:accepted,invalidProofRejected:invalid,calls};fs.writeFileSync('simple-staging-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
