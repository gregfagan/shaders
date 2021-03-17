const tsconfig = fetch('tsconfig.json').then(r => r.json());
const endsWithFileExtension = /\/?\.[a-zA-Z]{2,}$/;
const endsWithTS = /^.*\.ts/;

function hook(global) {
  const systemJS = global.System.constructor.prototype;

  // Automatically resolve bare specifiers with `.ts` extension
  const originalResolve = systemJS.resolve;
  systemJS.resolve = (name, location) => {
    if (name === '.') name = './index.ts';
    const url = originalResolve.call(this, name, location);
    const result = endsWithFileExtension.test(url) ? url : url + '.ts';
    return result;
  };

  // Always fetch modules so we can apply transformations
  systemJS.shouldFetch = () => true;

  // Transform TypeScript when fetching
  systemJS.fetch = async url => {
    const source = await fetch(url).then(r => r.text());
    return new Response(
      endsWithTS.test(url)
        ? ts.transpileModule(source, await tsconfig).outputText
        : source,
      { headers: { 'content-type': 'application/javascript' } }
    );
  };
}

hook(typeof self !== 'undefined' ? self : global);
