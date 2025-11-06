module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-react', {runtime: 'automatic'}],
    ['@babel/preset-typescript', {allExtensions: true, isTSX: true}],
  ],
  // no extra plugins required for tests; keep config minimal
};
