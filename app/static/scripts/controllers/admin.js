'use strict';

//为adminApp模块（后台管理）定义控制器
adminApp.controller('adminCtrl', ['$scope', '$http', function($scope, $http) {

}]);

//后台管理模块左侧导航栏控制器
adminApp.controller('navCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        /**
         * 需求：默认为显示导航第一个功能，点击导航切换右侧页面，且高亮当前导航项
         */

        //设定功能名称
        var navGroups = [{
            navName: '添加类别', //显示的名称
            urlName: 'addType' //对应URL的名称
        },  
            {
                navName: '添加任务',
                urlName: 'addPlan'
            },{
                navName: '添加资料',
            urlName: 'addBook'
            }, 
            {
                navName: '器材申请',
                urlName: 'addDevice'
            },{
                navName: '管理全部类别',
                urlName: 'seeAllType'
            },
            {
                navName: '管理全部任务',
                urlName: 'seeAllPlan'
            }, {
                navName: '管理全部资料',
            urlName: 'seeAllBook'
            }, {
                navName: '管理器材申请',
                urlName: 'seeAllDevice'
            },{
            navName: '添加管理员',
            urlName: 'addAdmin'
        }, {
            navName: '更改密码',
            urlName: 'manageAccount'
        }];
        $scope.navGroups = navGroups;
    }
]);

//添加类别
adminApp.controller('addBookType', ['$scope', '$http',
    function($scope, $http) {
        //检验通过
        $scope.addType = function(valid, event) {
            $scope.formData = {
                typeName: $scope.typeName
            };
            if (valid) {
                //发送数据到后台
                $http({
                    method: 'POST',
                    url: '/addType',
                    headers: {
                        //表单的报头格式
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param($scope.formData) //发送user数据到后台，这里用到了jQ
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.typeName = "";
                        alert(response.data.success);
                    }
                }, function errorCallback(response) {
                    alert("添加类别失败");
                });
            }
        }
    }
]);

