module.exports = {
  lintOnSave: false,
  publicPath: ".",
  devServer: {
    proxy: "http://localhost:3000",
  },
};
