const presetEnvOptions = process.env.LEGACY
  ? {
      modules: false,
      useBuiltIns: "entry",
      corejs: 3
    }
  : {
      modules: false,
      targets: {
        esmodules: true
      }
    };

module.exports = {
  presets: [["@babel/preset-env", presetEnvOptions], "@babel/preset-react"],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining"
  ]
};
