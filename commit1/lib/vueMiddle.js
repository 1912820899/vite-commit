const url = require("url");
const fs = require("fs");
const path = require("path");
const { compileTemplate } = require("@vue/compiler-sfc");
const { sendStreamJS } = require("./send");
const { parse } = require("./parseSFC");
const { rewrite } = require("./moduleReWrite");
module.exports.vueMiddleware = (req, res) => {
  const { pathname, searchParams } = new URL(
    req.url,
    `http://${req.headers.host}`
  );
  const type = searchParams.get("type");
  const filename = path.join(process.cwd(), `.${pathname}`);
  const { descriptor, errors } = parse(filename);
  if (!type) {
    if (descriptor.script) {
      rewrite(descriptor.script.content);
    }
  } else {
    if (type === "template") {
      const res = compileTemplate({
        source: descriptor.template.source,
        filename,
        id: "data-v-asdsad",
      });
      console.log(res);
      res.end(res);
    }
  }
};
