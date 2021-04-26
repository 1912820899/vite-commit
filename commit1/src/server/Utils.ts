import fs from "fs";
import { ServerResponse } from "http";

export const sendStreamJS = (
  source: string | Buffer,
  res: ServerResponse
) => {
  res.setHeader("Content-Type", "application/javascript");
  const stream = fs.createReadStream(source);
  stream.on("open", () => {
    stream.pipe(res);
  });
  stream.on("error", (err) => {
    res.end(err);
  });
};

export const sendJs = (source: string | Buffer, res: ServerResponse) => {
  res.setHeader("Content-Type", "application/javascript");
  res.end(source);
};
