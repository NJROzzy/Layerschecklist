import { regions } from "./content";
export type Vec3=[number,number,number];
export type BrainMesh={vertices:Float32Array;side:"left"|"right"|"center";internal:boolean};
type Surface=(u:number,v:number)=>Vec3;
const sub=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function normalize(p:Vec3):Vec3 {const length=Math.hypot(...p)||1;return p.map(v=>v/length) as Vec3;}
const colors=regions.map(r=>[1,3,5].map(i=>parseInt(r.color.slice(i,i+2),16)/255));

function mesh(surface:Surface,nu:number,nv:number,identify:(p:Vec3)=>number,side:BrainMesh["side"],internal=false):BrainMesh {
 const data:number[]=[];
 const vertex=(u:number,v:number)=>{
  const p=surface(u,v),eps=.0001;
  const du=sub(surface(Math.min(1,u+eps),v),surface(Math.max(0,u-eps),v));
  const dv=sub(surface(u,Math.min(1,v+eps)),surface(u,Math.max(0,v-eps)));
  return {p,n:normalize(cross(du,dv))};
 };
 for(let i=0;i<nu;i++) for(let j=0;j<nv;j++) {
  const a=vertex(i/nu,j/nv),b=vertex((i+1)/nu,j/nv),c=vertex((i+1)/nu,(j+1)/nv),d=vertex(i/nu,(j+1)/nv);
  for(const triangle of [[a,b,c],[a,c,d]]) {
   const center=triangle.reduce((s,{p})=>s.map((v,k)=>v+p[k]/3) as Vec3,[0,0,0] as Vec3);
   const id=identify(center),color=colors[id];
   for(const {p,n} of triangle) data.push(...p,...n,...color,id);
  }
 }
 return {vertices:new Float32Array(data),side,internal};
}
function ellipsoid(center:Vec3,radius:Vec3,folds:number):Surface {
 return (u,v)=>{
  const theta=.0001+(Math.PI-.0002)*u,phi=2*Math.PI*v;
  const ripple=1+folds*Math.sin(44*theta+1.2*Math.sin(3*phi));
  return [center[0]+radius[0]*Math.sin(theta)*Math.cos(phi)*ripple,center[1]+radius[1]*Math.cos(theta)*ripple,center[2]+radius[2]*Math.sin(theta)*Math.sin(phi)*ripple];
 };
}
/** Original procedural teaching geometry; folds and lobe borders are schematic, not scan-derived. */
export function buildBrainMeshes():BrainMesh[] {
 const meshes:BrainMesh[]=[];
 for(const sign of [-1,1]) {
  const cortex:Surface=(u,v)=>{
   const theta=.0001+(Math.PI-.0002)*u,phi=Math.PI*v;
   const sy=Math.sin(theta),y=.14+.83*Math.cos(theta),z=1.12*sy*Math.cos(phi);
   const folds=.032*Math.sin(32*theta+2.8*Math.sin(8*phi))+.018*Math.sin(30*phi+2*Math.sin(6*theta));
   const centralGroove=.04*Math.exp(-Math.pow((z-.22+.15*y)/.045,2));
   const lateralGroove=.04*Math.exp(-Math.pow((y+.16+.08*z)/.04,2))*Math.sin(phi);
   const radius=1+(folds-centralGroove-lateralGroove)*Math.sin(phi);
   return [sign*(.035+.79*sy*Math.sin(phi)*radius*(1+.07*Math.cos(phi))),.14+(y-.14)*radius,z*radius];
  };
  const lobe=(p:Vec3)=>p[2]<-.69?3:p[1]<-.13&&Math.abs(p[0])>.23?2:p[2]>.22-.15*p[1]?0:1;
  meshes.push(mesh(cortex,66,90,lobe,sign<0?"left":"right"));
 }
 meshes.push(mesh(ellipsoid([0,-.65,-.65],[.59,.35,.44],.035),36,60,()=>4,"center"));
 const stem:Surface=(u,v)=>{
  const radius=.105+.075*Math.exp(-Math.pow((u-.22)/.23,2)),a=2*Math.PI*v;
  return [radius*Math.cos(a),-.54-.85*u,-.29-.12*u+radius*Math.sin(a)];
 };
 meshes.push(mesh(stem,24,32,()=>5,"center"));
 const cord:Surface=(u,v)=>[.065*Math.cos(2*Math.PI*v),-1.36-.43*u,-.40+.065*Math.sin(2*Math.PI*v)];
 meshes.push(mesh(cord,10,24,()=>9,"center"));
 for(const sign of [-1,1]) {
  meshes.push(mesh(ellipsoid([sign*.16,-.03,-.10],[.15,.17,.23],0),22,32,()=>6,"center",true));
  const hippocampus:Surface=(u,v)=>{
   const t=-.4+u*2.8,angle=2*Math.PI*v,r=.055;
   return [sign*(.35+.10*Math.cos(t))+r*Math.cos(angle),-.25-.12*Math.sin(t)+r*Math.sin(angle),-.18+.37*Math.cos(t)];
  };
  meshes.push(mesh(hippocampus,32,16,()=>8,"center",true));
 }
 meshes.push(mesh(ellipsoid([0,-.29,.02],[.14,.105,.13],0),20,28,()=>7,"center",true));
 return meshes;
}

