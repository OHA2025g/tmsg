import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
const require=createRequire(import.meta.url);const ts=require('typescript');const React=require('react');const {renderToString}=require('react-dom/server');
const root=process.cwd();const cache=new Map();const db=new DatabaseSync(':memory:');
for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+file,'utf8'));
const env = {
 DB: {
  prepare(sql) {
   const stmt = db.prepare(sql);
   return {
    bind(...args) {
     return {
      async first() { return stmt.get(...args); },
      async run() { return stmt.run(...args); }
     };
    }
   };
  }
 }
};
function load(file){file=path.resolve(file);if(!path.extname(file))file=fs.existsSync(file+'.tsx')?file+'.tsx':file+'.ts';if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);const raw=fs.readFileSync(file,'utf8');const code=ts.transpileModule(raw,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;function localRequire(spec){if(spec==='cloudflare:workers')return {env};if(spec.startsWith('@/'))return load(path.join(root,spec.slice(2)));if(spec.startsWith('.'))return load(path.join(path.dirname(file),spec));return require(spec)}new Function('require','module','exports',code)(localRequire,module,module.exports);return module.exports;}
const data=load('content/site.ts');const Website=load('components/Website.tsx').default;const paths=data.allPaths();assert.equal(paths.length,42);assert.equal(new Set(paths).size,paths.length);
const rendered=new Map();let links=0,images=0;for(const route of paths){const html=renderToString(React.createElement(Website,{path:route}));rendered.set(route,html);assert.equal([...html.matchAll(/<h1[ >]/g)].length,1,route+' must have exactly one h1');assert.match(html,/<h1[ >]/,route+' must have h1');assert.match(html,/id="main"/,route+' main landmark');assert.doesNotMatch(html,/Starter Project|codex-preview|lorem ipsum/i);for(const [,href] of html.matchAll(/href="(\/[^"?]*)"/g)){const p=href.split('#')[0];if(p&& !p.startsWith('/images/'))assert.ok(paths.includes(p),route+' links to missing route '+p);links++}for(const [,src] of html.matchAll(/src="(\/(?:images|films)\/[^"]+)"/g)){assert.ok(fs.existsSync('public'+src),src+' exists');images++}}
let fragmentLinks=0;
for(const [route,html] of rendered){
 for(const [,href] of html.matchAll(/href="([^"]+)"/g)){
  if(!href.includes('#')||(!href.startsWith('/')&&!href.startsWith('#')))continue;
  const [pathname,fragment]=href.split('#');if(!fragment)continue;
  const target=rendered.get(pathname||route);
  assert.ok(target&&(target.includes('id="'+fragment+'"')||target.includes('name="'+fragment+'"')),route+' links to missing fragment '+href);
  fragmentLinks++;
 }
}
console.log('PASS: '+fragmentLinks+' internal fragment links resolve to rendered targets.');
const navigation=load('components/CorporateNavigation.tsx');assert.ok(navigation.findPages('Zustmed').some(r=>r.path==='/zustmed'));assert.ok(navigation.findPages('careers').some(r=>r.path==='/careers'));assert.ok(navigation.findPages('partnerships').some(r=>r.path==='/partner'));assert.equal(navigation.findPages('zzqxx-no-result').length,0);assert.ok(navigation.findPages('news').some(r=>r.path==='/news'));console.log('PASS: website search returns matching pages and handles empty results.');
console.log('PASS: '+paths.length+' rendered routes, '+links+' internal links, '+images+' image references.');
const {POST}=load('app/api/enquiries/route.ts');
const good={fullName:'Test Partner',organisation:'QA organisation',designation:'Founder',email:'qa@example.com',phone:'+910000000000',country:'India',interest:'Strategic partnership',message:'This is a test partnership enquiry for validation.',business:'TMSG',kind:'partnership',source:'/partner',consent:true,website:''};
function request(payload,headers={}){return new Request('https://tmsg.example/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://tmsg.example',...headers},body:JSON.stringify(payload)})}
let r=await POST(request(good));assert.equal(r.status,201);const receipt=await r.json();assert.equal(receipt.reference.length,8);const record=db.prepare('SELECT * FROM enquiries').get();assert.equal(record.email,good.email);assert.equal(record.consent,1);assert.equal(record.business,'TMSG');assert.equal(db.prepare('SELECT count(*) AS n FROM enquiries').get().n,1);
for(const payload of [{...good,email:'invalid'},{...good,consent:false},{...good,message:'short'},{...good,business:'UNKNOWN'},{...good,website:'spam'}]){r=await POST(request(payload));assert.equal(r.status,400)}
r=await POST(request(good,{Origin:'https://other.example'}));assert.equal(r.status,403);
r=await POST(new Request('https://tmsg.example/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:'{bad'}));assert.equal(r.status,400);
r=await POST(request({...good,message:'x'.repeat(16000)}));assert.equal(r.status,413);
for(let i=1;i<8;i++){r=await POST(request(good));assert.equal(r.status,201)}r=await POST(request(good));assert.equal(r.status,429);assert.equal(db.prepare('SELECT count(*) AS n FROM enquiries').get().n,8);
console.log('PASS: enquiry persistence, receipt, validation, consent, origin check, malformed JSON, payload limit, honeypot and rate limit.');
cache.clear();env.DB=undefined;const unavailable=load('app/api/enquiries/route.ts');r=await unavailable.POST(request(good));assert.equal(r.status,503);console.log('PASS: unavailable database returns a clear failure, not a false success.');db.close();
