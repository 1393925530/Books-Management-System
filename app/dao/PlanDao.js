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
var insert = function (plan, callback) {
    console.log("plan:" + plan);
    var sql = "insert into t_plan set ?";
    var obj = {
        planname: plan.planname || '',
        people: plan.people || '',
        Sort_id: plan.typeId || 0, //连接类别的外键
        costs: plan.costs || 0,
        plantime: plan.plantime || new Date(),
    };
    console.log(obj);
    try {
        //执行插入语句，成功返回success
        queryWithArgs(sql, obj, function (err, rows) {
            console.log("PlanDaoInsertSuccess:" + rows);
            if (err) {
                console.error("PlanDaoInsertError:" + err);
            }
            callback("success");
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("PlanDaoInsertCatchError:" + er);
        callback(er);
    }
};

exports.insert = insert;

var deleteOne = function (id, callback) {
    var sql = "DELETE FROM t_plan WHERE plan_num = ?";
    try {
        queryWithArgs(sql, id, function (err, rows) {
            console.log("PlanDaoDeleteSuccess:" + rows);
            if (err) {
                console.error("PlanDaoDeleteError:" + err);
            }
            callback("success");
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("PlanDaoDeleteCatchError:" + er);
        callback(er);
    }
};

exports.deleteOne = deleteOne;


var modify = function (plan, callback) {
    var sql = "UPDATE t_plan SET ? WHERE plan_num = " + plan.id;
    console.log("sql:" + sql);

    var obj = {
        plan_num: plan.id,
        planname: plan.planname || '',
        people: plan.people || '',
        Sort_id: plan.typeId || 0, //连接类别的外键
        costs: plan.costs || 0,
        plantime: plan.plantime || new Date(),
    };

    console.log(obj);
    console.log(sql);

    try {
        //执行插入语句，成功返回success
        queryWithArgs(sql, obj, function (err, rows) {
            console.log("PlanDaoModifySuccess:" + rows);
            if (err) {
                console.error("PlanDaoModifyError:" + err);
            }
            callback("success");
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("PlanDaoModifyCatchError:" + er);
        callback(er);
    }
};

exports.modify = modify;


var selectOne = function (id, callback) {
    var sql = "SELECT * FROM t_plan WHERE plan_num = ?";
    try {
        queryWithArgs(sql, id, function (err, rows) {
            console.log("PlanDaoSelectOneSuccess:" + rows);
            if (err) {
                console.error("PlanDaoSelectOneError:" + err);
            }
            callback(rows[0]);
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("PlanDaoSelectOneCatchError:" + er);
        callback(er);
    }
};

exports.selectOne = selectOne;

var selectAll = function (callback) {
    var sql = "select * from t_plan,t_type where t_plan.Sort_id= t_type.Sort_id";
    try {
        //执行插入语句，成功返回success
        query(sql, function (err, rows) {
            console.log("PlanDaoSelectAllSuccess:" + rows);
            if (err) {
                console.error("PlanDaoSelectAllError:" + err);
            }
            callback(rows);
        });
    } catch (er) {
        //错误则输出异常并输出错误
        console.error("PlanDaoSelectAllCatchError:" + er);
        callback(er);
    }
};

exports.selectAll = selectAll;

