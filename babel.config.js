const cjs = process.env.BABEL_ENV === "commonjs";

module.exports = {
  presets: [
    ["@babel/env", { loose: true, modules: false }],
    "@babel/preset-react"
  ],
  plugins: [
    cjs && ["@babel/transform-modules-commonjs", { loose: true }],
    ["@babel/transform-runtime", { useESModules: !cjs }]
  ].filter(Boolean)
};
