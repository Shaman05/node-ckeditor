var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var baseDir = path.resolve(__dirname, `../public/articles/`);
  var files = fs.readdirSync(baseDir);
  var data = [];
  files.forEach(function (file, index) {
    let st = fs.lstatSync(path.join(baseDir, file));
    if(!st.isDirectory()){
      data.push(require(path.join(baseDir, file)));
    }
  });
  res.render('index', { articles: data });
});

router.get('/view', function(req, res, next) {
  var id = req.query.id;
  var baseDir = path.resolve(__dirname, `../public/articles/`);
  var fileName = `file_${id}.json`;
  var data = require(path.join(baseDir, fileName));
  res.render('details', {
    title: data.title,
    time: data.time,
    content: data.content
  });
});
router.get('/delete', function(req, res, next) {
  var id = req.query.id;
  var baseDir = path.resolve(__dirname, `../public/articles/`);
  var fileName = `file_${id}.json`;
  fs.unlink(path.join(baseDir, fileName), function (err) {
    if(!err){
      res.redirect('/');
    }else{
      res.end('删除失败！');
    }
  });
});

router.get('/edit', function(req, res, next) {
  res.render('edit', { title: '编辑器' });
});

module.exports = router;
