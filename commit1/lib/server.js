const fs = require("fs");
const path = require("path");
const url = require("url");
const http = require("http");
const serverHandler = require("serve-handler");
const { fileWatcher } = require("./fileWatcher");
const hrm = fs.readFileSync(path.resolve(__dirname, "./hrm.js"));

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  if (pathname.indexOf("__hrm") !== -1) {
    res.setHeader("Content-Type", "application/javascript");
    const stream = fs.createReadStream(path.resolve(__dirname, "./hrm.js"));
    stream.on("open", () => {
      stream.pipe(res);
    });
    stream.on("error", (err) => {
      res.end(err);
    });
  }

  serverHandler(req, res, {
    rewrites: [{ source: "**", destination: "/index.html" }],
  });
});

const Ws = require("ws");
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
