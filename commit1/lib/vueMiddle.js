const url = require("url");
const fs = require("fs");
const path = require("path");
const { compileTemplate } = require("@vue/compiler-sfc");
const { sendStreamJS, sendJs } = require("./send");
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
    let code = "import '/__hrmClient';\n";
    if (descriptor.script) {
      const content = rewrite(descriptor.script.content);
      code += content;
    } else {
      code += "const __script = {}; export default __script";
    }

    if (descriptor.template) {
      code += `\n import {render as __render} from '${pathname}?type=template';`;
      code += `\n__script.render = __render;`;
    }

    if (descriptor.style) {
      // TODO
    }

    code += `\n __script.__hmrId = '${pathname}';`;
    return sendJs(code, res);
  }
  if (type === "template") {
    const { code, errors } = compileTemplate({
      source: descriptor.template.content,
      filename,
      id: "v-data-test",
      compilerOptions: {
        // TODO infer proper Vue path
        runtimeModuleName: "/__modules/vue",
      },
    });
    return sendJs(code, res);
  }
};
