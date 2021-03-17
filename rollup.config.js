// rollup.config.js
// node-resolve will resolve all the node dependencies
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
// Convert CJS modules to ES6, so they can be included in a bundle
import commonjs from 'rollup-plugin-commonjs';
//import postcss from 'rollup-plugin-postcss';
//import postcssModules from 'postcss-modules';

//const autoprefixer = require('autoprefixer');

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  // All the used libs needs to be here
  external: [
    'react', 
    'react-proptypes'
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    /*
    postcss({
      plugins: [
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer()]
          }
        }
      ],
      getExportNamed: false,
      getExport (id) {
        return cssExportMap[id];
      },
      extract: 'dist/styles.css',
    }),*/
    
    babel({
      exclude: 'node_modules/**',
      
      presets: ['@babel/env', '@babel/preset-react']
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType']
      }
    }),
    json({
      compact: true
  })
  ]
}