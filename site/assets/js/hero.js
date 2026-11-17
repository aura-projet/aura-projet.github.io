/* AURA: modeled WebGL2 illustrations. No telemetry, capture or radio transmission. */
import * as T from '../vendor/three/three.module.min.js';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const records = [];
let paused = Boolean(window.AURA_MOTION_PAUSED), timer = 0, frame = 0, last = 0;
const CYAN = 0x51dcdf, AMBER = 0xffb978;
const mat = (color, metalness=.3, roughness=.4) => new T.MeshStandardMaterial({color,metalness,roughness});
function mesh(parent,g,m,x=0,y=0,z=0) {
  const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
}
function box(p,w,h,d,m,x=0,y=0,z=0){return mesh(p,new T.BoxGeometry(w,h,d),m,x,y,z);}
function rounded(p,w,h,d,m,x=0,y=0,z=0) {
  const r=Math.min(w,d)*.13,s=new T.Shape();
  s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);
  s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);
  s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
  const g=new T.ExtrudeGeometry(s,{depth:h,steps:1,bevelEnabled:true,bevelSegments:2,bevelSize:.025,bevelThickness:.025,curveSegments:5});
  g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);return mesh(p,g,m,x,y,z);
}
function textTexture(text,color='#bceff0') {
  const c=document.createElement('canvas');c.width=512;c.height=96;
  const ctx=c.getContext('2d');ctx.fillStyle='#102538';ctx.fillRect(0,0,512,96);
  ctx.font='600 36px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,256,48,490);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
}
function label(p,text,x,y,z,w=1.8,color) {
  const o=new T.Sprite(new T.SpriteMaterial({map:textTexture(text,color),depthTest:false,toneMapped:false}));
  o.position.set(x,y,z);o.scale.set(w,w*96/512,1);o.renderOrder=10;o.userData.label=text;o.visible=false;p.add(o);return o;
}
function probe(p,scale=1) {
  const g=new T.Group();g.scale.setScalar(scale);p.add(g);
  const ink=mat(0x122b3d,.5),silver=mat(0xcbdfe3,.5,.3);
  rounded(g,2.2,.48,1.45,silver,0,.58,0);rounded(g,2.18,.07,1.43,ink,0,.36,0);
  rounded(g,2.02,.055,1.28,silver,0,.845,0);
  for(const x of [-.8,.8])for(const z of [-.46,.46])box(g,.22,.12,.22,ink,x,.23,z);
  box(g,.43,.27,.06,mat(0x859ca7,.8),.5,.58,.75);box(g,.32,.18,.03,ink,.5,.58,.79);
  for(let i=0;i<6;i++)box(g,.025,.04,.012,mat(0xc2b781,.6),.39+i*.043,.63,.815);
  for(const x of [-.32,0])box(g,.23,.11,.04,ink,x,.56,.76);
  for(let i=0;i<6;i++)box(g,.04,.012,.36,ink,-.8+i*.11,.906,.05);
  mesh(g,new T.CylinderGeometry(.11,.14,.17,16),ink,.78,.94,-.43);
  mesh(g,new T.CapsuleGeometry(.065,1.12,4,10),ink,.78,1.6,-.43).rotation.z=-.12;
  mesh(g,new T.SphereGeometry(.04,10,8),new T.MeshBasicMaterial({color:CYAN}),-.83,.59,.765);
  const lidTexture=textTexture('AURA');lidTexture.repeat.set(.4,1);lidTexture.offset.x=.3;
  const print=mesh(g,new T.PlaneGeometry(.92,.173),new T.MeshBasicMaterial({map:lidTexture,toneMapped:false}),.27,.91,.1);
  print.rotation.x=-Math.PI/2;print.castShadow=false;return g;
}
function switchNode(p) {
  const g=new T.Group();p.add(g);const ink=mat(0x122b3d,.5);rounded(g,1.9,.34,1.05,mat(0x78949f,.7),0,.47,0);box(g,1.75,.24,.045,ink,0,.47,.55);
  for(let i=0;i<8;i++){box(g,.15,.12,.025,mat(0x030f1d),-.73+i*.21,.48,.59);box(g,.04,.025,.01,new T.MeshBasicMaterial({color:CYAN}),-.76+i*.21,.58,.61);}return g;
}
function apNode(p,color=0xd0e1e3) {
  const g=new T.Group();p.add(g);mesh(g,new T.CylinderGeometry(.54,.64,.2,32),mat(color,.35),0,.45,0);
  mesh(g,new T.TorusGeometry(.27,.017,5,32),new T.MeshBasicMaterial({color:CYAN}),0,.56,0).rotation.x=-Math.PI/2;return g;
}
function workstation(p) {
  const g=new T.Group();p.add(g);const ink=mat(0x122b3d,.5);rounded(g,.87,.07,.59,ink,0,.29,.14);box(g,.12,.5,.12,ink,0,.55,0);
  rounded(g,1.17,.76,.1,ink,0,.99,0);box(g,1.03,.6,.015,mat(0x267b87,.4),0,1,.075);
  for(let i=0;i<3;i++)box(g,.65-i*.14,.025,.01,new T.MeshBasicMaterial({color:0x8ee4df}),-.08,1.15-i*.13,.09);return g;
}
function phone(p) {
  const g=new T.Group();p.add(g);rounded(g,.65,1.14,.15,mat(0x122b3d,.5),0,.8,0);box(g,.5,.93,.015,mat(0x267b87),0,.81,.11);return g;
}
function radio(state,x,z,color=CYAN,style='scan') {
  for(let i=0;i<2;i++){
    const ring=mesh(state.scene,new T.TorusGeometry(.72,.012,5,64,style==='tether'?Math.PI*1.5:Math.PI*2),new T.MeshBasicMaterial({color,transparent:true,opacity:.3,depthWrite:false}),x,.21,z);
    ring.rotation.x=-Math.PI/2;ring.castShadow=false;state.rings.push({ring,phase:i*.5,style});
  }
}
function route(state,points,color=CYAN,phase=0,speed=.13) {
  const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');
  mesh(state.scene,new T.TubeGeometry(curve,28,.021,5,false),mat(color,.3));
  const packet=mesh(state.scene,new T.SphereGeometry(.065,10,8),new T.MeshBasicMaterial({color}));packet.castShadow=false;
  state.packets.push({curve,packet,phase,speed});
}
function build(r) {
  const renderer=new T.WebGLRenderer({canvas:r.canvas,antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  const scene=new T.Scene(),camera=new T.OrthographicCamera(-5,5,4,-4,.1,40);
  const s={renderer,scene,camera,packets:[],rings:[],nodes:[],time:1.2,frames:0};r.state=s;
  scene.add(new T.HemisphereLight(0xc8f4ff,0x101c30,2.5));
  const key=new T.DirectionalLight(0xfff2df,4);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(512,512);
  Object.assign(key.shadow.camera,{left:-7,right:7,top:6,bottom:-6,near:.5,far:20});key.shadow.normalBias=.04;key.shadow.bias=-.0002;key.shadow.radius=3;scene.add(key);
  const rim=new T.DirectionalLight(0x48dce2,3);rim.position.set(4,3,-4);scene.add(rim);
  if(r.kind==='hero') {
    camera.position.set(5,4.1,6.8);camera.lookAt(0,.8,0);s.span=5.8;
    rounded(scene,3.8,.16,2.8,mat(0x142e43,.4,.55),0,.03,0);probe(scene,1.18).rotation.y=-.18;radio(s,0,0);
  } else {
    camera.position.set(7.5,8.5,10);camera.lookAt(0,.3,0);s.span=9.3;
    rounded(scene,7.1,.17,5.2,mat(0x10293c,.3,.6),0,-.03,0);
    const sw=switchNode(scene);sw.position.set(-1.95,0,.65);
    const core=probe(scene,.66);core.position.set(.45,0,.85);
    const ap=apNode(scene);ap.position.set(-1.8,0,-1.55);
    const pc=workstation(scene);pc.position.set(2.25,0,-1.25);s.nodes=[ap,core,core,sw,pc];
    label(scene,'SWITCH',-2.05,.24,1.57,1.55);label(scene,'AURA CORE',.5,.24,1.83,1.85);
    label(scene,'BORNE WI-FI',-1.85,.45,-2.18,2.05);label(scene,'POSTE ADMIN.',2.12,.25,-.25,2);
    route(s,[[-1.8,.28,-1.55],[-2.6,.26,-.7],[-1.95,.3,.65]],CYAN,.1);
    route(s,[[-1.95,.29,.65],[-.8,.28,.65],[.45,.3,.85]],CYAN,.4);
    route(s,[[.45,.28,.85],[1.8,.26,.65],[2.25,.3,-1.25]],CYAN,.7);radio(s,-1.8,-1.55);
    const names={unknown:'HÔTE INCONNU',rogue:'BORNE SUSPECTE',tether:'PARTAGE MOBILE',switch:'LIEN AJOUTÉ'};
    if(names[r.kind]) {
      const extra=r.kind==='unknown'?workstation(scene):r.kind==='rogue'?apNode(scene,0xd7a272):r.kind==='tether'?phone(scene):switchNode(scene);
      if(r.kind==='unknown')extra.scale.setScalar(.72);extra.position.set(2.05,0,1.58);
      label(scene,names[r.kind],1.8,.32,2.55,2.4,r.kind==='switch'?'#bceff0':'#ffd09b');
      if(r.kind==='unknown')route(s,[[2.05,.3,1.58],[1.5,.27,2.1],[.45,.32,.85]],AMBER,.15,.085);
      else if(r.kind==='switch')route(s,[[-1.95,.3,.65],[-1.3,.24,1.95],[2.05,.3,1.58]],CYAN,.3,.2);
      else radio(s,2.05,1.58,AMBER,r.kind);
    }
    s.focus=mesh(scene,new T.TorusGeometry(.9,.025,5,64),new T.MeshBasicMaterial({color:0x9bf9ef,transparent:true,opacity:.7}));
    s.focus.rotation.x=-Math.PI/2;s.focus.castShadow=false;
  }
  if(r.kind!=='hero') {
    const overlay=document.createElement('div');overlay.className='scene-3d__labels';overlay.setAttribute('aria-hidden','true');
    const notice=document.createElement('span');notice.className='scene-3d__notice';notice.textContent='Illustration · aucune donnée en direct';overlay.append(notice);
    s.labels=[];scene.traverse(o=>{if(o.userData.label){const el=document.createElement('span');el.className='scene-3d__node';el.textContent=o.userData.label;overlay.append(el);s.labels.push({o,el});}});
    r.canvas.parentElement.append(overlay);s.overlay=overlay;
  }
  const geometrySet=new Set();scene.traverse(o=>{if(o.geometry)geometrySet.add(o.geometry);});
  r.canvas.dataset.vertices=String([...geometrySet].reduce((n,g)=>n+(g.attributes.position?.count||0),0));
  r.canvas.dataset.engine='three.js r'+T.REVISION;
  draw(r,true);
}
function resize(r) {
  const s=r.state,b=r.canvas.getBoundingClientRect(),w=Math.round(b.width),h=Math.round(b.height);if(!w||!h)return false;
  if(s.w!==w||s.h!==h){s.w=w;s.h=h;s.renderer.setSize(w,h,false);
    const aspect=w/h,v=Math.max(r.kind==='hero'?3.8:6.1,s.span/aspect);
    Object.assign(s.camera,{left:-v*aspect/2,right:v*aspect/2,top:v/2,bottom:-v/2});s.camera.updateProjectionMatrix();
    s.camera.updateMatrixWorld();
    for(const {o,el} of s.labels||[]){const point=o.position.clone().project(s.camera);el.style.left=((point.x+1)*w/2)+'px';el.style.top=((-point.y+1)*h/2)+'px';}
  }return true;
}
function draw(r,initial=false) {
  const s=r.state;if(!s||(!initial&&(paused||window.AURA_MOTION_PAUSED||document.hidden)))return;
  try {
    if(!resize(r))return;
    for(const p of s.packets)p.packet.position.copy(p.curve.getPoint((s.time*p.speed+p.phase)%1));
    for(const a of s.rings){const t=(s.time*.12+a.phase)%1;
      a.ring.scale.setScalar((r.kind==='hero'?2.2:1)*(.8+t*.75));a.ring.material.opacity=.32*(1-t)+.06;
      if(a.style==='tether')a.ring.scale.y*=.6;
      if(a.style==='rogue')a.ring.scale.setScalar(.85+t*1.35);
    }
    if(s.focus){const node=s.nodes[(r.step||1)-1];s.focus.visible=Boolean(node);if(node)s.focus.position.set(node.position.x,.23,node.position.z);}
    s.renderer.render(s.scene,s.camera);s.frames++;
    Object.assign(r.canvas.dataset,{renderFrames:String(s.frames),triangles:String(s.renderer.info.render.triangles),drawCalls:String(s.renderer.info.render.calls)});
    r.canvas.closest('.scene-3d')?.classList.add('is-3d-rendered');r.canvas.closest('.hero__stage')?.classList.add('is-rendered');r.dirty=false;
  }catch(error){fail(r,error);}
}
function fallback(r){r.canvas.closest('.scene-3d')?.classList.remove('is-3d-rendered');r.canvas.closest('.hero__stage')?.classList.remove('is-rendered');}
function dispose(r) {
  const s=r.state;if(!s)return;const gs=new Set(),ms=new Set(),ts=new Set();
  s.scene.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){ms.add(m);if(m.map)ts.add(m.map);}});
  gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());s.overlay?.remove();s.renderer.dispose();r.state=null;
}
function retire(r){if(!r.state)return;r.canvas.dataset.sceneStatus='idle';r.intentionalLoss=true;r.contextExtension=r.state.renderer.getContext().getExtension('WEBGL_lose_context');fallback(r);dispose(r);if(r.contextExtension){r.contextLost=true;r.contextExtension.loseContext();}}
function fail(r,error){fallback(r);dispose(r);r.failed=true;r.canvas.dataset.sceneStatus='fallback';console.warn('AURA: visuel statique conservé, 3D indisponible.',error);}
function init(r) {
  if(r.state||r.failed||!r.near||document.hidden)return;
  if(r.contextLost){if(!r.restorePending){r.restorePending=true;r.contextExtension.restoreContext();}return;}
  if(records.filter(a=>a.state).length>=4){const old=records.find(a=>a.state&&!a.visible&&a!==r);if(!old)return;retire(old);}
  try{build(r);if(r.state)r.canvas.dataset.sceneStatus='ready';}catch(error){fail(r,error);}
}
function running(r){return r.state&&r.visible&&!r.failed&&!paused&&!window.AURA_MOTION_PAUSED&&!reduced.matches&&!document.hidden;}
function stop(){clearTimeout(timer);cancelAnimationFrame(frame);timer=frame=0;last=0;}
function schedule(){
  if(timer||frame||!records.some(running))return;
  timer=setTimeout(()=>{timer=0;frame=requestAnimationFrame(now=>{frame=0;const dt=last?Math.min((now-last)/1000,.1):1/30;last=now;
    for(const r of records)if(running(r)){r.state.time+=dt;draw(r);}schedule();});},1000/30);
}
function refresh(){stop();for(const r of records){if(!r.state)init(r);if(r.state&&r.visible&&r.dirty)draw(r);}schedule();}
for(const canvas of document.querySelectorAll('#hero-canvas,#network-canvas,canvas[data-network-scene]')) {
  const kind=canvas.id==='hero-canvas'?'hero':canvas.dataset.networkScene||'overview';
  if(!['hero','overview','unknown','rogue','tether','switch'].includes(kind))continue;
  canvas.tabIndex=-1;canvas.setAttribute('aria-hidden','true');
  const r={canvas,kind,state:null,near:false,visible:false,step:1,dirty:false,failed:false};records.push(r);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(r.intentionalLoss)return;fallback(r);r.failed=true;stop();schedule();});
  canvas.addEventListener('webglcontextrestored',()=>{dispose(r);r.failed=false;r.contextLost=false;r.restorePending=false;r.intentionalLoss=false;init(r);refresh();});
  new ResizeObserver(()=>{r.dirty=true;if(r.state&&r.visible&&!paused&&!window.AURA_MOTION_PAUSED&&!document.hidden){draw(r);schedule();}}).observe(canvas);
}
const near=new IntersectionObserver(entries=>{
  for(const e of entries){const r=records.find(a=>a.canvas===e.target);r.near=e.isIntersecting;if(r.near)init(r);else if(r.state){retire(r);}}schedule();
},{rootMargin:'240px'});
const visible=new IntersectionObserver(entries=>{
  for(const e of entries){const r=records.find(a=>a.canvas===e.target);r.visible=e.isIntersecting;if(r.visible){init(r);if(r.dirty)draw(r);}}
  if(!records.some(running))stop();else schedule();
});
for(const r of records){near.observe(r.canvas);visible.observe(r.canvas);}
document.addEventListener('aura:motion',e=>{paused=typeof e.detail?.paused==='boolean'?e.detail.paused:Boolean(window.AURA_MOTION_PAUSED);refresh();});
reduced.addEventListener('change',refresh);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else refresh();});
function focusStep(value){const n=Number(value);if(!Number.isInteger(n)||n<1||n>5)return;
  for(const r of records)if(r.kind==='overview'){r.step=n;r.dirty=true;if(r.visible)draw(r);}}
document.addEventListener('aura:step',e=>focusStep(e.detail?.step));
const svg=document.getElementById('how-svg');
if(svg){const sync=()=>focusStep([...svg.classList].find(c=>/^step-[1-5]$/.test(c))?.slice(5));new MutationObserver(sync).observe(svg,{attributes:true,attributeFilter:['class']});sync();}
