var app=angular.module('myApp',['tcl.table']);
app.controller('myCtrl',["$scope",function($scope){
	$scope.dataTable={
		rowClass:function(row){
			if(row.status=="禁用"){
				return "danger";
			}
		},
		columns:[ 
			{field:"id",displayName:"编号"},
			{field:"name",displayName:"姓名",cellClass:"info"},
			{
				field:"sex",displayName:"性别",
				cellClass:function(row,column){
					if(row[column.field]=="男"){
						return "success";
					}else{
						return "warning";
					}
				}
			},
			{field:"age",displayName:"年龄",headerCellClass:"text-red"},
			{field:"registtime",displayName:"注册日期"},
			{field:"status",displayName:"状态"}
		],
		data: [   
			{id:1,name:"曹操",sex:"男",age:45,registtime:"1024",status:"启用"},
			{id:1,name:"貂蝉",sex:"女",age:18,registtime:"1024",status:"启用"},
			{id:1,name:"诸葛亮",sex:"男",age:35,registtime:"1024",status:"启用"},
			{id:1,name:"小乔",sex:"男",age:20,registtime:"1026",status:"禁用"}
		]
	};
}]);