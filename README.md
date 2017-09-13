# tclTable
A table moudule based on [**Bootstrap3+**](http://v3.bootcss.com/,访问Bootstrap官网) and [**AngularJS 1.x**](https://angular.cn/) .

# Features
Table with configuration in Angular controller $scope object and structure HTML defination in .html document, you can get columns defination, header column class defination, table body cell class defination, table body cell custom template, row class defination , row select (both single select and multi-select are supported), pagination, editable table cell,column width drag, multi-row header, column frozen, column frozen with header fixed...

> 使用基于Angular 控制器里$scope对象上绑定配置，结合html文档中的指令引用，提供列定义，列头样式定义，表格单元格样式定义，表格单元格自定义模板，行样式定义，行选择（支持单选和多选），分页，表格编辑，列宽拖动，多行表头，列冻结，列冻结并且列头固定等功能。

**tcl.table模块提供了一个服务和五个指令，这五个指令分别实现四种表格，它们分别是:**
* 1、**标准表** `tcl-simple-table`，又叫简单表，表头为单行，附带行选择、列宽拖动，编辑，分页等功能。
* 2、**多行表头表** `simple-table-custom-header 或 simple-table-multi-columns`，在简单表的基础上实现多行表头。
* 3、**两列表**`table-besides-columns`，又叫冻结表，可以实现列冻结和多行表头，由左右两个table实现。
* 4、**复杂表**`complex-table-multi-columns`，在两列表的基础上实现表头固定，表体滚动的效果，由四个table实现。

# Enviroments 
This project based on [FIS3](http://fis.baidu.com) to do the compile work, cause the tcl.table module is write in ES6 and SASS. You can also use other tools such as webpack or gulp.

因为tcl.table模块是使用ES6和SASS来写的，因此需要脚手架来完成编译的工作，你也可以使用其他构建工具，比如webpack或gulp。

I used Nginx as web server，you can use other webserver such as tomcat or JS server write with nodeJS.

我使用了Nginx做为web server,你也可以使用其他服务器软件，比如Tomcat或者自己用Node写一个。

# Demonstrations
This project is support by Li Linlu, and any used in commertial bussiness should has a MIT contract.

本项目作者是李林禄，欢迎一起探讨。

# 文档
* [introduction](https://github.com/lilinlugis/tclTable/blob/master/doc/introduction.md)
* [styles](https://github.com/lilinlugis/tclTable/blob/master/doc/styles.md)
* [select](https://github.com/lilinlugis/tclTable/blob/master/doc/select.md)
* [pagination](https://github.com/lilinlugis/tclTable/blob/master/doc/pagination.md)
* [subtable](https://github.com/lilinlugis/tclTable/blob/master/doc/subtable.md)
* [cellTemplate](https://github.com/lilinlugis/tclTable/blob/master/doc/celltemplate.md)
* [edit](https://github.com/lilinlugis/tclTable/blob/master/doc/edit.md)
* [columnresize](https://github.com/lilinlugis/tclTable/blob/master/doc/columnresize.md)
* [multiheader](https://github.com/lilinlugis/tclTable/blob/master/doc/multiheader.md)
* [bisizestable](https://github.com/lilinlugis/tclTable/blob/master/doc/besizestable.md)
* [complextable](https://github.com/lilinlugis/tclTable/blob/master/doc/complextable.md)