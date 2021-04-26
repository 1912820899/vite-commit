import path from 'path';
import resolveCwd from 'resolve-cwd';
import { ServerResponse } from 'http';
const { sendStreamJS } = require("../../lib/send");

module.exports.moduleMiddleware = (id:string, res:ServerResponse) => {
  let modulePath = resolveCwd(id);
  if (id === "vue") {
    modulePath = path.join(
      path.dirname(modulePath),
      "dist/vue.runtime.esm-browser.js"
    );
  }
  sendStreamJS(modulePath, res);
};
