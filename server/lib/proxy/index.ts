import { Request, Response } from "express";
import http from "http";
import https from "https";
import { parseUrl } from "../http/parseUrl";
const proxy = (req: Request, res: Response) => {
  const { category, encoded_url } = req.params;
  const url = Buffer.from(encoded_url, "base64").toString();
  const { protocol, hostname, path } = parseUrl(url);
  const use = protocol === "http" ? http : https;
  if (category === "blAudio") {
    use
      .request(
        {
          hostname,
          path,
          method: "GET",
          headers: {
            referer: "https://www.bilibili.com",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68",
          },
        },
        (response) => {
          res.writeHead(
            response.statusCode || 500,
            response.statusMessage,
            response.headers
          );
          response.on("data", (data) => {
            res.write(data);
          });
          response.on("end", () => {
            res.end();
          });
        }
      )
      .end();
  } else {
    res.status(404).end();
  }
};
export default proxy;
