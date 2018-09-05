exports.logger = (req, res, next) => {
  const time = (new Date()).toLocaleString();
  console.log(`${time} ${req.method} ${req.url}`);
  next();
};