var config = require('./config.js'),
    BookTypeDao = require('../dao/BookTypeDao.js'),
    PlanDao = require('../dao/PlanDao.js'),
    BookDao = require('../dao/BookDao.js'),
    UserDao = require("../dao/UserDao.js"),
    DeviceDao = require("../dao/DeviceDao.js"),
    md5 = require('md5');


exports.addType = function(req, res) {
    //封装obj
    var obj = {
        typeName: req.body.typeName
    };
    console.log("需要添加到数据库的类别为：" + req.body.typeName);

    // 调用DAO层接口
    BookTypeDao.insert(obj, function() {
        console.warn("添加类别成功");
        //返回给客户端200成功插入反馈
        res.status(200).json({
            success: '添加类别成功'
        });
    });
};

//查看全部类别
exports.seeAllType = function(req, res) {
    BookTypeDao.selectAll(function(rows) {
        res.status(200).json(rows);
    });
};

//修改类别
exports.updateType = function(req, res) {
    var obj = req.body;
    BookTypeDao.modify(obj, function() {
        res.status(200).json({
            success: '修改类别成功'
        });
        console.log("修改类别成功");
    });
};

//删除类别
exports.deleteType = function(req, res) {
    //接受url传递的删除类别的id值
    var id = req.params.id;
    BookTypeDao.deleteOne(id, function() {
        res.status(200).json({
            success: '删除类别成功'
        });;
        console.log("删除类别成功");
    });
};

//添加书籍
exports.addBook = function(req, res) {
    //封装obj
    var obj = {
        bookName: req.body.bookName,
        writer: req.body.writer,
        typeId: req.body.typeId, //连接类别的外键
        price: req.body.price,
        pubCompany: req.body.pubCompany,
        pubDate: req.body.pubDate,
        sum: req.body.sum,
        currentNum: req.body.currentNum,
        // buyDate:         '2007-06-01',
        brief: req.body.brief,
        imageName: ''
    };
    // console.log(obj);
    // 调用DAO层接口
    BookDao.insert(obj, function() {
        console.warn("添加资料成功");
        //返回给客户端200成功插入反馈
        res.status(200).json({
            success: '添加资料成功'
        });
    });
};
//查看全部书籍
exports.seeAllBook = function (req, res) {
    BookDao.selectAll(function (rows) {
        res.status(200).json(rows);
    });
};

//修改书籍
exports.updateBook = function (req, res) {
    var obj = req.body;
    console.log(obj);
    BookDao.modify(obj, function () {
        res.status(200).json({
            success: '修改资料成功'
        });
        console.log("修改资料成功");
    });
};

//删除书籍
exports.deleteBook = function (req, res) {
    //接受url传递的删除类别的id值
    var id = req.params.id;
    BookDao.deleteOne(id, function () {
        res.status(200).json({
            success: '删除资料成功'
        });;
        console.log("删除资料成功");
    });
};

exports.addPlan = function (req, res) {
    //封装obj
    var obj = {
        planname: req.body.planname,
        people: req.body.people,
        typeId: req.body.typeId, //连接类别的外键
        costs: req.body.costs,
        plantime: req.body.plantime,
    };
    // console.log(obj);
    // 调用DAO层接口
        PlanDao.insert(obj, function () {
        console.warn("添加任务成功");
        //返回给客户端200成功插入反馈
        res.status(200).json({
            success: '添加任务成功'
        });
    });
};
exports.seeAllPlan = function (req, res) {
    PlanDao.selectAll(function (rows) {
        res.status(200).json(rows);
    });
};

//修改书籍
exports.updatePlan = function (req, res) {
    var obj = req.body;
    console.log(obj);
    PlanDao.modify(obj, function () {
        res.status(200).json({
            success: '修改任务成功'
        });
        console.log("修改任务成功");
    });
};

//删除书籍
exports.deletePlan = function (req, res) {
    //接受url传递的删除类别的id值
    var id = req.params.id;
    PlanDao.deleteOne(id, function () {
        res.status(200).json({
            success: '删除任务成功'
        });;
        console.log("删除任务成功");
    });
};

exports.addDevice = function (req, res) {
    //封装obj
    var obj = {
        devicename: req.body.devicename,
        people: req.body.people,
        typeId: req.body.typeId, //连接类别的外键
        price: req.body.price,
        devicetime: req.body.devicetime,
    };
    // console.log(obj);
    // 调用DAO层接口
    DeviceDao.insert(obj, function () {
        console.warn("添加器材申请信息成功");
        //返回给客户端200成功插入反馈
        res.status(200).json({
            success: '添加器材申请信息成功'
        });
    });
};
exports.seeAllDevice = function (req, res) {
    DeviceDao.selectAll(function (rows) {
        res.status(200).json(rows);
    });
};

//修改书籍
exports.updateDevice = function (req, res) {
    var obj = req.body;
    console.log(obj);
    DeviceDao.modify(obj, function () {
        res.status(200).json({
            success: '修改器材申请信息成功'
        });
        console.log("修改器材申请信息成功");
    });
};

//删除书籍
exports.deleteDevice = function (req, res) {
    //接受url传递的删除类别的id值
    var id = req.params.id;
    DeviceDao.deleteOne(id, function () {
        res.status(200).json({
            success: '删除器材申请信息成功'
        });;
        console.log("删除器材申请信息成功");
    });
};



//添加管理员
exports.addAdmin = function(req, res) {
    //封装obj
    var obj = {
        username: req.body.username,
        password: req.body.password
    };
    // 调用DAO层接口
    UserDao.insert(obj, function(msg, err) {
        if (err) {
            if (err.errno == 1062)
                res.status(403).json({
                    success: '已有这个账户'
                });
            return;
        }
        console.warn("添加管理员成功");
        //返回给客户端200成功插入反馈
        res.status(200).json({
            success: '添加管理员成功'
        });
    });
};

//管理账号
exports.manageAccount = function(req, res) {
    var obj = {
        username: req.body.username,
        password: md5(req.body.password),
        oldPassword: md5(req.body.pswOld)
    };

    UserDao.selectAll(function(rows) {
        //缓存变量，提高查找效率
        var i, len;
        //获得后台的用户列表数据
        // var userList = JSON.parse(JSON.stringify(rows));
        for (i = 0, len = rows.length; i < len; i++) {

            console.log("需要数据库匹配的账号为：" + obj.username);
            console.log("需要数据库匹配的密码为：" + obj.oldPassword);

            if (rows[i].Admin_name === obj.username && rows[i].Admin_password === obj.oldPassword) {
                obj.id = rows[i].Admin_id; //添加id
                console.log(rows[i]);
                console.log(obj);
                break;
            }
        }

        if (i < len) {
            //找到了用户
            console.log("找到了用户");
            //修改密码
            UserDao.modify(obj, function(msg, err) {
                if (err) {
                    res.status(403).json({
                        success: '账号或密码错误'
                    });
                }
                res.status(200).json({
                    success: '修改成功'

                });
            });

        } else {
            res.status(403).json({
                success: '找不到用户'
            });
        }
    });
};
