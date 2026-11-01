// Local test adapter, not part of the deployed Worker. Real SQLite, simulated DO lifecycle.
import {DatabaseSync} from 'node:sqlite';
export function storage(filename=':memory:') {
  const db=new DatabaseSync(filename);
  return {db,sql:{exec(query,...args){
    const statement=db.prepare(query);
    if (/^\s*(SELECT|PRAGMA)/i.test(query)) {const rows=statement.all(...args);return {toArray:()=>rows};}
    statement.run(...args);return {toArray:()=>[]};
  }},transactionSync(fn){db.exec('BEGIN');try{const result=fn();db.exec('COMMIT');return result;}catch(error){db.exec('ROLLBACK');throw error;}}};
}
