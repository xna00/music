const parseUrl = (url: string) => {
  let protocol = url.substring(0, url.indexOf("//"));
  url = url.replace(protocol + "//", "");
  const hostname = url.substring(0, url.indexOf("/"));
  url = url.replace(hostname, "");
  const path = url;
  protocol = protocol.replace(":", "");
  return { protocol, hostname, path };
};
export { parseUrl };
