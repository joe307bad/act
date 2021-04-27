module.exports = (config, context) => {
    return {
      ...config,
      module: {
        //...config.module,
        rules: [{
          test: /\.(ts|js)x?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                "@babel/typescript",
                "@babel/preset-react"
              ],
              plugins: [
                '@babel/proposal-class-properties'
              ],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },],
      },
      plugins: [
        ...config.plugins
      ],
    };
  };