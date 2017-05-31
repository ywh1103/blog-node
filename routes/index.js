var express = require('express');
 var mongoose = require('mongoose');
 var User = require('../models/user.model');
var moment = require('moment');//时间控件
var formidable = require('formidable');//表单控件
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/res'

var router = express.Router();

/* GET home page. */



// 注册
router.get("/reg",function(req,res,next){
  res.render("reg",{title:"注册",user:req.session.user})
})



router.post('/reg', function (req, res) {
    var user = new User({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
    });
    if(req.body['password'] != req.body['password-repeat']){

        //req.flash("error",'两次输入的密码不一致');
        console.log('两次输入的密码不一致');
        return res.redirect('/');//返回注册页
    }
    User.findOne({'username':user.username},function(err,data){
        if(err){
            req.flash("err",err);
            return res.redirect('/');
        }
        if(data != null){
            // req.flash('error','该用户已存在');
            console.log('该用户已存在');
            return res.redirect('/reg');//返回注册页
        }else{
            //保存新的用户
            user.save(function(err){
                if(err){
                    //req.flash('err',err);
                    console.log(err);
                    return res.redirect('/');
                }
                //req.flash('success', '注册成功!');
                console.log('注册用户成功');
                res.redirect('/login');//注册成功后返回主页
            })
        }
    })
});
// 登录
router.get("/login",function(req,res,next){
  res.render("login",{title:"登录",user:req.session.user})
})
router.post('/login',function (req, res) {
 var password = req.body.password;
 //检查用户是否存在
 User.findOne({'username':req.body.username},function(err,user){
 if(err){
 console.log('error','err');
 // req.flash('error','登录出错');
 return res.redirect('/');
 }
 console.log(user)
 //用户不存在
 if(!user){
 console.log('error','用户不存在');
 // req.flash('error','用户不存在');
 return res.redirect('/login');
 }
 //判断密码是否一致
 if(req.body.password!=user.password){
 console.log('error','密码错误');
 //  req.flash('error','密码错误');
 return res.redirect('/login');
 }
 //用户名密码都匹配后，将用户信息存入 session
 req.session.user = user;
 console.log(user.username);
 //req.flash('success','登录成功');
 res.redirect('/');
 });

 });


// 首页

router.get('/', function(req, res, next) {
    // res.render('post', { title: '首页' ,user:req.session.user});
    //   获取表单数据
    var title=req.body["title"];
    var article=req.body["article"];
    var usern=req.session.user;
    // res.send(user)
    // 插入函数
    var finddata=function(db,callback){
// 获取指定关联的数据库集合的名字
        var coll3=db.collection("wenzhang");
        // 插入需要放进数据库的数据
        coll3.find({}).toArray(function(err,result){
            callback(result)
        })
    }
    // 链接数据库
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log("链接成功");
            finddata(db,function(result){
                res.render("index",{shuju:result,title:"文章",user:req.session.user});
                console.log(result)
            })
        }
    })
});



// router.post('/post',function(req,res,next){
//     var imgPath = path.dirname(__dirname) + '/public/images/';
//     var form = new formidable.IncomingForm(); //创建上传表单
//     form.encoding = 'utf-8'; //设置编辑
//     form.uploadDir = imgPath; //设置上传目录
//     form.keepExtensions = true; //保留后缀
//     form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
//     form.type = true;
//     form.parse(req, function(err, fields, files) {
//         if (err) {
//             console.log(err);
//             req.flash('error','图片上传失败');
//             return;
//         }
//         var file = files.postImg;//获取上传文件信息
//
//         if(file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/gif' && file.type != 'image/jpg'){
//             console.log('上传文件格式错误，只支持png,jpeg,gif');
//             req.flash('error','上传文件格式错误，只支持png,jpeg,gif');
//             return res.redirect('/upload');
//         }
//         var title = fields.title;
//         var author = req.session.user.username;
//         var article = fields.article;
//         var postImg = file.path.split(path.sep).pop();
//         var pv = fields.pv;
//         // 校验参数
//         try {
//             if (!title.length) {
//                 throw new Error('请填写标题');
//             }
//             if (!article.length) {
//                 throw new Error('请填写内容');
//             }
//         } catch (e) {
//             req.flash('error', e.message);
//             return res.redirect('back');
//         }
//         var post = new Post({
//             title:title,
//             author:author,
//             article:article,
//             postImg:postImg,
//             publishTime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toString(),
//             pv:pv
//         });
//         post.save(function(err){
//             if(err){
//                 console.log('文章发表出现错误');
//                 req.flash('err','文章发表出现错误');
//                 return res.redirect('/post');
//             }
//             console.log('文章录入成功');
//             req.flash('success','文章录入成功');
//             res.redirect('/');
//         });
//     });
// });


// 发表文章
router.get("/post",function(req,res,next){
    res.render("post",{title:"文章",user:req.session.user})
})

// 留言
// 显示留言板的内容
router.get("/say",function(req,res,next){
    //   获取表单数据
    var titi=req.body["titi"];
    var con=req.body["con"];
    var usern=req.session.user;
    // res.send(user)
    // 插入函数
    var finddata=function(db,callback){
// 获取指定关联的数据库集合的名字
        var coll3=db.collection("liuyan");
        // 插入需要放进数据库的数据
        coll3.find({}).toArray(function(err,result){
            callback(result)
        })
    }
    // 链接数据库
    mongodb.connect(db_str,function(err,db){
        if(err){
            console.log(err)
        }else{
            console.log("链接成功");
            finddata(db,function(result){
                res.render("say",{shuju:result,title:"留言",user:req.session.user});
                console.log(result)
            })
        }
    })
})

//退出登录
router.get("/logout",function(req,res,next){
    req.session.destroy(function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/")
        }
    })
})


module.exports = router;
