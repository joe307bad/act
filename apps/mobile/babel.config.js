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
      'babel-plugin-transform-typescript-metadata',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            "@act/data/core": ["libs/data/core/src/index.ts"],
            "@act/data/rn": ["libs/data/rn/src/index.ts"],
            "@act/data/web": ["libs/data/web/src/index.ts"]
          }
        }
      ]
    ]
  };
};
