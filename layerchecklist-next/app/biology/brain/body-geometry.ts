import { buildBrainMeshes, type Vec3 } from "./brain-geometry";

/**
 * A stylized whole-body nervous system, built procedurally.
 *
 * Coordinates: +x is the person's right, +y is up, +z is anterior (front).
 * Stature spans y = -1 (soles) to y = +1 (vertex), so one unit is half a body
 * height. Landmark heights follow conventional proportions of stature; they are
 * teaching approximations, not measurements of any individual.
 */

export type Track = { id:number; name:string; group:"cns"|"cranial"|"plexus"|"arm"|"leg"|"trunk"; blurb:string };

export const tracks:Track[] = [
 {id:0, name:"Brain",              group:"cns",    blurb:"The cerebrum, cerebellum and brainstem sit inside the cranial vault. Ascending input arrives here and descending output leaves from here."},
 {id:1, name:"Spinal cord",        group:"cns",    blurb:"The cord runs inside the vertebral canal and ends near the first or second lumbar vertebra, well above the end of the spine."},
 {id:2, name:"Cauda equina",       group:"cns",    blurb:"Below the end of the cord, lumbar and sacral nerve roots continue downward as a bundle before leaving between vertebrae."},
 {id:3, name:"Spinal nerve roots", group:"cns",    blurb:"Thirty-one pairs leave the cord. Each carries sensory fibres inward and motor fibres outward for one segment of the body."},
 {id:4, name:"Vagus nerve",        group:"cranial",blurb:"A cranial nerve that leaves the medulla and travels down the neck into the chest and abdomen, carrying much parasympathetic output and a great deal of sensory traffic."},
 {id:5, name:"Phrenic nerve",      group:"cranial",blurb:"Arises from cervical segments around C3 to C5 and descends to the diaphragm. Cervical damage above this level threatens breathing."},
 {id:6, name:"Sympathetic chain",  group:"trunk",  blurb:"Paired ganglia run alongside the vertebral column, linking spinal output to organs and blood vessels."},
 {id:7, name:"Intercostal nerves", group:"trunk",  blurb:"Thoracic spinal nerves run along the underside of each rib, supplying chest wall muscles and skin."},
 {id:8, name:"Brachial plexus",    group:"plexus", blurb:"Roots from about C5 to T1 mix and regroup in the neck and armpit before emerging as the nerves of the arm."},
 {id:9, name:"Median nerve",       group:"arm",    blurb:"Runs down the front of the arm and through the carpal tunnel at the wrist to much of the thumb side of the hand."},
 {id:10,name:"Ulnar nerve",        group:"arm",    blurb:"Passes behind the medial epicondyle, the exposed point at the elbow, then along the little-finger side of the forearm and hand."},
 {id:11,name:"Radial nerve",       group:"arm",    blurb:"Spirals around the back of the humerus, then supplies the extensor muscles and the back of the hand."},
 {id:12,name:"Lumbosacral plexus", group:"plexus", blurb:"Lumbar and sacral roots combine in the pelvis and give rise to the nerves of the hip and leg."},
 {id:13,name:"Femoral nerve",      group:"leg",    blurb:"Enters the front of the thigh and supplies the muscles that straighten the knee, plus skin over the front of the thigh."},
 {id:14,name:"Sciatic nerve",      group:"leg",    blurb:"The thickest nerve in the body. It leaves the pelvis, runs down the back of the thigh and divides above the knee."},
 {id:15,name:"Tibial nerve",       group:"leg",    blurb:"The sciatic nerve's medial division. It continues down the calf and passes behind the inner ankle into the sole."},
 {id:16,name:"Common fibular n.",  group:"leg",    blurb:"The sciatic nerve's lateral division. It wraps around the head of the fibula, where it lies close to the surface, then reaches the shin and foot."},
];
export const trackById = Object.fromEntries(tracks.map(t=>[t.id,t])) as Record<number,Track>;
export const BONE_ID = 90;

const COLOR:Record<Track["group"],Vec3> = {
 cns:[.56,.86,.74], cranial:[.79,.68,.93], plexus:[.99,.80,.45],
 arm:[.55,.78,.98], leg:[.97,.62,.66], trunk:[.62,.88,.90],
};
const BONE_COLOR:Vec3=[.88,.89,.87];

