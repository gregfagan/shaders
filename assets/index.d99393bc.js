var e=Object.defineProperty,r=Object.prototype.hasOwnProperty,o=Object.getOwnPropertySymbols,t=Object.prototype.propertyIsEnumerable,n=(r,o,t)=>o in r?e(r,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[o]=t,a=(e,a)=>{for(var s in a||(a={}))r.call(a,s)&&n(e,s,a[s]);if(o)for(var s of o(a))t.call(a,s)&&n(e,s,a[s]);return e};import{l as s,t as c,p as i,G as l,h as p,a as d,b as u,c as f,e as m,n as v,d as y,s as b,f as g,g as w,i as h,j as $,k as x,m as A,o as I,r as S,_ as F,q as C,u as _}from"./vendor.66c43eae.js";!function(e=".",r="__import__"){try{self[r]=new Function("u","return import(u)")}catch(o){const t=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[r]=e=>new Promise(((o,a)=>{const s=new URL(e,t);if(self[r].moduleMap[s])return o(self[r].moduleMap[s]);const c=new Blob([`import * as m from '${s}';`,`${r}.moduleMap['${s}']=m;`],{type:"text/javascript"}),i=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(c),onerror(){a(new Error(`Failed to import: ${e}`)),n(i)},onload(){o(self[r].moduleMap[s]),n(i)}});document.head.appendChild(i)})),self[r].moduleMap={}}}("/shaders/assets/");const O=s.stream.bind({});Object.assign(O,a(a({},s),{of:O}));function q(e,r){const o=O.of();return e.addEventListener(r,o),o}const j=/^#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i,E=e=>"string"==typeof e&&j.test(e);class P{constructor(){return new Proxy({},{get(e,r){var o,t;return"$"===r?e:null!=(t=null==(o=e[r])?void 0:o.call(e))?t:void 0},set(e,r,o){const t=e[r];return t?t(o):e[r]=O(o),!0}})}}class U extends l{constructor(e=new P){super(),this.store=e}auto(e,r,...o){const t=this.store.$;if(t[r])return t[r];this.store[r]=e;const n=t[r];return n.controller=E(e)?this.addColor(this.store,r):this.add(this.store,r,...o),n}addFolder(e){const r=super.addFolder(e);return Object.setPrototypeOf(r,U.prototype),r.store=new P,r}}function z(e,...r){const o=r.map(k),t=p,n=d,a=e.reduce(((e,r,n)=>{const a=o[n-1];return`${e}${t(a)}${r}`}));return[...o.map(n),{frag:a}].reduce(M)}function k(e){if("number"==typeof e)return[e.toString(),{}];if("string"==typeof e)return[e,{}];if("object"==typeof e&&!Array.isArray(e))return["",e];if(Array.isArray(e)&&2===e.length)return e;throw new Error("invalid glsl template parameter")}function M(e,r){return Object.entries(r).reduce(((e,[r,o])=>{var t;return e[r]="string"==typeof o?(null!=(t=e[r])?t:"")+"\n"+o:a(a({},e[r]),o),e}),a({},e))}function N(e,r=L(),o){const t="controller"in e?e.controller.property:D(r)?L():r;const n=E(e())?()=>function(e){const r=e.match(j);if(null===r)throw new Error("cannot read color");return[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]}(e()):()=>e();return[t,{frag:`uniform ${null!=o?o:D(r)?r:W(n())} ${t};`,uniforms:{[t]:n}}]}let R=1;const L=()=>"u_"+R++,T=["float","int","bool","vec2","vec3","vec4"],D=e=>T.includes(e);const W=e=>{if("number"==typeof e)return"float";if(function(e){return"boolean"==typeof e}(e))return"bool";if(function(e){return Array.isArray(e)&&2===e.length}(e))return"vec2";if(function(e){return Array.isArray(e)&&3===e.length}(e))return"vec3";if(function(e){return Array.isArray(e)&&4===e.length}(e))return"vec4";throw new Error("could not infer uniform type")},Y={primitive:"triangle strip",count:4,attributes:{position:[[-1,-1],[1,-1],[-1,1],[1,1]]},vert:"\n      attribute vec2 position;\n      void main() {\n        gl_Position = vec4(position, 0, 1);\n      }\n    ",uniforms:{viewport:({viewportWidth:e,viewportHeight:r})=>[e,r]},frag:"\nprecision mediump float;\n\nuniform vec2 viewport;\n\nvec2 coord(vec2 p) {\n  return 2. * (p - 0.5 * viewport) / min(viewport.x, viewport.y);\n}\n\nvec2 st() {\n  return coord(gl_FragCoord.xy);\n}"},B=z`
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
`;function G(e){let r;return O.combine(((e,o)=>{void 0!==r?(o(e()-r),r=e()):r=e()}),[e])}const K=O.merge(O(document.hasFocus()),O.merge(q(window,"focus"),q(window,"blur")).map(f("type")).map(m("focus"))),H=new U;H.domElement.parentElement.style.zIndex=Number.MAX_SAFE_INTEGER.toString();const X=function(e){const r=O.combine(((e,r)=>{if(!e())return function(){const e=O(),r=O(),o=O.merge(O.of(0),O.immediate(O.combine((r=>(e(requestAnimationFrame(r)),r())),[r])));return O.on((()=>cancelAnimationFrame(e())),o.end),o}().pipe(G);r()&&r().end(!0)}),[e]),o=(t=r,O.combine(((e,r)=>{e().map(r)}),[t]));var t;return O.scan(u,0,o)}(K.map(v).map(((...e)=>c(i(console.log,e)))("pause"))),J=G(X).map((e=>e/1e3)),Q=(V=document,O.scan(((e,r)=>(e[r.key]="keydown"===r.type,e)),{},O.merge(q(V,"keydown"),q(V,"keyup"))));var V;const Z=e=>e<-1?e+2:e>1?e-2:e,ee=({frag:e})=>`\n  for (float x = -2.; x <= 2.; x += 2.) {\n    for (float y = -2.; y <= 2.; y += 2.) {\n      vec2 pScreenWrap = vec2(x, y);\n      ${e}\n    }\n  }\n`,re=e=>r=>(...o)=>r(e(),...o),oe=re(g),te=oe(y),ne=oe(b),ae=oe(w),se=oe(h),ce=$,ie=e=>r=>r.map(e),le=re(A)(x);I(Array);const pe=H.addFolder("asteroid"),de=(e=1)=>(2*Math.random()-1)*e,ue=(e=1)=>ne(ae([de(),de()]),e),fe=e=>n=>{var{p:s}=n,c=((e,n)=>{var a={};for(var s in e)r.call(e,s)&&n.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&o)for(var s of o(e))n.indexOf(s)<0&&t.call(e,s)&&(a[s]=e[s]);return a})(n,["p"]);return a(a({},c),{p:F.pipe(s,(r=>te(r,ne(c.v,e))),ie(Z))})},me=S(0,10),ve=O.scan(((e,r)=>e.map(fe(r))),me.map((()=>({p:[de(),de()],v:ue(.25*Math.random()),size:Math.random()}))),J),ye=z`
  ${{uniforms:me.reduce(((e,r,o)=>{for(const t of Object.keys(ve()[o]))e[`asteroids[${o}].${t}`]=()=>ve()[o][t];return e}),{})}}
  
  struct Asteroid { vec2 p; vec2 v; float size; };
  uniform Asteroid asteroids[${10}];

  float sdAsteroid(vec2 p, Asteroid a) {
    float d = sdCircle(p - a.p, a.size * ${N(pe.auto(.1,"sizeScale",.1,.5))} +
      ${N(pe.auto(.2,"sizeBase",.01,.2))});
    return d;
  }

  float sdAsteroids(vec2 p) {
    float d = INFINITY;
    for (int i = 0; i <= ${10}; i+= 1) {
      d = opSmoothUnion(d, sdAsteroid(p, asteroids[i]), ${N(pe.auto(.1,"u_asteroidK",0,.25))});
    }
    return d;
  }

  float sdSpaceAsteroids(vec2 p) {
    float d = INFINITY;
    ${ee(z`
      d = opSmoothUnion(d, sdAsteroids(p - pScreenWrap), u_asteroidK);
    `)}
    return d;
  }

  vec4 asteroidsColor(vec2 p) {
    float d = sdSpaceAsteroids(p);
    d = -d;
    d = d * ${N(pe.auto(30,"bandEffectScaleUp",1,50))};
    d = floor(d) + 1.;
    d = d / ${N(pe.auto(3,"bandEffectScaleDown",1,10))};
    d = normalized(d);

    float stepD = step(sdSpaceAsteroids(p), 0.);
    float alpha = mix(d, stepD, ${N(pe.auto(0,"bandOrStep",0,1))});
    
    return vec4(${N(pe.auto("#d79552","asteroidColor"))}, alpha);
  }
