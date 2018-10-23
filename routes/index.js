var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WebSocket Client' });
});

router.post('/setcookie', function (req, res) {
  var cookies = req.cookies;
  var cookieToClear = Object.keys(cookies)[0];
  var body = req.body;
  var key = Object.keys(body)[0];
  var value = body[key];
  res.clearCookie(cookieToClear).cookie(key, value).send({msg: "Cooke set!"});
});

router.get('/clearcookies', function (req, res) {

});

module.exports = router;
