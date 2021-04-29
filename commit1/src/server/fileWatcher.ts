import chokidar from "chokidar";
import { parseSFC } from "./parseSFC";
import path from "path";
import hash from "hash-sum";
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
      /* 新增或者删减scoped样式，需要重新渲染页面，因为scoped 已经被渲染到了dom上 */
      if (
        descriptor.styles.some((s) => s.scoped) !==
        preDescriptor.styles.some((s) => s.scoped)
      ) {
        notify.type = "reload";
        console.log("hmr:reload");

        return callback(notify);
      }
      descriptor.styles.forEach((styleItem, index) => {
        if (
          !preDescriptor.styles[index] ||
          styleItem.content !== preDescriptor.styles[index].content
        ) {
          console.log(`[hmr:update-style] ${resourcePath}`);
          notify.type = "update-style";
          notify.index = index;
          callback(notify);
          return;
        }
      });
      preDescriptor.styles.slice(descriptor.styles.length).forEach((_, i) => {
        console.log('删除style');
        
        notify.type = "style-remove";
        notify.id = `${hash(resourcePath)}-${i + descriptor.styles.length}`;
        callback(notify);
      });
    } else {
      // console.log(`[hmr:full-reload] ${resourcePath}`);
      notify.type = "full-reload";
      callback(notify);
      return;
    }
  });
};
