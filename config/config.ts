import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const path = require("path");
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  alias: {
    '@': path.resolve(__dirname, "src"),
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // // 只需要 dev，这么配
  // mfsu: {},
  // // 如果需要针对生产环境生效，这么配
  // // mfsu: { production: { output: '.mfsu-production' } },
  history: {
    type: "hash",
  },
  // chunks: [ 'vendors', 'umi' ],
  // chainWebpack: function (config, { webpack }) {
  //   config.merge({
  //     optimization: {
  //       splitChunks: {
  //         chunks: 'all',
  //         minSize: 30000,
  //         minChunks: 3,
  //         automaticNameDelimiter: '.',
  //         cacheGroups: {
  //           vendor: {
  //             name: 'vendors',
  //             test ({ resource }) {
  //               return /[\\/]node_modules[\\/]/.test(resource);
  //             },
  //             priority: 10,
  //           },
  //         },
  //       },
  //     },
  //   });
  // },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[ REACT_APP_ENV || 'dev' ],
  publicPath: "./",
  manifest: {
    basePath: './',
    publicPath: './',
  },
  esbuild: {},
  plugins: [ 'react-dev-inspector/plugins/umi/react-inspector' ],
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  mfsu: {},
  webpack5: {},
  // exportStatic: {},
});
