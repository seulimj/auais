module.exports = (req, res, next) => {
  delete req.query._u_;
  delete req.query._s_;
  delete req.query._t_;
  next();
};
