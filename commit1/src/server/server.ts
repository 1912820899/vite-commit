import fs from "fs";
import path from "path";
import url from "url";
const serverHandler = require("serve-handler");
const { fileWatcher } = require("./fileWatcher");
const { rewrite } = require("./moduleRewrite");
import { IncomingMessage, ServerResponse, createServer } from "http";
const hrm = fs.readFileSync(path.resolve(__dirname, "./hrm.js"));

const server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const pathname = url.parse(req.url!).pathname;
    if (pathname === "/__hrmClient") {
      return sendJs(hrm, res);
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
  }
);

const Ws = require("ws");
const { sendJs } = require("./send");
const { moduleMiddleware } = require("./moduleMiddleware");
const { vueMiddleware } = require("./vueMiddle");
const wss = new Ws.Server({ server });
const sockets = new Set();
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

server.listen(8899, () => {
  console.log("启动成功 ");
});
