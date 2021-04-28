import chokidar from "chokidar";
import { parseSFC } from "./parseSFC";
import path from "path";
export interface ServerNotification {
  type: string;
  path?: string;
  index?: number;
  id?: string;
}

export const fileWatcher = (callback: (notify: ServerNotification) => void) => {
  const watcher = chokidar.watch(process.cwd(), {
    ignored: [/node_modules/],
  });

  watcher.on("change", (file) => {
    const resourcePath = "/" + path.relative(process.cwd(), file);
    const notify: ServerNotification = {
      type: "",
      path: resourcePath,
    };
    if (file.endsWith(".vue")) {
      const { descriptor, preDescriptor } = parseSFC(file);
      if (!preDescriptor) {
        // 首次加载
        return;
      }
      if (
        (descriptor.template && descriptor.template.content) !==
        (preDescriptor.template && preDescriptor.template.content)
      ) {
        // console.log(`[hmr:rerender] ${resourcePath}`);
        notify.type = "rerender";
        callback(notify);
        return;
      }

      if (
        (descriptor.script && descriptor.script.content) !==
        (preDescriptor.script && preDescriptor.script.content)
      ) {
        // console.log(`[hmr:reload] ${resourcePath}`);
        notify.type = "reload";
        callback(notify);
        return;
      }

      if (descriptor.styles.length !== preDescriptor.styles.length) {
        console.log(`[hmr:update-style]1 ${resourcePath}`);
        notify.type = "update-style";
        notify.index = descriptor.styles.length - 1;
        callback(notify);
        return;
      } else {
        descriptor.styles.forEach((styleItem, index) => {
          if (styleItem.content !== preDescriptor.styles[index].content) {
            console.log(`[hmr:update-style] ${resourcePath}`);
            notify.type = "update-style";
            notify.index = index;
            callback(notify);
            return;
          }
        });
      }
    } else {
      // console.log(`[hmr:full-reload] ${resourcePath}`);
      notify.type = "full-reload";
      callback(notify);
      return;
    }
  });
};
