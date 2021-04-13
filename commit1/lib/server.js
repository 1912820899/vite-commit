const fs = require("fs");
const path = require("path");
const http = require("http");
const serverHandler = require("serve-handler");
const { fileWatcher } = require("./fileWatcher");
const hrm = fs.readFileSync(path.resolve(__dirname, "./hrm.js"));

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.end(hrm);
  /* return serverHandler(req, res, {
    public: path.resolve(__dirname, "./"),
  }); */
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
  // console.log(sockets);
  sockets.forEach((socket) => socket.send(JSON.stringify(payload)));
});

server.listen(8899, () => {
  console.log("启动成功 ");
});