/* ---- curves ------------------------------------------------------------- */
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
/** Centripetal-ish Catmull-Rom through the control points, clamped at the ends. */
function curve(points:Vec3[], u:number):Vec3 {
 const n=points.length-1, s=Math.min(.999999,Math.max(0,u))*n, i=Math.floor(s), t=s-i;
 const p=(k:number)=>points[Math.min(n,Math.max(0,k))];
 const p0=p(i-1),p1=p(i),p2=p(i+1),p3=p(i+2);
 const out=[0,0,0] as Vec3;
 for(let k=0;k<3;k++) out[k]=.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t);
 return out;
}
/** The spine's sagittal curve: cervical and lumbar bend forward, thoracic and sacral backward. */
const SPINE:[number,number][]=[[.755,.012],[.700,.004],[.640,-.010],[.560,-.030],[.460,-.040],[.360,-.028],[.300,-.012],[.240,.014],[.190,.024],[.140,.014],[.080,-.016],[.020,-.040]];
export function spineZ(y:number):number {
 if(y>=SPINE[0][0]) return SPINE[0][1];
 for(let i=0;i<SPINE.length-1;i++){
  const [ya,za]=SPINE[i],[yb,zb]=SPINE[i+1];
  if(y<=ya&&y>=yb) return lerp(za,zb,(ya-y)/(ya-yb));
 }
 return SPINE[SPINE.length-1][1];
}
const spineAt=(y:number,x=0):Vec3=>[x,y,spineZ(y)];

/* ---- geometry builders --------------------------------------------------- */
type Tri = { position:Vec3; normal:Vec3 };
const sub=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=(p:Vec3):Vec3=>{const l=Math.hypot(p[0],p[1],p[2])||1;return [p[0]/l,p[1]/l,p[2]/l];};

/** A circular tube swept along a curve, with a rotation-minimising frame. */
function tube(out:number[], points:Vec3[], radius:(u:number)=>number, id:number, color:Vec3, along:boolean, nu:number, nv=7) {
 const ring:Vec3[][]=[], centre:Vec3[]=[];
 let ref:Vec3=[0,0,1];
 for(let i=0;i<=nu;i++){
  const u=i/nu, p=curve(points,u);
  const t=norm(sub(curve(points,Math.min(1,u+.004)),curve(points,Math.max(0,u-.004))));
  if(Math.abs(t[0]*ref[0]+t[1]*ref[1]+t[2]*ref[2])>.9) ref=[1,0,0];
  const n=norm(cross(t,ref)), b=norm(cross(t,n));
  ref=n;
  const r=radius(u), circle:Vec3[]=[];
  for(let j=0;j<nv;j++){
   const a=2*Math.PI*j/nv, c=Math.cos(a), s=Math.sin(a);
   circle.push([p[0]+r*(c*n[0]+s*b[0]), p[1]+r*(c*n[1]+s*b[1]), p[2]+r*(c*n[2]+s*b[2])]);
  }
  ring.push(circle); centre.push(p);
 }
 for(let i=0;i<nu;i++) for(let j=0;j<nv;j++){
  const j2=(j+1)%nv;
  const quad:[Vec3,number][]=[[ring[i][j],i],[ring[i+1][j],i+1],[ring[i+1][j2],i+1],[ring[i][j],i],[ring[i+1][j2],i+1],[ring[i][j2],i]];
  for(const [v,k] of quad){
   const n=norm(sub(v,centre[k]));
   out.push(v[0],v[1],v[2], n[0],n[1],n[2], color[0],color[1],color[2], id, along?k/nu:-1);
  }
 }
}

