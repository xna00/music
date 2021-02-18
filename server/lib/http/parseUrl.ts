const parseUrl = (url: string) => {
  const protocol = url.substring(0, url.indexOf("://"));
  url = url.replace(protocol + "://", "");
  const hostname = url.substring(0, url.indexOf("/"));
  url = url.replace(hostname, "");
  const path = url;
  return { protocol, hostname, path };
};
export { parseUrl };
