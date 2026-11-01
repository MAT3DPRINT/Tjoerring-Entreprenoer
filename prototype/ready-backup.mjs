// Staging-only operator tool. Never logs credentials, browser hashes or rows.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const [mode,file,target='public-v2']=process.argv.slice(2);
if(!['export','restore'].includes(mode)||!file||!['public-v2','restore-v2'].includes(target))throw new Error('Usage: node ready-backup.mjs export|restore FILE public-v2|restore-v2');
if(mode==='restore'&&target!=='restore-v2')throw new Error('Restore is restricted to the isolated test target');
const token=fs.readFileSync(new URL('.dev.vars.staging',import.meta.url),'utf8').match(/^STAGING_TOKEN\s*=\s*"?([^"\r\n]+)"?/m)?.[1];
if(!token)throw new Error('Missing local credential');
const checksum=data=>createHash('sha256').update(JSON.stringify(data)).digest('hex');
async function request(path,body,query=''){
 const r=await fetch('https://tjoerring-counter-staging.mateusz-szulczik.workers.dev/v2/admin/'+path+'?target='+target+query,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 if(!r.ok)throw new Error(`Operation ${path} stopped: HTTP ${r.status}. Do not reset the target or blindly repeat writes.`);
 return r.json();
}
if(mode==='export'){
 if(fs.existsSync(file))throw new Error('Refusing to overwrite an existing backup');
 const manifest=await request('manifest'),data={manifest,events:[],browsers:[]};let bytes=0;
 for(const table of ['events','browsers']){
  let after='';for(;;){const {rows}=await request('export',undefined,'&table='+table+'&revision='+manifest.meta.total+'&after='+after);if(!rows.length)break;
   bytes+=JSON.stringify(rows).length;if(bytes>100000000)throw new Error('Backup exceeds this tool memory limit; use a streaming exporter');
   data[table].push(...rows);after=rows.at(-1).id;
  }
  if(data[table].length!==manifest[table])throw new Error('Row count mismatch');
 }
 if(JSON.stringify(await request('manifest'))!==JSON.stringify(manifest))throw new Error('Data changed during export; rerun export to a new file');
 fs.writeFileSync(file,JSON.stringify({sha256:checksum(data),data}),{flag:'wx',mode:0o600});
 console.log('Backup saved with SHA-256 checksum. Store it encrypted outside Git.');
}else{
 const backup=JSON.parse(fs.readFileSync(file,'utf8'));
 if(checksum(backup.data)!==backup.sha256)throw new Error('Backup checksum mismatch');
 const {manifest,...tables}=backup.data;
 for(const table of ['events','browsers'])if(!Array.isArray(tables[table])||tables[table].length!==manifest[table])throw new Error('Invalid backup row count');
 await request('import/start',manifest);
 for(const table of ['events','browsers'])for(let i=0;i<tables[table].length;i+=100)await request('import/page',{table,rows:tables[table].slice(i,i+100)});
 await request('import/finish',{});
 if(JSON.stringify(await request('manifest'))!==JSON.stringify(manifest))throw new Error('Restored manifest differs');
 console.log('Restore complete. Re-export and compare checksum before any cutover.');
}