/** A closed blob; `shape` distorts the unit sphere. */
function blob(out:number[], centre:Vec3, radius:Vec3, id:number, color:Vec3, nu=18, nv=26, shape?:(t:number,p:number)=>number) {
 const at=(i:number,j:number):Vec3=>{
  const th=Math.PI*i/nu, ph=2*Math.PI*j/nv;
  const k=shape?shape(th,ph):1;
  return [centre[0]+radius[0]*Math.sin(th)*Math.cos(ph)*k, centre[1]+radius[1]*Math.cos(th)*k, centre[2]+radius[2]*Math.sin(th)*Math.sin(ph)*k];
 };
 for(let i=0;i<nu;i++) for(let j=0;j<nv;j++){
  for(const [a,b,c] of [[[i,j],[i+1,j],[i+1,j+1]],[[i,j],[i+1,j+1],[i,j+1]]] as [number,number][][]){
   const p=[at(a[0],a[1]),at(b[0],b[1]),at(c[0],c[1])];
   const n=norm(cross(sub(p[1],p[0]),sub(p[2],p[0])));
   for(const v of p) out.push(v[0],v[1],v[2], n[0],n[1],n[2], color[0],color[1],color[2], id, -1);
  }
 }
}

/* ---- the nerve tree ------------------------------------------------------ */
const THIN=(r:number)=>()=>r;
const TAPER=(a:number,b:number)=>(u:number)=>lerp(a,b,u);

