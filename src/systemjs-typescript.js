(function (global) {
  const systemJSPrototype = global.System.constructor.prototype;
  const transform = systemJSPrototype.transform;
  systemJSPrototype.transform = function (url, source) {
    // composition of transform is done based on assuming every format
    // returns its own System.register. So we don't "compose" transforms
    // but rather treat transforms "fallbacks" where they can select themselves
    return Promise.resolve(transform.call(this, url, source)).then(
      async function (_source) {
        // if there was translation done, then stop
        if (source !== _source) return _source;
        if (/^.*\.ts/.exec(url) == null) return source;

        const config = await fetch('./tsconfig.json').then((r) => r.json());
        console.log('tsconfig', config);
        return new Promise((resolve, reject) => {
          const output = ts.transpileModule(source, config);
          // console.log(output);
          resolve(output.outputText);
        });
      },
    );
  };

  // Automatically resolve bare specifiers with `.ts` extension
  const endsWithFileExtension = /\/?\.[a-zA-Z]{2,}$/;
  const originalResolve = systemJSPrototype.resolve;
  systemJSPrototype.resolve = function () {
    // apply original resolve to make sure importmaps are resolved first
    const url = originalResolve.apply(this, arguments);
    // append .js file extension if url is missing a file extension
    // return endsWithFileExtension.test(url) ? url : url + '.js';
    return endsWithFileExtension.test(url) ? url : url + '.ts';
  };
})(typeof self !== 'undefined' ? self : global);
