# 复杂表格

功能：1、列冻结； 2、表头固定，表体滚动。
即要实现某些列冻结，又要让表头固定在顶部，这样的需求是因为有些表比较复杂，列数目较多，而且数据行数也要多，很可能不分页，但要求数据可以滚动，但滚动时又不让整个页面滚动，方便根据列头找对应的数据，此时常常给table设置一个固定高度。

```html
<div class="table-overflow" complex-table-multi-columns="dataTable"  tcl-table-pagination></div>
```

### compositeData参数
compositeData:true可以实现嵌套的数据，合并的字段包含了被合并字段的数据，注意data的定义。

```js
	$scope.dataTable={
        compositeData:true,
        totalItems:100,
        rowClass:"warning",
        columns:[[
                {field:"code",displayName:"部门代码",rowspan:4,headerCellClass:"v-center text-center"},
                {field:"name",displayName:"部门名称",rowspan:4,headerCellClass:"v-center text-center"},
                {field:"year",displayName:"2017",colspan:26,headerCellClass:"danger"},
                {field:"date",displayName:"日期",rowspan:4,headerCellClass:"v-center text-center",width:120},
                {field:"user",displayName:"负责人",rowspan:4,headerCellClass:"v-center text-center"}
            ],[
                {field:"season1",displayName:"第1季",colspan:6,headerCellClass:"success"},
                {field:"season2",displayName:"第2季",colspan:6,headerCellClass:"warning"},
                {field:"season3",displayName:"第3季",colspan:6,headerCellClass:"success"},
                {field:"season4",displayName:"第4季",colspan:6,headerCellClass:"warning"},
                {field:"saleall",displayName:"总销量",rowspan:3,headerCellClass:"v-center text-center primary",width:100},
                {field:"costall",displayName:"总成本",rowspan:3,headerCellClass:"v-center text-center",width:100},
            ],[
                {field:"January",displayName:"1月",colspan:2},
                {field:"February",displayName:"2月",colspan:2},
                {field:"March",displayName:"3月",colspan:2},
                {field:"April",displayName:"4月",colspan:2},
                {field:"May",displayName:"5月",colspan:2},
                {field:"June",displayName:"6月",colspan:2},
                {field:"July",displayName:"7月",colspan:2},
                {field:"August",displayName:"8月",colspan:2},
                {field:"September",displayName:"9月",colspan:2},
                {field:"October",displayName:"10月",colspan:2},
                {field:"November",displayName:"11月",colspan:2},
                {field:"December",displayName:"12月",colspan:2}
            ],[
                {field:'sale',width:100,displayName:"销量",cellClass:"danger"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},

                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},

                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},

                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"},
                {field:'sale',width:100,displayName:"销量"},
                {field:'cost',width:100,displayName:"成本"}
            ]
        ],
        data:[{code:"01",name:"电视机部",
            year: {
                season1: {
                    January: {sale: 1230, cost: 222},
                    February: {sale: 332, cost: 466},
                    March: {sale: 198, cost: 884}
                },
                season2: {
                    April: {sale: 1324, cost: 394},
                    May: {sale: 1323, cost: 1},
                    June: {sale: 321, cost: 761}
                },
                season3: {
                    July: {sale: 899, cost: 99},
                    August: {sale: 144, cost: 114},
                    September: {sale: 7771, cost: 371}
                },
                season4: {
                    October: {sale: 3300, cost: 111},
                    November: {sale: 2323, cost: 122},
                    December: {sale: 13, cost: 721}
                },
                saleall:3298344,
                costall:382938445
            },
            date:1501057290064,
            user:"李林禄"
        }],
        on:{
            pageChanged:function(from,to){
                alert(to);
            }
        }
    };
```js

### compositeData:false则仍然使用简单的数据结构，不需要嵌套，所有的物理列一维展开，注意data的定义。

