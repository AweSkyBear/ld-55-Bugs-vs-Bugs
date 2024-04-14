const webpack = require('webpack')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (env) => ({
  entry: './src/boot.ts',

  devtool: env.production ? undefined : 'eval',

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 5055,
    liveReload: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  optimization: {
    // runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        // in case Phaser is imported by mistake, exclude it from the vendor bundle
        // (see index.html - imports Phaser from CDN)
        // (note - you can also import phaser from vendor/phaser.3.70.min.js too)
        phaser: {
          test: /[\\/]node_modules[\\/]phaser/,
          name: 'phaser',
          chunks: 'all',
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            defaults: true,
            drop_console: true,
          },
          mangle: true,
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        // options: {
        //   transpileOnly: true,
        // },
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|png|jpg|gif|frag|avif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // {
      //   // test: /\.(png|jpg|gif|frag|avif)$/i, // OLD
      //   test: /\.(frag)$/i,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 81920, // 80kb / default proposed is 8kb
      //       },
      //     },
      //   ],
      // },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: { '~': path.resolve(__dirname, './src') },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    env.analyzeBundle && new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/index.html', to: 'index.html' },
        { from: 'assets/css/index.css', to: '../dist/style.css' },
        { from: 'assets/music/cosmic-wow.mp3', to: '../dist/music/cosmic-wow.mp3' },
        // { from: "dist/**", to: "../www/dist/[path][name].[contenthash][ext]" },
        // { from: "music/**", to: "../dist/" },
      ],
    }),
  ].filter((f) => !!f),
})
