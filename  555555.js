const PAGE=String.raw`<!DOCTYPE html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PixelForge - AI Image & Video</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:#0b0b14;color:#eee}
.w{max-width:520px;margin:auto;padding:18px}h1{font-size:30px;margin:10px 0}.g{background:linear-gradient(90deg,#7c5cff,#ff5c9d);-webkit-background-clip:text;color:transparent}
.c{background:#161626;border:1px solid #2a2a44;border-radius:16px;padding:16px;margin:14px 0}
input,textarea{width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #333;background:#0f0f1c;color:#fff;font-size:16px}
button,.b{display:block;width:100%;padding:13px;border:0;border-radius:10px;background:linear-gradient(90deg,#7c5cff,#ff5c9d);color:#fff;font-size:16px;font-weight:600;margin-top:8px;text-align:center;text-decoration:none}
.s{background:#2a2a44}.p{font-size:34px;font-weight:700}.m{color:#aaa;font-size:14px}.e{color:#ff6b6b}img,video{width:100%;border-radius:12px;margin-top:10px}
.t{display:flex;gap:8px}.t button{margin:0}#q{display:flex;justify-content:center;margin:12px 0;background:#fff;padding:10px;border-radius:10px}.h{display:none}</style></head><body><div class="w">
<div id="A"><h1>🎨 <span class="g">PixelForge</span></h1><p class="m">Text se AI Image aur Video banayein.</p>
<div class="c"><div class="p">₹99<span class="m">/month</span></div><p class="m">✔ 3 din ka free trial (5 images)<br>✔ 100 credits/month<br>✔ AI Images + Videos<br>✔ UPI se payment</p></div>
<div class="c"><input id="em" type="email" placeholder="Email"><input id="pw" type="password" placeholder="Password (6+ akshar)">
<button onclick="au('signup')">Free Trial Shuru Karein</button><button class="s" onclick="au('login')">Login</button><p id="ae" class="e"></p></div></div>
<div id="D" class="h"><h1>🎨 <span class="g">PixelForge</span></h1><div class="c"><div id="st" class="m"></div></div>
<div class="c"><div class="t"><button id="ti" onclick="tb('image')">Image</button><button id="tv" class="s" onclick="tb('video')">Video</button></div>
<textarea id="pr" rows="3" placeholder="Kya banana hai? Jaise: sunset par ek sher"></textarea><button onclick="go()">Generate</button><p id="msg" class="m"></p><div id="res"></div></div>
<div class="c"><b>₹99 Plan Lein</b><p class="m">Neeche pay karein, phir UTR number daalein.</p>
<a id="up" class="b" href="#">UPI App Se Pay Karein ₹99</a><div id="q"></div><p class="m" style="text-align:center">UPI: 9839690620@axl</p>
<input id="utr" placeholder="12 ank ka UTR / Ref No."><button class="s" onclick="pay()">Payment Jama Karein</button><p id="pm" class="m"></p></div>
<button class="s" onclick="localStorage.clear();location.reload()">Logout</button></div></div>
<script>
const UPI='upi://pay?pa=9839690620@axl&pn=PixelForge&am=99&cu=INR&tn=PixelForge%20Plan';
let T=localStorage.pf||'',mode='image';const $=i=>document.getElementById(i);
async function api(u,b){const r=await fetch(u,{method:b?'POST':'GET',headers:{'Content-Type':'application/json','x-token':T},body:b?JSON.stringify(b):undefined});const j=await r.json();if(!r.ok)throw j.error||'Error';return j}
async function au(k){try{const j=await api('/api/'+k,{email:$('em').value,password:$('pw').value});T=j.token;localStorage.pf=T;init()}catch(e){$('ae').textContent=e}}
function show(s){$('st').innerHTML=(s.paid?'✅ Paid plan • '+new Date(s.paidUntil).toLocaleDateString():s.trial?'🎁 Trial • '+new Date(s.trialEnd).toLocaleDateString()+' tak':'⛔ Trial khatam')+'<br>Credits: <b>'+s.credits+'</b>'}
async function init(){if(!T)return;try{show(await api('/api/me'));$('A').className='h';$('D').className='';$('up').href=UPI;if(!$('q').firstChild)new QRCode($('q'),{text:UPI,width:170,height:170})}catch{localStorage.clear();T=''}}
function tb(m){mode=m;$('ti').className=m=='image'?'':'s';$('tv').className=m=='video'?'':'s'}
async function go(){const p=$('pr').value;$('msg').textContent='Ban raha hai...';$('res').innerHTML='';
try{if(mode=='image'){const j=await api('/api/image',{prompt:p});$('res').innerHTML='<img src="'+j.image+'"><a class="b s" download="pixelforge.png" href="'+j.image+'">Download</a>';$('msg').textContent='';}
else{const j=await api('/api/video',{prompt:p});$('msg').textContent='Video mein 1-3 minute lagte hain, ruke rahein...';
while(1){await new Promise(r=>setTimeout(r,8000));const s=await api('/api/video/status?op='+encodeURIComponent(j.op));if(s.done){if(s.error)throw s.error;$('res').innerHTML='<video controls src="'+s.url+'"></video>';$('msg').textContent='';break}}}
init()}catch(e){$('msg').innerHTML='<span class="e">'+e+'</span>'}}
async function pay(){try{await api('/api/pay',{utr:$('utr').value});$('pm').textContent='✅ Jama ho gaya. Verify hone par plan chalu ho jayega.'}catch(e){$('pm').innerHTML='<span class="e">'+e+'</span>'}}
init();</script></body></html>
`;
const http=require('http'),crypto=require('crypto'),fs=require('fs'),path=require('path'),{Readable}=require('stream');
const K=process.env.GEMINI_API_KEY,ADMIN=process.env.ADMIN_KEY||'',F=process.env.DATA_FILE||'data.json';
const IMGM=process.env.IMAGE_MODEL||'gemini-2.5-flash-image',VEOM=process.env.VIDEO_MODEL||'veo-3.0-fast-generate-001';
const G='https://generativelanguage.googleapis.com/v1beta',DAY=864e5,IMG=1,VID=+(process.env.VIDEO_COST||50),PLAN=100;
let db={users:{},pay:[]};try{db=JSON.parse(fs.readFileSync(F))}catch{}
const save=()=>{try{fs.writeFileSync(F,JSON.stringify(db))}catch{}};
const hash=(p,s)=>crypto.scryptSync(p,s,32).toString('hex');
const st=u=>{const n=Date.now(),p=u.paidUntil>n;return{email:u.email,credits:u.credits,paid:p,paidUntil:u.paidUntil,trial:!p&&u.trialEnd>n,trialEnd:u.trialEnd}};
const out=u=>({token:u.token,...st(u)});
const gcall=(url,opt={})=>fetch(url,{...opt,headers:{'x-goog-api-key':K||'','Content-Type':'application/json'}});
const can=(u,c,vid)=>{const s=st(u);if(!s.paid&&!s.trial)return'Trial khatam. ₹99 ka plan lein.';if(vid&&!s.paid)return'Video sirf paid plan mein hai.';if(u.credits<c)return'Credits kam hain.';return null};
const R={};const route=(m,p,f)=>R[m+' '+p]=f;
route('POST','/api/signup',async c=>{const{email,password}=c.body;
 if(!/^\S+@\S+\.\S+$/.test(email||'')||(password||'').length<6)return[400,{error:'Sahi email aur kam se kam 6 akshar ka password daalein'}];
 const e=email.toLowerCase();if(db.users[e])return[400,{error:'Ye email pehle se registered hai'}];
 const salt=crypto.randomBytes(8).toString('hex');
 const u=db.users[e]={email:e,salt,pw:hash(password,salt),token:crypto.randomBytes(24).toString('hex'),trialEnd:Date.now()+3*DAY,paidUntil:0,credits:5};save();return[200,out(u)]});
