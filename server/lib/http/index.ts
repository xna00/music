import http = require("http");
import https = require("https");
import querystring = require("querystring");
import zlib = require("zlib");
// let real = _http;

const _request = (url: string, method, headers = {}, postData = {}) => {
  const protocol = url.substring(0, url.indexOf("://"));
  url = url.replace(protocol + "://", "");
  const use = protocol === "http" ? http : https;
  const hostname = url.substring(0, url.indexOf("/"));
  url = url.replace(hostname, "");
  const path = url;
//   console.log(protocol, hostname, path);
  return new Promise<string>((resolve, reject) => {
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
          const data = buffer.toString();
          resolve(data);
        });
        response.on("error", (err) => reject(err));
      }
    );

    request.on("error", (err) => reject(err));
    request.write(querystring.stringify(postData));
    request.end();
  });
};
const get = (url: string, query = {}, headers = {}) => {
  url += querystring.stringify(query);
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