//查看全部类别
adminApp.controller('seeAllType', ['$scope', '$http',
    function($scope, $http) {
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 50],
            pageSize: 10,
            currentPage: 1
        };

        //设置页面数据
        $scope.setPagingData = function(data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.bookTypes = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //异步获取页面数据
        $scope.getPagedDataAsync = function(pageSize, page, searchText) {
            setTimeout(function() {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    //获取模拟的书籍json文件
                    $http.get('/seeAllType')
                        .success(function(largeLoad) {
                            data = largeLoad.filter(function(item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data, page, pageSize);
                        });
                } else {
                    $http({
                        method: 'GET',
                        url: '/seeAllType'
                    }).then(function successCallback(response) {
                        if (response.status === 200) {
                            $scope.setPagingData(response.data, page, pageSize);
                        }
                    }, function errorCallback(response) {
                        alert("获取资料失败");
                    });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        //监听排序等
        $scope.$watch('pagingOptions', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.gridOptions = {
            data: 'bookTypes',
            rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
                '<div ng-cell></div>' +
                '</div></div>',
            multiSelect: false,
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: true, //双击修改，单击选中
            enablePinning: true, //列固定
            columnDefs: [{
                field: 'Sort_id',
                displayName: 'id',
                width: '10%',
                // width: 10%,
                pinnable: true,
                sortable: true,
                enableCellEdit: false
            }, {
                field: 'Sort_name',
                displayName: '类别名',
                enableCellEdit: true,
                // width: 220
                width: '30%'
            }, {
                field: 'Sort_id',
                displayName: '修改',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                width: '30%',
                // width: 120,
                cellTemplate: '<div><a class="btn btn-xs btn-success feng-btn-modify" ng-click="updateType(row)"  data="{{row.getProperty(col.field)}}">确认修改</a></div>'
            }, {
                field: 'Sort_id',
                displayName: '删除',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                // width: 120,
                width: '30%',
                cellTemplate: '<div><a class="btn btn-xs btn-danger feng-btn-delete" ng-click="deleteType(row)" data="{{row.getProperty(col.field)}}">删除</a></div>'
                    //ng-click时间触发的时候传入row
            }],
            enablePaging: true,
            showFooter: true,
            showGroupPanel: true, //顶部的分组选项，可以拖拽列
            // jqueryUITheme: true, //更换主题，需要jq-ui-theme文件
            // selectedItems: $scope.mySelections,
            // multiSelect: false, //多选
            totalServerItems: 'totalServerItems',
            // enableCellSelection: true, 
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };

        $scope.updateType = function(row) {
            //包装数据传递到后台
            var obj = {
                id: row.entity.Sort_id,
                typeName: row.entity.Sort_name
            };
            // console.log($.param(obj))
            $http.put('/seeAllType/' + obj.id, obj).success(function(data, status) {
                if (status === 200) {
                    alert(data.success);
                }
            });
        };

        $scope.deleteType = function(row) {
            $http.delete('/seeAllType/' + row.entity.Sort_id).success(function(data, status) {
                if (status === 200) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                    alert(data.success);
                }
            });
        };
    }
]);

//添加书籍
adminApp.controller('addBook', ['$scope', '$http',
    function($scope, $http) {
        //对类别进行加载
        $http.get('/seeAllType')
            .success(function(largeLoad) {
                $scope.types = largeLoad;
            });

        //提交的时候
        $scope.addBook = function(valid, event) {
            $scope.formData = {
                bookName: $scope.bookName,
                writer: $scope.writer,
                typeId: $scope.typeId, //类别
                price: $scope.price,
                pubCompany: $scope.pubCompany,
                pubDate: $scope.pubDate,
                sum: $scope.sum,
                currentNum: $scope.currentNum,
                brief: $scope.brief
                    //缺少imageName,buyDate
            };

            //检验通过
            if (valid) {
                //发送数据到后台
                $http({
                    method: 'POST',
                    url: '/addBook',
                    headers: {
                        //表单的报头格式
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param($scope.formData) //发送user数据到后台，这里用到了jQ
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        //添加成功，清空输入项
                        for (var p in $scope.formData) {
                            $scope[p] = '';
                        }
                        alert(response.data.success);
                    }
                }, function errorCallback(response) {
                    alert("添加资料失败");
                });
            }
        }
    }
]);
//添加计划
adminApp.controller('addPlan', ['$scope', '$http',
    function ($scope, $http) {
        //对类别进行加载
        $http.get('/seeAllPlan')
            .success(function (largeLoad) {
                $scope.types = largeLoad;
            });

        //提交的时候
        $scope.addPlan = function (valid, event) {
            $scope.formData = {
                planname: $scope.planname,
                people: $scope.people,
                typeId: $scope.typeId, //类别
                costs: $scope.costs,
                plantime: $scope.plantime,
            };

            //检验通过
            if (valid) {
                //发送数据到后台
                $http({
                    method: 'POST',
                    url: '/addPlan',
                    headers: {
                        //表单的报头格式
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param($scope.formData) //发送user数据到后台，这里用到了jQ
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        //添加成功，清空输入项
                        for (var p in $scope.formData) {
                            $scope[p] = '';
                        }
                        alert(response.data.success);
                    }
                }, function errorCallback(response) {
                    alert("添加任务失败");
                });
            }
        }
    }
]);
//添加任务结束
//添加器材申请信息
adminApp.controller('addDevice', ['$scope', '$http',
    function ($scope, $http) {
        //对类别进行加载
        $http.get('/seeAllDevice')
            .success(function (largeLoad) {
                $scope.types = largeLoad;
            });

        //提交的时候
        $scope.addDevice = function (valid, event) {
            $scope.formData = {
                devicename: $scope.devicename,
                people: $scope.people,
                typeId: $scope.typeId, //类别
                price: $scope.price,
                devicetime: $scope.devicetime,
            };

            //检验通过
            if (valid) {
                //发送数据到后台
                $http({
                    method: 'POST',
                    url: '/addDevice',
                    headers: {
                        //表单的报头格式
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param($scope.formData) //发送user数据到后台，这里用到了jQ
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        //添加成功，清空输入项
                        for (var p in $scope.formData) {
                            $scope[p] = '';
                        }
                        alert(response.data.success);
                    }
                }, function errorCallback(response) {
                    alert("添加器材申请信息失败");
                });
            }
        }
    }
]);
//器材申请结束
//查看全部书籍
adminApp.controller('seeAllBook', ['$scope', '$http',
    function($scope, $http) {
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 50],
            pageSize: 10,
            currentPage: 1
        };

        //设置页面数据
        $scope.setPagingData = function(data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.books = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //异步获取页面数据
        $scope.getPagedDataAsync = function(pageSize, page, searchText) {
            setTimeout(function() {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    //获取模拟的书籍json文件
                    $http.get('/seeAllBook')
                        .success(function(largeLoad) {
                            data = largeLoad.filter(function(item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data, page, pageSize);
                        });
                } else {
                    $http({
                        method: 'GET',
                        url: '/seeAllBook'
                    }).then(function successCallback(response) {
                        console.log(response);
                        if (response.status === 200) {
                            $scope.setPagingData(response.data, page, pageSize);
                        }
                    }, function errorCallback(response) {
                        alert("获取资料失败");
                    });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        //监听排序等
        $scope.$watch('pagingOptions', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.gridOptions = {
            data: 'books',
            rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
                '<div ng-cell></div>' +
                '</div></div>',
            multiSelect: false,
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: true, //双击修改，单击选中
            enablePinning: true, //列固定
            enableColumnResize: true, //可以更改列宽度
            columnDefs: [{
                field: 'Book_num',
                displayName: 'id',
                width: '5%',
                pinnable: true,
                sortable: true,
                enableCellEdit: false
            }, {
                field: 'Book_name',
                displayName: '书名',
                pinnable: true,
                sortable: true,
                enableCellEdit: true
            }, {
                field: 'Writer',
                displayName: '作者',
                pinnable: true,
                sortable: true,
                enableCellEdit: true,
                width: '10%'
            }, {
                field: 'Sort_name',
                displayName: '类别',
                pinnable: true,
                sortable: true,
                enableCellEdit: false,
                width: '8%'
            }, {
                field: 'Sort_id',
                displayName: '类别id',
                visible: false //隐藏列，方便后面修改数据
            }, {
                field: 'Price',
                displayName: '价格',
                enableCellEdit: true,
                width: '5%'
            }, {
                field: 'Pub_company',
                displayName: '出版社',
                enableCellEdit: true,
                width: '10%'
            }, {
                field: 'Pub_date',
                displayName: '出版日期',
                enableCellEdit: true,
                cellFilter: 'date:\'yyyy-MM-dd\'', //过滤器，格式化日期
                width: '10%'
            }, {
                field: 'Current_num',
                displayName: '现有',
                enableCellEdit: true,
                width: '5%'
            }, {
                field: 'Total_num',
                displayName: '总共',
                enableCellEdit: true,
                width: '5%'
            }, {
                field: 'Brief',
                displayName: '简介',
                enableCellEdit: true,
                width: '10%'
            }, {
                field: 'Book_num',
                displayName: '修改',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                width: '8%',
                // width: 120,
                cellTemplate: '<div><a class="btn btn-xs btn-success feng-btn-modify" ng-click="updateBook(row)"  data="{{row.getProperty(col.field)}}">确认修改</a></div>'
            }, {
                field: 'Book_num',
                displayName: '删除',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                // width: 120,
                width: '5%',
                cellTemplate: '<div><a class="btn btn-xs btn-danger feng-btn-delete" ng-click="deleteBook(row)" data="{{row.getProperty(col.field)}}">删除</a></div>'
                    //ng-click时间触发的时候传入row
            }],
            enablePaging: true,
            showFooter: true,
            showGroupPanel: true, //顶部的分组选项，可以拖拽列
            // jqueryUITheme: true, //更换主题，需要jq-ui-theme文件
            // selectedItems: $scope.mySelections,
            // multiSelect: false, //多选
            totalServerItems: 'totalServerItems',
            // enableCellSelection: true, 
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };

        $scope.updateBook = function(row) {
            //包装数据传递到后台
            var obj = {
                id: row.entity.Book_num,
                bookName: row.entity.Book_name,
                writer: row.entity.Writer,
                typeId: row.entity.Sort_id, //类别id
                typeName: row.entity.Sort_name, //类别名
                price: row.entity.Price,
                pubCompany: row.entity.Pub_company,
                //字符串转化为日期，日期转化为年月日格式
                pubDate: new Date(row.entity.Pub_date).toLocaleDateString(),
                sum: row.entity.Total_num,
                currentNum: row.entity.Current_num,
                brief: row.entity.Brief
                    //缺少imageName,buyDate
            };
            // console.log(obj);
            $http.put('/seeAllBook/' + obj.id, obj).success(function(data, status) {
                if (status === 200) {
                    alert(data.success);
                }
            });
        };

        $scope.deleteBook = function(row) {
            $http.delete('/seeAllBook/' + row.entity.Book_num).success(function(data, status) {
                if (status === 200) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                    alert(data.success);
                }
            });
        };
    }
]);
//添加任务
adminApp.controller('seeAllPlan', ['$scope', '$http',
    function ($scope, $http) {
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 50],
            pageSize: 10,
            currentPage: 1
        };

        //设置页面数据
        $scope.setPagingData = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.plan = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //异步获取页面数据
        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    //获取模拟的书籍json文件
                    $http.get('/seeAllPlan')
                        .success(function (largeLoad) {
                            data = largeLoad.filter(function (item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data, page, pageSize);
                        });
                } else {
                    $http({
                        method: 'GET',
                        url: '/seeAllPlan'
                    }).then(function successCallback(response) {
                        console.log(response);
                        if (response.status === 200) {
                            $scope.setPagingData(response.data, page, pageSize);
                        }
                    }, function errorCallback(response) {
                        alert("获取任务失败");
                    });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        //监听排序等
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.gridOptions = {
            data: 'plan',
            rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
                '<div ng-cell></div>' +
                '</div></div>',
            multiSelect: false,
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: true, //双击修改，单击选中
            enablePinning: true, //列固定
            enableColumnResize: true, //可以更改列宽度
            columnDefs: [/*{
                field: 'plan_num',
                displayName: 'id',
                width: '5%',
                pinnable: true,
                sortable: true,
                enableCellEdit: false
            },*/ {
                field: 'planname',
                displayName: '任务',
                pinnable: true,
                sortable: true,
                enableCellEdit: true
            }, {
                field: 'people',
                displayName: '负责人',
                pinnable: true,
                sortable: true,
                enableCellEdit: true,
                width: '10%'
            }, {
                field: 'Sort_name',
                displayName: '类别',
                pinnable: true,
                sortable: true,
                enableCellEdit: false,
                width: '8%'
            }, {
                field: 'Sort_id',
                displayName: '类别id',
                visible: false //隐藏列，方便后面修改数据
            }, {
                field: 'costs',
                displayName: '成本',
                enableCellEdit: true,
                width: '5%'
            },{
                field: 'plantime',
                displayName: '完成时间',
                enableCellEdit: true,
                cellFilter: 'date:\'yyyy-MM-dd\'', //过滤器，格式化日期
                width: '10%'
            },  {
                field: 'plan_num',
                displayName: '修改',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                width: '8%',
                // width: 120,
                cellTemplate: '<div><a class="btn btn-xs btn-success feng-btn-modify" ng-click="updatePlan(row)"  data="{{row.getProperty(col.field)}}">确认修改</a></div>'
            }, {
                field: 'plan_num',
                displayName: '删除',
                enableCellEdit: false,
                sortable: false,
                pinnable: false,
                // width: 120,
                width: '5%',
                cellTemplate: '<div><a class="btn btn-xs btn-danger feng-btn-delete" ng-click="deletePlan(row)" data="{{row.getProperty(col.field)}}">删除</a></div>'
                //ng-click时间触发的时候传入row
            }],
            enablePaging: true,
            showFooter: true,
            showGroupPanel: true, //顶部的分组选项，可以拖拽列
            // jqueryUITheme: true, //更换主题，需要jq-ui-theme文件
            // selectedItems: $scope.mySelections,
            // multiSelect: false, //多选
            totalServerItems: 'totalServerItems',
            // enableCellSelection: true, 
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };

        $scope.updatePlan = function (row) {
            //包装数据传递到后台
            var obj = {
                id: row.entity.plan_num,
                planname: row.entity.planname,
                people: row.entity.people,
                typeId: row.entity.Sort_id, //类别id
                typeName: row.entity.Sort_name, //类别名
                costs: row.entity.costs,
                //字符串转化为日期，日期转化为年月日格式
                plantime: new Date(row.entity.plantime).toLocaleDateString(),
            };
            // console.log(obj);
            $http.put('/seeAllPlan/' + obj.id, obj).success(function (data, status) {
                if (status === 200) {
                    alert(data.success);
                }
            });
        };

        $scope.deletePlan = function (row) {
            $http.delete('/seeAllPlan/' + row.entity.plan_num).success(function (data, status) {
                if (status === 200) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                    alert(data.success);
                }
            });
        };
    }
]);
//添加任务结束
//添加器材申请
adminApp.controller('seeAllDevice', ['$scope', '$http',
    function ($scope, $http) {
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 50],
            pageSize: 10,
            currentPage: 1
        };

        //设置页面数据
        $scope.setPagingData = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.device = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        //异步获取页面数据
        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    //获取模拟的书籍json文件
                    $http.get('/seeAllDevice')
                        .success(function (largeLoad) {
                            data = largeLoad.filter(function (item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data, page, pageSize);
                        });
                } else {
                    $http({
                        method: 'GET',
                        url: '/seeAllDevice'
                    }).then(function successCallback(response) {
                        console.log(response);
                        if (response.status === 200) {
                            $scope.setPagingData(response.data, page, pageSize);
                        }
                    }, function errorCallback(response) {
                        alert("获取器材申请信息失败");
                    });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        //监听排序等
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.gridOptions = {
            data: 'device',
            rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
                '<div ng-cell></div>' +
                '</div></div>',
            multiSelect: false,
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: true, //双击修改，单击选中
            enablePinning: true, //列固定
            enableColumnResize: true, //可以更改列宽度
            columnDefs: [/*{
                field: 'plan_num',
                displayName: 'id',
                width: '5%',
                pinnable: true,
                sortable: true,
                enableCellEdit: false
            },*/ {
                    field: 'devicename',
                    displayName: '器材',
                    pinnable: true,
                    sortable: true,
                    enableCellEdit: true
                }, {
                    field: 'people',
                    displayName: '申请人',
                    pinnable: true,
                    sortable: true,
                    enableCellEdit: true,
                    width: '10%'
                }, {
                    field: 'Sort_name',
                    displayName: '类别',
                    pinnable: true,
                    sortable: true,
                    enableCellEdit: false,
                    width: '8%'
                }, {
                    field: 'Sort_id',
                    displayName: '类别id',
                    visible: false //隐藏列，方便后面修改数据
                }, {
                    field: 'price',
                    displayName: '价格',
                    enableCellEdit: true,
                    width: '5%'
                }, {
                    field: 'devicetime',
                    displayName: '预计归还时间',
                    enableCellEdit: true,
                    cellFilter: 'date:\'yyyy-MM-dd\'', //过滤器，格式化日期
                    width: '10%'
                }, {
                    field: 'device_num',
                    displayName: '修改',
                    enableCellEdit: false,
                    sortable: false,
                    pinnable: false,
                    width: '8%',
                    // width: 120,
                    cellTemplate: '<div><a class="btn btn-xs btn-success feng-btn-modify" ng-click="updateDevice(row)"  data="{{row.getProperty(col.field)}}">确认修改</a></div>'
                }, {
                    field: 'device_num',
                    displayName: '删除',
                    enableCellEdit: false,
                    sortable: false,
                    pinnable: false,
                    // width: 120,
                    width: '5%',
                    cellTemplate: '<div><a class="btn btn-xs btn-danger feng-btn-delete" ng-click="deleteDevice(row)" data="{{row.getProperty(col.field)}}">删除</a></div>'
                    //ng-click时间触发的时候传入row
                }],
            enablePaging: true,
            showFooter: true,
            showGroupPanel: true, //顶部的分组选项，可以拖拽列
            // jqueryUITheme: true, //更换主题，需要jq-ui-theme文件
            // selectedItems: $scope.mySelections,
            // multiSelect: false, //多选
            totalServerItems: 'totalServerItems',
            // enableCellSelection: true, 
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };

        $scope.updateDevice = function (row) {
            //包装数据传递到后台
            var obj = {
                id: row.entity.device_num,
                devicename: row.entity.devicename,
                people: row.entity.people,
                typeId: row.entity.Sort_id, //类别id
                typeName: row.entity.Sort_name, //类别名
                price: row.entity.price,
                //字符串转化为日期，日期转化为年月日格式
                devicetime: new Date(row.entity.devicetime).toLocaleDateString(),
            };
            // console.log(obj);
            $http.put('/seeAllDevice/' + obj.id, obj).success(function (data, status) {
                if (status === 200) {
                    alert(data.success);
                }
            });
        };

        $scope.deleteDevice= function (row) {
            $http.delete('/seeAllDevice/' + row.entity.device_num).success(function (data, status) {
                if (status === 200) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                    alert(data.success);
                }
            });
        };
    }
]);
//器材申请结束
//添加管理员
adminApp.controller('addAdmin', ['$scope', '$http',
    function($scope, $http) {
        //检验通过
        $scope.addAdmin = function(valid, event) {
            if ($scope.psw !== $scope.pswAgain) {
                alert("两次密码输入不一致");
                return;
            }
            $scope.formData = {
                username: $scope.uName,
                password: $scope.psw
            };
            if (valid) {
                //发送数据到后台
                $http({
                    method: 'POST',
                    url: '/addAdmin',
                    headers: {
                        //表单的报头格式
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param($scope.formData) //发送user数据到后台，这里用到了jQ
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        for (var p in $scope.formData) {
                            $scope.uName = $scope.psw = $scope.pswAgain = '';
                        }
                        alert(response.data.success);
                    }
                }, function errorCallback(response) {
                    alert(response.data.success);
                });
            }
        }
    }
]);

//管理当前账号
adminApp.controller('manageAccount', ['$scope', '$http',
    function($scope, $http) {

        //检验通过
        $scope.manageAccount = function(valid, event) {
            if ($scope.psw !== $scope.pswAgain) {
                alert("新密码两次密码输入不一致");
                return;
            }

            $scope.formData = {
                pswOld: $scope.pswOld,
                username: $scope.uName,
                password: $scope.psw
            };
            if (valid) {
                //发送数据到后台
                $http({
                    method: 'POST',
                    url: '/manageAccount',
                    headers: {
                        //表单的报头格式
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param($scope.formData) //发送user数据到后台，这里用到了jQ
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        for (var p in $scope.formData) {
                            $scope.uName = $scope.psw = $scope.pswAgain = $scope.pswOld = '';
                        }
                        alert(response.data.success);
                    }
                }, function errorCallback(response) {
                    alert(response.data.success);
                });
            }
        }
    }
]);
