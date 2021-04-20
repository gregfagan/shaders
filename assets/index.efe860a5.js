var e=Object.defineProperty,t=Object.prototype.hasOwnProperty,r=Object.getOwnPropertySymbols,o=Object.prototype.propertyIsEnumerable,n=(t,r,o)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[r]=o,a=(e,a)=>{for(var s in a||(a={}))t.call(a,s)&&n(e,s,a[s]);if(r)for(var s of r(a))o.call(a,s)&&n(e,s,a[s]);return e};import{l as s,t as i,p as c,a as l,b as p,e as d,G as u,n as f,h as m,c as v,d as y,s as h,f as g,g as b,i as w,j as x,k as $,m as A,o as I,q as S,r as C,u as F,_,v as M,w as O}from"./vendor.89899b44.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(r){const o=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((r,a)=>{const s=new URL(e,o);if(self[t].moduleMap[s])return r(self[t].moduleMap[s]);const i=new Blob([`import * as m from '${s}';`,`${t}.moduleMap['${s}']=m;`],{type:"text/javascript"}),c=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(i),onerror(){a(new Error(`Failed to import: ${e}`)),n(c)},onload(){r(self[t].moduleMap[s]),n(c)}});document.head.appendChild(c)})),self[t].moduleMap={}}}("/shaders/assets/");const P=s.stream.bind({});Object.assign(P,a(a({},s),{of:P}));function j(e,t){const r=P.of();return e.addEventListener(t,r),r}function q(e){let t;return P.combine(((e,r)=>{void 0!==t?(r(e()-t),t=e()):t=e()}),[e])}const z=P.merge(P(document.hasFocus()),P.merge(j(window,"focus"),j(window,"blur")).map(p("type")).map(d("focus"))),E=e=>e instanceof Element,U=/^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i,R=e=>"string"==typeof e&&U.test(e);class k{constructor(){return new Proxy({},{get(e,t){var r,o;return"$"===t?e:null!=(o=null==(r=e[t])?void 0:r.call(e))?o:void 0},set(e,t,r){const o=e[t];return o?o(r):e[t]=P(r),!0}})}}class N extends u{constructor(e=new k){super(),this.store=e}auto(e,t,...r){const o=this.store.$;if(o[t])return o[t];this.store[t]=e;const n=o[t];return n.controller=R(e)?this.addColor(this.store,t):this.add(this.store,t,...r),n}addFolder(e){const t=super.addFolder(e);return Object.setPrototypeOf(t,N.prototype),t.store=new k,t}}const T=(e,t=!0)=>{e.__li.style.display=t?"":"none"},D=new N;D.domElement.parentElement.style.zIndex=Number.MAX_SAFE_INTEGER.toString();const L=function(e){const t=P.combine(((e,t)=>{if(!e())return function(){const e=P(),t=P(),r=P.merge(P.of(0),P.immediate(P.combine((t=>(e(requestAnimationFrame(t)),t())),[t])));return P.on((()=>cancelAnimationFrame(e())),r.end),r}().pipe(q);t()&&t().end(!0)}),[e]),r=(o=t,P.combine(((e,t)=>{e().map(t)}),[o]));var o;return P.scan(l,0,r)}(z.map(f).map(((...e)=>i(c(console.log,e)))("pause"))),W=q(L).map((e=>e/1e3)),Y=(B=document,P.scan(((e,t)=>(t.preventDefault(),t.stopPropagation(),e[t.key]="keydown"===t.type,e)),{},P.merge(j(B,"keydown"),j(B,"keyup"))));var B;const G=e=>e<-1?e+2:e>1?e-2:e,H=({frag:e})=>`\n  for (float x = -2.; x <= 2.; x += 2.) {\n    for (float y = -2.; y <= 2.; y += 2.) {\n      vec2 pScreenWrap = vec2(x, y);\n      ${e}\n    }\n  }\n`;function K(e,...t){const r=t.map(X),o=m,n=v,a=e.reduce(((e,t,n)=>{const a=r[n-1];return`${e}${o(a)}${t}`}));return[...r.map(n),{frag:a}].reduce(J)}function X(e){if("number"==typeof e)return[e.toString(),{}];if("string"==typeof e)return[e,{}];if("object"==typeof e&&!Array.isArray(e))return["",e];if(Array.isArray(e)&&2===e.length)return e;throw new Error("invalid glsl template parameter")}function J(e,t){return Object.entries(t).reduce(((e,[t,r])=>{var o;return e[t]="string"==typeof r?((null!=(o=e[t])?o:"")+"\n"+r).trim():"object"==typeof r&&null!==r?a(a({},e[t]),r):r,e}),a({},e))}function Q(e,t=Z(),r){const o="controller"in e?e.controller.property:te(t)?Z():t;const n=R(e())?()=>function(e){const t=e.match(U);if(null===t)throw new Error("cannot read color");return[parseInt(t[1],16)/255,parseInt(t[2],16)/255,parseInt(t[3],16)/255]}(e()):()=>e();return[o,{frag:`uniform ${null!=r?r:te(t)?t:re(n())} ${o};`,uniforms:{[o]:n}}]}let V=1;const Z=()=>"u_"+V++,ee=["float","int","bool","vec2","vec3","vec4"],te=e=>ee.includes(e);const re=e=>{if("number"==typeof e)return"float";if(function(e){return"boolean"==typeof e}(e))return"bool";if(function(e){return Array.isArray(e)&&2===e.length}(e))return"vec2";if(function(e){return Array.isArray(e)&&3===e.length}(e))return"vec3";if(function(e){return Array.isArray(e)&&4===e.length}(e))return"vec4";throw new Error("could not infer uniform type")},oe=K`
${{depth:{enable:!1},primitive:"triangle strip",count:4,attributes:{position:[[-1,-1],[1,-1],[-1,1],[1,1]]},vert:"\nprecision highp float;\nattribute vec2 position;\nvarying vec2 uv;\nvoid main() {\n  uv = 0.5 * (position + 1.0);\n  gl_Position = vec4(position, 0, 1);\n}\n",uniforms:{viewport:({viewportWidth:e,viewportHeight:t})=>[e,t]},scissor:{enable:!0,box:({viewportWidth:e,viewportHeight:t})=>{const r=Math.min(e,t),o=Math.max(e,t)-r;return a(a({},e>t?{x:o/2,y:0}:{x:0,y:o/2}),{width:r,height:r})}}}}

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
`,ne=K`
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
`,ae=e=>t=>(...r)=>t(e(),...r),se=ae(b),ie=se(y),ce=se(h),le=se(w),pe=se(x),de=$,ue=e=>t=>t.map(e),fe=ae(I)(A);S(Array);const me=Y.map((({a:e,ArrowLeft:t,d:r,ArrowRight:o,w:n,ArrowUp:a})=>({left:e||t,right:r||o,thrust:n||a}))),ve=P.scan(((e,t)=>{const r=t.x>t.container.width/2?t.x-t.container.width:t.x,o=Math.abs(r),n=t.container.height-t.y,s=o<280&&n<280?r>0?o-n<0?"left":"right":"thrust":"none";return"none"!==s?a(a({},e),{[s]:"pointerdown"===t.type}):e}),{left:!1,right:!1,thrust:!1},(e=>P.merge(j(e,"pointerdown"),j(e,"pointerup")).map((e=>(e.preventDefault(),e.stopPropagation(),{id:e.pointerId,type:e.type,x:e.clientX,y:e.clientY,container:E(e.target)?e.target.getBoundingClientRect():new DOMRect}))))(document)),ye=P.merge(me,ve),he=D.addFolder("player"),ge=ye.map((({left:e,right:t,thrust:r})=>[t?1:e?-1:0,r?1:0])),be=P.scan(((e,t)=>{const[r]=ge();return e-r*he.auto(1.5,"rotate",.1,2)()*Math.PI*t}),Math.PI,P.combine((e=>0!==ge()[0]?e():void 0),[W])),we=[0,-1],xe=be.map(C(fe,(e=>pe(we,e)))),$e=W.map((e=>xe().map((t=>t*(ge()[1]*he.auto(.05,"acceleration",.025,.1)()*e))))),Ae=he.auto(.02,"maxSpeed",.005,.05).map((e=>t=>de(t)>e?ce(le(t),e):t)),Ie=P.scan(C(ie,(e=>Ae()(e))),[0,0],$e),Se=K`
  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float sdPlayer(vec2 p) {
    vec2 pos = ${Q(P.scan(C(ie,ue(G)),[0,0],Ie))};
    vec2 center = vec2(0, 0.05);
    vec2 size = vec2(0.035, 0.085);
    float roundedness = 0.015;
    vec2 player = p - pos;
    player = rotate2d(${Q(be)}) * player;
    player += center + pos;
    float d = sdTriangleIsosceles(player - pos, size) - roundedness;

    return d;
  }

  float sdSpacePlayer(vec2 p) {
    float d = INFINITY;
    ${H(K`
      d = opUnion(d, sdPlayer(p - pScreenWrap));
    `)}
    return d;
  }

  vec4 playerColor(vec2 p) {
    float d = aastep(sdSpacePlayer(p), 0.);
    return vec4(vec3(1), d);
  }
