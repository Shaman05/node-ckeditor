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
  console.log(+new Date());
  res.render('index', { articles: data });
});

router.get('/view', function(req, res, next) {
  var id = req.query.id;
  var baseDir = path.resolve(__dirname, `../public/articles/`);
  var fileName = `file_${id}.json`;
  var data = require(path.join(baseDir, fileName));
  res.render('details', {
    id: id,
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
  var id = req.query.id;
  if(id){
    var baseDir = path.resolve(__dirname, `../public/articles/`);
    var fileName = `file_${id}.json`;
    var data = require(path.join(baseDir, fileName));
    res.render('edit', {
      pageTitle: '编辑文章：' + data.title,
      id: id,
      title: data.title,
      content: data.content
    });
  }else{
    res.render('edit', {
      pageTitle: '新建文章',
      id: '',
      time: '',
      title: '',
      content: ''
    });
  }
});

/* xblockly 新版本号接口 */
router.get('/xblockly-update', function(req, res, next) {
  res.json({
    version: '1.0.3',
    packagePath: '/download/app.zip'
  });
});

module.exports = router;
