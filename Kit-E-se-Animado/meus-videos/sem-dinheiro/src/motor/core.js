import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
export const W = 1080, H = 1920;
export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
export const easeIn = (u) => Math.pow(clamp(u), 3);
export const easeIO = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
/** Interpola chaves [[t,valor]...] com suavização. */
export function keys(k, t) { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const u = easeIO((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); const a = k[i - 1][1], b = k[i][1]; return Array.isArray(a) ? a.map((v, j) => lerp(v, b[j], u)) : lerp(a, b, u); } return k[k.length - 1][1]; }

const DofShader = {
  uniforms: { tColor: { value: null }, tDepth: { value: null }, near: { value: .1 }, far: { value: 400 }, focus: { value: 6 }, range: { value: 3 }, maxBlur: { value: 22 }, res: { value: new THREE.Vector2(W, H) } },
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader: `varying vec2 vUv;uniform sampler2D tColor,tDepth;uniform float near,far,focus,range,maxBlur;uniform vec2 res;
  float lin(float z){float n=z*2.-1.;return 2.*near*far/(far+near-n*(far-near));}
  float coc(vec2 uv){float d=lin(texture2D(tDepth,uv).r);return clamp((d-focus)/(d<focus?range*.6:range),-1.,1.);}
  float hash(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453);}
  void main(){float c0=coc(vUv);float r0=abs(c0)*maxBlur;vec3 sum=texture2D(tColor,vUv).rgb;float w=1.;float rot=hash(vUv*res)*6.283;
    const float G=2.39996;for(int i=1;i<72;i++){float fi=float(i);float r=sqrt(fi/72.)*maxBlur;float an=fi*G+rot;vec2 uv=vUv+vec2(cos(an),sin(an))*r/res;float c=coc(uv);float rs=abs(c)*maxBlur;
      float k=c<c0?smoothstep(r-1.5,r+1.5,rs):smoothstep(r-1.5,r+1.5,r0);sum+=texture2D(tColor,uv).rgb*k;w+=k;}
    gl_FragColor=vec4(sum/w,1.);}`
};
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, vig: { value: .42 }, exposure: { value: 1 }, grain: { value: .016 }, frame: { value: 0 }, tint: { value: new THREE.Color(1, 1, 1) }, sat: { value: 1 }, flash: { value: 0 } },
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader: `varying vec2 vUv;uniform sampler2D tDiffuse;uniform float vig,exposure,grain,frame,sat,flash;uniform vec3 tint;
  vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
  float rnd(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+frame)*43758.5453);}
  void main(){vec3 c=texture2D(tDiffuse,vUv).rgb*exposure*tint;c=aces(c*.88);
    float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,sat);
    vec2 q=(vUv-.5)*vec2(.86,1.);float v=smoothstep(.32,.86,length(q));c*=1.-vig*v;
    c=pow(c,vec3(1./2.2));c+=(rnd(vUv*vec2(1080.,1920.))-.5)*grain;c=mix(c,vec3(1.),flash);gl_FragColor=vec4(c,1.);}`
};
export class Stage {
  constructor(canvas) {
    const r = this.r = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    r.setPixelRatio(1); r.setSize(W, H, false); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; r.toneMapping = THREE.NoToneMapping; r.outputColorSpace = THREE.LinearSRGBColorSpace;
    const dt = new THREE.DepthTexture(W, H); dt.type = THREE.UnsignedIntType;
    this.rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4, depthTexture: dt });
    this.composer = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType }));
    this.dof = new ShaderPass(DofShader, 'tDummy');
    this.dof.uniforms.tColor.value = this.rt.texture; this.dof.uniforms.tDepth.value = dt;
    this.bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), .45, .75, .82);
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.dof); this.composer.addPass(this.bloom); this.composer.addPass(this.grade);
    this.shots = [];
  }
  add(shot) { this.shots.push(shot); }
  render(t) {
    let s = this.shots.find(x => t >= x.t0 && t < x.t1) || this.shots[this.shots.length - 1];
    s.update(t, t - s.t0, this); const st = s.update(t, t - s.t0, this) || {};
    const u = this.dof.uniforms, g = this.grade.uniforms;
    u.near.value = s.camera.near; u.far.value = s.camera.far;
    u.focus.value = st.focus ?? 6; u.range.value = st.range ?? 3; u.maxBlur.value = st.blur ?? 20;
    this.bloom.strength = st.bloom ?? .45; this.bloom.threshold = st.bloomT ?? .82; this.bloom.radius = st.bloomR ?? .75;
    g.vig.value = st.vig ?? .42; g.exposure.value = st.exposure ?? 1; g.sat.value = st.sat ?? 1; g.flash.value = st.flash ?? 0; g.frame.value = Math.floor(t * 30) % 97;
    g.tint.value.set(st.tint ?? '#ffffff');
    this.r.setRenderTarget(this.rt); this.r.clear(); this.r.render(s.scene, s.camera); this.r.setRenderTarget(null);
    this.composer.render();
  }
}
export function makeShot(t0, t1, bg, fov = 40) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(bg);
  const camera = new THREE.PerspectiveCamera(fov, W / H, .08, 400);
  return { t0, t1, scene, camera, update() { return {}; } };
}
export function aim(cam, p, q, roll = 0) { cam.position.set(p[0], p[1], p[2]); cam.up.set(Math.sin(roll), Math.cos(roll), 0); cam.lookAt(q[0], q[1], q[2]); }
