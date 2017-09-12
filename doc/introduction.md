# 快速入门
1、在JS中引入tcl.table模块并定义表格列
Javascript code:
```js
var app=angular.module('myApp',['tcl.table']);
app.controller('myCtrl',["$scope"){
	$scope.dataTable={
		columns:[ 
			{field:"id",displayName:"编号"},
			{field:"name",displayName:"姓名"},
			{field:"sex",displayName:"性别"},
			{field:"age",displayName:"年龄"},
			{field:"registtime",displayName:"注册日期"},
			{field:"status",displayName:"状态"}
		],
		data: [   

		]
	};
```
2、在HTML中引用样式和指令
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>tclTable快速入门</title>
    <link rel="stylesheet" href="../plugins/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="../plugins/fontawesome/css/font-awesome.min.css" />
    <link rel="stylesheet" href="../plugins/animate/animate.min.css" />
	<link rel="styleSheet" href="../plugins/tcl/tcl.table.simple.scss"/>
	<script src="../plugins/jquery/jquery.min.js"></script>
	<script src="../plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="../plugins/angular/angular.min.js"></script>
    <script src="../plugins/tcl/tclSimpleTable.es6"></script>
    <script src="helloTable.es6"></script>
</head>
<body ng-app="myApp">
	<div ng-controller="myCtr">
        <h4>表格示例</h4>
        <div class="table-overflow" tcl-table-simple="dataTable"></div>
	</div>
</body>
</html>
```