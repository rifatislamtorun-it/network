function openForm(kind,id,vals){
 if(kind=='link'&&D.nodes.length<2){toast('আগে অন্তত ২টা Node add করো');return}
 $('nav').classList.remove('open');
 const fields=kind=='node'?NF:LF(),o=vals||(id?(kind=='node'?node(id):D.links.find(l=>l.id==id)):{})||{};draft={kind,id};
 $('fm').innerHTML=`<h3>${id?'Edit':'Add'} ${kind}</h3>`+fields.map(f=>{const v=o[f[0]]??(f[0]=='status'?'Active':'');let i;
  if(f[2]=='select')i=`<select name="${f[0]}">${f[3].map(x=>{const a=Array.isArray(x)?x[0]:x,b=Array.isArray(x)?x[1]:x;return`<option value="${esc(a)}" ${a==v?'selected':''}>${esc(b)}</option>`}).join('')}</select>`;
  else if(f[2]=='textarea')i=`<textarea name="${f[0]}" rows="2">${esc(v)}</textarea>`;
  else i=`<input name="${f[0]}" value="${esc(v)}" ${f[0]=='name'?'required':''}>`;
  return`<label class="${f[2]=='textarea'?'w':''}">${esc(f[1])}${i}</label>`}).join('')+
  (kind=='node'?`<button type="button" class="w" onclick="startPick()">📍 Map এ click করে location নাও</button>`:'')+`<button type="button" onclick="closeForm()">Cancel</button><button class="p">Save</button>`;
 $('ov').style.display='flex';
 $('fm').onsubmit=e=>{e.preventDefault();const r=Object.fromEntries(new FormData($('fm')));
  if(kind=='node'){r.lat=parseFloat(r.lat);r.lng=parseFloat(r.lng)}
  else{const bad=[[r.from,r.fromPort],[r.to,r.toPort]].filter(([n,p])=>p&&D.links.some(l=>l.id!=id&&[[l.from,l.fromPort],[l.to,l.toPort]].some(([n2,p2])=>n2==n&&(p2||'').trim().toLowerCase()==p.trim().toLowerCase())));
   if(bad.length&&!confirm(`Port আগে থেকেই ব্যবহার হচ্ছে: ${bad.map(b=>nm(b[0])+' '+b[1]).join(', ')}\nতবুও save করবে?`))return}
  const arr=kind=='node'?D.nodes:D.links;let nid=id;
  if(id)Object.assign(arr.find(x=>x.id==id),r);else{nid=uid();arr.push({id:nid,...r})}
  persist();closeForm();render();select(kind,nid)}}
function closeForm(){$('ov').style.display='none';draft=null}
function startPick(){pick={...draft,vals:Object.fromEntries(new FormData($('fm')))};$('ov').style.display='none';go('map');toast('Map এ যেখানে node, সেখানে click করো')}
map.on('click',e=>{if(!pick)return;const p=pick;pick=null;p.vals.lat=e.latlng.lat.toFixed(6);p.vals.lng=e.latlng.lng.toFixed(6);openForm(p.kind,p.id,p.vals)});
document.addEventListener('keydown',e=>{if(e.key=='Escape'){closeForm();pick=null}});

function dl(name,type,txt){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click()}
function exportData(){dl('data.json','application/json',JSON.stringify(D,null,2));$('dirty').style.display='none';toast('data.json নামল — repo তে commit করো')}
function exportCSV(){const h=['Link ID','From','From port','To','To port','Role','Status','Medium','Provider','VLAN','Bandwidth','Fiber core','Fiber area','TJ Box','Distance km','Note'];
 const rows=D.links.map(l=>{const a=node(l.from),b=node(l.to);return[l.linkId,nm(l.from),l.fromPort,nm(l.to),l.toPort,l.role,stOf(l),l.medium,l.provider,l.vlan,l.bw,l.core,l.area,l.tj,ok(a)&&ok(b)?km(a,b).toFixed(2):'',l.note]});
 dl('links.csv','text/csv','\ufeff'+[h,...rows].map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n'))}
$('f').onchange=e=>{const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.nodes||!x.links)throw 0;D=x;persist();go.fit=0;render();toast('Import done')}catch(z){toast('Invalid JSON')}};r.readAsText(e.target.files[0]);e.target.value=''};
async function loadFile(){try{const r=await fetch('data.json?'+Date.now());if(!r.ok)throw 0;D=await r.json();persist();$('dirty').style.display='none';go.fit=0;render();toast('data.json লোড হয়েছে')}catch(e){toast('data.json পাওয়া যায়নি')}}
$('q').oninput=render;
NT.forEach(t=>$('ft').add(new Option(t,t)));MEDIUM.forEach(t=>$('fmd').add(new Option(t,t)));

