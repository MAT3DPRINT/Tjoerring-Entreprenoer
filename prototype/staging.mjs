import {VisitorCounter} from './worker.mjs';
import {readyRoutes} from './ready-routes.mjs';
import {manualPage,manualScript} from './manual-page.mjs';
import likesScript from './likes-client.js';
export {ReadyCounter} from './ready-counter.mjs';
const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class StagingCounter extends VisitorCounter {
  constructor(ctx,env){super(ctx,{...env,ENABLE_WRITES:'local-test-only'});this.window=0;this.requests=0;}
  async fetch(request){
    const minute=Math.floor(Date.now()/60000);
    if(this.window!==minute){this.window=minute;this.requests=0;}
    if(++this.requests>200)return reply({error:'Staging test rate limit'},429);
    const p=new URL(request.url).pathname;
    if(p==='/backup'&&request.method==='GET')return reply({version:1,
      totals:this.sql.exec('SELECT * FROM totals').toArray(),
      visitors:this.sql.exec('SELECT * FROM visitors').toArray(),
      events:this.sql.exec('SELECT * FROM events').toArray()});
    if(p==='/restore'&&request.method==='POST'){
      let d;try{d=await request.json();}catch{return reply({error:'Invalid backup'},400);}
      if(d?.version!==1||!Array.isArray(d.totals)||d.totals.length!==1||!Array.isArray(d.events)||!Array.isArray(d.visitors)||d.events.length>1000||d.visitors.length>1000)return reply({error:'Invalid backup'},400);
      const t=d.totals[0],now=Date.now();
      if(t.id!==1||![t.views,t.uniques,t.started].every(Number.isSafeInteger)||t.views<d.events.length||t.uniques!==d.visitors.length||t.uniques>t.views||t.started<=0||t.started>now||
        d.events.some(e=>!UUID.test(e.id)||!Number.isSafeInteger(e.at)||e.at<t.started||e.at>now)||d.visitors.some(v=>!UUID.test(v.id))||
        new Set(d.events.map(e=>e.id)).size!==d.events.length||new Set(d.visitors.map(v=>v.id)).size!==d.visitors.length)return reply({error:'Invalid backup values'},400);
      const empty=this.sql.exec('SELECT views FROM totals WHERE id=1').toArray()[0].views===0;
      if(!empty)return reply({error:'Restore requires empty isolated target'},409);
      this.ctx.storage.transactionSync(()=>{
        this.sql.exec('UPDATE totals SET views=?,uniques=?,started=? WHERE id=1',t.views,t.uniques,t.started);
        for(const e of d.events)this.sql.exec('INSERT INTO events VALUES (?,?)',e.id,e.at);
        for(const v of d.visitors)this.sql.exec('INSERT INTO visitors VALUES (?)',v.id);
      });return reply({restored:true});
    }
    return super.fetch(request);
  }
}
export default {
 async fetch(request,env){
  const path=new URL(request.url).pathname;
  if(request.method==='GET'&&['/manual-test','/manual-test.js','/manual-likes.js'].includes(path))return new Response(path==='/manual-test'?manualPage:path==='/manual-test.js'?manualScript:likesScript,{headers:{'Content-Type':path==='/manual-test'?'text/html; charset=utf-8':'application/javascript; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'"}});
  if(new URL(request.url).pathname.startsWith('/v2/'))return readyRoutes(request,env);
  // Fail closed from the first deployment, before a secret has been provisioned.
  if(!env.STAGING_TOKEN)return reply({error:'Staging locked'},503);
  const supplied=request.headers.get('Authorization')||'';
  const expected='Bearer '+env.STAGING_TOKEN;
  const enc=new TextEncoder();
  const [a,b]=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(supplied)),crypto.subtle.digest('SHA-256',enc.encode(expected))]);
  if(!crypto.subtle.timingSafeEqual(a,b))return reply({error:'Unauthorized'},401);
  if(request.headers.has('Origin')&&request.headers.get('Origin')!=='http://127.0.0.1:8787')return reply({error:'Origin not allowed'},403);
  const u=new URL(request.url),target=u.searchParams.get('target')||'primary';
  if(!['primary','restore-test','boundary-test'].includes(target))return reply({error:'Unknown test target'},400);
  if(!['/stats','/visit','/backup','/restore'].includes(u.pathname))return reply({error:'Not found'},404);
  if(u.pathname==='/restore'&&target==='primary')return reply({error:'Cannot restore over primary'},403);
  if(!['GET','POST'].includes(request.method))return reply({error:'Method not allowed'},405);
  if(request.method==='POST'){
    const max=u.pathname==='/restore'?262144:512;
    const reader=request.body?.getReader();let size=0;const chunks=[];
    if(reader)for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();return reply({error:'Body too large'},413);}chunks.push(value);}
    const body=new Uint8Array(size);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength;}
    request=new Request(request,{body});
  }
  try{
    const object=env.STAGING_COUNTER.get(env.STAGING_COUNTER.idFromName('synthetic-only-'+target));
    return await object.fetch(request);
  }catch{return reply({error:'Staging storage unavailable'},503);}
 }
};
