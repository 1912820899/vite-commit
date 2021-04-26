import path from 'path';
import resolveCwd from 'resolve-cwd';
const { sendStreamJS } = require("../../lib/send");

module.exports.moduleMiddleware = (id, res) => {
  let modulePath = resolveCwd(id);
  if (id === "vue") {
    modulePath = path.join(
      path.dirname(modulePath),
      "dist/vue.runtime.esm-browser.js"
    );
  }
  sendStreamJS(modulePath, res);
};
