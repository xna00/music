const timeFormat = (seconds) => {
  const date = new Date(seconds * 1000);
  let m = (date.getMinutes() || 0).toString();
  let s = (date.getSeconds() || 0).toString();
  m.length < 2 && (m = "0" + m);
  s.length < 2 && (s = "0" + s);
  s.length > 2 && (s = s.substr(0, 2));
  return m + ":" + s;
};
export default timeFormat;
