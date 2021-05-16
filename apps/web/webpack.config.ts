module.exports = (config, context) => {
  return {
    ...config,
    module: {
      //...config.module,
      rules: [
        {
          test: /\.(ts|js)x?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/typescript',
                '@babel/preset-react'
              ],
              plugins: [
                [
                  '@babel/plugin-proposal-decorators',
                  { legacy: true }
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  { loose: true }
                ],
                [
                  '@babel/plugin-transform-runtime',
                  {
                    helpers: true,
                    regenerator: true
                  }
                ]
              ]
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [...config.plugins]
  };
};
