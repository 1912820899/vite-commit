const resolveCwd = require("resolve-cwd");
const { sendStreamJS } = require("./send");

module.exports.moduleMiddleware = (id, res) => {
  const modulePath = resolveCwd(id);
  sendStreamJS(modulePath, res);
  res.end("ok");
};
