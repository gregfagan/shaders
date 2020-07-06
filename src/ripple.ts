import { Shader, glsl } from './Shader';
import { autorun, action } from 'mobx';
import { Vec2, Vec3 } from 'regl';

const shader = new Shader();

shader.prop({
  name: 'u_time',
  type: 'float',
  value: 0,
  script: (time, onFrame) => {
    shader.addGui('animate', true);
    let lastTime = 0;
    let t = 0;
    const update = (elapsed: number) => {
      if (!shader.ui.animate) return;
      const dt = (elapsed - lastTime) / 1000;
      t += dt;
      lastTime = elapsed;
      time.value = t;
    };
    autorun(() => {
      if (shader.ui.animate) {
        lastTime = performance.now();
        requestAnimationFrame(update);
      }
    });
    onFrame(update);
  },
});

function glCoordinatesFromMouseEvent(e: MouseEvent, out: Vec2 | Vec3) {
  out[0] = e.clientX * window.devicePixelRatio;
  out[1] =
    ((e.target as HTMLElement).clientHeight - e.clientY) *
    window.devicePixelRatio;
}

shader.prop({
  name: 'u_mouse',
  type: 'vec2',
  value: [shader.canvas.clientWidth / 2, shader.canvas.clientHeight / 2],
  script: (mouse) => {
    shader.canvas.addEventListener(
      'mousemove',
      action('mousemove', (e) => {
        glCoordinatesFromMouseEvent(e, mouse.value);
      }),
    );
  },
});

shader.prop({
  name: 'u_click',
  type: 'vec3',
  value: [
    shader.canvas.clientWidth / 2,
    shader.canvas.clientHeight / 2,
    Number.MIN_VALUE,
  ],
  script: (click) => {
    shader.canvas.addEventListener(
      'mousedown',
      action((e) => {
        glCoordinatesFromMouseEvent(e, click.value);
        click.value[2] = shader.values.u_time.value as number;
      }),
    );
  },
});

shader.source = glsl`
#define INFINITY ${Number.MAX_VALUE.toString()}
#define normalized(x) clamp(x, 0., 1.)

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

 float sdRing(float d, float r) {
  return abs(d) - r;
 }

// https://www.iquilezles.org/www/articles/smin/smin.htm 
float opUnion(float a, float b) {
  // return min(a, b);
  float k = ${shader.float('blend', 0.1)};
  float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
  return mix( b, a, h ) - k*h*(1.0-h);
}

void main() {
  vec2 p = st();
  vec2 mouse = coord(u_mouse);
  vec3 baseColor = ${shader.color('base_color')};
  vec3 color = ${shader.color('color', '#ffaaaa')};
  float r = ${shader.float('radius', 0.05)} + 0.015 * sin(u_time * 5.);
  float clickTime = u_time - u_click.z;

  float d = INFINITY;
  d = opUnion(d, sdCircle(p - mouse, r));
  d = opUnion(d, sdRing(sdCircle(p - coord(u_click.xy), clickTime * ${shader.float(
    'speed',
    2.5,
    0.1,
    10,
  )}), ${shader.float('ring_thickness', 0.1, 0.01, 0.2)}));

  if(!${shader.prop({ type: 'bool', value: true, name: 'showField' })}) {
    d = step(d, 0.);
  }

  gl_FragColor = vec4(mix(baseColor, color, d), 1.);
}
`;
