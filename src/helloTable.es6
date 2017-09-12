var app=angular.module('myApp',['tcl.table']);
app.controller('myCtrl',["$scope",function($scope){
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
			{id:1,name:"曹操",sex:"男",age:45,registtime:"1024",status:"启用"}
		]
	};
}]);