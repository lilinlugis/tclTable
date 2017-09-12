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