# Shader Tools

Using fragment shaders to draw with code involves tweaking several numeric
values to achieve a desired effect. Experimenting with different values is
tedious by just editing the code; often you'll want a GUI to quickly play with
many values.

The purpose of these tools is to provide an environment for creative shader
experimentation and make it possible to declare GUI-changable values right in
the middle of the GLSL code.

The tools combine and build upon:

- [REGL](http://regl.party): declarative WebGL
- [dat.GUI](https://github.com/dataarts/dat.gui): light-weight GUI for adjusting
  values
- [flyd](https://github.com/paldepind/flyd): simple streams for piping in time
  or interaction events

Most of the heavy lifting is in those libraries; you will need to know how they
work. These tools provide API glue that bind them together in elegant ways.

### Example

```typescript
const regl = REGL(); // REGL creates a GL canvas
const gui = new AutoGUI(); // a customized dat.GUI which manages its own storage
const time = clock(); // a stream that emits requestAnimationFrame time

// Tagged template literal for GLSL code. Editor plugins can provide GLSL syntax
// highlighting based on the presence of this tag. The result of the template
// function will be a DrawConfig we can give to REGL.
const draw = glsl`
// We can splice in other REGL DrawConfigs, which will be merged with this shader.
// This allows us to easily compose other building blocks, like quad, which sets
// up the polygon for our shader to render to, and sdf, which provides signed
// distance field drawing functions.
${quad}
${sdf}
void main() {
  // Splicing in the uniform function sets up the DrawConfig to pipe in the values
  // from our time stream into the shader via a uniform.
  float t = ${uniform(time)} / 1000.;

  // The st and sdCircle functions were provided by our quad and sdf configs.
  // st gives us normalized coordinates for this fragment.
  vec2 p = st();

  // uniform can be combined with gui to quickly enable experimentation, all
  // defined inline while writing the shader. This line gives us a slider
  // which we can use to scale the circle from 0.1 to 1.
  float d = sdCircle(p, ${uniform(gui.add(0.1, 'u_radius', 0.1, 1))});
  
  // Standard GLSL, clipping our circle out of the distance field.
  d = step(0., d);

  // Since we're authoring the shader code inside a JavaScript tagged template
  // literal, we can break out of GLSL at any time to take advantage of JS.
  vec3 color = vec3(sin(t), cos(t), ${Math.random()});
  gl_FragColor = vec4(mix(vec3(0), color, 1. - d), 1.);
}
`;

const render = regl(draw); // REGL compiles our config and shader
stream.on(() => render(), time); // render when the clock ticks
```

### Build Tools

This library is written in TypeScript, but I have not set up a typical Node
based build toolchain. Instead, [SystemJS](https://github.com/systemjs/systemjs)
is used to load the TypeScript into the browser and transpile it there.

Yes, this is inefficient. Yes, it's weird and unexpected. Yes, I'll probably
eventually set up traditional build tools.

But for now, all you need to do is serve the static files (which `npm start`
will do for you) and you're good to go. That's kind of nice.
