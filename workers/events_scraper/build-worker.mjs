import esbuild from 'esbuild'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

esbuild.build({
  plugins: [NodeModulesPolyfillPlugin()],
  platform: 'browser',
  conditions: ['worker', 'browser'],
  entryPoints: ["src/index.ts"],
  sourcemap: true,
  outfile: "out.js",
  logLevel: 'warning',
  format: 'esm',
  target: 'es2020',
  bundle: true,
  minify: true,
  define: {
    IS_CLOUDFLARE_WORKER: 'true'
  }
})