function nerves(out:number[]) {
 const C=(g:Track["group"])=>COLOR[g];
 // spinal cord: medulla down to the conus at about L1
 const cord:Vec3[]=[]; for(let y=.752;y>=.275;y-=.025) cord.push(spineAt(y));
 tube(out,cord,TAPER(.022,.012),1,C("cns"),true,64,9);
 // cauda equina: roots continuing past the end of the cord
 for(const off of [-.014,-.005,.005,.014]) {
  const strand:Vec3[]=[]; for(let y=.290;y>=.075;y-=.02) strand.push([off*(1+(.29-y)*2.2), y, spineZ(y)-.004]);
  tube(out,strand,THIN(.0045),2,C("cns"),true,26,5);
 }
 for(const side of [-1,1]) {
  // segmental roots leaving the cord
  for(let y=.660;y>.120;y-=.0235){
   const z=spineZ(y), lat=.016+.030*Math.min(1,(.68-y)*2.4);
   tube(out,[[0,y,z],[side*lat*.6,y-.004,z+.004],[side*lat,y-.012,z+.010]],THIN(.0052),3,C("cns"),true,6,5);
  }
  // vagus: medulla -> neck -> chest -> abdomen
  tube(out,[[side*.014,.672,-.004],[side*.040,.640,.030],[side*.046,.590,.044],[side*.034,.520,.046],[side*.024,.440,.040],[side*.014,.360,.036],[side*.008,.300,.030]],TAPER(.0075,.0045),4,C("cranial"),true,40,6);
  // phrenic: C3-C5 -> diaphragm
  tube(out,[[side*.022,.668,.012],[side*.050,.628,.034],[side*.056,.560,.040],[side*.062,.480,.036],[side*.070,.430,.028]],THIN(.0050),5,C("cranial"),true,30,5);
  // sympathetic chain, with its ganglia
  const chain:Vec3[]=[]; for(let y=.650;y>=.060;y-=.03) chain.push([side*.028,y,spineZ(y)+.020]);
  tube(out,chain,THIN(.0048),6,C("trunk"),true,40,5);
  for(let y=.630;y>=.080;y-=.055) blob(out,[side*.028,y,spineZ(y)+.020],[.0092,.0092,.0092],6,C("trunk"),6,9);
  // intercostal nerves following the ribs
  for(let k=0;k<11;k++){
   const y=.620-k*.028, z=spineZ(y), drop=.030+k*.004, w=.072+.040*Math.sin(Math.PI*(k+.6)/12);
   tube(out,[[side*.030,y-.012,z+.010],[side*(w*.7),y-drop*.5,z+.055],[side*w,y-drop,z+.105],[side*(w*.55),y-drop*1.25,z+.135]],THIN(.0040),7,C("trunk"),true,20,5);
  }
  // brachial plexus: roots -> trunks -> axilla
  for(let k=0;k<5;k++){
   const y=.668-k*.0155;
   tube(out,[[side*.030,y,spineZ(y)+.010],[side*.090,y-.012,.018],[side*.150,.612,.020],[side*.196,.600,.018]],THIN(.0058),8,C("plexus"),true,24,5);
  }
  blob(out,[side*.170,.606,.019],[.020,.013,.014],8,C("plexus"),8,12);
  const axilla:Vec3=[side*.204,.596,.014];
  // median
  tube(out,[axilla,[side*.222,.500,.028],[side*.230,.400,.034],[side*.236,.300,.038],[side*.238,.258,.040],[side*.244,.170,.038],[side*.248,.060,.034],[side*.250,-.014,.030],[side*.252,-.070,.026],[side*.256,-.135,.024]],TAPER(.0072,.0030),9,C("arm"),true,54,6);
  // ulnar: behind the medial epicondyle
  tube(out,[axilla,[side*.216,.480,.008],[side*.228,.360,-.006],[side*.246,.276,-.022],[side*.258,.230,-.010],[side*.264,.120,.014],[side*.268,.020,.020],[side*.270,-.030,.018],[side*.272,-.100,.016],[side*.274,-.150,.014]],TAPER(.0065,.0028),10,C("arm"),true,54,6);
  // radial: spirals behind the humerus, then to the back of the hand
  tube(out,[axilla,[side*.214,.510,-.020],[side*.232,.430,-.042],[side*.248,.340,-.038],[side*.258,.282,-.008],[side*.264,.210,-.016],[side*.266,.110,-.022],[side*.266,.020,-.024],[side*.264,-.040,-.022],[side*.262,-.110,-.020]],TAPER(.0068,.0026),11,C("arm"),true,54,6);
  // lumbosacral plexus
  for(let k=0;k<5;k++){
   const y=.235-k*.030;
   tube(out,[[side*.030,y,spineZ(y)+.008],[side*.062,y-.020,.010],[side*.086,y-.045,.002],[side*.100,.052,-.010]],THIN(.0062),12,C("plexus"),true,22,5);
  }
  blob(out,[side*.094,.062,-.008],[.020,.022,.015],12,C("plexus"),8,12);
  // femoral: front of the thigh
  tube(out,[[side*.088,.070,.006],[side*.092,.030,.034],[side*.090,-.060,.046],[side*.084,-.180,.046],[side*.078,-.300,.042],[side*.074,-.400,.034]],TAPER(.0070,.0034),13,C("leg"),true,36,6);
  // sciatic: through the greater sciatic notch, down the back of the thigh
  tube(out,[[side*.104,.048,-.020],[side*.108,.010,-.042],[side*.100,-.090,-.040],[side*.092,-.200,-.036],[side*.086,-.310,-.032],[side*.082,-.392,-.028]],TAPER(.0115,.0072),14,C("leg"),true,40,8);
  const fork:Vec3=[side*.082,-.392,-.028];
  // tibial: down the calf, behind the medial malleolus, into the sole
  tube(out,[fork,[side*.078,-.470,-.030],[side*.074,-.600,-.028],[side*.070,-.740,-.022],[side*.064,-.860,-.014],[side*.060,-.918,.002],[side*.062,-.952,.030]],TAPER(.0072,.0034),15,C("leg"),true,40,6);
  // common fibular: around the head of the fibula, then the shin and foot
  tube(out,[fork,[side*.090,-.442,-.020],[side*.100,-.478,.000],[side*.096,-.560,.016],[side*.088,-.680,.024],[side*.080,-.800,.026],[side*.074,-.895,.030],[side*.072,-.945,.058]],TAPER(.0066,.0030),16,C("leg"),true,42,6);
  // terminal branches in hand and foot
  for(let k=-1;k<=1;k++){
   tube(out,[[side*.250,-.135,.024],[side*(.250+k*.012),-.175,.026],[side*(.250+k*.020),-.215,.024]],THIN(.0022),9,C("arm"),true,10,4);
   tube(out,[[side*.062,-.952,.030],[side*(.062+k*.011),-.968,.062],[side*(.062+k*.017),-.975,.092]],THIN(.0021),15,C("leg"),true,10,4);
  }
 }
}

