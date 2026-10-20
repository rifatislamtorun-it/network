function issues(){const r=[],use={};
 D.links.forEach(l=>[[l.from,l.fromPort],[l.to,l.toPort]].forEach(([n,p])=>{if(!p)return;(use[n+'|'+p.trim().toLowerCase()]??=[]).push(l)}));
 for(const k in use)if(use[k].length>1){const i=k.indexOf('|');r.push({t:'Port conflict',m:`${nm(k.slice(0,i))} port "${k.slice(i+1)}" ${use[k].length}টা link এ ব্যবহার হয়েছে`,k:'link',id:use[k][0].id})}
 D.links.filter(l=>stOf(l)=='Down').forEach(l=>r.push({t:'Link down',m:`${nm(l.from)} → ${nm(l.to)} (${l.linkId||'-'})`,k:'link',id:l.id}));
 D.nodes.forEach(n=>{const ls=D.links.filter(l=>l.from==n.id||l.to==n.id);
  if(!ok(n))r.push({t:'No location',m:`${n.name}: lat/lng নেই`,k:'node',id:n.id});
  if(!ls.length)r.push({t:'Isolated',m:`${n.name}: কোনো link নেই`,k:'node',id:n.id});
  else if(!ls.some(l=>l.role=='Secondary'))r.push({t:'No backup',m:`${n.name}: Secondary link নেই`,k:'node',id:n.id})});
 return r}
function matches(o,k){
 if(k=='link'){if(($('fr').value&&o.role!=$('fr').value)||($('fmd').value&&o.medium!=$('fmd').value)||($('fs').value&&stOf(o)!=$('fs').value))return false}
 else if($('ft').value&&o.type!=$('ft').value)return false;
 const s=$('q').value.trim().toLowerCase();if(!s)return true;
 const t=(JSON.stringify(Object.values(o))+(k=='link'?nm(o.from)+nm(o.to):'')).toLowerCase();return s.split(/\s+/).every(w=>t.includes(w))}

