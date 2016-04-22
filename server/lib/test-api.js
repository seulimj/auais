module.exports ={
  handler(req, res, next) {
    res.json({
      path: req.route.path,
      method: req.method
    });
  }
};
