const http = require("http");
const server = http.createServer((req, res) => {
  console.log("进来http请求了");
});

const Ws = require("ws");
const wss = new Ws.Server({ server });
wss.on("connection", (ws) => {
  console.log(ws);
  ws.onmessage = (e) => {
    console.log("收到消息message：", e.data);
  };
});

const clentWs = new Ws("ws://localhost:8899");
clentWs.on("open", (ws) => {
  console.log("连接成功");
  const data = [1, 3, 4];
  clentWs.send(data);
});
server.listen(8899, () => {
  console.log("启动成功 ");
});
