# 子表
可以在某一行下添加子表，子表的定义和父表是类似的，也需要有columns和data属性，但是目前子表还不支持复杂的功能，如行选择和分页等。
子表不需要父表定义列，只需要在data里每一行上加subTable属性来定义子表。
```js
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
		{id:1,name:"曹操",sex:"男",age:45,registtime:"1024",status:"启用",subTable:{
			columns:[
				{field:"name",displayName:"名称"},
				{field:"level",displayName:"段位"},
				{field:"exp",displayName:"经验"}
			],
			data:[
				{name:"乒乓球",level:8,exp:"10年"},
				{name:"羽毛球",level:4,exp:"1年3个月"},
				{name:"攀岩",level:2,exp:"1年"}
			]
		}}
	]
}
```
因为每个数据行都可以带一个子表的定义，所以同一个父表里的子表可以相同也可以不同。
*subTable.title* 子表的标题
*dataTable.showGroupHeader* 父表中有子表的行是否要显示一个可折叠列，这样可以把不需要看的子表给折叠起来，方便查看数据。
后续子表还会支持更多内容，如果有需求可以请提Issue。