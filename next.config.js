// next.config.js
const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  webpack (config, options) {
    if(!options.isServer){
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      })
    }
    return config
  }
})
