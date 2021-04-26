import { HMRRuntime } from "vue";
declare var __VUE_HMR_RUNTIME__: HMRRuntime;
const socket = new WebSocket(`ws://${location.host}`);

// Listen for messages
socket.addEventListener("message", ({ data }) => {
  const { type, path } = JSON.parse(data);
  switch (type) {
    case "connected":
      console.log("ws热更新连接成功");
      break;
    case "reload":
      import(`${path}?t=${Date.now()}`).then((m) => {
        __VUE_HMR_RUNTIME__.reload(path, m.default);
        console.log(`[lpze] ${path} reloaded.`, m.default);
      });
      break;
    case "rerender":
      import(`${path}?type=template&t=${Date.now()}`).then((m) => {
        __VUE_HMR_RUNTIME__.rerender(path, m.render);
        console.log(`[lpze] ${path} rerender.`);
      });
      break;
    case "full-reload":
      location.reload();
  }
});

// ping server
socket.addEventListener("close", () => {
  console.log("ws 连接断开，正在重新连接");
  setInterval(() => {
    new WebSocket(`ws://${location.host}`).addEventListener("open", () => {
      location.reload();
    });
  }, 1000);
});