/* ---- the skeleton -------------------------------------------------------- */
function skeleton(out:number[]) {
 const B=BONE_COLOR, id=BONE_ID;
 // cranium and face
 blob(out,[0,.892,.004],[.126,.146,.150],id,B,20,28,(t)=>1-.13*Math.pow(Math.max(0,-Math.cos(t)),1.6));
 blob(out,[0,.800,.082],[.072,.052,.062],id,B,12,18);
 tube(out,[[-.088,.792,.028],[-.080,.756,.086],[-.040,.742,.118],[0,.740,.126],[.040,.742,.118],[.080,.756,.086],[.088,.792,.028]],THIN(.0135),id,B,false,30,7);
 // vertebral column, one body per vertebra
 for(let y=.752;y>=.020;y-=.0205){
  const z=spineZ(y), r=.0175+.017*Math.min(1,Math.max(0,(.70-y)/.62));
  blob(out,[0,y,z-.004],[r,.0082,r*.86],id,B,6,10);
  tube(out,[[0,y,z-.006],[0,y-.002,z-.030]],THIN(.0062),id,B,false,3,5);
 }
 // rib cage
 for(const side of [-1,1]) for(let k=0;k<12;k++){
  const y=.624-k*.028, z=spineZ(y), drop=.034+k*.0065;
  const w=.074+.046*Math.sin(Math.PI*(k+.7)/13), reach=k<7?.118:k<10?.100:.066;
  const rib:Vec3[]=[[side*.020,y,z-.004],[side*(w*.66),y-drop*.42,z+.050],[side*w,y-drop*.86,z+.112],[side*(w*.62),y-drop*1.22,reach+.010],[side*(w*.24),y-drop*1.42,reach]];
  tube(out,k<10?rib:rib.slice(0,4),THIN(.0062),id,B,false,22,6);
 }
 tube(out,[[0,.628,.134],[0,.560,.146],[0,.470,.140],[0,.418,.128]],(u)=>.016+.008*Math.sin(Math.PI*u),id,B,false,16,8);
 // shoulder girdle
 for(const side of [-1,1]){
  tube(out,[[side*.014,.640,.118],[side*.090,.652,.086],[side*.166,.648,.036],[side*.206,.634,.008]],THIN(.0092),id,B,false,20,7);
  blob(out,[side*.150,.598,-.046],[.058,.062,.018],id,B,10,14);
  blob(out,[side*.206,.624,-.004],[.026,.024,.026],id,B,8,12);
  // humerus, radius, ulna
  tube(out,[[side*.208,.612,-.002],[side*.224,.480,.002],[side*.238,.340,.006],[side*.244,.268,.008]],(u)=>.0175+.011*Math.pow(Math.abs(2*u-1),3),id,B,false,22,8);
  tube(out,[[side*.238,.256,.020],[side*.244,.150,.028],[side*.250,.040,.030],[side*.252,-.026,.030]],(u)=>.0112+.007*Math.pow(Math.abs(2*u-1),3),id,B,false,18,7);
  tube(out,[[side*.256,.258,-.008],[side*.258,.150,.002],[side*.262,.040,.010],[side*.264,-.026,.014]],(u)=>.0120+.008*Math.pow(1-u,3),id,B,false,18,7);
  // hand
  blob(out,[side*.258,-.048,.022],[.026,.018,.014],id,B,8,12);
  for(let f=-2;f<=2;f++) tube(out,[[side*(.258+f*.009),-.062,.022],[side*(.258+f*.013),-.120,.024],[side*(.258+f*.016),-.170-Math.abs(f)*.006,.022]],THIN(.0038),id,B,false,10,5);
  // pelvis, femur, tibia, fibula, foot
  blob(out,[side*.112,.092,-.006],[.062,.070,.050],id,B,12,16,(t,p)=>1-.34*Math.max(0,Math.sin(t)*Math.cos(p)));
  blob(out,[side*.070,.026,-.004],[.040,.038,.038],id,B,8,12);
  tube(out,[[side*.092,.036,-.002],[side*.086,-.090,.006],[side*.080,-.250,.010],[side*.076,-.394,.010]],(u)=>.0235+.015*Math.pow(Math.abs(2*u-1),3),id,B,false,24,8);
  blob(out,[side*.076,-.424,.026],[.020,.016,.012],id,B,7,10);
  tube(out,[[side*.074,-.418,.004],[side*.072,-.560,.008],[side*.070,-.740,.010],[side*.068,-.900,.008]],(u)=>.0185+.012*Math.pow(Math.abs(2*u-1),3),id,B,false,22,8);
  tube(out,[[side*.098,-.440,-.002],[side*.092,-.600,.000],[side*.086,-.780,.002],[side*.082,-.898,.002]],(u)=>.0090+.006*Math.pow(Math.abs(2*u-1),3),id,B,false,18,6);
  blob(out,[side*.072,-.932,.006],[.030,.026,.036],id,B,8,12);
  tube(out,[[side*.072,-.952,.030],[side*.072,-.972,.074],[side*.072,-.980,.110]],(u)=>.018-.006*u,id,B,false,10,7);
  for(let f=-2;f<=2;f++) tube(out,[[side*(.072+f*.013),-.982,.108],[side*(.072+f*.016),-.986,.142]],THIN(.0038),id,B,false,5,5);
 }
}

