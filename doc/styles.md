# 表格样式化
tcl.table生成的表格table标签使用了Bootstrap的table table-bordered table-striped样式，可根据需要去重写这些样式，另外添增了tclTable样式，用于自定义。
表格内部的样式通过rowClass,cellClass和headerClass来控制，它们可以是一个字符串，也可以是一个返回样式名的函数。

## 下面是一个综合使用了上述样式的例子：

```js
var app=angular.module('myApp',['tcl.table']);
app.controller('myCtrl',["$scope",function($scope){
	$scope.dataTable={
		rowClass:function(row){
			if(row.status=="0"){
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

		]
	};
}]);
```

其中rowClass:function(row)的参数是其中每一行数据，可根据数据的具体内容返回需要的class。cellClass:function(row,column)中参数分别为行数据和列定义。
注意：如果行样式和列样式同时作用某个单元格时，具体生效的样式取决于CSS在样式文件中定义的优先级。