`,be=H.addFolder("player"),ge=Q.map((({a:e,d:r,w:o,s:t})=>[r?1:e?-1:0,o?1:0])),we=O.scan(((e,r)=>{const[o]=ge();return e-o*be.auto(1.5,"rotate",.1,2)()*Math.PI*r}),0,O.combine((e=>0!==ge()[0]?e():void 0),[J])),he=[0,-1],$e=we.map(C(le,(e=>se(he,e)))),xe=J.map((e=>$e().map((r=>r*(ge()[1]*be.auto(.05,"acceleration",.025,.1)()*e))))),Ae=be.auto(.02,"maxSpeed",.005,.05).map((e=>r=>ce(r)>e?ne(ae(r),e):r)),Ie=O.scan(C(te,(e=>Ae()(e))),[0,0],xe),Se=z`
  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
  }

  float sdPlayer(vec2 p) {
    vec2 pos = ${N(O.scan(C(te,ie(Z)),[0,0],Ie))};
    vec2 center = vec2(0, 0.06);
    vec2 player = p - center - pos;
    player = rotate2d(${N(we)}) * player;
    player += center + pos;
    float d = sdTriangleIsosceles(player - pos, vec2(0.035, 0.085)) - 0.015;

    return d;
  }

  float sdSpacePlayer(vec2 p) {
    float d = INFINITY;
    ${ee(z`
      d = opUnion(d, sdPlayer(p - pScreenWrap));
    `)}
    return d;
  }

  vec4 playerColor(vec2 p) {
    float d = step(sdSpacePlayer(p), 0.);
    return vec4(vec3(1), d);
  }
`,Fe=_()(z`
${Y}
${B}
${Se}
${ye}

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
`);O.on((()=>Fe()),X);
