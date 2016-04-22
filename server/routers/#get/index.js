/**
 * Created by Administrator on 2015/12/21.
 */
module.exports=function (req, res, next) {

  console.log(req.query);
  res.json(req.query);
};