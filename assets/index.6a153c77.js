var e=Object.defineProperty,r=Object.prototype.hasOwnProperty,o=Object.getOwnPropertySymbols,t=Object.prototype.propertyIsEnumerable,n=(r,o,t)=>o in r?e(r,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[o]=t,a=(e,a)=>{for(var s in a||(a={}))r.call(a,s)&&n(e,s,a[s]);if(o)for(var s of o(a))t.call(a,s)&&n(e,s,a[s]);return e};import{l as s,t as c,p as i,G as l,h as p,a as d,b as u,c as f,e as m,n as v,d as y,s as b,f as g,g as h,i as w,j as x,k as $,m as A,o as I,q as S,r as F,_ as C,u as _,v as O}from"./vendor.efb7b843.js";!function(e=".",r="__import__"){try{self[r]=new Function("u","return import(u)")}catch(o){const t=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[r]=e=>new Promise(((o,a)=>{const s=new URL(e,t);if(self[r].moduleMap[s])return o(self[r].moduleMap[s]);const c=new Blob([`import * as m from '${s}';`,`${r}.moduleMap['${s}']=m;`],{type:"text/javascript"}),i=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(c),onerror(){a(new Error(`Failed to import: ${e}`)),n(i)},onload(){o(self[r].moduleMap[s]),n(i)}});document.head.appendChild(i)})),self[r].moduleMap={}}}("/shaders/assets/");const q=s.stream.bind({});Object.assign(q,a(a({},s),{of:q}));function j(e,r){const o=q.of();return e.addEventListener(r,o),o}const E=/^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i,M=e=>"string"==typeof e&&E.test(e);class P{constructor(){return new Proxy({},{get(e,r){var o,t;return"$"===r?e:null!=(t=null==(o=e[r])?void 0:o.call(e))?t:void 0},set(e,r,o){const t=e[r];return t?t(o):e[r]=q(o),!0}})}}class U extends l{constructor(e=new P){super(),this.store=e}auto(e,r,...o){const t=this.store.$;if(t[r])return t[r];this.store[r]=e;const n=t[r];return n.controller=M(e)?this.addColor(this.store,r):this.add(this.store,r,...o),n}addFolder(e){const r=super.addFolder(e);return Object.setPrototypeOf(r,U.prototype),r.store=new P,r}}function z(e,...r){const o=r.map(k),t=p,n=d,a=e.reduce(((e,r,n)=>{const a=o[n-1];return`${e}${t(a)}${r}`}));return[...o.map(n),{frag:a}].reduce(N)}function k(e){if("number"==typeof e)return[e.toString(),{}];if("string"==typeof e)return[e,{}];if("object"==typeof e&&!Array.isArray(e))return["",e];if(Array.isArray(e)&&2===e.length)return e;throw new Error("invalid glsl template parameter")}function N(e,r){return Object.entries(r).reduce(((e,[r,o])=>{var t;return e[r]="string"==typeof o?(null!=(t=e[r])?t:"")+"\n"+o:a(a({},e[r]),o),e}),a({},e))}function R(e,r=T(),o){const t="controller"in e?e.controller.property:W(r)?T():r;const n=M(e())?()=>function(e){const r=e.match(E);if(null===r)throw new Error("cannot read color");return[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]}(e()):()=>e();return[t,{frag:`uniform ${null!=o?o:W(r)?r:Y(n())} ${t};`,uniforms:{[t]:n}}]}let L=1;const T=()=>"u_"+L++,D=["float","int","bool","vec2","vec3","vec4"],W=e=>D.includes(e);const Y=e=>{if("number"==typeof e)return"float";if(function(e){return"boolean"==typeof e}(e))return"bool";if(function(e){return Array.isArray(e)&&2===e.length}(e))return"vec2";if(function(e){return Array.isArray(e)&&3===e.length}(e))return"vec3";if(function(e){return Array.isArray(e)&&4===e.length}(e))return"vec4";throw new Error("could not infer uniform type")},B=z`
${{primitive:"triangle strip",count:4,attributes:{position:[[-1,-1],[1,-1],[-1,1],[1,1]]},vert:"\nattribute vec2 position;\nvoid main() {\n  gl_Position = vec4(position, 0, 1);\n}\n",uniforms:{viewport:({viewportWidth:e,viewportHeight:r})=>[e,r]}}}

precision mediump float;

uniform vec2 viewport;

vec2 coord(vec2 p) {
  return 2. * (p - 0.5 * viewport) / min(viewport.x, viewport.y);
}

vec2 st() {
  return coord(gl_FragCoord.xy);
}

float aastep(float edge, float x) {
  vec2 screen = 1./viewport * 2.;
  float e = max(screen.x, screen.y);
  return smoothstep(edge - e, edge + e, x);
}
`,G=z`
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
`;function K(e){let r;return q.combine(((e,o)=>{void 0!==r?(o(e()-r),r=e()):r=e()}),[e])}const H=q.merge(q(document.hasFocus()),q.merge(j(window,"focus"),j(window,"blur")).map(f("type")).map(m("focus"))),X=new U;X.domElement.parentElement.style.zIndex=Number.MAX_SAFE_INTEGER.toString();const J=function(e){const r=q.combine(((e,r)=>{if(!e())return function(){const e=q(),r=q(),o=q.merge(q.of(0),q.immediate(q.combine((r=>(e(requestAnimationFrame(r)),r())),[r])));return q.on((()=>cancelAnimationFrame(e())),o.end),o}().pipe(K);r()&&r().end(!0)}),[e]),o=(t=r,q.combine(((e,r)=>{e().map(r)}),[t]));var t;return q.scan(u,0,o)}(H.map(v).map(((...e)=>c(i(console.log,e)))("pause"))),Q=K(J).map((e=>e/1e3)),V=(Z=document,q.scan(((e,r)=>(e[r.key]="keydown"===r.type,e)),{},q.merge(j(Z,"keydown"),j(Z,"keyup"))));var Z;const ee=e=>e<-1?e+2:e>1?e-2:e,re=({frag:e})=>`\n  for (float x = -2.; x <= 2.; x += 2.) {\n    for (float y = -2.; y <= 2.; y += 2.) {\n      vec2 pScreenWrap = vec2(x, y);\n      ${e}\n    }\n  }\n`,oe=e=>r=>(...o)=>r(e(),...o),te=oe(g),ne=h,ae=te(y),se=te(b),ce=te(w),ie=te(x),le=$,pe=e=>r=>r.map(e),de=oe(I)(A);S(Array);const ue=X.addFolder("asteroid"),fe=(e=1)=>C.pipe(Math.random()*Math.PI*2,(e=>ne(Math.sin(e),Math.cos(e))),(r=>se(r,e))),me=e=>n=>{var{p:s}=n,c=((e,n)=>{var a={};for(var s in e)r.call(e,s)&&n.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&o)for(var s of o(e))n.indexOf(s)<0&&t.call(e,s)&&(a[s]=e[s]);return a})(n,["p"]);return a(a({},c),{p:C.pipe(s,(r=>ae(r,se(c.v,e))),pe(ee))})},ve=F(0,10),ye=q.scan(((e,r)=>e.map(me(r))),ve.map((()=>({p:fe(.25*Math.random()+.75),v:fe(.25*Math.random()),size:Math.random()}))),Q),be=z`
  ${{uniforms:ve.reduce(((e,r,o)=>{for(const t of Object.keys(ye()[o]))e[`asteroids[${o}].${t}`]=()=>ye()[o][t];return e}),{})}}
  
  struct Asteroid { vec2 p; vec2 v; float size; };
  uniform Asteroid asteroids[${10}];

  float sdAsteroid(vec2 p, Asteroid a) {
    float d = sdCircle(p - a.p, a.size * ${R(ue.auto(.1,"sizeScale",.1,.5))} +
      ${R(ue.auto(.2,"sizeBase",.01,.2))});
    return d;
  }

  float sdAsteroids(vec2 p) {
    float d = INFINITY;
    for (int i = 0; i <= ${10}; i+= 1) {
      d = opSmoothUnion(d, sdAsteroid(p, asteroids[i]), ${R(ue.auto(.1,"u_asteroidK",0,.25))});
    }
    return d;
  }

  float sdSpaceAsteroids(vec2 p) {
    float d = INFINITY;
    ${re(z`
      d = opSmoothUnion(d, sdAsteroids(p - pScreenWrap), u_asteroidK);
    `)}
    return d;
  }

  vec4 asteroidsColor(vec2 p) {
    float d = sdSpaceAsteroids(p);
    d = -d;
    d = d * ${R(ue.auto(30,"bandEffectScaleUp",1,50))};
    d = floor(d) + 1.;
    d = d / ${R(ue.auto(3,"bandEffectScaleDown",1,10))};
    d = normalized(d);

    float stepD = step(sdSpaceAsteroids(p), 0.);
    float alpha = mix(d, stepD, ${R(ue.auto(0,"bandOrStep",0,1))});
    
    return vec4(${R(ue.auto("#d79552","asteroidColor"))}, alpha);
  }
`,ge=X.addFolder("player"),he=V.map((({a:e,d:r,w:o,s:t})=>[r?1:e?-1:0,o?1:0])),we=q.scan(((e,r)=>{const[o]=he();return e-o*ge.auto(1.5,"rotate",.1,2)()*Math.PI*r}),0,q.combine((e=>0!==he()[0]?e():void 0),[Q])),xe=[0,-1],$e=we.map(_(de,(e=>ie(xe,e)))),Ae=Q.map((e=>$e().map((r=>r*(he()[1]*ge.auto(.05,"acceleration",.025,.1)()*e))))),Ie=ge.auto(.02,"maxSpeed",.005,.05).map((e=>r=>le(r)>e?se(ce(r),e):r)),Se=q.scan(_(ae,(e=>Ie()(e))),[0,0],Ae),Fe=z`
  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float sdPlayer(vec2 p) {
    vec2 pos = ${R(q.scan(_(ae,pe(ee)),[0,0],Se))};
    vec2 center = vec2(0, 0.06);
    vec2 player = p - center - pos;
    player = rotate2d(${R(we)}) * player;
    player += center + pos;
    float d = sdTriangleIsosceles(player - pos, vec2(0.035, 0.085)) - 0.015;

    return d;
  }

  float sdSpacePlayer(vec2 p) {
    float d = INFINITY;
    ${re(z`
      d = opUnion(d, sdPlayer(p - pScreenWrap));
    `)}
    return d;
  }

  vec4 playerColor(vec2 p) {
    float d = aastep(sdSpacePlayer(p), 0.);
    return vec4(vec3(1), d);
  }
`,Ce=O()(z`
${B}
${G}
${Fe}
${be}

void main() {
  vec2 p = st();
  vec3 color = vec3(0.);
  
  vec4 aColor = asteroidsColor(p);
  color = mix(color, aColor.xyz, aColor.w);
  vec4 pColor = playerColor(p);
  color = mix(color, pColor.xyz, pColor.w);

  // Draw grey borders outside of the inscribed square
  color = mix(vec3(0.1), color, 
    min(
      step(abs(st().x), 1.),
      step(abs(st().y), 1.)
    )
  );

  gl_FragColor = vec4(color, 1.);
}
`);q.on((()=>Ce()),J);
