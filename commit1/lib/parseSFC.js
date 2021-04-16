const fs = require("fs");
const { parse } = require("@vue/compiler-sfc");

module.exports.parse = (filename) => {
  const content = fs.readFileSync(filename, "utf-8");
  const res = parse(content, { filename });
  return res;
};
