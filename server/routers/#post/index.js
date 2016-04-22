/**
 * Created by Administrator on 2015/12/21.
 */
module.exports=function (req, res, next) {
  res.json({
    body:req.body,
    query:req.query,
    headers:req.headers,
    url:req.headers.host + req.originalUrl
  });
};