# 行选择功能
行选择在实际应用中非常常见，为了方便使用，指令做了封装，增加行选择功能非常简单，只用把enableSelect设置为true即可。

如果需要多选，只用再把multiSelect设置为true即可。

在有些应用中，表格需要编辑功能，用户鼠标会点击到某个单元格进行编辑，这会触发rowSelect事件，但用户的本意可能并非如此，在这种情况下，行选择列就会比较有用。

行选择列是表格中的一个实际列，只不过这一列不是用来显示数据的，而是用来操作行是否被选中的，对于单选，使用radio来操控，对于multiSelect为true的情况，则改用checkbox实现。要启用行选择列，只需设置showCheckHeader为true即可，在启用行选择列时，行上的点击事件不再触发rowSelect，用户需要点击行选择列中的radio或checkbox来选中或取消选中某一行。

如果要清除已选择的行，可以调用clearSelectedRows方法：
```js
$scope.dataTable.clearSelectedRows();
```