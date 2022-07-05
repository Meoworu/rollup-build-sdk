import resolve from "@rollup/plugin-node-resolve";
import globals from "rollup-plugin-node-globals";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import builtins from "rollup-plugin-node-builtins";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";
import { eslint } from "rollup-plugin-eslint";
import nodePolyfills from "rollup-plugin-node-polyfills";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import { terser } from "rollup-plugin-terser";
import gzipPlugin from "rollup-plugin-gzip";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const pkg = require("./package.json");
// 判断环境
const isProduction = process.env.NODE_ENV === "production";
const libraryName = "human";

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: !isProduction
    },
    { file: pkg.module, format: "es", sourcemap: !isProduction },
  ],
  // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
  // external: [],
  watch: {
    include: "src/**"
  },
  // plugins 需要注意引用顺序
  plugins: [
    peerDepsExternal(),
    eslint({
      throwOnError: true, // lint 结果有错误将会抛出异常
      throwOnWarning: true,
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "lib/**", "*.js"]
    }),
    builtins(),
    resolve({ browser: true, preferBuiltins: true, mainFields: ["browser"] }),
    commonjs(),
    globals(),
    typescript({ useTsconfigDeclarationDir: true }),
    nodePolyfills(),
    json(),
    babel({
      runtimeHelpers: true,
      // 只转换源代码，不运行外部依赖
      exclude: "node_modules/**",
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, ".ts"]
    }),
    sourceMaps(),
    isProduction && terser(),
    isProduction && gzipPlugin()
  ]
};
