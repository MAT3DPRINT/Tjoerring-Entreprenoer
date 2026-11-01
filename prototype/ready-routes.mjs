import {response,boundedJSON,collect} from './ready-counter.mjs';
export async function readyRoutes(request,env){
 const u=new URL(request.url),p=u.pathname;
 const stagingOrigin=env.ALLOWED_ORIGIN||'https://tjoerring-counter-staging.mateusz-szulczik.workers.dev';
 const origin=request.headers.get('Origin');
 const allowed=(!env.ALLOWED_ORIGIN&&origin==='http://127.0.0.1:8787')||origin===stagingOrigin||(!origin&&request.method==='GET'&&u.origin===stagingOrigin);
 const headers={'Access-Control-Allow-Origin':origin===stagingOrigin?stagingOrigin:(env.ALLOWED_ORIGIN||'http://127.0.0.1:8787'),'Vary':'Origin','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
 const finish=r=>{const out=new Response(r.body,r);for(const [k,v]of Object.entries(headers))out.headers.set(k,v);return out;};
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 try{
  if(p.startsWith('/v2/admin/')){
   if(!env.STAGING_TOKEN)return response({error:'Locked'},503);
   const enc=new TextEncoder();const [a,b]=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(request.headers.get('Authorization')||'')),crypto.subtle.digest('SHA-256',enc.encode('Bearer '+env.STAGING_TOKEN))]);
   if(!crypto.subtle.timingSafeEqual(a,b))return response({error:'Unauthorized'},401);
   const target=u.searchParams.get('target')||'public-v2';
   if(!['public-v2','restore-v2'].includes(target))return response({error:'Invalid target'},400);
   const path=p.slice('/v2/admin'.length);
   if(!['/stats','/manifest','/export','/import/start','/import/page','/import/finish'].includes(path))return response({error:'Not found'},404);
   if(path.startsWith('/import')&&(target!=='restore-v2'||request.method!=='POST'))return response({error:'Import forbidden'},403);
   if(!path.startsWith('/import')&&request.method!=='GET')return response({error:'Method not allowed'},405);
   const stub=env.SECURE_COUNTER.get(env.SECURE_COUNTER.idFromName(target));
   const body=request.method==='POST'?JSON.stringify(await boundedJSON(request,32768)):undefined;
   return stub.fetch(new Request('https://internal'+path+u.search,{method:request.method,body}));
  }
  if(!allowed)return response({error:'Origin not allowed'},403);
  const stub=env.SECURE_COUNTER.get(env.SECURE_COUNTER.idFromName('public-v2'));
  if(p==='/v2/likes'){
   const likes=env.SECURE_COUNTER.get(env.SECURE_COUNTER.idFromName('likes-v1'));
   if(request.method==='GET')return finish(await likes.fetch(new Request('https://internal/likes')));
   if(request.method==='POST'){
    const clone=request.clone();let d;try{d=await boundedJSON(clone);}catch{return finish(response({error:'Invalid request'},400));}
    if(typeof d.like!=='boolean')return finish(response({error:'Invalid like'},400));
    return finish(await collect(request,env,likes));
   }
  }
  if(p==='/v2/stats'&&request.method==='GET')return finish(await stub.fetch(new Request('https://internal/stats')));
  if(p==='/v2/config'&&request.method==='GET')return finish(response({sitekey:env.TURNSTILE_SITEKEY||null}));
  if(p==='/v2/collect'&&request.method==='POST'){const d=await boundedJSON(request.clone());if(d.like!==undefined)return finish(response({error:'Use likes endpoint'},400));return finish(await collect(request,env,stub));}
  return finish(response({error:'Not found'},404));
 }catch{return finish(response({error:'Counter temporarily unavailable'},503));}
}
