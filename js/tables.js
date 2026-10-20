const empty=t=>`<div class="empty">${ic('search',34)}<p>${t}</p></div>`;
const dly=i=>fresh?`style="--d:${Math.min(i,14)*28}ms"`:'';
const typeTag=t=>{const c=NC[t]||'#64748b';return`<span class="tag" style="background:${c}1f;color:${c}">${esc(t)}</span>`};
const table=(h,rows)=>`<div class="tw"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>${rows?'':empty('কিছু পাওয়া যায়নি')}</div>`;
function rLinks(){const ls=D.links.filter(l=>matches(l,'link'));
 $('v-links').innerHTML=table(['Link ID','From','To','Role','Status','Medium','Provider','VLAN','BW','Area','TJ Box'],ls.map((l,i)=>`<tr ${dly(i)} class="${sel&&sel.id==l.id?'on':''}" onclick="select('link','${l.id}')"><td><b>${esc(l.linkId)}</b></td>
 <td>${esc(nm(l.from))} <span class="mu">${esc(l.fromPort)}</span></td><td>${esc(nm(l.to))} <span class="mu">${esc(l.toPort)}</span></td><td>${roleTag(l.role)}</td><td>${stTag(stOf(l))}</td>
 <td>${esc(l.medium)}</td><td>${esc(l.provider)}</td><td>${esc(l.vlan)}</td><td>${esc(l.bw)}</td><td>${esc(l.area)}</td><td>${esc(l.tj)}</td></tr>`).join(''))}
function rNodes(){const ns=D.nodes.filter(n=>matches(n,'node'));
 $('v-nodes').innerHTML=table(['Name','Type','Area','Mgmt IP','Links','Location'],ns.map((n,i)=>`<tr ${dly(i)} class="${sel&&sel.id==n.id?'on':''}" onclick="select('node','${n.id}')"><td><b>${esc(n.name)}</b></td>
 <td>${typeTag(n.type)}</td><td>${esc(n.area)}</td><td>${esc(n.ip)}</td><td>${D.links.filter(l=>l.from==n.id||l.to==n.id).length}</td><td>${ok(n)?'<span class="tag ok">Set</span>':'<span class="tag dn">Missing</span>'}</td></tr>`).join(''))}
function rIssues(is){const hot=t=>t=='Link down'||t=='Port conflict'?'linear-gradient(135deg,#fb7185,#e11d48)':'linear-gradient(135deg,#fbbf24,#d97706)';
 $('v-issues').innerHTML=is.length?`<div class="cards" style="grid-template-columns:1fr">${is.map((i,k)=>`<div class="card c" ${dly(k)} onclick="select('${i.k}','${i.id}')"><div class="ico" style="--k:${hot(i.t)}">${ic('alert',20)}</div><div><b>${esc(i.t)}</b><div class="l">${esc(i.m)}</div></div></div>`).join('')}</div>`
 :`<div class="card empty">${ic('check',40)}<p>কোনো সমস্যা নেই — সব ঠিক আছে</p></div>`}
