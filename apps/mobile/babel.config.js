module.exports = function (api) {
  api.cache(true);
  return {
    "presets": [
      ["@babel/preset-react", {
        "runtime": "automatic"
      }]
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'babel-plugin-transform-typescript-metadata'
    ]
  };
};
