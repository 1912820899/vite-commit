import path from "path";
import { compileStyle, compileTemplate } from "@vue/compiler-sfc";
import { sendJs } from "./Utils";
import { parseSFC } from "./parseSFC";
import { rewrite } from "./moduleRewrite";
import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";
import hash from "hash-sum";
export const vueMiddleware = (req: IncomingMessage, res: ServerResponse) => {
  const { pathname, searchParams } = new URL(
    req.url!,
    `http://${req.headers.host}`
  );
  const type = searchParams.get("type");
  const filename = path.join(process.cwd(), `.${pathname}`);
  const { descriptor } = parseSFC(filename);

  // 初始化，对三块内容进行拆分
  if (!type) {
    let code = "import '/__hrmClient';\n";
    if (descriptor.script) {
      const content = rewrite(descriptor.script.content);
      code += content;
    } else {
      code += "const __script = {}; export default __script";
    }

    let hasScoped = false;
    if (descriptor.styles) {
      descriptor.styles.forEach((s, i) => {
        if (s.scoped) hasScoped = true;
        code += `\n import ${JSON.stringify(
          pathname + `?type=style&index=${i}`
        )}`;
      });
    }
    if (hasScoped) {
      code += `\n__script.__scopeId = "data-v-${hash(pathname)}"`;
    }
    if (descriptor.template) {
      code += `\n import {render as __render} from '${pathname}?type=template';`;
      code += `\n__script.render = __render`;
    }
    code += `\n __script.__hmrId = ${JSON.stringify(pathname)}`;
    return sendJs(code, res);
  }
  // 检测是否存在 scoped组件
  const scoped = descriptor.styles.some((s) => s.scoped);

  if (type === "template") {
    const { code } = compileTemplate({
      source: descriptor.template?.content || "",
      filename,
      id: `data-v-${hash(pathname)}`,
      compilerOptions: {
        scopeId: scoped ? `data-v-${hash(pathname)}` : null,
        runtimeModuleName: "/__modules/vue",
      },
    });
    return sendJs(code, res);
  }

  if (type === "style") {
    const index = searchParams.get("index");
    if (index === null) return;
    const styleIndex = Number(index);
    const source = descriptor.styles[styleIndex].content || "";
    const id = hash(pathname);

    const { code, errors } = compileStyle({
      source,
      filename,
      id: `data-v-${id}`,
      scoped: descriptor.styles[styleIndex].scoped,
    });
    if (errors.length > 0) {
      console.error("解析style出错", errors);
    }
    return sendJs(
      `
      let style = document.getElementById('data-v-${id}')
      if(!style){
        style = document.createElement('style');
        style.id = 'data-v-${id}';
        document.head.appendChild(style);
      }
      style.textContent += ${JSON.stringify(code)};
    `.trim(),
      res
    );
  }
};
