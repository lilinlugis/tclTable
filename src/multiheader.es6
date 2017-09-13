var app = angular.module('sampleApp', ["tcl.table"]);

app.controller("sampleCtrl",["$scope",'$window','$timeout','$sce',function($scope,$window,$timeout,$sce){
    $scope.itemsTable={
        columns:[
            {field:"itemCode",displayName:"物料代码"},
            {field:"itemName",displayName:"物料名称"},
            {field:"itemSpec",displayName:"物料规格"}
        ],
        data:[
            {itemCode:"V8-S38AT01-LF1V001",itemName:"TCL家居智能水晶灯专用灯条",itemSpec:"0.5*5000*5"},
            {itemCode:"V8-RT95001-LF1V001",itemName:"电冰箱内压缩机",itemSpec:"高888，宽444，厚620，重120KG，航空铝材"}
        ]
    };

    $scope.customHeader=$sce.trustAsHtml(`<tr>
        <th rowspan="2" class="v-center text-center">code</th>
        <th rowspan="2" class="v-center text-center">name</th>
        <th colspan="3">第一季</th>
        <th colspan="3">第2季</th>
        <th colspan="3">第3季</th>
        <th colspan="3">第4季</th>
        <th rowspan="2"class="v-center text-center">date</th>
        <th rowspan="2"class="v-center text-center">user</th>
    </tr>
    <tr>
        <th>1</th>
        <th>2</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
        <th>8</th>
        <th>9</th>
        <th>10</th>
        <th>11</th>
        <th>12</th>
    </tr>`);
    $scope.dataTable0={
        totalItems:100,
        pageSize:20,
        rowClass:function(row,index){
            return index%2===0?"success":"";
        },
        columns: [
            {field:'code',width:190},
            {field:'name',width:280},
            {field:'January',width:100},
            {field:'February',width:100},
            {field:'March',width:100},

            {field:'April',width:100},
            {field:'May',width:100},
            {field:'June',width:100},

            {field:'July',width:100},
            {field:'August',width:100},
            {field:'September',width:100},

            {field:'October',width:100},
            {field:'November',width:100},
            {field:'December',width:100},

            {field:'user',width:120},
            {field:'date',width:155,cellTemplate:'<span>{{row[column.field]|date:"yyyy-MM-dd"}}</span>'}
        ],
        data:[
            {code:"01",name:"电视机部",January:1230,February:222,March:332,April:466,May:198,June:884,July:1324,August:394,September:1323,October:1,November:321,December:761,date:1501057290064,user:"李林禄"},
            {code:"01",name:"电视机部",January:1230,February:222,March:332,April:466,May:198,June:884,July:1324,August:394,September:1323,October:1,November:321,December:761,date:1501057290064,user:"李林禄"},
            {code:"01",name:"电视机部",January:1230,February:222,March:332,April:466,May:198,June:884,July:1324,August:394,September:1323,October:1,November:321,December:761,date:1501057290064,user:"李林禄"},
            {code:"01",name:"电视机部",January:1230,February:222,March:332,April:466,May:198,June:884,July:1324,August:394,September:1323,October:1,November:321,December:761,date:1501057290064,user:"李林禄"},
            {code:"01",name:"电视机部",January:1230,February:222,March:332,April:466,May:198,June:884,July:1324,August:394,September:1323,October:1,November:321,December:761,date:1501057290064,user:"李林禄"},
            {code:"01",name:"电视机部",January:1230,February:222,March:332,April:466,May:198,June:884,July:1324,August:394,September:1323,October:1,November:321,December:761,date:1501057290064,user:"李林禄"}
        ],
        on:{
            pageChanged:function(from,to){
                alert(to);
            }
        }
    };
    $scope.dataTable1={
        totalItems:100,
        pageSize:20,
        rowClass:function(row,index){
            return index%2==0?"success":"";
        },
        columns: [
            {field:'code',width:190},
            {field:'name',width:280},
            {field:'season1_01_sale',width:100},
            {field:'season1_01_cost',width:100},
            {field:'season1_02_sale',width:100},
            {field:'season1_02_cost',width:100},
            {field:'season1_03_sale',width:100},
            {field:'season1_03_cost',width:100},

            {field:'season2_01_sale',width:100},
            {field:'season2_01_cost',width:100},
            {field:'season2_02_sale',width:100},
            {field:'season2_02_cost',width:100},
            {field:'season2_03_sale',width:100},
            {field:'season2_03_cost',width:100},

            {field:'season3_01_sale',width:100},
            {field:'season3_01_cost',width:100},
            {field:'season3_02_sale',width:100},
            {field:'season3_02_cost',width:100},
            {field:'season3_03_sale',width:100},
            {field:'season3_03_cost',width:100},

            {field:'season4_01_sale',width:100},
            {field:'season4_01_cost',width:100},
            {field:'season4_02_sale',width:100},
            {field:'season4_02_cost',width:100},
            {field:'season4_03_sale',width:100},
            {field:'season4_03_cost',width:100},
            {field:'saleall',width:120},
            {field:'costall',width:120},
            {field:'date',width:155,cellTemplate:'<span>{{row[column.field]|date:"yyyy-MM-dd"}}</span>'},
            {field:'user',width:120}
        ],
        data:[
            {code:"01",name:"电视机部",
                season1_01_sale:1230,season1_01_cost:222,season1_02_sale:332,season1_02_cost:466,season1_03_sale:198,season1_03_cost:884,
                season2_01_sale:1324,season2_01_cost:394,season2_02_sale:1323,season2_02_cost:1,season2_03_sale:321,season2_03_cost:761,
                season3_01_sale:899,season3_01_cost:99,season3_02_sale:144,season3_02_cost:114,season3_03_sale:7771,season2_03_cost:371,
                season4_01_sale:3300,season4_01_cost:111,season4_02_sale:2323,season4_02_cost:122,season4_03_sale:13,season4_03_cost:721,
                saleall:3298344,costall:382938445,date:1501057290064,user:"李林禄"
            },
            {code:"01",name:"电视机部",
                season1_01_sale:1,season1_01_cost:2,season1_02_sale:3,season1_02_cost:4,season1_03_sale:1,season1_03_cost:4,
                season2_01_sale:1,season2_01_cost:1,season2_02_sale:1,season2_02_cost:1,season2_03_sale:1,season2_03_cost:1,
                season3_01_sale:1,season3_01_cost:1,season3_02_sale:1,season3_02_cost:1,season3_03_sale:1,season2_03_cost:1,
                season4_01_sale:1,season4_01_cost:1,season4_02_sale:1,season4_02_cost:1,season4_03_sale:1,season4_03_cost:1
            }
        ],
        on:{
            pageChanged:function(from,to){
                alert(to);
            }
        }
    };
    $scope.dataTable2={
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
}]);