`,Ce=D.addFolder("asteroid"),Fe=(e=1)=>_.pipe(Math.random()*Math.PI*2,(e=>((e,t=e)=>g(e,t))(Math.sin(e),Math.cos(e))),(t=>ce(t,e))),_e=e=>n=>{var{p:s}=n,i=((e,n)=>{var a={};for(var s in e)t.call(e,s)&&n.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&r)for(var s of r(e))n.indexOf(s)<0&&o.call(e,s)&&(a[s]=e[s]);return a})(n,["p"]);return a(a({},i),{p:_.pipe(s,(t=>ie(t,ce(i.v,e))),ue(G))})},Me=F(0,10),Oe=P.scan(((e,t)=>e.map(_e(t))),Me.map((()=>({p:Fe(.25*Math.random()+.75),v:Fe(.25*Math.random()),size:Math.random()}))),W),Pe=K`
  ${{uniforms:Me.reduce(((e,t,r)=>{for(const o of Object.keys(Oe()[r]))e[`asteroids[${r}].${o}`]=()=>Oe()[r][o];return e}),{})}}
  
  struct Asteroid { vec2 p; vec2 v; float size; };
  uniform Asteroid asteroids[${10}];

  float sdAsteroid(vec2 p, Asteroid a) {
    float d = sdCircle(p - a.p, a.size * ${Q(Ce.auto(.1,"sizeScale",.1,.5))} +
      ${Q(Ce.auto(.2,"sizeBase",.01,.2))});
    return d;
  }

  float sdAsteroids(vec2 p) {
    float d = INFINITY;
    for (int i = 0; i <= ${10}; i+= 1) {
      d = opSmoothUnion(d, sdAsteroid(p, asteroids[i]), ${Q(Ce.auto(.1,"u_asteroidK",0,.25))});
    }
    return d;
  }

  float sdSpaceAsteroids(vec2 p) {
    float d = INFINITY;
    ${H(K`
      d = opSmoothUnion(d, sdAsteroids(p - pScreenWrap), u_asteroidK);
    `)}
    return d;
  }

  vec4 asteroidsColor(vec2 p) {
    float d = sdSpaceAsteroids(p);
    d = -d;
    d = d * ${Q(Ce.auto(30,"bandEffectScaleUp",1,50))};
    d = floor(d) + 1.;
    d = d / ${Q(Ce.auto(3,"bandEffectScaleDown",1,10))};
    d = normalized(d);

    float stepD = step(sdSpaceAsteroids(p), 0.);
    float alpha = mix(d, stepD, ${Q(Ce.auto(0,"bandOrStep",0,1))});
    
    return vec4(${Q(Ce.auto("#d79552","asteroidColor"))}, alpha);
  }
