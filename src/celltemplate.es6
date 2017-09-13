var app=angular.module('myApp',['tcl.table']);
app.controller('myCtrl',["$scope",function($scope){
	$scope.dataTable={
		columns:[ 
			{field:"id",displayName:"编号"},
			{field:"name",displayName:"姓名"},
			{field:"sex",displayName:"性别",cellTemplate:'<span>{{row.sex==1 ? "男" : "女"}}</span>'},
			{field:"age",displayName:"年龄"},
			{field:"registtime",displayName:"注册日期"},
			{field:"status",displayName:"状态"}
		],
		data: [   
			{id:1,name:"曹操",sex:1,age:45,registtime:"1024",status:"启用"},
			{id:2,name:"小乔",sex:0,age:45,registtime:"1024",status:"启用"},
			{id:3,name:"张三",sex:1,age:45,registtime:"1024",status:"启用"},
			{id:4,name:"李四",sex:1,age:45,registtime:"1024",status:"启用"}
		]
	};
}]);