import fs from "fs";
import path from "path";
import url from "url";
import WebSocket from "ws";
import serverHandler from "serve-handler";
import { fileWatcher } from "./fileWatcher";
import { rewrite } from "./moduleRewrite";
import { IncomingMessage, ServerResponse, createServer } from "http";
import { sendJs } from "./Utils";
const hmr = fs.readFileSync(path.resolve(__dirname, "../client/hmr.js"));

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const pathname = url.parse(req.url!).pathname!;
  if (pathname === "/__hrmClient") {
    return sendJs(hmr, res);
  } else if (pathname.startsWith("/__modules/")) {
    return moduleMiddleware(pathname.replace("/__modules/", ""), res);
  } else if (pathname.endsWith(".vue")) {
    return vueMiddleware(req, res);
  } else if (pathname.endsWith(".js")) {
    try {
      const jsFile = fs.readFileSync(
        path.resolve(process.cwd(), `.${pathname}`),
        "utf-8"
      );
      return sendJs(rewrite(jsFile), res);
    } catch (error) {
      console.log(error);
      if (error.code === "ENOENT") {
        // handle
      } else {
        console.error(error);
      }
    }
  }

  serverHandler(req, res, {
    rewrites: [{ source: "**", destination: "/index.html" }],
  });
});

const { moduleMiddleware } = require("./moduleMiddleware");
const { vueMiddleware } = require("./vueMiddle");
const wss = new WebSocket.Server({ server });
const sockets = new Set<WebSocket>();
wss.on("connection", (ws) => {
  sockets.add(ws);
  ws.send(JSON.stringify({ type: "connected" }));
  ws.onmessage = (e) => {
    console.log("收到消息message：", e.data);
  };
});

fileWatcher((payload) => {
  sockets.forEach((socket) => socket.send(JSON.stringify(payload)));
});

server.listen(8799, () => {
  console.log("启动成功 ");
});
