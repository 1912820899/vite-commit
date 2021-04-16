const { babelParse } = require("@vue/compiler-sfc");

module.exports.rewrite = (source) => {
  const res = babelParse(source, {
    sourceType: "module",
  });
  console.log(res);
  return res;
};
