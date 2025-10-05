import { WebSocketServer } from "ws";

/* 
 stage 1: get a simple websocket server up and running that gets messages.
 stage 2: incorporate this with an expressjs server. Expose port -> upgrade to a websocket and have the websocket handle it
 stage 3: 
 - incorporate creation of a designated chat room for each class and each assignment. (use a database to track and store this)
 - incorporate a way to identify which user is in which class and assignment.
 - incorporate a way to save messages to the database.
*/

const decoder = new TextDecoder("utf-8")

console.log("turning on websocket server on port 8080");
const websocketServer = new WebSocketServer({
  port: 8080,
});

const messageHandler = (message) => {
  const messageObject = JSON.parse(decoder.decode(message))
  console.log("user: ", messageObject.user)
  console.log("time: ", messageObject.time)
  console.log("message: ", messageObject.message)
}


websocketServer.on("connection", (conn) => {
  console.log(
    "number of total connected clients",
    websocketServer.clients.size
  );
  conn.on("message", (message) => {
    messageHandler(message);
  });
});

websocketServer.on("", () => {
  console.log(
    "Client disconnected. Number of total connected clients",
    websocketServer.clients.size
  );
});
