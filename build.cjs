// Build the dependency-free browser bundle from the same modules used by the tests.
const fs = require('node:fs');
const names = ['types', 'data', 'logic', 'adapter', 'ui'];
const modules = names.map(name =>
  JSON.stringify('./' + name) + ': function(require, module, exports) {\n' +
  fs.readFileSync(name + '.js', 'utf8') + '\n}'
);
const loader = `
const cache = {};
function load(name) {
  if (cache[name]) return cache[name].exports;
  const module = {exports: {}};
  cache[name] = module;
  modules[name](load, module, module.exports);
  return module.exports;
}
load('./ui');`;
fs.writeFileSync('browser.js', '(() => {\nconst modules = {\n' + modules.join(',\n') + '\n};\n' + loader + '\n})();\n');
