var e=Object.defineProperty,r=Object.prototype.hasOwnProperty,o=Object.getOwnPropertySymbols,t=Object.prototype.propertyIsEnumerable,n=(r,o,t)=>o in r?e(r,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[o]=t,a=(e,a)=>{for(var s in a||(a={}))r.call(a,s)&&n(e,s,a[s]);if(o)for(var s of o(a))t.call(a,s)&&n(e,s,a[s]);return e};import{l as s,t as i,p as c,a as l,b as d,e as p,G as u,n as f,h as m,c as v,d as y,s as h,f as b,g,i as w,j as x,k as $,m as A,o as I,q as S,r as F,u as _,_ as C,v as O,w as j}from"./vendor.89899b44.js";!function(e=".",r="__import__"){try{self[r]=new Function("u","return import(u)")}catch(o){const t=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[r]=e=>new Promise(((o,a)=>{const s=new URL(e,t);if(self[r].moduleMap[s])return o(self[r].moduleMap[s]);const i=new Blob([`import * as m from '${s}';`,`${r}.moduleMap['${s}']=m;`],{type:"text/javascript"}),c=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(i),onerror(){a(new Error(`Failed to import: ${e}`)),n(c)},onload(){o(self[r].moduleMap[s]),n(c)}});document.head.appendChild(c)})),self[r].moduleMap={}}}("/shaders/assets/");const M=s.stream.bind({});Object.assign(M,a(a({},s),{of:M}));function q(e,r){const o=M.of();return e.addEventListener(r,o),o}function z(e){let r;return M.combine(((e,o)=>{void 0!==r?(o(e()-r),r=e()):r=e()}),[e])}const E=M.merge(M(document.hasFocus()),M.merge(q(window,"focus"),q(window,"blur")).map(d("type")).map(p("focus"))),P=/^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i,U=e=>"string"==typeof e&&P.test(e);class k{constructor(){return new Proxy({},{get(e,r){var o,t;return"$"===r?e:null!=(t=null==(o=e[r])?void 0:o.call(e))?t:void 0},set(e,r,o){const t=e[r];return t?t(o):e[r]=M(o),!0}})}}class N extends u{constructor(e=new k){super(),this.store=e}auto(e,r,...o){const t=this.store.$;if(t[r])return t[r];this.store[r]=e;const n=t[r];return n.controller=U(e)?this.addColor(this.store,r):this.add(this.store,r,...o),n}addFolder(e){const r=super.addFolder(e);return Object.setPrototypeOf(r,N.prototype),r.store=new k,r}}const T=(e,r=!0)=>{e.__li.style.display=r?"":"none"},R=new N;R.domElement.parentElement.style.zIndex=Number.MAX_SAFE_INTEGER.toString();const L=function(e){const r=M.combine(((e,r)=>{if(!e())return function(){const e=M(),r=M(),o=M.merge(M.of(0),M.immediate(M.combine((r=>(e(requestAnimationFrame(r)),r())),[r])));return M.on((()=>cancelAnimationFrame(e())),o.end),o}().pipe(z);r()&&r().end(!0)}),[e]),o=(t=r,M.combine(((e,r)=>{e().map(r)}),[t]));var t;return M.scan(l,0,o)}(E.map(f).map(((...e)=>i(c(console.log,e)))("pause"))),D=z(L).map((e=>e/1e3)),W=(Y=document,M.scan(((e,r)=>(e[r.key]="keydown"===r.type,e)),{},M.merge(q(Y,"keydown"),q(Y,"keyup"))));var Y;const B=e=>e<-1?e+2:e>1?e-2:e,G=({frag:e})=>`\n  for (float x = -2.; x <= 2.; x += 2.) {\n    for (float y = -2.; y <= 2.; y += 2.) {\n      vec2 pScreenWrap = vec2(x, y);\n      ${e}\n    }\n  }\n`;function H(e,...r){const o=r.map(K),t=m,n=v,a=e.reduce(((e,r,n)=>{const a=o[n-1];return`${e}${t(a)}${r}`}));return[...o.map(n),{frag:a}].reduce(X)}function K(e){if("number"==typeof e)return[e.toString(),{}];if("string"==typeof e)return[e,{}];if("object"==typeof e&&!Array.isArray(e))return["",e];if(Array.isArray(e)&&2===e.length)return e;throw new Error("invalid glsl template parameter")}function X(e,r){return Object.entries(r).reduce(((e,[r,o])=>{var t;return e[r]="string"==typeof o?((null!=(t=e[r])?t:"")+"\n"+o).trim():"object"==typeof o&&null!==o?a(a({},e[r]),o):o,e}),a({},e))}function J(e,r=V(),o){const t="controller"in e?e.controller.property:ee(r)?V():r;const n=U(e())?()=>function(e){const r=e.match(P);if(null===r)throw new Error("cannot read color");return[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]}(e()):()=>e();return[t,{frag:`uniform ${null!=o?o:ee(r)?r:re(n())} ${t};`,uniforms:{[t]:n}}]}let Q=1;const V=()=>"u_"+Q++,Z=["float","int","bool","vec2","vec3","vec4"],ee=e=>Z.includes(e);const re=e=>{if("number"==typeof e)return"float";if(function(e){return"boolean"==typeof e}(e))return"bool";if(function(e){return Array.isArray(e)&&2===e.length}(e))return"vec2";if(function(e){return Array.isArray(e)&&3===e.length}(e))return"vec3";if(function(e){return Array.isArray(e)&&4===e.length}(e))return"vec4";throw new Error("could not infer uniform type")},oe=H`
${{depth:{enable:!1},primitive:"triangle strip",count:4,attributes:{position:[[-1,-1],[1,-1],[-1,1],[1,1]]},vert:"\nprecision highp float;\nattribute vec2 position;\nvarying vec2 uv;\nvoid main() {\n  uv = 0.5 * (position + 1.0);\n  gl_Position = vec4(position, 0, 1);\n}\n",uniforms:{viewport:({viewportWidth:e,viewportHeight:r})=>[e,r]},scissor:{enable:!0,box:({viewportWidth:e,viewportHeight:r})=>{const o=Math.min(e,r),t=Math.max(e,r)-o;return a(a({},e>r?{x:t/2,y:0}:{x:0,y:t/2}),{width:o,height:o})}}}}

precision highp float;

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
`,te=H`
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
`,ne=e=>r=>(...o)=>r(e(),...o),ae=ne(g),se=ae(y),ie=ae(h),ce=ae(w),le=ae(x),de=$,pe=e=>r=>r.map(e),ue=ne(I)(A);S(Array);const fe=R.addFolder("player"),me=W.map((({a:e,d:r,w:o,s:t})=>[r?1:e?-1:0,o?1:0])),ve=M.scan(((e,r)=>{const[o]=me();return e-o*fe.auto(1.5,"rotate",.1,2)()*Math.PI*r}),0,M.combine((e=>0!==me()[0]?e():void 0),[D])),ye=[0,-1],he=ve.map(F(ue,(e=>le(ye,e)))),be=D.map((e=>he().map((r=>r*(me()[1]*fe.auto(.05,"acceleration",.025,.1)()*e))))),ge=fe.auto(.02,"maxSpeed",.005,.05).map((e=>r=>de(r)>e?ie(ce(r),e):r)),we=M.scan(F(se,(e=>ge()(e))),[0,0],be),xe=H`
  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float sdPlayer(vec2 p) {
    vec2 pos = ${J(M.scan(F(se,pe(B)),[0,0],we))};
    vec2 center = vec2(0, 0.05);
    vec2 size = vec2(0.035, 0.085);
    float roundedness = 0.015;
    vec2 player = p - pos;
    player = rotate2d(${J(ve)}) * player;
    player += center + pos;
    float d = sdTriangleIsosceles(player - pos, size) - roundedness;

    return d;
  }

  float sdSpacePlayer(vec2 p) {
    float d = INFINITY;
    ${G(H`
      d = opUnion(d, sdPlayer(p - pScreenWrap));
    `)}
    return d;
  }

  vec4 playerColor(vec2 p) {
    float d = aastep(sdSpacePlayer(p), 0.);
    return vec4(vec3(1), d);
  }
`,$e=R.addFolder("asteroid"),Ae=(e=1)=>C.pipe(Math.random()*Math.PI*2,(e=>((e,r=e)=>b(e,r))(Math.sin(e),Math.cos(e))),(r=>ie(r,e))),Ie=e=>n=>{var{p:s}=n,i=((e,n)=>{var a={};for(var s in e)r.call(e,s)&&n.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&o)for(var s of o(e))n.indexOf(s)<0&&t.call(e,s)&&(a[s]=e[s]);return a})(n,["p"]);return a(a({},i),{p:C.pipe(s,(r=>se(r,ie(i.v,e))),pe(B))})},Se=_(0,10),Fe=M.scan(((e,r)=>e.map(Ie(r))),Se.map((()=>({p:Ae(.25*Math.random()+.75),v:Ae(.25*Math.random()),size:Math.random()}))),D),_e=H`
  ${{uniforms:Se.reduce(((e,r,o)=>{for(const t of Object.keys(Fe()[o]))e[`asteroids[${o}].${t}`]=()=>Fe()[o][t];return e}),{})}}
  
  struct Asteroid { vec2 p; vec2 v; float size; };
  uniform Asteroid asteroids[${10}];

  float sdAsteroid(vec2 p, Asteroid a) {
    float d = sdCircle(p - a.p, a.size * ${J($e.auto(.1,"sizeScale",.1,.5))} +
      ${J($e.auto(.2,"sizeBase",.01,.2))});
    return d;
  }

  float sdAsteroids(vec2 p) {
    float d = INFINITY;
    for (int i = 0; i <= ${10}; i+= 1) {
      d = opSmoothUnion(d, sdAsteroid(p, asteroids[i]), ${J($e.auto(.1,"u_asteroidK",0,.25))});
    }
    return d;
  }

  float sdSpaceAsteroids(vec2 p) {
    float d = INFINITY;
    ${G(H`
      d = opSmoothUnion(d, sdAsteroids(p - pScreenWrap), u_asteroidK);
    `)}
    return d;
  }

  vec4 asteroidsColor(vec2 p) {
    float d = sdSpaceAsteroids(p);
    d = -d;
    d = d * ${J($e.auto(30,"bandEffectScaleUp",1,50))};
    d = floor(d) + 1.;
    d = d / ${J($e.auto(3,"bandEffectScaleDown",1,10))};
    d = normalized(d);

    float stepD = step(sdSpaceAsteroids(p), 0.);
    float alpha = mix(d, stepD, ${J($e.auto(0,"bandOrStep",0,1))});
    
    return vec4(${J($e.auto("#d79552","asteroidColor"))}, alpha);
  }
`,Ce=H`
${oe}
${te}
${xe}
${_e}

void main() {
  vec2 p = st();
  vec3 color = vec3(0.);
  
  vec4 aColor = asteroidsColor(p);
  color = mix(color, aColor.xyz, aColor.w);
  vec4 pColor = playerColor(p);
  color = mix(color, pColor.xyz, pColor.w);

  gl_FragColor = vec4(color, 1.);
}
`,Oe=(e,r,o="nearest")=>t=>{const n=t.texture({min:"linear",mag:o,radius:r,wrap:"repeat"}),s=t.framebuffer({depth:!1,color:n}),i=t(a({framebuffer:s},e)),c=t(H`
    ${oe}
    ${{uniforms:{source:s}}}
    uniform sampler2D source;
    void main() {
      gl_FragColor = vec4(texture2D(source, st() / 2. + 0.5).xyz, 1.);
    }
  `);return{renderToTexture:i,renderToScreen:c,texture:s,render:()=>{i(),c()}}},je=O(),Me=new j;Me.showPanel(0),document.body.appendChild(Me.dom);const qe=((e,r,o)=>{const t=r.addFolder("render scale"),n=t.auto("nearest","mode",["none","linear","nearest"]),a=t.auto(8,"textureSize",3,11,1);return M.combine(((r,t)=>{const n=r();return"none"===n?(console.dir(a.controller),T(a.controller,!1),e(o)):(T(a.controller,!0),Oe(o,2**t(),n)(e).render)}),[n,a])})(je,R,Ce);M.on((()=>{je.poll(),qe()(),Me.update()}),L);
