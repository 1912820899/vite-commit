const MagicString = require("magic-string");

module.exports.ast = () => {
  var s = new MagicString("problems = 99");

  s.overwrite(0, 1, "asd");

  const sourcemap = s.generateMap({
    source: "test.js",
    file: "converted.js.map",
    includeContent: true,
  });
  require("fs").writeFileSync("test.js", s.toString());
  require("fs").writeFileSync("converted.js.map", sourcemap.toString());
};
