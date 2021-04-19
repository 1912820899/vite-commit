const resolveCwd = require("resolve-cwd");
const { sendStreamJS } = require("./send");
const path = require("path");
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