`,je=K`
${oe}
${ne}
${Se}
${Pe}

void main() {
  vec2 p = st();
  vec3 color = vec3(0.);
  
  vec4 aColor = asteroidsColor(p);
  color = mix(color, aColor.xyz, aColor.w);
  vec4 pColor = playerColor(p);
  color = mix(color, pColor.xyz, pColor.w);

  gl_FragColor = vec4(color, 1.);
}
`,qe=(e,t,r="nearest")=>o=>{const n=o.texture({min:"linear",mag:r,radius:t,wrap:"repeat"}),s=o.framebuffer({depth:!1,color:n}),i=o(a({framebuffer:s},e)),c=o(K`
    ${oe}
    ${{uniforms:{source:s}}}
    uniform sampler2D source;
    void main() {
      gl_FragColor = vec4(texture2D(source, st() / 2. + 0.5).xyz, 1.);
    }
  `);return{renderToTexture:i,renderToScreen:c,texture:s,render:()=>{i(),c()}}},ze=M(),Ee=new O;Ee.showPanel(0),document.body.appendChild(Ee.dom);const Ue=((e,t,r)=>{const o=t.addFolder("render scale"),n=o.auto("nearest","mode",["none","linear","nearest"]),a=o.auto(8,"textureSize",3,11,1);return P.combine(((t,o)=>{const n=t();return"none"===n?(console.dir(a.controller),T(a.controller,!1),e(r)):(T(a.controller,!0),qe(r,2**o(),n)(e).render)}),[n,a])})(ze,D,je);P.on((()=>{ze.poll(),Ue()(),Ee.update()}),L);