/* ---- assembly ------------------------------------------------------------ */
export type BodyPart = { data:Float32Array; kind:"nerve"|"bone"|"brain" };

/** The brain page's cortex mesh, scaled down and seated inside the cranial vault. */
function brainInSkull():Float32Array {
 const SCALE=.112, CX=0, CY=.894, CZ=.004, BRAIN_MID=.14;
 const out:number[]=[];
 for(const m of buildBrainMeshes()){
  const v=m.vertices;
  for(let i=0;i<v.length;i+=10){
   const y=CY+(v[i+1]-BRAIN_MID)*SCALE;
   if(y<.745) continue;                       // the brainstem below the skull is drawn as cord instead
   out.push(CX+v[i]*SCALE, y, CZ+v[i+2]*SCALE, v[i+3],v[i+4],v[i+5], v[i+6],v[i+7],v[i+8], 0, -1);
  }
 }
 return new Float32Array(out);
}

export function buildBodyParts():BodyPart[] {
 const n:number[]=[]; nerves(n);
 const b:number[]=[]; skeleton(b);
 return [
  {data:brainInSkull(), kind:"brain"},
  {data:new Float32Array(n), kind:"nerve"},
  {data:new Float32Array(b), kind:"bone"},
 ];
}

/* ---- renderer ------------------------------------------------------------ */
export type BodyView = { yaw:number; pitch:number; zoom:number; selected:number; bones:boolean; time:number; pulses:boolean };

const VERTEX=`
attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;attribute float aRegion;attribute float aPath;
uniform mat3 uRotation;uniform float uAspect;uniform float uDistance;
varying vec3 vNormal;varying vec3 vColor;varying float vRegion;varying float vPath;
void main(){
 vec3 p=uRotation*(aPosition-vec3(0.0,0.02,0.0));
 float w=uDistance-p.z;
 gl_Position=vec4(p.x*2.12/uAspect,p.y*2.12,1.01005*w-0.201005,w);
 vNormal=uRotation*aNormal;vColor=aColor;vRegion=aRegion;vPath=aPath;
}`;
const FRAGMENT=`
precision mediump float;
uniform float uSelected;uniform bool uPicking;uniform float uTime;uniform float uAlpha;uniform bool uPulses;
varying vec3 vNormal;varying vec3 vColor;varying float vRegion;varying float vPath;
void main(){
 if(uPicking){gl_FragColor=vec4((vRegion+1.0)/255.0,0.0,0.0,1.0);return;}
 vec3 n=normalize(vNormal); if(!gl_FrontFacing)n=-n;
 vec3 light=normalize(vec3(-0.35,0.75,1.1));
 float diffuse=abs(dot(n,light));
 float rim=pow(1.0-abs(n.z),3.0);
 bool chosen=abs(vRegion-uSelected)<0.5;
 vec3 color=vColor*(chosen?1.12:0.42);
 color*=0.34+0.66*diffuse;
 color+=vec3(0.10,0.16,0.16)*rim;
 if(uPulses&&vPath>=0.0){
  float rate=chosen?0.62:0.26;
  float s=fract(vPath*0.85-uTime*rate);
  float glow=exp(-pow(s/0.05,2.0))+exp(-pow((1.0-s)/0.05,2.0));
  color+=vColor*glow*(chosen?1.5:0.55)+vec3(0.28)*glow*(chosen?0.9:0.3);
 }
 gl_FragColor=vec4(color*uAlpha,uAlpha);
}`;