function go(v){fresh=true;setTimeout(()=>fresh=false,800);view=v;sel=null;$('det').style.display='none';$('nav').classList.remove('open');
 $('title').textContent=TITLES[v];$('sb').style.display=['map','links','nodes'].includes(v)?'':'none';
 $('fL').style.display=['map','links'].includes(v)?'':'none';$('ft').style.display=v=='nodes'?'':'none';
 document.querySelectorAll('.view').forEach(e=>e.style.display=e.id=='v-'+v?'block':'none');
 document.querySelectorAll('#nav .n[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v==v));
 if(v=='map'){map.invalidateSize();setTimeout(()=>map.invalidateSize(),520);if(!go.fit){fitAll();go.fit=1}}render()}
function fitAll(){const p=D.nodes.filter(ok).map(n=>[n.lat,n.lng]);if(p.length)map.fitBounds(p,{padding:[50,50],maxZoom:15})}

function render(){
 const is=issues();const ib=$('ib');ib.style.display=is.length?'':'none';ib.textContent=is.length;
 ({dash:()=>rDash(is),map:rMap,links:rLinks,nodes:rNodes,issues:()=>rIssues(is)})[view]()}

function rMap(){layer.clearLayers();
 const nodes=D.nodes.filter(n=>matches(n,'node')),links=D.links.filter(l=>matches(l,'link'));
 const nodesHit=new Set(links.flatMap(l=>[l.from,l.to]));const q=$('q').value.trim();
 const warn=new Set(issues().filter(i=>i.t=='No backup').map(i=>i.id));
 D.links.forEach(l=>{const a=node(l.from),b=node(l.to);if(!ok(a)||!ok(b))return;
  const hit=links.includes(l),pr=l.role=='Primary',s=stOf(l),on=sel&&sel.id==l.id;
  let c=pr?'#2563eb':'#ea580c',dash=pr?null:'8 6';if(s=='Down')c='#dc2626';if(s=='Planned'){c='#94a3b8';dash='2 7'}
  let p=[[a.lat,a.lng],[b.lat,b.lng]];
  if(!pr){const dx=b.lng-a.lng,dy=b.lat-a.lat,n=Math.hypot(dx,dy)||1,ox=dx/n*0.0003,oy=-dy/n*0.0003;p=p.map(([y,x])=>[y+oy,x+ox])}
  L.polyline(p,{color:c,weight:on?7:hit?4:2,opacity:hit?.9:.2,dashArray:dash,lineCap:'round',className:(pr?'':'flow ')+(s=='Down'?'pulse':'')})
   .bindTooltip(`${esc(nm(l.from))} ${esc(l.fromPort)} → ${esc(nm(l.to))} ${esc(l.toPort)}<br>${esc(l.role)} · ${s} · VLAN ${esc(l.vlan)} · ${esc(l.medium)}<br>≈ ${km(a,b).toFixed(2)} km`,{sticky:true})
   .on('click',()=>select('link',l.id)).addTo(layer)});
 D.nodes.forEach(n=>{if(!ok(n))return;const on=sel&&sel.id==n.id,hit=nodes.includes(n)&&(!q&&!$('fr').value&&!$('fmd').value&&!$('fs').value||nodesHit.has(n.id)||matches(n,'node')&&q);
  L.marker([n.lat,n.lng],{opacity:hit?1:.3,icon:L.divIcon({className:'',iconSize:[28,28],html:`<div class="pin ${on?'sel':''} ${warn.has(n.id)?'warn':''}" style="background:${NC[n.type]||'#64748b'};border-color:${warn.has(n.id)?'#f59e0b':'#fff'}">${esc((n.type||'?').slice(0,3))}</div>`})})
   .bindTooltip(esc(n.name),{permanent:true,direction:'bottom',offset:[0,12],className:'nl'}).on('click',()=>select('node',n.id)).addTo(layer)})}

function select(kind,id,fly){
 sel={kind,id};const d=$('det');d.style.display='block';let rows,title,o;
 const lk=(k,i,t)=>`<a onclick="select('${k}','${i}',1)">${esc(t)}</a>`;
 if(kind=='node'){o=node(id);if(!o)return;title=o.name;rows=NF.map(f=>[f[1],esc(o[f[0]])]);
  rows.push(['Links',D.links.filter(l=>l.from==id||l.to==id).map(l=>lk('link',l.id,l.from==id?`${l.fromPort||'?'} → ${nm(l.to)}`:`${l.toPort||'?'} ← ${nm(l.from)}`)+` <span class="mu">${esc(l.role)} · VLAN ${esc(l.vlan)}</span>`).join('<br>')]);
  if(fly&&view=='map'&&ok(o))map.setView([o.lat,o.lng],16)}
 else{o=D.links.find(l=>l.id==id);if(!o)return;title=`${nm(o.from)} → ${nm(o.to)}`;
  rows=LF().map(f=>[f[1],f[0]=='from'||f[0]=='to'?lk('node',o[f[0]],nm(o[f[0]])):esc(o[f[0]]||(f[0]=='status'?'Active':''))]);
  const a=node(o.from),b=node(o.to);
  if(ok(a)&&ok(b)){rows.push(['Distance (straight)',km(a,b).toFixed(2)+' km']);if(fly&&view=='map')map.fitBounds([[a.lat,a.lng],[b.lat,b.lng]],{padding:[90,90]})}
  const alt=D.links.filter(x=>x.id!=o.id&&((x.from==o.from&&x.to==o.to)||(x.from==o.to&&x.to==o.from)));
  if(alt.length)rows.push(['Same pair',alt.map(x=>lk('link',x.id,`${x.role} ${x.fromPort}→${x.toPort}`)).join('<br>')])}
 d.innerHTML=`<button class="x" onclick="closeDet()">×</button><h3 style="margin:0 0 8px">${esc(title)}</h3><table>${rows.filter(r=>r[1]).map(r=>`<tr><td>${esc(r[0])}</td><td>${r[1]}</td></tr>`).join('')}</table>
 <p><button class="p" onclick="showMap('${kind}','${id}')">🗺️ Map এ দেখো</button> <button onclick="openForm('${kind}','${id}')">Edit</button> <button onclick="dup('${kind}','${id}')">Duplicate</button> <button class="d" onclick="del('${kind}','${id}')">Delete</button></p>`;
 render()}
function closeDet(){sel=null;$('det').style.display='none';render()}
function showMap(k,id){go('map');setTimeout(()=>{map.invalidateSize();select(k,id,1)},60)}
function dup(k,id){const o={...(k=='node'?node(id):D.links.find(l=>l.id==id))};delete o.id;if(k=='node')o.name+=' (copy)';else{o.fromPort='';o.toPort=''}openForm(k,null,o)}
function del(k,id){if(!confirm('Delete করবে?'))return;const snap=JSON.stringify(D);
 if(k=='node'){D.nodes=D.nodes.filter(n=>n.id!=id);D.links=D.links.filter(l=>l.from!=id&&l.to!=id)}else D.links=D.links.filter(l=>l.id!=id);
 sel=null;$('det').style.display='none';persist();render();toast('Deleted','Undo',()=>{D=JSON.parse(snap);persist();render()})}

