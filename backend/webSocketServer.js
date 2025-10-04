const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

wss.on("connection", (ws) => {
  console.log("New client connected!");
  ws.send("Dummy Message");

  ws.on("message", (message) => {
    console.log("Message recieved!");
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  })
});

