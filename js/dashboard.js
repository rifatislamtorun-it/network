function countUp(){document.querySelectorAll('[data-n]').forEach(e=>{const t=+e.dataset.n,s=performance.now();(function f(n){const p=Math.min(1,(n-s)/900);e.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s)})}
function donut(parts,total){let a=0;const seg=parts.filter(p=>p[1]).map(p=>{const s=a;a+=p[1]/total*100;return`${p[2]} ${s}% ${a}%`});
 return`<div class="dn2"><div class="donut" data-t="${total}" style="--c:${seg.join(',')||'#e5e9f2 0% 100%'}"></div><div class="leg">${parts.map(p=>`<div><i style="--c:${p[2]}"></i>${p[0]} <b>${p[1]}</b></div>`).join('')}</div></div>`}
function bars(o){const m=Math.max(1,...Object.values(o));return Object.entries(o).map(([k,v])=>`<div class="br"><span>${esc(k)}</span><div><i style="width:${v/m*100}%"></i></div><b>${v}</b></div>`).join('')||'<p class="mu">কিছু নেই</p>'}
function rDash(is){
 const L1=D.links,P=L1.filter(l=>l.role=='Primary').length,dn=L1.filter(l=>stOf(l)=='Down'),pl=L1.filter(l=>stOf(l)=='Planned'),ac=L1.length-dn.length-pl.length;
 const G=(a,b)=>`linear-gradient(135deg,${a},${b})`;
 const S=[['Total Nodes',D.nodes.length,'node',G('#818cf8','#4f46e5'),'nodes'],['Total Links',L1.length,'link',G('#60a5fa','#2563eb'),'links'],['Primary',P,'link',G('#38bdf8','#0284c7'),'links'],
 ['Secondary',L1.length-P,'link',G('#fb923c','#ea580c'),'links'],['NTTN Links',L1.filter(l=>l.medium=='NTTN').length,'globe',G('#a78bfa','#7c3aed'),'links'],
 ['Links Down',dn.length,'alert',G('#fb7185','#e11d48'),'links'],['Issues',is.length,'alert',G('#fbbf24','#d97706'),'issues']];
 const lr=l=>`<div class="row" onclick="go('links');select('link','${l.id}')"><div><b>${esc(nm(l.from))} → ${esc(nm(l.to))}</b><div class="mu">${esc(l.linkId)} · ${esc(l.medium)} · VLAN ${esc(l.vlan)}</div></div><span style="margin-left:auto">${stTag(stOf(l))}</span></div>`;
 const ir=i=>`<div class="row" onclick="go('${i.k}s');select('${i.k}','${i.id}')"><div><b>${esc(i.t)}</b><div class="mu">${esc(i.m)}</div></div></div>`;
 const att=[...dn.map(lr),...is.filter(i=>i.t!='Link down').map(ir)].slice(0,6).join('');
 $('v-dash').innerHTML=`<section class="hero"><div><h2>Network Overview</h2><p>${D.nodes.length} devices · ${L1.length} links · ${is.length?is.length+'টা issue পাওয়া গেছে':'সব ঠিক আছে ✓'}</p></div>
 <div class="acts"><button class="w" onclick="openForm('link')">${ic('plus')}Add Link</button><button onclick="openForm('node')">${ic('plus')}Add Node</button><button onclick="go('map')">${ic('map')}Open Map</button></div></section>
 <div class="cards">${S.map((s,i)=>`<div class="card c" style="--d:${i*70}ms" onclick="go('${s[4]}')"><div class="ico" style="--k:${s[3]}">${ic(s[2],22)}</div><div><div class="v" data-n="${s[1]}">0</div><div class="l">${s[0]}</div></div></div>`).join('')}</div>
 <div class="grid">
 <div class="card" style="--d:100ms"><h3>Primary vs Secondary</h3>${donut([['Primary',P,'#2563eb'],['Secondary',L1.length-P,'#f97316']],L1.length)}</div>
 <div class="card" style="--d:200ms"><h3>Link status</h3>${donut([['Active',ac,'#16a34a'],['Planned',pl.length,'#94a3b8'],['Down',dn.length,'#e11d48']],L1.length)}</div>
 <div class="card" style="--d:300ms"><h3>Links by medium</h3>${bars(cnt(L1,l=>l.medium))}</div>
 <div class="card" style="--d:400ms"><h3>Nodes by type</h3>${bars(cnt(D.nodes,n=>n.type))}</div>
 <div class="card" style="--d:500ms"><h3>Links by VLAN</h3>${bars(cnt(L1,l=>l.vlan?'VLAN '+l.vlan:''))}</div>
 <div class="card" style="--d:600ms"><h3>Needs attention</h3>${att||`<div class="empty">${ic('check',30)}<p>সব ঠিক আছে</p></div>`}</div></div>`;
 countUp()}
