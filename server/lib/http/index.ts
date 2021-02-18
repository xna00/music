import http = require("http");
import https = require("https");
import querystring = require("querystring");
import zlib = require("zlib");
import { parseUrl } from "./parseUrl";
// let real = _http;

const _request = (url: string, method, headers = {}, postData = {}) => {
  const { protocol, hostname, path } = parseUrl(url);
  const use = protocol === "http" ? http : https;
  // console.log(protocol, use, method, hostname, path, headers);
  return new Promise<string | object>((resolve, reject) => {
    const request = use.request(
      {
        hostname,
        path,
        method,
        headers,
      },
      (response) => {
        // console.log(response.statusCode);
        const chunks: Uint8Array[] = [];
        response.on("data", (chunk: Uint8Array) => {
          chunks.push(chunk);
        });
        response.on("end", () => {
          let buffer = Buffer.concat(chunks);
          if (response.headers["content-encoding"] === "gzip") {
            buffer = zlib.gunzipSync(buffer);
          }
          let data: any = buffer.toString();
          try {
            data = JSON.parse(data);
          } catch (error) {
          } finally {
            resolve(data);
          }
        });
        response.on("error", (err) => reject(err));
      }
    );

    request.on("error", (err) => reject(err));
    request.write(querystring.stringify(postData));
    request.end();
  });
};
const get = (url: string, query?, headers = {}) => {
  if (query && JSON.stringify(query) !== "{}") {
    url.includes("?") ? (url += "&") : (url += "?");
    url += querystring.stringify(query);
  }
  return _request(url, "GET", headers);
};
const post = (url: string, postData = {}, headers = {}) => {
  console.log("post");

  return _request(url, "POST", headers, postData);
};
export default {
  get,
  post,
};
