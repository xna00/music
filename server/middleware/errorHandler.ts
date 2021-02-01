export default () => (err, req, res, next) => {
  if (err.message.includes("E11000")) {
    err.statusCode = 422;
    err.message = "用户名已存在";
  }
  res.status(err.statusCode || 500).send({
    message: err.message,
  });
};
