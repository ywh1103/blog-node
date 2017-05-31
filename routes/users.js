var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/res'
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 往数据库里插留言标题和内容（留言）
router.post("/list",function(req,res,next){
    var user=req.session.user;
    if(user) {
        //   获取表单数据
        var titi = req.body["titi"];
        var con = req.body["con"];
        // res.send(user)
        // 插入函数
        var insertdata = function (db, callback) {
// 获取指定关联的数据库集合的名字
            var coll2 = db.collection("liuyan");
            // 插入需要放进数据库的数据
            var data = [{titi: titi, con: con,}];
            coll2.insert(data, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    callback(result)//回调当前插入数据库的数据结果
                }
            })
        }
        // 链接数据库
        mongodb.connect(db_str, function (err, db) {
            if (err) {
                console.log(err)
            } else {
                console.log("链接成功");
                insertdata(db, function (result) {
                    console.log(result);
                    // res.send('留言成功')
                     res.redirect("/say")
                    //关闭数据库
                    db.close()
                })
            }
        })
    }else{
        res.send('重新登录')
    }
})



// 往数据库里插文章标题和内容（发表文章）
router.post("/wen",function(req,res,next){
    var user=req.session.user;
    if(user){
        //   获取表单数据
        var title = req.body["title"];
        var article = req.body["article"];
        // res.send(user)
        // 插入函数
        var insertdata = function (db, callback) {
// 获取指定关联的数据库集合的名字
            var coll2 = db.collection("wenzhang");
            // 插入需要放进数据库的数据
            var data = [{title: title, article: article}];
            coll2.insert(data, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    callback(result)//回调当前插入数据库的数据结果
                }
            })
        }
        // 链接数据库
        mongodb.connect(db_str, function (err, db) {
            if (err) {
                console.log(err)
            } else {
                console.log("链接成功");
                insertdata(db, function (result) {
                    console.log(result);
                    // res.send('留言成功')
                    res.redirect("/")
                    //关闭数据库
                    db.close()
                })
            }
        })
    }
})


module.exports = router;