```js
		$scope.dataTable3={
            totalItems:100,
            rowClass:"warning",
            columns:[[
                {field:"code",displayName:"部门代码",rowspan:4,headerCellClass:"v-center text-center"},
                {field:"name",displayName:"部门名称",rowspan:4,headerCellClass:"v-center text-center"},
                {field:"year",displayName:"2017",colspan:26},
                {field:"date",displayName:"日期",rowspan:4,headerCellClass:"v-center text-center",width:100,cellTemplate:'<span>{{row.date|date:"yyyy-MM-dd"}}</span>'},
                {field:"user",displayName:"负责人",rowspan:4,headerCellClass:"v-center text-center"}
            ],[
                {field:"season1",displayName:"第1季",colspan:6},
                {field:"season2",displayName:"第2季",colspan:6},
                {field:"season3",displayName:"第3季",colspan:6},
                {field:"season4",displayName:"第4季",colspan:6},
                {field:"saleall",displayName:"总销量",rowspan:3,headerCellClass:"v-center text-center"},
                {field:"costall",displayName:"总成本",rowspan:3,headerCellClass:"v-center text-center"},
            ],[
                {field:"January",displayName:"1月",colspan:2},
                {field:"February",displayName:"2月",colspan:2},
                {field:"March",displayName:"3月",colspan:2},
                {field:"April",displayName:"4月",colspan:2},
                {field:"May",displayName:"5月",colspan:2},
                {field:"June",displayName:"6月",colspan:2},
                {field:"July",displayName:"7月",colspan:2},
                {field:"August",displayName:"8月",colspan:2},
                {field:"September",displayName:"9月",colspan:2},
                {field:"October",displayName:"10月",colspan:2},
                {field:"November",displayName:"11月",colspan:2},
                {field:"December",displayName:"12月",colspan:2}
            ],[
                {field:'season1_01_sale',width:100,displayName:"销量"},
                {field:'season1_01_cost',width:100,displayName:"成本"},
                {field:'season1_02_sale',width:100,displayName:"销量"},
                {field:'season1_02_cost',width:100,displayName:"成本"},
                {field:'season1_03_sale',width:100,displayName:"销量"},
                {field:'season1_03_cost',width:100,displayName:"成本"},

                {field:'season2_01_sale',width:100,displayName:"销量"},
                {field:'season2_01_cost',width:100,displayName:"成本"},
                {field:'season2_02_sale',width:100,displayName:"销量"},
                {field:'season2_02_cost',width:100,displayName:"成本"},
                {field:'season2_03_sale',width:100,displayName:"销量"},
                {field:'season2_03_cost',width:100,displayName:"成本"},

                {field:'season3_01_sale',width:100,displayName:"销量"},
                {field:'season3_01_cost',width:100,displayName:"成本"},
                {field:'season3_02_sale',width:100,displayName:"销量"},
                {field:'season3_02_cost',width:100,displayName:"成本"},
                {field:'season3_03_sale',width:100,displayName:"销量"},
                {field:'season2_03_cost',width:100,displayName:"成本"},

                {field:'season4_01_sale',width:100,displayName:"销量"},
                {field:'season4_01_cost',width:100,displayName:"成本"},
                {field:'season4_02_sale',width:100,displayName:"销量"},
                {field:'season4_02_cost',width:100,displayName:"成本"},
                {field:'season4_03_sale',width:100,displayName:"销量"},
                {field:'season4_03_cost',width:100,displayName:"成本"}
            ]
            ],
            data:[{code:"01",name:"电视机部",
                code:"01",name:"电视机部",
                season1_01_sale:1230,season1_01_cost:222,season1_02_sale:332,season1_02_cost:466,season1_03_sale:198,season1_03_cost:884,
                season2_01_sale:1324,season2_01_cost:394,season2_02_sale:1323,season2_02_cost:1,season2_03_sale:321,season2_03_cost:761,
                season3_01_sale:899,season3_01_cost:99,season3_02_sale:144,season3_02_cost:114,season3_03_sale:7771,season2_03_cost:371,
                season4_01_sale:3300,season4_01_cost:111,season4_02_sale:2323,season4_02_cost:122,season4_03_sale:13,season4_03_cost:721,
                saleall:3298344,costall:382938445,date:1501057290064,user:"李林禄"
            }],
            on:{
                pageChanged:function(from,to){
                    alert(to);
                }
            }
        };
```js

> 上例中的数据只保留了一条，在测试时可以模拟大量的数据进行查看，方便出效果。
> 其中v-center或text-middle可以使文字上下居中。
> 在列定义时，物理列可以定义宽度，非物理列不需要指定宽度。