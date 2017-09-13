# 分页
要使用分页功能，需要在HTML里加入**tcl-table-pagination**指令。这个指令相关的属性有：
* page 当前页码
* pageSize 页行数
* pageSizeList 页大小列表，数组
* totalItems 数组总数

## 分页器
分页控件默认分页器的大小为10个，包括首页和最后一页，如果页数较少，则页码全部展示出来，如果过多，会加省略号，并显示最后一页的按钮，分页器会根据当前的所在页码以及总页数动态改变页码切换按钮。

## 动态渲染
在数据改变或totalItems有变化时，系统也会重新渲染分页器。

## 页切换事件
用户切换页码时，会触发pageChaged事件，tcl.table中所有的事件都被封装在on属性里，如果用户定义了此事件的回调函数，则只用在回调函数中根据页码加载数据即可。
```js
on:{
	pageChaged(from,to){
		//from:切换前的页码
		//to：切换后的页码
		//TODO:loadPageData(to);
	}
}
function loadPageData(page){
	//send http request
	//then set the response data to dataTable.data，and the total rows to dataTable.totalItems
}
```
## loading效果
如果要在表格上启动加载效果，可以设置loading为true，在加载数据完成后再置为false。加载图标使用font-awsome4.x图标，因此使用此属性时需要引入font-awesome的样式库，当然，这不是必须的，也可以自定义加载效果，此div上有样式tcl-table-loading，可对其重新定义，包括加载图标的大小和颜色也可自行修改。
```js
function loadPageData(page){
	//$scope.dataTable.loading=true
	//send http request
	//then set the response data to dataTable.data，and the total rows to dataTable.totalItems; set the loading to false;
}
```

## seek和seekToPage方法
有时要把页码重置为第一页，或者在把数据改变为某一页后让页码也置为指定的一页，则需要有办法操控分页器，指令在dataTable上添加了两个方法可以完成这种功能。
* *seek* 这个方法会把页码置为指令的页，但不会触发pageChange事件，适用于：用户主动改变了data里的数据为某一页，再让分页器显示为那一页；
```js
$scope.dataTable.seek(1);
loadPage(1);
``` 
* *seekToPage* 这个方法分触发pageChange事件，所以调用此方法后在事件里加载数据即可。
```js
$scope.dataTable.seekToPage(1);
...
on:{
	pageChanged(from,to){
		loadPage(to);
	}
}
```