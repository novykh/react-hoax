const cjs = process.env.BABEL_ENV === "commonjs";

module.exports = {
  presets: [
    ["@babel/env", { loose: true, modules: false }],
    "@babel/preset-react"
  ],
  plugins: [
    cjs && ["@babel/transform-modules-commonjs", { loose: true }],
    ["@babel/transform-runtime", { useESModules: !cjs }]
  ].filter(Boolean),
  env: {
    test: {
      presets: [
        [
          "@babel/env",
          {
            useBuiltIns: "entry",
            targets: {
              node: "current"
            },
            corejs: 3
          }
        ]
      ],
      plugins: ["@babel/transform-runtime"]
    }
  }
};
