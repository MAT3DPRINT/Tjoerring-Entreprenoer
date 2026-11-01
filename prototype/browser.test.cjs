const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),calls=[],errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  let mode='normal';
  await page.route('**/*',route=>{
   const u=new URL(route.request().url());
   if(u.origin!=='http://127.0.0.1:8787')return route.abort();
   if(['/visit','/stats'].includes(u.pathname))calls.push({path:u.pathname,method:route.request().method()});
   if(u.pathname==='/stats'&&mode==='down')return route.fulfill({status:503,body:'unavailable'});
   if(u.pathname==='/stats'&&mode==='network')return route.abort();
   if(u.pathname==='/stats'&&mode==='invalid')return route.fulfill({body:'{"pageviews":-1}'});
   if(u.pathname==='/stats'&&mode==='timeout')return;
   return route.continue();
  });
  await page.goto('http://127.0.0.1:8787/');
  await page.waitForFunction(()=>/^\d/.test(document.getElementById('visitorTotal')?.textContent));
  const first=await page.locator('#visitorTotal').textContent(),unique=await page.locator('#visitorUnique').textContent();
  assert.equal(calls.filter(c=>c.path==='/visit').length,1);
  assert.equal(await page.locator('#visitorDevice').textContent(),'1');
  await page.reload();
  await page.waitForFunction(old=>document.getElementById('visitorTotal')?.textContent!==old && /^\d/.test(document.getElementById('visitorTotal')?.textContent),first);
  assert.equal(await page.locator('#visitorUnique').textContent(),unique);
  assert.equal(await page.locator('#visitorDevice').textContent(),'2');
  assert.equal(calls.filter(c=>c.path==='/visit').length,2);
  console.log('PASS reload: one POST per load, stable browser unique, unchanged device counter');
  for(const failure of ['down','network','invalid','timeout']){
   mode=failure;calls.length=0;await page.clock.install();await page.reload();
   await page.clock.runFor(30000);
   await page.waitForFunction(()=>document.getElementById('visitorTotalStatus')?.hidden===false);
   assert.ok(/^\d/.test(await page.locator('#visitorTotal').textContent()),'last good cache');
   assert.equal(calls.filter(c=>c.path==='/visit').length,1);
   assert.ok(calls.filter(c=>c.path==='/stats').length<=3);
   for(const lang of ['da','en','de','pl']){
    await page.evaluate(lang=>window.TjoerringI18n.setLanguage(lang),lang);await page.clock.runFor(32);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.ok((await page.locator('#visitorTotalStatus').textContent()).length>10);
   }
   await page.clock.runFor(60000);assert.equal(calls.filter(c=>c.path==='/visit').length,1);
   console.log('PASS '+failure+': cached status, four languages, mobile, no counting retries');
  }
  mode='normal';await page.reload();await page.clock.runFor(1000);
  await page.waitForFunction(()=>/^\d/.test(document.getElementById('visitorTotal')?.textContent)&&document.getElementById('visitorTotalStatus').hidden);
  console.log('PASS recovery: fresh values replace stale status');
  mode='invalid';
  await page.evaluate(()=>localStorage.clear());await page.reload();await page.clock.runFor(12000);
  await page.waitForFunction(()=>document.getElementById('visitorTotalStatus')?.hidden===false);
  assert.equal(await page.locator('#visitorTotal').textContent(),'–');
  assert.ok(!(await page.locator('#visitorOdometer').textContent()).includes('0'));
  assert.deepEqual(errors,[]);console.log('PASS no cache: neutral status, no invented values, no JS errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
