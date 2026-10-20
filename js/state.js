let fresh=false;
const KEY='netmap-data-v1',uid=()=>Math.random().toString(36).slice(2,9),$=id=>document.getElementById(id);
const NT=['OLT','Switch','Router','TJ Box','Splitter','POP','Other'];
const NC={OLT:'#2563eb',Switch:'#16a34a',Router:'#9333ea','TJ Box':'#ca8a04',Splitter:'#0891b2',POP:'#dc2626',Other:'#64748b'};
const MEDIUM=['Own Fiber','NTTN','Overhead','Underground','Radio','Other'],STAT=['Active','Planned','Down'];
const NF=[['name','Name'],['type','Type','select',NT],['area','Area / Location'],['ip','Mgmt IP'],['lat','Latitude'],['lng','Longitude'],['note','Note','textarea']];
const nodeOpts=()=>D.nodes.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(n=>[n.id,n.name]);
const LF=()=>[['from','From node','select',nodeOpts()],['fromPort','From port (Gi0/1, PON 1/1)'],['to','To node','select',nodeOpts()],['toPort','To port'],
['role','Role','select',['Primary','Secondary']],['status','Status','select',STAT],['medium','Medium','select',MEDIUM],['provider','NTTN / Provider'],
['linkId','Link ID'],['vlan','VLAN'],['bw','Bandwidth'],['core','Fiber core / color'],['area','Fiber area'],['tj','TJ Box'],['note','Note','textarea']];
const TITLES={dash:'Dashboard',map:'Map',links:'Links',nodes:'Nodes / Devices',issues:'Issues'};
let D={nodes:[],links:[]},view='dash',sel=null,pick=null,draft=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nm=id=>(D.nodes.find(n=>n.id==id)||{}).name||'?',node=id=>D.nodes.find(n=>n.id==id);
const stOf=l=>l.status||'Active',ok=n=>n&&!isNaN(n.lat)&&!isNaN(n.lng);
const km=(a,b)=>{const r=Math.PI/180,x=Math.sin((b.lat-a.lat)*r/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin((b.lng-a.lng)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))};
const cnt=(a,f)=>a.reduce((o,x)=>{const k=f(x)||'—';o[k]=(o[k]||0)+1;return o},{});
const stTag=s=>`<span class="tag ${s=='Down'?'dn':s=='Planned'?'pl':'ok'}">${s}</span>`,roleTag=r=>`<span class="tag ${r=='Primary'?'pr':'se'}">${esc(r)}</span>`;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}$('dirty').style.display='block'}
function toast(t,lbl,fn){const e=$('toast');e.innerHTML=`<span>${esc(t)}</span>`;if(lbl){const b=document.createElement('button');b.textContent=lbl;b.onclick=()=>{fn();e.style.display='none'};e.append(b)}
 e.style.display='flex';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',lbl?7000:3500)}