route('POST','/api/login',async c=>{const{email,password}=c.body;const u=db.users[(email||'').toLowerCase()];
 if(!u||hash(password||'',u.salt)!==u.pw)return[400,{error:'Email ya password galat hai'}];return[200,out(u)]});
route('GET','/api/me',async c=>[200,st(c.u)]);
route('POST','/api/image',async c=>{const p=(c.body.prompt||'').slice(0,800);if(!p)return[400,{error:'Prompt likhein'}];
 const e=can(c.u,IMG);if(e)return[403,{error:e}];
 const j=await(await gcall(`${G}/models/${IMGM}:generateContent`,{method:'POST',body:JSON.stringify({contents:[{parts:[{text:p}]}]})})).json();
 const part=(j.candidates?.[0]?.content?.parts||[]).find(x=>x.inlineData);if(!part)return[500,{error:j.error?.message||'Image nahi bani, prompt badal kar dekhein'}];
 c.u.credits-=IMG;save();return[200,{image:`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,credits:c.u.credits}]});
route('POST','/api/video',async c=>{const p=(c.body.prompt||'').slice(0,800);if(!p)return[400,{error:'Prompt likhein'}];
 const e=can(c.u,VID,true);if(e)return[403,{error:e}];
 const j=await(await gcall(`${G}/models/${VEOM}:predictLongRunning`,{method:'POST',body:JSON.stringify({instances:[{prompt:p}]})})).json();
 if(!j.name)return[500,{error:j.error?.message||'Video start nahi hui'}];
 c.u.credits-=VID;save();return[200,{op:j.name,credits:c.u.credits}]});
route('GET','/api/video/status',async c=>{const j=await(await gcall(`${G}/${c.q.get('op')}`)).json();
 if(!j.done)return[200,{done:false}];
 const v=j.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
 if(!v){c.u.credits+=VID;save();return[200,{done:true,error:'Video nahi bani, credits wapas kar diye'}]}
 return[200,{done:true,url:`/api/video/file?t=${c.u.token}&u=${encodeURIComponent(v)}`}]});
route('POST','/api/pay',async c=>{const utr=(c.body.utr||'').trim();if(!/^\d{12}$/.test(utr))return[400,{error:'12 ank ka UTR/Ref number daalein'}];
 if(db.pay.some(p=>p.utr===utr))return[400,{error:'Ye UTR pehle se jama hai'}];
 db.pay.push({email:c.u.email,utr,time:Date.now(),done:false});save();return[200,{ok:true}]});
route('GET','/api/admin/pending',async c=>{if(!ADMIN||c.q.get('key')!==ADMIN)return[403,{error:'no'}];return[200,db.pay.filter(p=>!p.done)]});
route('GET','/api/admin/approve',async c=>{if(!ADMIN||c.q.get('key')!==ADMIN)return[403,{error:'no'}];
 const p=db.pay.find(x=>x.utr===c.q.get('utr')&&!x.done);if(!p)return[200,{result:'Nahi mila'}];
 const u=db.users[p.email];u.paidUntil=Math.max(Date.now(),u.paidUntil)+30*DAY;u.credits+=PLAN;p.done=true;save();return[200,{result:'Approved: '+p.email}]});
const open=['/api/signup','/api/login','/api/admin/pending','/api/admin/approve'];
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://x'),key=req.method+' '+url.pathname,send=(s,o)=>{res.writeHead(s,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
 if(req.method==='GET'&&!url.pathname.startsWith('/api/')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(PAGE)}
 if(url.pathname==='/api/video/file'){const t=url.searchParams.get('t'),u=url.searchParams.get('u')||'';
  if(!Object.values(db.users).find(x=>x.token===t)||!u.startsWith('https://generativelanguage.googleapis.com/')){res.writeHead(403);return res.end()}
  const f=await gcall(u);res.writeHead(200,{'Content-Type':'video/mp4'});return Readable.fromWeb(f.body).pipe(res)}
 const h=R[key];if(!h)return send(404,{error:'Not found'});
 let raw='';for await(const ch of req)raw+=ch;let body={};try{body=raw?JSON.parse(raw):{}}catch{}
 const c={body,q:url.searchParams};
 if(!open.includes(url.pathname)){const t=req.headers['x-token']||url.searchParams.get('t');c.u=Object.values(db.users).find(x=>x.token===t);if(!c.u)return send(401,{error:'Dobara login karein'})}
 const[s,o]=await h(c);send(s,o)}catch(e){console.error(e);try{res.writeHead(500);res.end(JSON.stringify({error:'Server error'}))}catch{}}
}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('PixelForge chal raha hai'));
