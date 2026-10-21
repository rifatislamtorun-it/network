document.querySelectorAll('[data-i]').forEach(e=>e.insertAdjacentHTML('afterbegin',ic(e.dataset.i,e.classList.contains('logo')?20:18)));
(async()=>{
 if(ghOn()){try{const d=await ghPull();if(d&&d.nodes){D=d;try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}}setSync('saved')}catch(e){setSync('error',e.message)}}else setSync('off');
 try{const s=localStorage.getItem(KEY);if(s)D=JSON.parse(s)}catch(e){}
 if(!D.nodes.length){try{const r=await fetch('data.json?t='+Date.now());if(r.ok)D=await r.json()}catch(e){}}
 if(!D.nodes.length)D={nodes:[
  {id:'n1',name:'Core OLT-1',type:'OLT',area:'Mirpur POP',ip:'10.0.0.1',lat:23.8069,lng:90.3687,note:'sample'},
  {id:'n2',name:'SW-Uttara',type:'Switch',area:'Uttara',ip:'10.0.0.2',lat:23.8759,lng:90.3795,note:'sample'},
  {id:'n3',name:'TJ-Banani-01',type:'TJ Box',area:'Banani',lat:23.7937,lng:90.4066,note:'sample'}],
  links:[{id:'l1',from:'n1',fromPort:'Gi0/1',to:'n2',toPort:'Gi0/24',role:'Primary',status:'Active',medium:'NTTN',provider:'Summit',linkId:'LNK-1001',vlan:'100',bw:'1G',core:'12 (Blue)',area:'Mirpur-Uttara',tj:'',note:'sample'},
  {id:'l2',from:'n1',fromPort:'Gi0/2',to:'n2',toPort:'Gi0/23',role:'Secondary',status:'Active',medium:'Overhead',provider:'',linkId:'LNK-1002',vlan:'100',bw:'1G',core:'',area:'Mirpur-Uttara',tj:'',note:'sample'},
  {id:'l3',from:'n1',fromPort:'Gi0/3',to:'n3',toPort:'Gi0/1',role:'Primary',status:'Planned',medium:'Own Fiber',provider:'',linkId:'LNK-1003',vlan:'200',bw:'1G',core:'',area:'Banani',tj:'TJ-Banani-01',note:'sample'}]};
 go('dash')})();
document.addEventListener('keydown',e=>{if(e.key=='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&$('sb').style.display!='none'){e.preventDefault();$('q').focus()}});
