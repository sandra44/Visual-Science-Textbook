import { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { lessonModels } from './models/registry';
import { potatoState } from './models/potato';

export function OrbitLesson({id,p,title}:{id:string;p:number;title:string}){
  const host=useRef<HTMLDivElement>(null);
  const progress=useRef(p);
  const reset=useRef<()=>void>(()=>{});
  const [error,setError]=useState('');
  useEffect(()=>{progress.current=p;},[p]);
  useEffect(()=>{
    const target=host.current!;
    let renderer:T.WebGLRenderer;
    try { renderer=new T.WebGLRenderer({antialias:true,alpha:true}); }
    catch {setError('This browser could not start WebGL. Select 2D to continue the lesson.');return;}
    setError('');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    target.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label',`${title}, orbitable 3D model`);
    renderer.domElement.style.touchAction='none';
    const scene=new T.Scene(),root=new T.Group(),camera=new T.PerspectiveCamera(36,1,.05,180);
    scene.add(root,new T.HemisphereLight(0xfffaf1,0xdacbbb,1.9));
    const light=new T.DirectionalLight(0xfff8ed,2.4);light.position.set(4,7,5);scene.add(light);
    const update=lessonModels[id](root);
    update(progress.current);
    const control=new OrbitControls(camera,renderer.domElement);
    control.enableDamping=true;control.enablePan=false;
    function fit(){
      const w=Math.max(1,target.clientWidth),h=Math.max(1,target.clientHeight);
      renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
      const dist=id==='topic:Activity 2.2'?Math.max(6.3,3.35/(Math.tan(Math.PI/10)*camera.aspect)):Math.max(8.7,5.2/(Math.tan(Math.PI/10)*camera.aspect));
      camera.position.set(.34,.24,1).normalize().multiplyScalar(dist);
      control.target.set(0,0,0);control.minDistance=2;control.maxDistance=dist*3;control.update();
    }
    fit();reset.current=fit;
    const observer=new ResizeObserver(fit);observer.observe(target);
    function lose(e:Event){e.preventDefault();setError('The 3D graphics context was lost. Switch to 2D, then reopen 3D to retry.');}
    renderer.domElement.addEventListener('webglcontextlost',lose);
    renderer.setAnimationLoop(()=>{update(progress.current);control.update();renderer.render(scene,camera);});
    return ()=>{
      observer.disconnect();renderer.setAnimationLoop(null);control.dispose();
      const resources=new Set<T.BufferGeometry|T.Material|T.Texture>();
      root.traverse(obj=>{if(obj instanceof T.Mesh || obj instanceof T.Line || obj instanceof T.Points || obj instanceof T.Sprite){
        if('geometry' in obj)resources.add(obj.geometry);
        for(const mat of ([] as T.Material[]).concat(obj.material)){
          resources.add(mat);for(const v of Object.values(mat))if(v instanceof T.Texture)resources.add(v);
        }
      }});
      resources.forEach(r=>r.dispose());renderer.domElement.removeEventListener('webglcontextlost',lose);
      renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();reset.current=()=>{};
    };
  },[id,title]);
  return <div className="lesson-scene my-2">
    <div ref={host} className="w-full h-[34vh] min-h-40 rounded-xl overflow-hidden"/>
    {error?<p role="alert" className="text-center text-sm">{error}</p>:<div className="flex flex-wrap justify-center gap-3 text-xs">
      <span>Drag to orbit · Scroll or pinch to zoom</span><button className="underline" onClick={()=>reset.current()}>Reset view</button>
      {id==='topic:Activity 2.2' && <div className="w-full text-center">
        <strong>{potatoState(p).drop<1?'Two equal pieces':`Soaking: ${potatoState(p).minutes} of 60 min`}</strong>
        <p>A · Plain water: {potatoState(p).soak?'swelling as water enters':'starting size'} &nbsp;|&nbsp; B · 20% salt: {potatoState(p).soak?'shrinking as water leaves':'starting size'}</p>
        <small>Dashed ring = original width. Size changes exaggerated for visibility.</small>
      </div>}
    </div>}
  </div>;
}
