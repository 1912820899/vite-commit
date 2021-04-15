const socket = new WebSocket(`ws://${location.host}`);

// Listen for messages
socket.addEventListener("message", ({ data }) => {
  // const { type, path, index } = JSON.parse(data)
  console.log(data);
});

// ping server
socket.addEventListener("close", () => {
  // console.log("[vds] server connection lost. polling for restart...");
  console.log("aaa");
  setInterval(() => {
    new WebSocket(`ws://${location.host}`).addEventListener("open", () => {
      location.reload();
    });
  }, 1000);
});
