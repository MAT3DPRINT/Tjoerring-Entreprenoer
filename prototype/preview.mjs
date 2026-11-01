import http from 'node:http';

import fs from 'node:fs';

import path from 'node:path';

import {fileURLToPath} from 'node:url';

import worker,{VisitorCounter} from './worker.mjs';

import {storage} from './sqlite-adapter.mjs';

import {ReadyCounter,collect} from './ready-counter.mjs';

const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(dir);

const ready=process.env.READY_PREVIEW==='1';

const remote=ready&&process.env.STAGING_PREVIEW==='1';

const staging='https://tjoerring-counter-staging.mateusz-szulczik.workers.dev';

const store=storage(path.join(dir,ready?'ready-local-test.sqlite':'local-test.sqlite'));

const readyObject=ready?new ReadyCounter({storage:store},{}):null;

const likesObject=ready?new ReadyCounter({storage:storage(path.join(dir,'likes-local-test.sqlite'))},{}):null;

const env={ALLOWED_ORIGIN:'http://127.0.0.1:8787',ENABLE_WRITES:'local-test-only'};

const object=new VisitorCounter({storage:store},env);

env.COUNTER={idFromName:x=>x,get:()=>object};

const source=fs.readFileSync(path.join(root,'visitor-counter.js'),'utf8');

// Adapt only the served preview. Original files and CounterAPI fallback stay intact.

const start=source.indexOf('    const getValue = async url => {');

const end=source.indexOf('    const renderOdometer',start);

if(start<0 || end<0)throw new Error('Unexpected counter source; refusing unsafe preview');

let counter=(source.slice(0,start)+'    const getValue = url => window.TjoerringCloudflarePrototype.getValue(url);\n'+source.slice(end))

  .replace('https://counterapi.com/api/${NS}/${ACTION}/${KEY}','http://127.0.0.1:8787/stats')

  .replace('tjoerring-counter-v1:',ready?'tjoerring-cf-ready-cache-v2:':'tjoerring-cf-prototype-cache-v1:')

  .replace('Unikke besøgende',ready?'Unikke browsere · 30 dage':'Unikke besøgende');

if(ready)counter=counter.replace('      const retryDelays = [2000, 5000];',`      window.addEventListener('tjoerring:counter-refresh', async () => {

        try {

          const value = await getValue(readUrl.href);

          state.updatedAt = Date.now();

          safeSet(cacheKey, JSON.stringify({value, updatedAt:state.updatedAt}));

          render(value); status.hidden = true; status.textContent = '';

        } catch { status.hidden = false; updateStatus(state); }

      }, {once:true});

      const retryDelays = [2000, 5000];`);

const server=http.createServer(async(req,res)=>{

 try{

  const url=new URL(req.url,'http://127.0.0.1:8787');

  if(ready&&url.pathname.startsWith('/v2/')){

   const chunks=[];let size=0;for await(const c of req){size+=c.length;if(size>4096){res.writeHead(413);res.end();return;}chunks.push(c);}

   const request=new Request(url,{method:req.method,headers:req.headers,body:req.method==='POST'?Buffer.concat(chunks):undefined});

   let result;

   if(url.pathname==='/v2/likes')result=req.method==='GET'?await likesObject.fetch(new Request('https://internal/likes')):await collect(request,{TURNSTILE_SECRET:'local-only',IDENTITY_SECRET:'local-only',TURNSTILE_HOSTNAME:'127.0.0.1'},likesObject,async(_,options)=>Response.json({success:JSON.parse(options.body).response==='local-valid',hostname:'127.0.0.1',action:'counter_visit'}));

   else if(url.pathname==='/v2/config')result=Response.json({sitekey:'LOCAL-MOCK-ONLY'});

   else if(url.pathname==='/v2/stats')result=await readyObject.fetch(new Request('https://internal/stats'));

   else if(url.pathname==='/v2/collect')result=await collect(request,{TURNSTILE_SECRET:'local-only',IDENTITY_SECRET:'local-only',TURNSTILE_HOSTNAME:'127.0.0.1'},readyObject,async(_,options)=>Response.json({success:JSON.parse(options.body).response==='local-valid',hostname:'127.0.0.1',action:'counter_visit'}));

   else result=new Response(null,{status:404});

   res.writeHead(result.status,Object.fromEntries(result.headers));res.end(await result.text());return;

  }

  if(['/stats','/visit'].includes(url.pathname)){

   const chunks=[];for await(const chunk of req){chunks.push(chunk);if(Buffer.concat(chunks).length>1024){res.writeHead(413);res.end();return;}}

   const headers=new Headers(req.headers);

   // Same-origin GET fetches may omit Origin; emulate a dedicated same-origin proxy.

   if(!headers.has('Origin')&&req.method==='GET')headers.set('Origin',env.ALLOWED_ORIGIN);

   const response=await worker.fetch(new Request(url,{method:req.method,headers,body:req.method==='POST'?Buffer.concat(chunks):undefined}),env);

   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;

  }

  const name=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));

  // Explicit allowlist prevents exposing .git, configuration, or the test database.

  const allowed=new Set(['index.html','script.js','style.css','styles.css','translations.js','philosophy.js','visitor-counter.js','prototype/client.js','prototype/ready-client.js','prototype/likes-client.js','assets/logo.png','assets/logo-new.png','assets/logo-new.svg']);

  if(!allowed.has(name)){res.writeHead(404);res.end();return;}

  let body=name==='visitor-counter.js'?counter:fs.readFileSync(path.join(root,name));

  if(name==='index.html')body=body.toString().replace('<head>',`<head>${remote?'<script>window.TjoerringCounterConfig={apiBase:'+JSON.stringify(staging)+'};</script>':''}<script src="/prototype/${ready?'ready-client':'client'}.js"></script>${ready?'<script defer src="/prototype/likes-client.js"></script>':''}`).replace('<title>','<title>[LOCAL TESTDATA] ');

  if(ready&&name==='translations.js')body=body.toString().replace('Unikke besøgende','Unikke browsere · 30 dage').replace('Unique visitors','Unique browsers · 30 days').replace('Eindeutige Besucher','Eindeutige Browser · 30 Tage').replace('Unikalni odwiedzający','Unikalne przeglądarki · 30 dni');

  const type=name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':name.endsWith('.png')?'image/png':name.endsWith('.svg')?'image/svg+xml':'text/html';

  res.writeHead(200,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store',

    'Content-Security-Policy':remote?`connect-src 'self' ${staging} https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; img-src 'self' data:; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com`:"connect-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'"});res.end(body);

 }catch(error){res.writeHead(500);res.end('Local preview error');console.error(error.message);}

});

server.listen(8787,'127.0.0.1',()=>console.log('LOCAL TESTDATA only: http://127.0.0.1:8787 (persistent local-test.sqlite)'));
