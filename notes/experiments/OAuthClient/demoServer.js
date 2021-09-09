const https = require("https");
const fs = require("fs");
const path = require("path");

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https
  .createServer(options, function (req, res) {
    var filePath = "dist/" + path.join(".", req.url.split("?")[0]);
    // Browser will autorequest 'localhost:8000/favicon.ico'
    if (!filePath.includes("favicon.ico")) {
      file = fs.readFileSync(filePath, "utf-8");
      res.write(file);
    }
    res.end();
  })
  .listen(8000);