export type BrainView={yaw:number;pitch:number;zoom:number;inside:boolean;selected:number};
const VERTEX=`
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec3 aColor; attribute float aRegion;
uniform mat3 uRotation; uniform float uAspect; uniform float uDistance;
varying vec3 vNormal; varying vec3 vColor; varying float vRegion; varying vec3 vPosition;
void main(){
 vec3 p=uRotation*(aPosition-vec3(0.0,-0.24,0.0));
 float w=uDistance-p.z;
 gl_Position=vec4(p.x*2.12/uAspect,p.y*2.12,1.01005*w-0.201005,w);
 vNormal=uRotation*aNormal;vColor=aColor;vRegion=aRegion;vPosition=p;
}`;
const FRAGMENT=`
precision mediump float;
uniform float uSelected;uniform bool uPicking;
varying vec3 vNormal;varying vec3 vColor;varying float vRegion;varying vec3 vPosition;
void main(){
 if(uPicking){gl_FragColor=vec4((vRegion+1.0)/255.0,0.0,0.0,1.0);return;}
 vec3 n=normalize(vNormal); if(!gl_FrontFacing)n=-n;
 vec3 light=normalize(vec3(-0.4,0.7,1.2));
 float diffuse=abs(dot(n,light));
 float rim=pow(1.0-abs(n.z),3.0);
 float selected=1.0-step(0.2,abs(vRegion-uSelected));
 vec3 color=mix(vColor*0.67,vColor,selected);
 color*=0.36+0.64*diffuse;
 color+=vec3(0.12,0.19,0.18)*rim;
 color+=vec3(0.12)*pow(max(dot(reflect(-light,n),vec3(0.0,0.0,1.0)),0.0),22.0);
 gl_FragColor=vec4(color,1.0);
}`;

export function createBrainRenderer(canvas:HTMLCanvasElement) {
 const gl=canvas.getContext("webgl",{antialias:true,alpha:true,preserveDrawingBuffer:true});
 if(!gl) return null;
 function shader(type:number,source:string) {
  const shader=gl!.createShader(type)!;gl!.shaderSource(shader,source);gl!.compileShader(shader);
  if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)){gl!.deleteShader(shader);throw new Error("Brain shader compilation failed");}
  return shader;
 }
 const vertex=shader(gl.VERTEX_SHADER,VERTEX),fragment=shader(gl.FRAGMENT_SHADER,FRAGMENT),program=gl.createProgram()!;
 gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error("Brain renderer link failed");
 const attributes=["aPosition","aNormal","aColor","aRegion"].map(n=>gl.getAttribLocation(program,n));
 const uniforms=Object.fromEntries(["uRotation","uAspect","uDistance","uSelected","uPicking"].map(n=>[n,gl.getUniformLocation(program,n)]));
 const meshes=buildBrainMeshes().map(m=>{
  const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,m.vertices,gl.STATIC_DRAW);
  return {...m,buffer,count:m.vertices.length/10};
 });
 let last:BrainView={yaw:1.05,pitch:.16,zoom:1,inside:false,selected:0};
 function draw(view:BrainView,picking=false) {
  if(!gl||gl.isContextLost()) return;
  last=view;
  const ratio=Math.min(window.devicePixelRatio||1,2),width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.disable(gl.DITHER);gl.useProgram(program);
  const cy=Math.cos(view.yaw),sy=Math.sin(view.yaw),cp=Math.cos(view.pitch),sp=Math.sin(view.pitch);
  gl.uniformMatrix3fv(uniforms.uRotation,false,new Float32Array([cy,sp*sy,-cp*sy,0,cp,sp,sy,-sp*cy,cp*cy]));
  const aspect=Math.max(.1,width/height);
  gl.uniform1f(uniforms.uAspect,aspect);gl.uniform1f(uniforms.uDistance,4*Math.max(1,.95/aspect)/view.zoom);
  gl.uniform1f(uniforms.uSelected,view.selected);gl.uniform1i(uniforms.uPicking,Number(picking));
  for(const m of meshes) {
   if(view.inside&&m.side==="left")continue;
   if(m.internal&&!view.inside)continue;
   gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);
   [3,3,3,1].forEach((size,i)=>{gl.enableVertexAttribArray(attributes[i]);gl.vertexAttribPointer(attributes[i],size,gl.FLOAT,false,40,[0,12,24,36][i]);});
   gl.drawArrays(gl.TRIANGLES,0,m.count);
  }
 }
 function pick(clientX:number,clientY:number) {
  if(!gl||gl.isContextLost())return -1;
  const rect=canvas.getBoundingClientRect(),x=Math.floor((clientX-rect.left)/rect.width*canvas.width),y=Math.floor((rect.bottom-clientY)/rect.height*canvas.height);
  if(x<0||y<0||x>=canvas.width||y>=canvas.height)return -1;
  draw(last,true);const pixel=new Uint8Array(4);gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);draw(last);
  return pixel[3]>0?pixel[0]-1:-1;
 }
 function dispose(){meshes.forEach(m=>gl!.deleteBuffer(m.buffer));gl!.deleteProgram(program);gl!.deleteShader(vertex);gl!.deleteShader(fragment);}
 return {draw,pick,dispose};
}
