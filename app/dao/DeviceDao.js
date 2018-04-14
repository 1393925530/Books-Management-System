var connection = require('../db/connection');
var queryWithArgs = connection.queryWithArgs;
var query = connection.query;

/*
             输入           输出
insert       Book           信息
delete       Book.id        信息
modify       Book           信息
selectAll    无             [Book]     
selectOne    Book.id        Book
 */

//可以考虑将insert,delete,modify,selectOne,selectAll封装成方法
//将t_book等表格独立出来变成参数传入，然后将传入的对象也封装起来
//这样的话增删查改变成公共接口
var insert = function (device, callback) {
    console.log("device:" + device);
    var sql = "insert into t_device set ?";
    var obj = {
        devicename: device.devicename || '',
        people: device.people || '',
        Sort_id: device.typeId || 0, //连接类别的外键
        price: device.price || 0,
        devicetime: device.devicetime || new Date(),
    };
    console.log(obj);
    try {
        //执行插入语句，成功返回success
        queryWithArgs(sql, obj, function (err, rows) {
            console.log("DeviceDaoInsertSuccess:" + rows);
            if (err) {
                console.error("DeviceDaoInsertError:" + err);
            }
            callback("success");
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("DeviceDaoInsertCatchError:" + er);
        callback(er);
    }
};

exports.insert = insert;

var deleteOne = function (id, callback) {
    var sql = "DELETE FROM t_device WHERE device_num = ?";
    try {
        queryWithArgs(sql, id, function (err, rows) {
            console.log("DeviceDaoDeleteSuccess:" + rows);
            if (err) {
                console.error("DeviceDaoDeleteError:" + err);
            }
            callback("success");
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("DeviceDaoDeleteCatchError:" + er);
        callback(er);
    }
};

exports.deleteOne = deleteOne;


var modify = function (device, callback) {
    var sql = "UPDATE t_device SET ? WHERE device_num = " + device.id;
    console.log("sql:" + sql);

    var obj = {
        device_num: device.id,
        devicename: device.devicename || '',
        people: device.people || '',
        Sort_id: device.typeId || 0, //连接类别的外键
        price: device.price || 0,
        devicetime: device.devicetime || new Date(),
    };

    console.log(obj);
    console.log(sql);

    try {
        //执行插入语句，成功返回success
        queryWithArgs(sql, obj, function (err, rows) {
            console.log("DeviceDaoModifySuccess:" + rows);
            if (err) {
                console.error("DeviceDaoModifyError:" + err);
            }
            callback("success");
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("DeviceDaoModifyCatchError:" + er);
        callback(er);
    }
};

exports.modify = modify;


var selectOne = function (id, callback) {
    var sql = "SELECT * FROM t_device WHERE device_num = ?";
    try {
        queryWithArgs(sql, id, function (err, rows) {
            console.log("DeviceDaoSelectOneSuccess:" + rows);
            if (err) {
                console.error("DeviceDaoSelectOneError:" + err);
            }
            callback(rows[0]);
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("DeviceDaoSelectOneCatchError:" + er);
        callback(er);
    }
};

exports.selectOne = selectOne;

var selectAll = function (callback) {
    var sql = "select * from t_device,t_type where t_device.Sort_id= t_type.Sort_id";
    try {
        //执行插入语句，成功返回success
        query(sql, function (err, rows) {
            console.log("DeviceDaoSelectAllSuccess:" + rows);
            if (err) {
                console.error("DeviceDaoSelectAllError:" + err);
            }
            callback(rows);
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("DeviceDaoSelectAllCatchError:" + er);
        callback(er);
    }
};

exports.selectAll = selectAll;

