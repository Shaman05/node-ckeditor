var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var formidable = require('formidable');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/saveArticle', function (req, res, next) {
  var id = req.body.id;
  if(!id){
    id = Math.random().toString(32).substring(2, 32);
    var title = req.body.title || '无标题';
    var content = req.body.content;
    var data = {
      id: id,
      time: new Date().toLocaleString(),
      title: title,
      content: content
    };
    fs.writeFile(path.resolve(__dirname, `../public/articles/file_${id}.json`), JSON.stringify(data, true, 2), function (err) {
      if(err){
        res.send({
          error: 1,
          message: err
        });
      }else{
        //备份
        fs.writeFile(path.resolve(__dirname, `../public/bak/file_${id}.json`), JSON.stringify(data, true, 2), function (err) {});
        res.send({
          error: 0,
          info: data
        });
      }
    });
  }else{
    var baseDir = path.resolve(__dirname, `../public/articles/`);
    var fileName = `file_${id}.json`;
    fs.unlink(path.join(baseDir, fileName), function (err) {
      if(!err){
        var id = Math.random().toString(32).substring(2, 32);
        var title = req.body.title || '无标题';
        var content = req.body.content;
        var data = {
          id: id,
          time: new Date().toLocaleString(),
          title: title,
          content: content
        };
        fs.writeFile(path.resolve(__dirname, `../public/articles/file_${id}.json`), JSON.stringify(data, true, 2), function (err) {
          if(err){
            res.send({
              error: 1,
              message: err
            });
          }else{
            //备份
            fs.writeFile(path.resolve(__dirname, `../public/bak/file_${id}.json`), JSON.stringify(data, true, 2), function (err) {});
            res.send({
              error: 0,
              info: data
            });
          }
        });
      }else{
        res.send({
          error: 1,
          message: err
        });
      }
    });
  }
});

router.post('/uploadImg', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.uploadDir = path.resolve(__dirname, '../public/upload');
  form.parse(req, function (err, fields, files) {
    if (err) {
      throw err;
    }
    var image = files.imgFile;
    var resPath = path.basename(image.path);
    var url = '/upload/' + resPath;
    var info = {
      "error": 0,
      "url": url
    };
    res.send(info);
  });
});

module.exports = router;