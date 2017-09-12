var app=angular.module('myApp',['tcl.table']);
app.controller('myCtrl',["$scope",'$timeout',function($scope,$timeout){
	$scope.dataTable={
		columns:[ 
			{field:"id",displayName:"编号"},
			{field:"name",displayName:"姓名"},
			{field:"sex",displayName:"性别"},
			{field:"age",displayName:"年龄"},
			{field:"registtime",displayName:"注册日期"},
			{field:"status",displayName:"状态"}
		],
		pageSize:5,
		data: [   
		],
		on:{
			pageChanged(from,to){
				loadPage(to);
			}
		}
	};
	//模拟数据
	let pageData1={
		data:[
			{id:1,name:"曹操",sex:"男",age:45,registtime:"1024",status:"启用"},
			{id:2,name:"貂蝉",sex:"女",age:18,registtime:"1024",status:"启用"},
			{id:3,name:"诸葛亮",sex:"男",age:35,registtime:"1024",status:"启用"},
			{id:4,name:"孙策",sex:"男",age:40,registtime:"1024",status:"启用"},
			{id:5,name:"小乔",sex:"男",age:20,registtime:"1026",status:"禁用"}
		],
		totalItems:10
	};
	let pageData2={
		data:[
			{id:6,name:"吕布",sex:"男",age:45,registtime:"1024",status:"启用"},
			{id:7,name:"张飞",sex:"女",age:18,registtime:"1024",status:"启用"},
			{id:8,name:"魏延",sex:"男",age:35,registtime:"1024",status:"启用"},
			{id:9,name:"关羽",sex:"男",age:40,registtime:"1024",status:"启用"},
			{id:10,name:"赵子龙",sex:"男",age:20,registtime:"1026",status:"禁用"}
		],
		totalItems:10
	};

	function loadPage(page=1,rows=5){
		$timeout(function(){
			$scope.dataTable.loading=true;
		});
		
		$timeout(function(){
			if(page==1){
				$scope.dataTable.data=pageData1.data;
				$scope.dataTable.totalItems=pageData1.totalItems;
			}else{
				$scope.dataTable.data=pageData2.data;
				$scope.dataTable.totalItems=pageData2.totalItems;
			}
			$scope.dataTable.loading=false;
		},1000);
	}
	loadPage(1);//默认加载第一页

}]);