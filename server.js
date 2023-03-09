const http = require("http");

const host = "localhost";
const port = 3000;

const requestListner = (req, res) => {
  res.writeHead(200);
  res.end("Welcome to the backend! :)");
};

const server = http.createServer(requestListner);
server.listen(port, host, () => {
  console.log(`Server is running on: http://${host}:${port}`);
});
