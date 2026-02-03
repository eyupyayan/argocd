const http = require("http");

const PORT = process.env.PORT || 8080;
const MESSAGE = process.env.MESSAGE || "Hei fra Kubernetes!!!";
const ENV_NAME = process.env.ENV_NAME || "dev";

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200);
    return res.end("ok");
  }
  if (req.url === "/readyz") {
    res.writeHead(200);
    return res.end("ready");
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    message: MESSAGE,
    env: ENV_NAME,
    hostname: require("os").hostname(),
    time: new Date().toISOString()
  }));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
