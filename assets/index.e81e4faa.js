var e=Object.defineProperty,r=Object.prototype.hasOwnProperty,o=Object.getOwnPropertySymbols,t=Object.prototype.propertyIsEnumerable,n=(r,o,t)=>o in r?e(r,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[o]=t,a=(e,a)=>{for(var s in a||(a={}))r.call(a,s)&&n(e,s,a[s]);if(o)for(var s of o(a))t.call(a,s)&&n(e,s,a[s]);return e};import{l as s,t as i,p as c,a as l,b as p,e as d,G as u,n as f,h as m,c as v,d as y,s as h,f as b,g,i as w,j as x,k as $,m as A,o as I,q as C,r as F,u as S,_,v as O,w as j}from"./vendor.89899b44.js";!function(e=".",r="__import__"){try{self[r]=new Function("u","return import(u)")}catch(o){const t=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[r]=e=>new Promise(((o,a)=>{const s=new URL(e,t);if(self[r].moduleMap[s])return o(self[r].moduleMap[s]);const i=new Blob([`import * as m from '${s}';`,`${r}.moduleMap['${s}']=m;`],{type:"text/javascript"}),c=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(i),onerror(){a(new Error(`Failed to import: ${e}`)),n(c)},onload(){o(self[r].moduleMap[s]),n(c)}});document.head.appendChild(c)})),self[r].moduleMap={}}}("/shaders/assets/");const M=s.stream.bind({});Object.assign(M,a(a({},s),{of:M}));function q(e,r){const o=M.of();return e.addEventListener(r,o),o}function z(e){let r;return M.combine(((e,o)=>{void 0!==r?(o(e()-r),r=e()):r=e()}),[e])}const E=M.merge(M(document.hasFocus()),M.merge(q(window,"focus"),q(window,"blur")).map(p("type")).map(d("focus"))),P=/^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i,U=e=>"string"==typeof e&&P.test(e);class k{constructor(){return new Proxy({},{get(e,r){var o,t;return"$"===r?e:null!=(t=null==(o=e[r])?void 0:o.call(e))?t:void 0},set(e,r,o){const t=e[r];return t?t(o):e[r]=M(o),!0}})}}class N extends u{constructor(e=new k){super(),this.store=e}auto(e,r,...o){const t=this.store.$;if(t[r])return t[r];this.store[r]=e;const n=t[r];return n.controller=U(e)?this.addColor(this.store,r):this.add(this.store,r,...o),n}addFolder(e){const r=super.addFolder(e);return Object.setPrototypeOf(r,N.prototype),r.store=new k,r}}const R=new N;R.domElement.parentElement.style.zIndex=Number.MAX_SAFE_INTEGER.toString();const L=function(e){const r=M.combine(((e,r)=>{if(!e())return function(){const e=M(),r=M(),o=M.merge(M.of(0),M.immediate(M.combine((r=>(e(requestAnimationFrame(r)),r())),[r])));return M.on((()=>cancelAnimationFrame(e())),o.end),o}().pipe(z);r()&&r().end(!0)}),[e]),o=(t=r,M.combine(((e,r)=>{e().map(r)}),[t]));var t;return M.scan(l,0,o)}(E.map(f).map(((...e)=>i(c(console.log,e)))("pause"))),T=z(L).map((e=>e/1e3)),D=(W=document,M.scan(((e,r)=>(e[r.key]="keydown"===r.type,e)),{},M.merge(q(W,"keydown"),q(W,"keyup"))));var W;const Y=e=>e<-1?e+2:e>1?e-2:e,B=({frag:e})=>`\n  for (float x = -2.; x <= 2.; x += 2.) {\n    for (float y = -2.; y <= 2.; y += 2.) {\n      vec2 pScreenWrap = vec2(x, y);\n      ${e}\n    }\n  }\n`;function G(e,...r){const o=r.map(H),t=m,n=v,a=e.reduce(((e,r,n)=>{const a=o[n-1];return`${e}${t(a)}${r}`}));return[...o.map(n),{frag:a}].reduce(K)}function H(e){if("number"==typeof e)return[e.toString(),{}];if("string"==typeof e)return[e,{}];if("object"==typeof e&&!Array.isArray(e))return["",e];if(Array.isArray(e)&&2===e.length)return e;throw new Error("invalid glsl template parameter")}function K(e,r){return Object.entries(r).reduce(((e,[r,o])=>{var t;return e[r]="string"==typeof o?((null!=(t=e[r])?t:"")+"\n"+o).trim():"object"==typeof o&&null!==o?a(a({},e[r]),o):o,e}),a({},e))}function X(e,r=Q(),o){const t="controller"in e?e.controller.property:Z(r)?Q():r;const n=U(e())?()=>function(e){const r=e.match(P);if(null===r)throw new Error("cannot read color");return[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]}(e()):()=>e();return[t,{frag:`uniform ${null!=o?o:Z(r)?r:ee(n())} ${t};`,uniforms:{[t]:n}}]}let J=1;const Q=()=>"u_"+J++,V=["float","int","bool","vec2","vec3","vec4"],Z=e=>V.includes(e);const ee=e=>{if("number"==typeof e)return"float";if(function(e){return"boolean"==typeof e}(e))return"bool";if(function(e){return Array.isArray(e)&&2===e.length}(e))return"vec2";if(function(e){return Array.isArray(e)&&3===e.length}(e))return"vec3";if(function(e){return Array.isArray(e)&&4===e.length}(e))return"vec4";throw new Error("could not infer uniform type")},re=G`
${{depth:{enable:!1},primitive:"triangle strip",count:4,attributes:{position:[[-1,-1],[1,-1],[-1,1],[1,1]]},vert:"\nprecision mediump float;\nattribute vec2 position;\nvarying vec2 uv;\nvoid main() {\n  uv = 0.5 * (position + 1.0);\n  gl_Position = vec4(position, 0, 1);\n}\n",uniforms:{viewport:({viewportWidth:e,viewportHeight:r})=>[e,r]},scissor:{enable:!0,box:({viewportWidth:e,viewportHeight:r})=>{const o=Math.min(e,r),t=Math.max(e,r)-o;return a(a({},e>r?{x:t/2,y:0}:{x:0,y:t/2}),{width:o,height:o})}}}}

precision mediump float;

uniform vec2 viewport;
varying vec2 uv;

vec2 coord(vec2 p) {
  return 2. * (p - 0.5 * viewport) / min(viewport.x, viewport.y);
}

vec2 st() {
  return coord(gl_FragCoord.xy);
}

float aastep(float edge, float x) {
  float e = 1./max(viewport.x, viewport.y);
  return smoothstep(edge - e, edge + e, x);
}
`,oe=G`
#define INFINITY 3.4028237e37
#define normalized(x) clamp(x, 0., 1.)

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdRing(float d, float r) {
 return abs(d) - r;
}

float sdTriangleIsosceles( in vec2 p, in vec2 q ) {
    p.x = abs(p.x);
    vec2 a = p - q*clamp( dot(p,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = p - q*vec2( clamp( p.x/q.x, 0.0, 1.0 ), 1.0 );
    float s = -sign( q.y );
    vec2 d = min( vec2( dot(a,a), s*(p.x*q.y-p.y*q.x) ),
                  vec2( dot(b,b), s*(p.y-q.y)  ));
    return -sqrt(d.x)*sign(d.y);
}

float opUnion(float a, float b) {
  return min(a, b);
}

// https://www.iquilezles.org/www/articles/smin/smin.htm 
float opSmoothUnion(float a, float b, float k) {
  float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
  return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 sdColor(float d) {
  vec3 col = vec3(1.0) - sign(d)*vec3(0.1,0.4,0.7);
  col *= 1.0 - exp(-3.0*abs(d));
  col *= 0.8 + 0.2*cos(150.0*d);
  col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(d)) );
  return col;
}
`,te=e=>r=>(...o)=>r(e(),...o),ne=te(g),ae=ne(y),se=ne(h),ie=ne(w),ce=ne(x),le=$,pe=e=>r=>r.map(e),de=te(I)(A);C(Array);const ue=R.addFolder("player"),fe=D.map((({a:e,d:r,w:o,s:t})=>[r?1:e?-1:0,o?1:0])),me=M.scan(((e,r)=>{const[o]=fe();return e-o*ue.auto(1.5,"rotate",.1,2)()*Math.PI*r}),0,M.combine((e=>0!==fe()[0]?e():void 0),[T])),ve=[0,-1],ye=me.map(F(de,(e=>ce(ve,e)))),he=T.map((e=>ye().map((r=>r*(fe()[1]*ue.auto(.05,"acceleration",.025,.1)()*e))))),be=ue.auto(.02,"maxSpeed",.005,.05).map((e=>r=>le(r)>e?se(ie(r),e):r)),ge=M.scan(F(ae,(e=>be()(e))),[0,0],he),we=G`
  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float sdPlayer(vec2 p) {
    vec2 pos = ${X(M.scan(F(ae,pe(Y)),[0,0],ge))};
    vec2 center = vec2(0, 0.05);
    vec2 size = vec2(0.035, 0.085);
    float roundedness = 0.015;
    vec2 player = p - pos;
    player = rotate2d(${X(me)}) * player;
    player += center + pos;
    float d = sdTriangleIsosceles(player - pos, size) - roundedness;

    return d;
  }

  float sdSpacePlayer(vec2 p) {
    float d = INFINITY;
    ${B(G`
      d = opUnion(d, sdPlayer(p - pScreenWrap));
    `)}
    return d;
  }

  vec4 playerColor(vec2 p) {
    float d = aastep(sdSpacePlayer(p), 0.);
    return vec4(vec3(1), d);
  }
`,xe=R.addFolder("asteroid"),$e=(e=1)=>_.pipe(Math.random()*Math.PI*2,(e=>((e,r=e)=>b(e,r))(Math.sin(e),Math.cos(e))),(r=>se(r,e))),Ae=e=>n=>{var{p:s}=n,i=((e,n)=>{var a={};for(var s in e)r.call(e,s)&&n.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&o)for(var s of o(e))n.indexOf(s)<0&&t.call(e,s)&&(a[s]=e[s]);return a})(n,["p"]);return a(a({},i),{p:_.pipe(s,(r=>ae(r,se(i.v,e))),pe(Y))})},Ie=S(0,10),Ce=M.scan(((e,r)=>e.map(Ae(r))),Ie.map((()=>({p:$e(.25*Math.random()+.75),v:$e(.25*Math.random()),size:Math.random()}))),T),Fe=G`
  ${{uniforms:Ie.reduce(((e,r,o)=>{for(const t of Object.keys(Ce()[o]))e[`asteroids[${o}].${t}`]=()=>Ce()[o][t];return e}),{})}}
  
  struct Asteroid { vec2 p; vec2 v; float size; };
  uniform Asteroid asteroids[${10}];

  float sdAsteroid(vec2 p, Asteroid a) {
    float d = sdCircle(p - a.p, a.size * ${X(xe.auto(.1,"sizeScale",.1,.5))} +
      ${X(xe.auto(.2,"sizeBase",.01,.2))});
    return d;
  }

  float sdAsteroids(vec2 p) {
    float d = INFINITY;
    for (int i = 0; i <= ${10}; i+= 1) {
      d = opSmoothUnion(d, sdAsteroid(p, asteroids[i]), ${X(xe.auto(.1,"u_asteroidK",0,.25))});
    }
    return d;
  }

  float sdSpaceAsteroids(vec2 p) {
    float d = INFINITY;
    ${B(G`
      d = opSmoothUnion(d, sdAsteroids(p - pScreenWrap), u_asteroidK);
    `)}
    return d;
  }

  vec4 asteroidsColor(vec2 p) {
    float d = sdSpaceAsteroids(p);
    d = -d;
    d = d * ${X(xe.auto(30,"bandEffectScaleUp",1,50))};
    d = floor(d) + 1.;
    d = d / ${X(xe.auto(3,"bandEffectScaleDown",1,10))};
    d = normalized(d);

    float stepD = step(sdSpaceAsteroids(p), 0.);
    float alpha = mix(d, stepD, ${X(xe.auto(0,"bandOrStep",0,1))});
    
    return vec4(${X(xe.auto("#d79552","asteroidColor"))}, alpha);
  }
`,Se=G`
${re}
${oe}
${we}
${Fe}

void main() {
  vec2 p = st();
  vec3 color = vec3(0.);
  
  vec4 aColor = asteroidsColor(p);
  color = mix(color, aColor.xyz, aColor.w);
  vec4 pColor = playerColor(p);
  color = mix(color, pColor.xyz, pColor.w);

  gl_FragColor = vec4(color, 1.);
}
`,_e=O(),Oe=new j;Oe.showPanel(0),document.body.appendChild(Oe.dom);const je=(Me=Se,qe=256,e=>{const r=e.framebuffer({color:e.texture({min:"linear",mag:"nearest",width:qe,height:qe,wrap:"repeat"})}),o=e(a({framebuffer:r},Me)),t=e(G`
    ${re}
    ${{uniforms:{source:r}}}
    uniform sampler2D source;
    void main() {
      gl_FragColor = vec4(texture2D(source, st() / 2. + 0.5).xyz, 1.);
    }
  `);return()=>{o(),t()}})(_e);var Me,qe;M.on((()=>{_e.poll(),je(),Oe.update()}),L);
