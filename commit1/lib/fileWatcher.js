const path = require("path");
const chokidar = require("chokidar");

exports.fileWatcher = (callback) => {
  const log = console.log.bind(console);

  const watcher = chokidar.watch(path.resolve(__dirname, "../src"), {});
  watcher.on("change", (path, stats) => {
    const notify = { path, stats };
    log(`${path}文件修改了 ${stats}`);
    callback(notify);
  });
};
