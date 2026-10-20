const map=L.map('map').setView([23.78,90.40],12);
const carto=L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:20,attribution:'© OpenStreetMap © CARTO'});
const osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap',referrerPolicy:'origin'});
const esri=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'© Esri'});
const esriLab=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:19});
const sat=L.layerGroup([esri,esriLab]);
carto.addTo(map);
L.control.layers({'Street (Carto)':carto,'Street (OSM)':osm,'Satellite + Labels':sat}).addTo(map);
// tile load fail korle auto fallback
let ce=0,oe=0;
carto.on('tileload',()=>ce=-1e6);osm.on('tileload',()=>oe=-1e6);
carto.on('tileerror',()=>{if(++ce==6&&map.hasLayer(carto)){map.removeLayer(carto);osm.addTo(map);toast('Carto load hoyni — OSM e switch kora holo')}});
osm.on('tileerror',()=>{if(++oe==6&&map.hasLayer(osm)){map.removeLayer(osm);sat.addTo(map);toast('Street map load hoyni — Satellite e switch kora holo')}});
new ResizeObserver(()=>map.invalidateSize()).observe(document.getElementById('map'));
const zl=()=>document.getElementById('map').classList.toggle('zlow',map.getZoom()<12);map.on('zoomend',zl);zl();
const lg=L.control({position:'bottomleft'});lg.onAdd=()=>{const d=L.DomUtil.create('div','lg');
 d.innerHTML='<i style="border-color:#2563eb"></i>Primary<br><i style="border-color:#ea580c;border-top-style:dashed"></i>Secondary<br><i style="border-color:#dc2626"></i>Down<br><i style="border-color:#94a3b8;border-top-style:dotted"></i>Planned<br>🟠 ring = no backup';return d};lg.addTo(map);
const layer=L.layerGroup().addTo(map);
