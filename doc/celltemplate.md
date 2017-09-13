# 单元格模板

**cellTemplate**

在列的定义里可以使用cellTemplate，以便实现更加高级的功能，比如对数据进行翻译，或格式化输出，或者实现编辑功能。

cellTemplate可以定义模板html，在模板里可以使用$scope上的变量或方法，另外，还可以使用模板所在作用域上的变量，包括row,column,$$index，其中row代表了当前行数据，column为当前列的定义，$$index为当前行的索引。

如果要使用当前单元格的值，可以使用row.name或row[column.field]  （假设当前列的字段为name）。

```js
{
  name:"edit",
  displayName:"编辑",
  width:60,
  cellTemplate:'<a href="javascript:void(0);" class="text-primary" title="编辑" ng-click="edit(row)"><i  ng-class="getIcon(row)" aria-hidden="true"></i></a>'
},
{field:"sex",displayName:"性别",cellTemplate:'<span>{{row.sex==1 ? "男" : "女"}}</span>'},
{field:"sex",displayName:"性别",cellTemplate:'{{formatSourceType(row[column.field]);}}'}
```

cellTemplate里的HTML会被编译后放到div.tcl-simple-cell中，请注意样式的影响。

在模板里，当然可以使用各种Angular指令。