export function createBodyRenderer(canvas:HTMLCanvasElement) {
 const gl=canvas.getContext("webgl",{antialias:true,alpha:true,preserveDrawingBuffer:true});
 if(!gl) return null;
 function shader(type:number,src:string){
  const s=gl!.createShader(type)!;gl!.shaderSource(s,src);gl!.compileShader(s);
  if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS)){gl!.deleteShader(s);throw new Error("Body shader compilation failed");}
  return s;
 }
 const vs=shader(gl.VERTEX_SHADER,VERTEX),fs=shader(gl.FRAGMENT_SHADER,FRAGMENT),program=gl.createProgram()!;
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error("Body renderer link failed");
 const attributes=["aPosition","aNormal","aColor","aRegion","aPath"].map(n=>gl.getAttribLocation(program,n));
 const uniforms=Object.fromEntries(["uRotation","uAspect","uDistance","uSelected","uPicking","uTime","uAlpha","uPulses"].map(n=>[n,gl.getUniformLocation(program,n)]));
 const parts=buildBodyParts().map(p=>{
  const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,p.data,gl.STATIC_DRAW);
  return {kind:p.kind,buffer,count:p.data.length/11};
 });
 let last:BodyView={yaw:.42,pitch:.06,zoom:1,selected:1,bones:true,time:0,pulses:true};
 function bind(buffer:WebGLBuffer){
  gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer);
  [3,3,3,1,1].forEach((size,i)=>{gl!.enableVertexAttribArray(attributes[i]);gl!.vertexAttribPointer(attributes[i],size,gl!.FLOAT,false,44,[0,12,24,36,40][i]);});
 }
 function draw(view:BodyView,picking=false) {
  if(!gl||gl.isContextLost()) return;
  last=view;
  const ratio=Math.min(window.devicePixelRatio||1,2),width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.useProgram(program);
  const cy=Math.cos(view.yaw),sy=Math.sin(view.yaw),cp=Math.cos(view.pitch),sp=Math.sin(view.pitch);
  gl.uniformMatrix3fv(uniforms.uRotation,false,new Float32Array([cy,sp*sy,-cp*sy,0,cp,sp,sy,-sp*cy,cp*cy]));
  const aspect=Math.max(.1,width/height);
  gl.uniform1f(uniforms.uAspect,aspect);
  gl.uniform1f(uniforms.uDistance,2.42*Math.max(1,.42/aspect)/view.zoom);
  gl.uniform1f(uniforms.uSelected,view.selected);gl.uniform1i(uniforms.uPicking,Number(picking));
  gl.uniform1f(uniforms.uTime,view.time);gl.uniform1i(uniforms.uPulses,Number(view.pulses&&!picking));
  // nerves and brain first, opaque; then the skeleton as a translucent shell over them
  gl.uniform1f(uniforms.uAlpha,1);
  for(const p of parts){ if(p.kind==="bone")continue; bind(p.buffer); gl.drawArrays(gl.TRIANGLES,0,p.count); }
  if(view.bones){
   const bone=parts.find(p=>p.kind==="bone")!;
   if(picking){ bind(bone.buffer); gl.drawArrays(gl.TRIANGLES,0,bone.count); }
   else {
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    gl.uniform1f(uniforms.uAlpha,.46);
    bind(bone.buffer); gl.drawArrays(gl.TRIANGLES,0,bone.count);
    gl.depthMask(true);gl.disable(gl.BLEND);
   }
  }
 }
 function pick(clientX:number,clientY:number) {
  if(!gl||gl.isContextLost())return -1;
  const rect=canvas.getBoundingClientRect();
  const x=Math.floor((clientX-rect.left)/rect.width*canvas.width),y=Math.floor((rect.bottom-clientY)/rect.height*canvas.height);
  if(x<0||y<0||x>=canvas.width||y>=canvas.height)return -1;
  draw({...last,bones:false},true);
  const pixel=new Uint8Array(4);gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
  draw(last);
  return pixel[3]>0?pixel[0]-1:-1;
 }
 function dispose(){parts.forEach(p=>gl!.deleteBuffer(p.buffer));gl!.deleteProgram(program);gl!.deleteShader(vs);gl!.deleteShader(fs);}
 return {draw,pick,dispose};
}
