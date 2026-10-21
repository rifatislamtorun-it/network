// GitHub Sync: browser theke shorashori repo-r data.json commit kore (backend lage na)
const GH_KEY='netmap-gh';
let GH=(()=>{try{return JSON.parse(localStorage.getItem(GH_KEY))||{}}catch(e){return{}}})();
if(!GH.owner&&location.hostname.endsWith('github.io')){GH.owner=location.hostname.split('.')[0];GH.repo=location.pathname.split('/')[1]||''}
GH.branch=GH.branch||'main';GH.path=GH.path||'data.json';
let ghSha=null,ghTimer=null;
const ghOn=()=>!!(GH.owner&&GH.repo&&GH.token);
const ghUrl=()=>`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${GH.path}`;
const ghHead=()=>({Accept:'application/vnd.github+json',...(GH.token?{Authorization:'Bearer '+GH.token}:{})});
const b64=s=>btoa(unescape(encodeURIComponent(s))),unb64=s=>decodeURIComponent(escape(atob(s.replace(/\n/g,''))));
function setSync(s,m){const e=document.getElementById('sy');if(!e)return;
 const M={off:['Off','#94a3b8'],pending:['Pending','#f59e0b'],saving:['Saving…','#2563eb'],saved:['Synced ✓','#16a34a'],error:['Error','#e11d48']}[s];
 e.textContent=M[0];e.style.background=M[1];if(s=='error')toast('GitHub save hoyni: '+m)}
async function ghPull(){const r=await fetch(ghUrl()+'?ref='+GH.branch+'&t='+Date.now(),{headers:ghHead()});
 if(r.status==404){ghSha=null;return null}if(!r.ok)throw new Error('HTTP '+r.status);
 const j=await r.json();ghSha=j.sha;return JSON.parse(unb64(j.content))}
function ghQueue(){setSync('pending');clearTimeout(ghTimer);ghTimer=setTimeout(()=>ghPush(),1500)}
async function ghPush(msg){if(!ghOn())return;setSync('saving');
 try{for(let t=0;t<3;t++){
  const r=await fetch(ghUrl(),{method:'PUT',headers:{...ghHead(),'Content-Type':'application/json'},body:JSON.stringify({message:msg||'Update network data',content:b64(JSON.stringify(D,null,2)),branch:GH.branch,...(ghSha?{sha:ghSha}:{})})});
  if(r.ok){ghSha=(await r.json()).content.sha;setSync('saved');return}
  if(r.status==409||r.status==422){const g=await fetch(ghUrl()+'?ref='+GH.branch+'&t='+Date.now(),{headers:ghHead()});if(g.ok)ghSha=(await g.json()).sha;continue}
  throw new Error(r.status==401?'Token ভুল / expire (401)':r.status==403||r.status==404?'Permission নেই (Contents: Read and write দাও) ['+r.status+']':'HTTP '+r.status)}
  throw new Error('Retry failed')}catch(e){setSync('error',e.message)}}
function syncOff(){GH.token='';try{localStorage.removeItem(GH_KEY)}catch(e){}closeForm();setSync('off');toast('GitHub Sync বন্ধ করা হয়েছে')}
function syncDialog(){$('nav').classList.remove('open');
 $('fm').innerHTML=`<h3>GitHub Sync</h3><p class="w mu" style="margin:0;line-height:1.7">Connect korle edit korar <b>1.5 second</b> pore nije theke <b>data.json</b> GitHub e save hobe, shob device e same data.<br>
 1) <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener" style="color:var(--ac)">Fine-grained token toiri koro</a> → Repository access: <b>Only select repositories</b> → <b>${esc(GH.repo||'network')}</b><br>
 2) Permissions → Repository permissions → <b>Contents: Read and write</b><br>3) Token niche paste koro. Token shudhu tomar browser e thake, repo te na.</p>
 <label>Owner<input name="owner" value="${esc(GH.owner)}" required></label><label>Repo<input name="repo" value="${esc(GH.repo)}" required></label>
 <label>Branch<input name="branch" value="${esc(GH.branch)}" required></label><label>Token<input name="token" type="password" value="${esc(GH.token)}" placeholder="github_pat_..." required></label>
 <button type="button" class="d" onclick="syncOff()">Disconnect</button><button class="p">Save &amp; Connect</button>`;
 $('ov').style.display='flex';
 $('fm').onsubmit=async e=>{e.preventDefault();Object.assign(GH,Object.fromEntries(new FormData($('fm'))));GH.token=GH.token.trim();
  try{const d=await ghPull();try{localStorage.setItem(GH_KEY,JSON.stringify(GH))}catch(x){}closeForm();setSync('saved');
   if(d&&d.nodes&&confirm('GitHub এর data.json load করবে?\nOK = GitHub এর data নেবে\nCancel = এই browser এর data GitHub এ push করবে')){D=d;try{localStorage.setItem(KEY,JSON.stringify(D))}catch(x){}go.fit=0;render();toast('GitHub থেকে data load হয়েছে')}
   else{await ghPush('Sync from browser');toast('GitHub এ save হয়েছে')}}
  catch(x){toast('Connect hoyni ('+x.message+') — token, repo name, permission check koro')}}}
