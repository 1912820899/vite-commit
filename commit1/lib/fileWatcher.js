const path = require("path");
const chokidar = require("chokidar");
const { parse } = require("./parseSFC");

exports.fileWatcher = (callback) => {
  const log = console.log.bind(console);

  const watcher = chokidar.watch(process.cwd(), {
    ignored: [/node_modules/],
  });

  watcher.on("change", (file) => {
    const resourcePath = "/" + path.relative(process.cwd(), file);
    const notify = {
      type: "",
      path: resourcePath,
    };
    if (file.endsWith(".vue")) {
      const { descriptor, preDescriptor } = parse(file);
      console.log(descriptor.template.content, preDescriptor.template.content);
      if (!preDescriptor) {
        // 首次加载
        return;
      }
      if (
        (descriptor.template && descriptor.template.content) !==
        (preDescriptor.template && preDescriptor.template.content)
      ) {
        console.log(`[hmr:rerender] ${resourcePath}`);
        notify.type = "rerender";
        callback(notify);
        return;
      }
      if (
        (descriptor.script && descriptor.script.content) !==
          preDescriptor.script &&
        preDescriptor.script.content
      ) {
        console.log(`[hmr:reload] ${resourcePath}`);
        notify.type = "reload";
        callback(notify);
        return;
      }
    } else {
      console.log(`[hmr:full-reload] ${resourcePath}`);
      notify.type = "full-reload";
      callback(notify);
      return;
    }
  });
};
