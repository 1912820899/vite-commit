const fs = require("fs");
module.exports.sendStreamJS = (source, res) => {
  res.setHeader("Content-Type", "application/javascript");
  const stream = fs.createReadStream(source);
  stream.on("open", () => {
    stream.pipe(res);
  });
  stream.on("error", (err) => {
    res.end(err);
  });
};

module.exports.sendJs = (source, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.end(source);
};
