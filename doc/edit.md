# 编辑功能

**编辑可以基于cellTemplate来实现，在cellTemplate里增加form元素，也可把表单元素与数据双向绑定。**

```js
columns:[
	{field:"title",displayName:"标题",cellTemplate:'<input type="text" placeholder="请输入标题" ng-model="row.title">'}
]
```

对于可编辑的列，建议增加样式cellClass:"tcl-table-cell-editable"，这样做可以使单元格上的上下8px的内边距置0，也方便样式重写。