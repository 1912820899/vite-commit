const path = require("path");
const chokidar = require("chokidar");
const { parse } = require("./parseSFC");

exports.fileWatcher = (callback) => {
  const log = console.log.bind(console);

  const watcher = chokidar.watch(process.cwd(), {
    ignored: [/node_modules/],
  });

  watcher.on("change", (path) => {
    const notify = {
      type: "",
      path: path,
    };
    if (path.endsWith(".vue")) {
      const { descriptor, preDescriptor } = parse(path);
      if (!preDescriptor) {
        // 首次加载
        return;
      }
      if (descriptor.script?.content !== preDescriptor.script?.content) {
        console.log(`[hmr:reload] ${path}`);
        notify.type = "reload";
        callback(notify);
        return;
      }
      if (descriptor.template?.content !== preDescriptor.template?.content) {
        console.log(`[hmr:rerender] ${path}`);
        notify.type = "rerender";
        callback(notify);
      }
    } else {
      console.log(`[hmr:full-reload] ${path}`);
      notify.type = "full-reload";
      callback(notify);
      return;
    }
  });
};
