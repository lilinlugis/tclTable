/**
 * Created by lilinlu on 2017/6/27.
 * 用于信息查看页面中简易表格展示
 */
angular.module("tcl.table",[])
.service("tclTableService",[function(){
    //初始化复杂表的列宽，因为表头是通过模板渲染的，如果合并的列不等与它包含所有列宽度之和，会造成头与体不对应的问题
    //初始化pinLeft属性，如果合并的列pinLeft=true，则它包含的所有列都继承此属性
    //有了此方法，在表格定义时，就不需要在合并的列上定义宽度，当合并的列上定义了pinLeft=true后，它包含的子列不需要再定义了
    function initTCLComplexColumns(tclTable){ 
        let columns=tclTable.columns;
        let compisiteCols=angular.copy(columns[columns.length-1]);//用来辅助计算宽度

        for(let i=columns.length-1;i>0;i--){
            let downCols=columns[i];
            if(i>0){
                let j=i-1;
                let upCols=columns[j];
                let newUpCols=[];

                let startPost=0;
                for(let p=0;p<upCols.length;p++){
                    if(upCols[p].colspan && upCols[p].colspan>1){
                        //取copyColumns[i]里前group[p].cospan个元素,copyGroup
                        let len=upCols[p].colspan;
                        let field=upCols[p].field;
                        let pinLeft=upCols[p].pinLeft;
                        let out= compisiteCols.slice(startPost,startPost+len);
                        let widthSum=0;//合并子列宽度做为主列宽度
                        
                        out.map(item=>{
                            widthSum+=item.width||100;
                            item.pinLeft=pinLeft;
                        });
                        upCols[p].width=widthSum;
                        newUpCols.push(...out);

                        startPost+=len;
                    }else{
                        newUpCols.push(upCols[p]);
                    }
                }
                compisiteCols=newUpCols;
            }
        }
        console.log(tclTable.columns);
        return tclTable;
    }
    //把二维columns数组组成一维的，去除合并的头，如果compositeData为true表示嵌套的数据结构，修改field
    //返回一维的columns用于遍历
    //后期通过tableName来做缓存，如果计算过不再重复计算
    function getRenderColumns(columns,compositeData){

        for(let i=columns.length-1;i>0;i--){
            let downCols=columns[i];
            if(i>0){
                let j=i-1;
                let upCols=columns[j];
                let newUpCols=[];// =angular.copy(copyColumns[j]);

                let startPost=0;
                for(let p=0;p<upCols.length;p++){
                    if(upCols[p].colspan && upCols[p].colspan>1){
                        //取copyColumns[i]里前group[p].cospan个元素,copyGroup
                        let len=upCols[p].colspan;
                        let field=upCols[p].field;
                        let pinLeft=upCols[p].pinLeft;
                        let out= downCols.slice(startPost,startPost+len);
                        let widthSum=0;//合并子列宽度做为主列宽度
                        
                        out.map(item=>{
                            if(compositeData){
                                item.field=field+"."+item.field;
                            }
                            widthSum+=item.width||100;
                            item.pinLeft=pinLeft;
                        });
                        upCols[p].width=widthSum;

                        newUpCols.push(...out);
                        startPost+=len;
                    }else{
                        newUpCols.push(upCols[p]);
                    }
                }
                columns[j]=newUpCols;
                columns.splice(i,1);
            }
            let group =columns[i];
        }
        return columns[0]||[];
    }
    //此方法拥有四种能力：
    //1、根据合并列的PinLeft来指定被合并列的pinLeft属性，
    //2、根据被合并列的列宽（默认100）来指定合并列的列宽，
    //3、初始化$$leftRows和$$rightRows属性来判断冻结和非冻结表要渲染的行数
    //4、初始化$$pinLeftWidth和$$contentWidth来为左右表格指定宽度$$wholeWidth为整表宽度，指令要监测整表宽度变化
    //目的：简化编程里的配置项，让程序来做自动补全的工作
    function initTCLBisidesTable(tclTable,WIDTH){
        let columns=tclTable.columns;
        let compisiteCols=angular.copy(columns[columns.length-1]);//用来辅助计算宽度

        tclTable.$$leftRows=1;//默认左表头一行
        tclTable.$$rightRows=1;//默认右表头一行

        //遍历所有列进行计算
        for(let i=columns.length-1;i>0;i--){
            let u=i-1;
            let leftAddRow=false;
            let rightAddRow=false;
            //循环columns[u]，找出要合并的内容，然后把columns[i]里的pinLeft初始化，把columns[u]里的width初始化
            let pos=0;//计录子列的位置
            
            for(let j=0;j<columns[u].length;j++){
                if(columns[u][j].colspan && columns[u][j].colspan>1){
                    let pinLeft=columns[u][j].pinLeft;
                    if(pinLeft===true && (columns[u][j].rowspan||1)==1){
                        leftAddRow=true;
                    }else{
                        rightAddRow=true;
                    }
                    //把被合并列的pinLeft属性设置一致，并sum(被合并列的宽度)
                    let sumWidth=0;
                    let sumColspanOfChild=0;
                    for(let n=pos;n<columns[u][j].colspan+pos;n++){
                        columns[i][n].pinLeft=pinLeft;
                        sumWidth+=columns[i][n].width||100;
                        sumColspanOfChild+=columns[i][n].colspan||1;
                    }
                    columns[u][j].width=sumWidth;
                    pos+=columns[u][j].colspan;
                    columns[u][j].colspan=sumColspanOfChild;//重置colspan，用来生成html
                }else if(columns[u].width==null ||columns[u].width<0){
                    columns[u].width=100;
                }
            }
            if(leftAddRow){
                tclTable.$$leftRows+=1;
            }
            if(rightAddRow){
                tclTable.$$rightRows+=1;
            }
        }

/*
        for(let i=0;i<columns.length;i++){
            let pos=0;//计录子列的位置
            let leftAddRow=false;
            let rightAddRow=false;
            for(let j=0;j<columns[i].length;j++){
                if(columns[i][j].colspan && columns[i][j].colspan>1){
                    let pinLeft=columns[i][j].pinLeft;
                    if(pinLeft===true){
                        leftAddRow=true;
                    }else{
                        rightAddRow=true;
                    }
                    //把被合并列的pinLeft属性设置一致，并sum(被合并列的宽度)
                    let sumWidth=0;
                    for(let n=pos;n<columns[i][j].colspan+pos;n++){
                        columns[i+1][n].pinLeft=pinLeft;
                        sumWidth+=columns[i+1][n].width||100;
                    }
                    columns[i][j].width=sumWidth;
                    pos+=columns[i][j].colspan;
                }

            }
            if(leftAddRow){
                tclTable.$$leftRows+=1;
            }
            if(rightAddRow){
                tclTable.$$rightRows+=1;
            }
        }*/
        
        //计算$$pinLeftWidth和$$wholeWidth即左右边的总宽度
        var pinLeftWidth=1;
        for(let i=0;i<columns[0].length;i++){
            if(columns[0][i].pinLeft===true){
                pinLeftWidth+=(columns[0][i].width||100)+(columns[0][i].colspan||1 * 1);//需要考虑到border的宽度
            }
        }
        WIDTH=(WIDTH<0 ||WIDTH==null)?window.innerWidth:WIDTH;
        tclTable.$$wholeWidth=WIDTH;
        tclTable.$$pinLeftWidth=pinLeftWidth;

        tclTable.$$contentWidth=(WIDTH-pinLeftWidth)>0?(WIDTH-pinLeftWidth):500;//如果冻结宽度大于总宽度，给右侧列500的宽度
        console.log(tclTable);

        return tclTable;
    }
    return {
        initComplexTable(tclTable){
            return initTCLComplexColumns(tclTable);
        },
        initBisidesTable(tclTable,WIDTH){
            return initTCLBisidesTable(tclTable,WIDTH);
        },
        //page当前页
        //rows每页行数
        //total数据总数
        //pagerLenth显示的分页器项数
        //showEnd显示最后一页或第一页或both
        calculatePager(page,rows,total,pagerLenth=10,showEnd=false){
            if(total==null || total==0) {
                return null;
            }
            let pages=total%rows==0?(total/rows):Math.ceil(total/rows);//计算总页数

            let arr=[];//页码数组
            if(pages<=pagerLenth){
                //生成从1到pages的所有页
                for(let i=1;i<=pages;i++){
                    arr.push(i);
                }
            }else{
                const leftPager=pagerLenth%2==0?(pagerLenth/2-1):(pagerLenth-1)/2;//当前页左侧数目
                const rightPager=pagerLenth%2==0?(pagerLenth/2):(pagerLenth-1)/2;//当前页右侧数目
                let start=page-leftPager;
                let end=page+rightPager;
                if(start<1){
                    let offset=1-start;
                    start=1;
                    end=(end+offset)>pages?pages:(end+offset);
                }
                if(end>pages){
                    let offset=pages-end;
                    end=pages;
                    start=(start+offset)>=1?start+offset:1;
                }
                for(let i=start;i<=end;i++){
                    arr.push(i);
                }
                if(showEnd) {
                    if(start>2){
                        //加上第一页和...
                        arr.splice(0,0,1,"...");
                    }
                    if(end<pages-1){
                        //加上...和最后一页
                        arr.push("...");
                        arr.push(pages);
                    }
                }
            }

            //根据arr页码数组生成页码模板
            let pager=[];
            for(let i=0;i<arr.length;i++){
                let p=arr[i];
                if(page==p){
                    pager.push('<li class="active"><a>'+p+'</a></li>');
                }else if(p=="..."){
                    pager.push('<li class="disabled"><a>'+p+'</a></li>');
                }else{
                    pager.push('<li><a>'+p+'</a></li>');
                }
            }
            let previousCls=page==1?"disabled":"";//第一项的样式
            let nextCls=page==pages?"disabled":"";//最后一项的样式
            let tpl=`<li class="Previous ${previousCls}">
                          <a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>
                        </li>
                        ${pager.join("")}
                        <li class="Next ${nextCls}">
                          <a aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                        </li>`;
            return tpl;

        },
        bindRowSelect:function(tclTable,element){
            if(tclTable.on==null){
                tclTable.on={};
            }

            tclTable.on.rowClick=function(row,el){
                //以下操作只有在enableSelect==true的情况下才生效
                if(tclTable.enableSelect!==true){
                    return;
                }
                let rowEl=angular.element(el.target).parents("tr");

                if(tclTable.multiSelect!=true){
                    //单选时，控件维护一个selectedRow变量
                    if(rowEl.hasClass("active")) {
                        tclTable.selectedRow=null;
                    }else{
                        tclTable.selectedRow=row;
                        // console.log(row);
                    }
                    element.find(".tclTable > tbody >tr").removeClass("active");
                    if(tclTable.selectedRow){
                        rowEl.addClass("active");
                    }
                }else{
                    //多选，控件维护一个selectedRows变量
                    if(rowEl.hasClass("active")) {
                        rowEl.removeClass("active");
                        //移除row
                        for(let i=0;i<tclTable.selectedRows.length;i++) {
                            if(tclTable.selectedRows[i]==row){
                                tclTable.selectedRows.splice(i,1);
                                break;
                            }
                        }
                    }else{
                        rowEl.addClass("active");
                        if(tclTable.selectedRows){
                            tclTable.selectedRows.push(row);
                        }else{
                            tclTable.selectedRows=[row];
                        }
                    }
                }
            };
            //扩展选择方法
            if(tclTable.enableSelect===true){
                //清除所有选择
                tclTable.clearSelectedRows=function(){
                    element.find(".tclTable > tbody >tr").removeClass("active");
                    if(tclTable.multiSelect!=true) {
                        //单选时
                        tclTable.selectedRow=null;
                    }else{
                        if(!tclTable.selectedRows){
                            tclTable.selectedRows=[];//初始化
                        }else{
                            tclTable.selectedRows.length=0;
                        }
                    }
                };

            }
        },
        //pinState:0所有格子都输出，1只输出pinLeft为true的，2只输出pinLeft为false的
        renderMultiHeaderData:function(tclTable,row,element,pinState){
            let columns=tclTable.columns;
            let compositeData=tclTable.compositeData;//是否是复合数据

            let renderColumns=getRenderColumns(angular.copy(columns),compositeData);//要渲染的行数据

            function getXpathVal(obj,xpath){
                if(xpath==null){
                    return null;
                }

                let o=obj;
                let paths=xpath.split(".");
                for(let path of paths){
                    o=o[path];
                    if(o==null){
                        return null;
                    }
                }
                return o;
            }
            //渲染数据，使用数据里的值来合并单元格，colspan,rowspan为合并单元格的属性，列不要定义成这两个名称
            for(let r=0;r<renderColumns.length;r++){
                let column=renderColumns[r];
                if(pinState==1 && column.pinLeft!==true){
                    continue;//状态1，跳过不冻结列
                }else if(pinState==2 && column.pinLeft===true){
                    continue;//状态2，路过冻结列
                }
                let v="";
                if(compositeData){
                    v=getXpathVal(row,column.field);
                    row[column.field]=v;
                }else{
                    v=row[column.field];
                }

                let cellClass=column.visible===false?"hide ":"";//是否可见控制
                
                if(column.cellClass){
                    if(typeof column.cellClass =="string"){
                        cellClass=column.cellClass;
                    }else if(typeof column.cellClass == "function"){
                        cellClass=column.cellClass(row,column);
                    }
                }
                //宽度处理

                let w='';
                if(column.width!=null){
                    w=`style="width:${column.width}px;"`;
                }else{
                    w='style="width:100px;"';//如果是冻结列，没指定宽度则默认100
                }
                //单元格合并处理
                if(v==="ROW_COLUMN_IGNORE"){
                    continue;//如果设置为此值，则跳过这行数据这一列的输出，用来合并单元格
                }
                let colspan='';let rowspan=''; 
                if(typeof v=="object"){
                    if(row[column.field]["colspan"]!=null){
                        colspan=' colspan='+row[column.field]["colspan"]+' ';
                    }
                    if(row[column.field]["rowspan"]!=null){
                        rowspan=' rowspan='+row[column.field]["rowspan"]+' ';
                        cellClass+=" text-middle merge-cell";
                    }   
                    v=v.value;
                }
                
                if(column.cellTemplate){
                    let tv=$compile(column.cellTemplate)(scope);//编译
                    let td=angular.element(`<td ${colspan} ${rowspan} class="${cellClass}" ${w}><div class="t-simple-cell" ${w}></div></td>`);
                    td.find(".t-simple-cell").append(tv);
                    element.parents("tr").append(td);
                }else{
                    let td=`<td ${colspan} ${rowspan}  class="${cellClass}" ${w}><div class="t-simple-cell" ${w}>${v==null?"":v}</div></td>`;
                    element.parents("tr").append(td);
                }
            }
            element.remove();
        },
        //此方法可以根据列上的值合并单元格，相邻行上同样字段上值相同的单元格将被处理成合并
        //例：后台返回data=[{group:"male",name:"张三"},{group:"male",name:"李四"},{group:"female",name:"丽丽"},{group:"female",name:"娜娜"}]
        //调用：combineColumnCells(tclTable,data,"group"||["group"],false)
        //得到的结果[{group:"male",name:"张三"},{group:"ROW_COLUMN_IGNORE",name:"李四"},{group:"female",name:"丽丽"},{group:"ROW_COLUMN_IGNORE",name:"娜娜"}]

        //第一个参数：原表定义，这个参数要用来获取输出列的一维数组，用来判断row上面哪些后续字段要被赋于ROW_COLUMN_IGNORE这个值，有这个值的字段在渲染时将被直接忽略
        //,如果第一个参数为null，则不处理rowspan，只处理colspan，因为程序不知道指定的fields后续的列叫什么，无法处理其他列的数据
        //第二个参数：需转换的数据，后台返回的数据不需要处理合并单元格的问题，每一行上需要合并的单元格具有相同的值即可
        //第三个参数：需要处理的字段，哪些列需要根据内容合并单元格
        //第四个参数：是否要前端重排序，推荐后端来排序，TODO:支持-1，0，1正反排序
        combineColumnCells:function(tclTable,data,fields,changeOrder=false){
            //如果fields是字符串，则只处理一列数据，如果是数组，则同时处理多列数据，如果changeOrder为true，则先对data数据进行排序处理。
            //参数判断，把fields统一转成数组
            if(data==null || fields==null){
                throw new Error("输入的data数据和字段不能为空");
            }
            if(typeof fields == "string"){
                fields=[fields];//转成
            }
            if(changeOrder){
                data.sort(function(row1,row2){
                    for(let i=0;i<fields.length;i++){
                        let field=fields[i];
                        if(row1[field]!=row2[field]){
                            return row1[field]>row2[field];
                        }else{
                            continue;//相等时再判断下一个字段
                        }
                    }
                    return true;
                });
            }
            //开始处理单元格
            let renderColumns=tclTable!=null?getRenderColumns(angular.copy(tclTable.columns),tclTable.compositeData):[];
            function getFieldIndex(field){
                for(let i=0;i<renderColumns.length;i++){
                    if(renderColumns[i].field==field){
                        return i;
                    }
                }
                throw new Error("指定的列名不在要渲染的列定义里！");
            }
            //针对每一列单独处理？
            for(let f=0;f<fields.length;f++){
                let field=fields[f];
               
                for(let i=0;i<data.length;i++){
                    let row=data[i];
                    let value=row[field];
                    if(value=="ROW_COLUMN_IGNORE"){
                        continue;
                    }
                    let j=i+1;

                    let colspan=row[field+"$colspan"];
                    let fieldIndex=getFieldIndex(field);
                    if(tclTable!=null && colspan>1){
                        row[field]={
                            value:value,
                            colspan:colspan
                        };//需要合并列
                        for(let c=1;c<colspan;c++){
                            row[renderColumns[fieldIndex+c].field]="ROW_COLUMN_IGNORE";
                        }
                    }
                    
                    for(;j<data.length;j++){
                        let nextRow=data[j];
                        if(nextRow[field]!=value && value!=""){
                            break;//遇到不等的，中断
                        }else{
                            nextRow[field]="ROW_COLUMN_IGNORE";
                            if(tclTable!=null && colspan>1){//如果有列合并，对此行数据的后续列进行处理
                                for(let c=1;c<colspan;c++){
                                    nextRow[renderColumns[fieldIndex+c].field]="ROW_COLUMN_IGNORE";
                                }
                            }
                            
                        }
                    }
                    if(j-i>1){
                        //需要合并rowspan
                        if(typeof row[field] =="object"){
                            row[field].rowspan=j-i;
                        }else{
                            row[field]={value:value,rowspan:j-i};
                        }
                    }
                    i=j-1;//从下一组开始找
                }
            }
            
            return data;
        },
        //在tclTable的指令rowIndex和列column上合并单元格，可根据callback来确定合并策略，其参数为被合并的单元格的值（数组）
        //如果不指定callback，默认合并格子的值取左上角单元格的值
        //TODO:要支持批量操作cells[{rowIndex,field,rowspan=1,colspan=1}]
        //TODO：优化：在赋值之前就合并
        combineCells:function(tclTable,rows,mergeCells,callback=null){
            
            let data=angular.copy(rows||tclTable.data);//复制一份再赋回，目的是让引用地址变化，触发表格数据重绘
            if(data==null||data.length<1){
                throw new Error("没有数据呀");
            }
            //开始处理单元格
            let renderColumns=tclTable!=null?getRenderColumns(angular.copy(tclTable.columns),tclTable.compositeData):[];
            function getFieldIndex(field){
                for(let i=0;i<renderColumns.length;i++){
                    if(renderColumns[i].field==field){
                        return i;
                    }
                }
                throw new Error("指定的列名不在要渲染的列定义里！");
            }
            for(let t=0;t<mergeCells.length;t++){
                let cell=mergeCells[t];
                let field=cell.field;
                let colspan=cell.colspan||1;
                let rowspan=cell.rowspan||1;
                let rowIndex=cell.rowIndex;
                
                //处理单个CELL
                let colIndex=getFieldIndex(field);
                if(data.length<rowIndex+rowspan || (colspan>1 && renderColumns.length<colIndex+colspan ) ){
                    throw new Error("数据索引超过最大值！");
                }
                
                let v=data[rowIndex][field];//合并的值
                let cells=[];//合并的单元格数据
                for(let r=rowIndex;r<rowIndex+rowspan;r++){
                    let subRow={};
                    for(let c=colIndex;c<colIndex+colspan;c++){
                        let subField=renderColumns[c].field;
                        subRow[subField]=angular.copy(data[r][subField]);
                        data[r][subField]="ROW_COLUMN_IGNORE";
                    }
                    cells.push(subRow);
                }
                if(callback){
                    v=callback(cells);//调用用户指令的处理方法
                }
                data[rowIndex][field]={value:v,colspan,rowspan};
            }
            tclTable.data=data;//地址改变将导致数据重绘
        }
    };
}])
//表一
//第一个表格，最简的，不支持复合表头及冻结，支持分页、选择（多选和单选、radio/checkbox选择）、单元格及行样式、单元格模板化、子表
.directive("tclTableSimple",["$compile",'tclTableService','$timeout',function($compile,tclTableService,$timeout){
    return{
        restrict:"A",
        template:function(ele,attrs){
            var dataSourceName=attrs["tclTableSimple"];
            var tpl= `<div ng-if="${dataSourceName}.loading===true" class="tcl-table-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
                      <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading===true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
						<thead>
							<tr>
							    <th ng-if="${dataSourceName}.shoGroupHeader" class="group-header-icon" group-header-toggle><i class="fa tcl-groupicon expanded" aria-hidden="true"></i></th>
								<th ng-if="${dataSourceName}.showCheckHeader" class="group-header-icon" style="width:40px;padding: 0 10px;"><input tcl-row-select-change="${dataSourceName}" name="SELECTALL" ng-if="${dataSourceName}.multiSelect" type="checkbox"/></th>
                                <th ng-repeat="column in ${dataSourceName}.columns" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass" ng-style="{'width':column.width }">
                                    <div ng-style="{'width':column.width }"  class="tcl-header-cell"  ng-class="{'resizeable':${dataSourceName}.columnResizable}">
                                    {{column.displayName}}
                                    <span ng-if="${dataSourceName}.columnResizable" class="resizeEl"></span>
                                    </div>
                                </th>
							</tr>
						</thead>
						<tbody>
                            <tr  ng-repeat="row in ${dataSourceName}.data | filter: ${dataSourceName}.filter" ng-init="$$index=$index" table-row-class="${dataSourceName}" tcl-subtable="row" data-colspan="${dataSourceName}.columns" ng-click="${dataSourceName}.on.rowClick(row,$event,$index)" class="info-bg">
                                <td ng-if="${dataSourceName}.showCheckHeader"  class="group-cell-icon" style="width:40px;">
                                    <input tcl-row-select-change="${dataSourceName}" ng-if="${dataSourceName}.multiSelect" type="checkbox" name="tclsimpletablecheckselect"/>
                                    <input ng-if="!${dataSourceName}.multiSelect"  tcl-row-select-change="${dataSourceName}" name="tclsimpletableradioselect" type="radio"/>
                                </td>
                                <td ng-repeat="column in ${dataSourceName}.columns" ng-class="{hide:column.visible===false}"  ng-style="{'width':column.width }" table-cell-class="column.cellClass">
                                    <div class="t-simple-cell" ng-style="{'width':column.width }" >
                                        <span ng-if="!column.cellTemplate">{{ row[column.field] }}</span>
                                        <span ng-if="column.cellTemplate" table-cell-template="column.cellTemplate"></span>
                                    </div>
                                </td>
                            </tr>
						</tbody>
					</table>
                    <div ng-if="(!!${dataSourceName}.data==false || ${dataSourceName}.data=='') && ${dataSourceName}.loading!==true && ${dataSourceName}.emptyTip===true" class="table-with-no-data">暂无数据</div>`;
            return tpl;
        },
        link : function(scope, element, attrs){
            let tclTable=scope[attrs["tclTableSimple"]];//表格数据

            tclTableService.bindRowSelect(tclTable,element);//绑定选择事件

            function bindResize(){
                var startResizing=false;//标记是否开始拖动
                var el=null;//拖动的元素
                element.find(">.table>thead>tr>th .resizeable>.resizeEl").on("mousedown",function(e){
                    startResizing=!startResizing;
                    el=e.target;
                });

                element.find(">.table>thead").on("mousemove",function(e){
                     if(startResizing && el){
                        let header=$(el).parents("th");

                        let w=e.clientX-header.find(".tcl-header-cell").offset().left;
                        if(w<10){
                            w=10;
                        }
                        let diff=w-header.width();
                        if(diff*diff>4){
                            // column.width=w;
                            $(el).parents("th").width(w).find(".tcl-header-cell").width(w);
                        }
                    }
                });
                document.addEventListener("mouseup",function(){
                    startResizing=false;
                })
                element.find("thead").on("mouseup",function(){
                    startResizing=false;     
                });
            }
            //允许鼠标拖动列宽
            if(tclTable.columnResizable===true){
                $timeout(bindResize,500);
            }
        }
    };
}]).directive("tableCellTemplate",["$compile",function($compile){
    //模板渲染的指令
    return{
        restrict:"A",
        replace: true,
        link : function(scope, element, attrs){
            var template=scope.$eval(attrs["tableCellTemplate"]);
            var html=$compile(template)(scope);
            element.replaceWith(html);
            return ;
        }
    };
}]).directive("tclSubtable",["$compile",function($compile){
    //子表的指令
    return {
        restrict:"A",
        link:function(scope,element,attrs){
            var row=scope.$eval(attrs["tclSubtable"]);
            if(!row.subTable){
                return;
            }
            var len=scope.$eval(attrs["colspan"]).length;
            var subScope=scope.$new();
            // console.log(row.subTable);

            subScope.tableData=row.subTable;
            subScope.parentColumnSize=len;
            if(row.subTable) {
                //生成子表
                var template=`<tr class="tcl-sub-table-wrap"><td colspan="{{parentColumnSize}}">
                            <div class="table-overflow"> 
                                <table class="table table-bordered tcl-sub-table" ng-style="{width:1800}">
                                    <thead>
                                        <tr>
                                            <th ng-repeat="column in tableData.columns" ng-class="{hide:column.visible===false}"  ng-style="{'width':column.width }" table-header-cell-class="column.headerCellClass"><div ng-style="{'width':column.width }">{{column.displayName}}</div></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="row in tableData.data"  table-row-class="tableData">
                                            <td ng-repeat="column in tableData.columns"  ng-class="{hide:column.visible===false}"  ng-style="{'width':column.width }" table-cell-class="column.cellClass">
                                                <div class="t-simple-cell" ng-style="{'width':column.width }">
                                                    <span ng-if="!column.cellTemplate">{{ row[column.field] }}</span>
                                                    <span ng-if="column.cellTemplate" table-cell-template="column.cellTemplate"></span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td></tr>`;
                var html=$compile(template)(subScope);
                element.after(html);
            }
        }
    };
}])
.directive("groupIconToggle",["$compile",function($compile){
    //子表父行折叠效果
    return{
        restrict:"A",
        replace: true,
        link : function(scope, element, attrs){
            element.on("click",function(){
                element.find("i").toggleClass("expanded");
                element.parents("tr").next(".tcl-sub-table-wrap").toggle();
            });
        }
    };
}])
.directive("groupHeaderToggle",["$compile",function($compile){
    //整表的子表折叠效果
    return{
        restrict:"A",
        replace: true,
        link : function(scope, element, attrs){
            element.on("click",function(){
                let $i=element.find("i");
                $i.toggleClass("expanded");
                if($i.hasClass("expanded")){
                    element.parents("table").find("tbody tr.tcl-sub-table-wrap").show();
                    element.parents("table").find(".group-cell-icon i").addClass("expanded");
                }else{
                    element.parents("table").find("tbody tr.tcl-sub-table-wrap").hide();
                    element.parents("table").find(".group-cell-icon i").removeClass("expanded");
                }

            });
        }
    };
}]).directive("tclRowSelectChange",["$compile",'$timeout',function($compile,$timeout){
    return{
        restrict:"A",
        replace: true,
        link : function(scope, element, attrs){
            let row=scope.$eval("row");//行数据
            let tclTable=scope.$eval(attrs["tclRowSelectChange"]);

            //tclTable.on.rowClick=function(row,el){
            //let rowEl=angular.element(el.target).parents("tr");
            if(tclTable.multiSelect===true) {
                element.on("change",function(){
                    if(element.attr("name")=="SELECTALL"){
                        //全选或全不选
                        if(element.prop("checked")==true) {
                            //数据
                            $timeout(function(){
                                for(let i=0;i<tclTable.data.length;i++){
                                    tclTable.selectedRows.push(tclTable.data[i]);
                                }
                            });
                            element.parents(".tclTable").find("> tbody >tr").not(".tcl-sub-table-wrap").addClass("active");//样式
                            element.parents(".tclTable").find("> tbody >tr input:checkbox[name=tclsimpletablecheckselect]").prop("checked",true);//checkbox样式
                        }else{
                            element.parents(".tclTable").find("> tbody >tr").removeClass("active");
                            element.parents(".tclTable").find("> tbody >tr input:checkbox[name=tclsimpletablecheckselect]").prop("checked",false);//checkbox样式
                            tclTable.selectedRows=[];
                        }
                    }else{
                        if(element.prop("checked")==true){
                            $timeout(function(){
                                tclTable.selectedRows.push(row);
                            });
                            element.parents("tr").addClass("active");
                            //全选变成肯定
                            if(tclTable.selectedRows.length==tclTable.data.length){
                                element.parents(".tclTable").find("> thead >tr input:checkbox[name=SELECTALL]").prop("checked",true);
                            }
                        }else{
                            //全选变成否定
                            element.parents(".tclTable").find("> thead >tr input:checkbox[name=SELECTALL]").prop("checked",false);
                            $timeout(function(){
                                for(let i=0;i<tclTable.selectedRows.length;i++){
                                    if(tclTable.selectedRows[i]==row){
                                        tclTable.selectedRows.splice(i,1);
                                        element.parents("tr").removeClass("active");
                                    }
                                }
                            });
                        }
                    }
                });
            }else{
                element.on("click",function(){
                    let rowEl=element.parents("tr");
                    if(tclTable.selectedRow==row){
                        element.prop("checked",false);//取消选中
                        tclTable.selectedRow=null;
                        rowEl.removeClass("active");
                    }else{
                        tclTable.selectedRow=row;
                        element.parents(".tclTable").find("tbody >tr").removeClass("active");
                        rowEl.addClass("active");
                    }
                });
            }
        }
    };
}])
.directive("tableCellClass",["$compile",function($compile){
    //单元格样式
    return{
        restrict:"A",
        replace: true,
        link : function(scope, element, attrs){

            var cellClass=scope.$eval(attrs["tableCellClass"]);
            var row=scope.$eval("row");
            var column=scope.$eval("column");
            if(cellClass){
                if(typeof cellClass =="string"){
                    element.addClass(cellClass);
                }else if(typeof cellClass== "function") {
                    element.addClass(cellClass.call(null,row,column));
                }
            }

        }
    };
}]).directive("tableHeaderCellClass",["$compile",function($compile){
    //头部单元格样式
    return{
        restrict:"A",
        replace: true,
        link : function(scope, element, attrs){
            var headerCellClass=scope.$eval(attrs["tableHeaderCellClass"]);
            var row=scope.$eval("row");
            var column=scope.$eval("column");
            if(headerCellClass){
                if(typeof headerCellClass =="string"){
                    element.addClass(headerCellClass);
                }else if(typeof headerCellClass== "function") {
                    element.addClass(headerCellClass.call(null,row,column));
                }
            }
        }
    };
}])
.directive("tclTablePagination",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        replace: true,
        link : function(scope, element, attrs){
            var dataSourceName=attrs["tclTableSimple"]||attrs["tclTableCustomHeader"]||attrs["tclTableMultiColumns"];

            let start_num=`((${dataSourceName}.page||1)-1)*(${dataSourceName}.pageSize||20)+1`;
            let end_num=`(${dataSourceName}.page||1)*(${dataSourceName}.pageSize||20) > ${dataSourceName}.totalItems ? ${dataSourceName}.totalItems : (${dataSourceName}.page||1)*(${dataSourceName}.pageSize||20)`;

            let tpl_wrap=`<nav class="tclTablePagination" ng-if="${dataSourceName}.totalItems">
                      <ul class="pagination"></ul>
                      <span class="pull-right" 
                style="line-height: 35px;">{{${dataSourceName}.page||1}}/{{${dataSourceName}.pages}}页 共 {{${dataSourceName}.totalItems}}条 当前显示{{${start_num}}}-{{${end_num}}}</span>
                    </nav>`;
            tpl_wrap=$compile(tpl_wrap)(scope);
            element.after(tpl_wrap);
            //TODO:监控page,pageSize,totalItems三个变量，如果有变
            let tclTable=scope[attrs["tclTableSimple"]]||scope[attrs["tclTableCustomHeader"]]||scope[attrs["tclTableMultiColumns"]];//表格数据

            //生成分页器
            function createPager(){
                //移除旧的分页器
                element.next(".tclTablePagination").find(".pagination li").remove();
                element.next(".tclTablePagination").find(".page-list").remove();

                let pageSize=tclTable.pageSize||20;//页大小
                let page=tclTable.page||1;//当前页
                let total=tclTable.totalItems||0;//总数目，如果为0则不分页
                tclTable.pages=total%pageSize==0?(total/pageSize):Math.ceil(total/pageSize);//计算总页数
                //根据total,pageSize,page三个参数生成分页模板
                let tpl=tclTableService.calculatePager(page,pageSize,total,7,true);
                element.next(".tclTablePagination").find(".pagination").append(tpl);

                //每页显示行数变化
                if(tclTable.pageSizeList && tclTable.pageSizeList.length>0) {
                    var list='';
                    for(var o=0;o<tclTable.pageSizeList.length;o++){
                        if(tclTable.pageSizeList[o]==tclTable.pageSize){
                            list+='<option selected>'+tclTable.pageSizeList[o]+'</option>';
                        }else{
                            list+='<option>'+tclTable.pageSizeList[o]+'</option>';
                        }
                    }
                    element.next(".tclTablePagination").find(".pagination").after('<select class="page-list">'+list+'</select>');
                    bindPageSizeChange();
                }


                bindPagerClick();
            }
            //添加事件
            function bindPagerClick(){
                let $pagination=element.next(".tclTablePagination").find(".pagination");
                $pagination.find("li").on("click",function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    let $this=angular.element(this);
                    if($this.hasClass("disabled")){
                        return;//防止其他浏览器下禁用不管用
                    }

                    let scrollTop=$("body").scrollTop();//重置分页器后仍定位到原来的位置
                    let oldPage=Number($pagination.find("li.active").text());
                    if($this.hasClass("disabled")|| $this.hasClass("active")) {
                        //跳过
                    }else{
                        let page=oldPage;
                        if($this.hasClass("Previous")){
                            page--;//到达上一页
                        }else if($this.hasClass("Next")){
                            page++;//到下一页
                        }else{
                            page=Number($this.text());//到指定页
                        }
                        tclTable.page=page;
                        let ons=tclTable.on;
                        if(ons && ons.pageChanged) {
                            //重新生成分页器
                            createPager();
                            $('body').animate({scrollTop: scrollTop}, 'fast');
                            //调用事件加载数据
                            ons.pageChanged(oldPage,page,tclTable.pageSize);
                        }
                    }
                });
            }

            function bindPageSizeChange(){
                let $select=element.next(".tclTablePagination").find(".page-list");
                $select.on("change",function(){
                    let from=tclTable.pageSize;
                    let to=Number($select.val());
                    let ons=tclTable.on;
                    tclTable.pageSize=to;//换成新值
                    if(ons && ons.pageSizeChanged) {
                        ons.pageSizeChanged(from,to);
                    }

                    //$select.trigger("blur");
                });
            }
            //监控totalItems，如果有变化，就重绘页码
            scope.$watch(function(){
                return tclTable.totalItems;
            },function(oldVal,newVal){
                createPager();
            });
            //跳转到指定页去
            tclTable.seekToPage=function(to){
                let $pagination=element.next(".tclTablePagination").find(".pagination");
                let oldPage=Number($pagination.find("li.active").text());
                let scrollTop=$("body").scrollTop();//重置分页器后仍定位到原来的位置
                tclTable.page=to;
                createPager();//重绘页码
                //加载数据
                let ons=tclTable.on;
                if(ons && ons.pageChanged) {
                    $('body').animate({scrollTop: scrollTop}, 'fast');
                    //调用事件加载数据
                    ons.pageChanged(oldPage,to,tclTable.pageSize);
                }
            };
            //激活指定的页，但不触发数据加载，用户需要手动加载数据
            tclTable.seek=function(to){
                tclTable.page=to;
                createPager();//重绘页码，但不触发pageChanged事件
            };

        }
    };
}])
//表二
.directive("tclTableCustomHeader",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        template:function(ele,attrs){
            var dataSourceName=attrs["simpleTableCustomHeader"];
            var header=attrs["header"];
            var headerTemplate=attrs["headerTemplate"];
            var tpl= `<div ng-if="${dataSourceName}.loading==true" class="tcl-table-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
                      <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
						<thead ng-if="!${headerTemplate}" ng-include="'${header}'"></thead>
						<thead ng-if="${headerTemplate}" ng-bind-html="${headerTemplate}"></thead>
						<tbody>
                            <tr  ng-repeat="row in ${dataSourceName}.data" tcl-subtable="row"  table-row-class="${dataSourceName}" data-colspan="${dataSourceName}.columns" ng-click="${dataSourceName}.on.rowClick(row,$event)" class="info-bg">
                                <td ng-if="${dataSourceName}.shoGroupHeader" class="group-cell-icon" group-icon-toggle><i class="fa tcl-groupicon expanded" aria-hidden="true"></i></td>
                                <td ng-repeat="column in ${dataSourceName}.columns" ng-class="{hide:column.visible===false}"  table-cell-class="column.cellClass">
                                    <div class="t-simple-cell" ng-style="{'width':column.width }" >
                                        <span ng-if="!column.cellTemplate">{{ row[column.field] }}</span>
                                        <span ng-if="column.cellTemplate" table-cell-template="column.cellTemplate"></span>
                                    </div>
                                </td>
                            </tr>
						</tbody>
					</table>`;
            return tpl;
        },
        link : function(scope, element, attrs){
            let tclTable=scope[attrs["simpleTableCustomHeader"]];//表格数据

            tclTableService.bindRowSelect(tclTable,element);
        }
    };
}])
//表二变体
.directive("tclTableMultiColumns",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        template:function(ele,attrs){
            var dataSourceName=attrs["tclTableMultiColumns"];
            var tpl= `<div ng-if="${dataSourceName}.loading==true" class="tcl-table-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
                  <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
					<thead>
						<tr ng-repeat="columnGroup in ${dataSourceName}.columns">
						    <!--<th ng-if="${dataSourceName}.shoGroupHeader" class="group-header-icon" group-header-toggle><i class="fa tcl-groupicon expanded" aria-hidden="true"></i></th>-->
							<th ng-repeat="column in columnGroup" attr-colspan="{{column.colspan||''}}" attr-rowspan="{{column.rowspan||''}}" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass"><div ng-style="{width:column.width }" >{{column.displayName}}</div></th>
						</tr>
					</thead>
					<tbody>
                        <tr  ng-repeat="row in ${dataSourceName}.data" tcl-subtable="row"  table-row-class="${dataSourceName}"  data-colspan="${dataSourceName}.columns" ng-click="${dataSourceName}.on.rowClick(row,$event)" class="info-bg">
                            <td ng-if="${dataSourceName}.shoGroupHeader" class="group-cell-icon" group-icon-toggle><i class="fa tcl-groupicon expanded" aria-hidden="true"></i></td>
                            <td table-body-due-columns="${dataSourceName}.columns"></td>
                        </tr>
					</tbody>
				</table>`;
            return tpl;
        },
        link : function(scope, element, attrs){
            let tclTable=scope[attrs["tclTableMultiColumns"]];//表格数据

            tclTableService.bindRowSelect(tclTable,element);
        }
    };
}])
.directive("attrColspan",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        replace:true,
        link : function(scope, element, attrs){
            if(attrs.attrColspan){
                element.attr("colspan",attrs.attrColspan);
            }
        }
    };
}])
.directive("attrRowspan",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        replace:true,
        link : function(scope, element, attrs){
            if(attrs.attrRowspan){
                element.attr("rowspan",attrs.attrRowspan);
            }

        }
    };
}])
.directive("tableRowClass",[function(){
    return{
        restrict:"A",
        replace:true,
        link : function(scope, element, attrs){
            let tclTable=scope[attrs["tableRowClass"]];//表格数据
            if(tclTable && tclTable.rowClass){
                let row=scope.$eval("row");

                if(typeof tclTable.rowClass =="string"){
                    return element.addClass(tclTable.rowClass);
                }else if(typeof tclTable.rowClass =="function"){
                    element.addClass(tclTable.rowClass(row,scope.$index));
                }
            }

        }
    };
}])
//针对二维数组的列定义，使用此指令完成数据渲染
.directive("tableBodyDueColumns",['$compile','tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        replace:true,
        link : function(scope, element, attrs){
            let attrColumn=attrs["tableBodyDueColumns"];
            let tableName=attrColumn.substr(0,attrColumn.indexOf("."));
            let tclTable=scope.$eval(tableName);//表格数据
            let row=scope.$eval("row");

            tclTableService.renderMultiHeaderData(tclTable,row,element,0);
        }
    };
}])
//表四
//使用此指令要指令冻结列的宽度，冻结列如果有多行表头，则组合的总宽度要一致,对应样式table-fixed-columns
.directive("tclQuadTable",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        template:function(ele,attrs){
            var dataSourceName=attrs["tclQuadTable"];
            var tpl =   `<div ng-if="${dataSourceName}.loading==true" class="tcl-table-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
                        <div class="fixed-head">
                            <div class="fixed-left table-overflow">
                                  <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
                                    <thead>
                                        <tr ng-repeat="columnGroup in ${dataSourceName}.columns">
                                            <th ng-repeat="column in columnGroup" ng-if="column.pinLeft===true"  attr-colspan="{{column.colspan||''}}" attr-rowspan="{{column.rowspan||''}}" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass"  ng-style="{'width':column.width||100 }"><div ng-style="{'width':column.width||100 }">{{column.displayName}}</div></th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table-content table-overflow">
                                <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
                                    <thead>
                                        <tr ng-repeat="columnGroup in ${dataSourceName}.columns">
                                            <th ng-repeat="column in columnGroup"  ng-if="column.pinLeft!==true" attr-colspan="{{column.colspan||''}}" attr-rowspan="{{column.rowspan||''}}" ng-style="{width:column.width||100}" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass"><div ng-style="{width:column.width||100 }" >{{column.displayName}}</div></th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                        <div class="fixed-body">
                            <div class="fixed-left table-overflow" tcl-complex-table-body-pin-left="${dataSourceName}">
                               
                            </div>
                            <div class="table-content table-overflow" tcl-complex-table-body="${dataSourceName}"></div>
                        </div>
                        
                        <div class="table-footer"></div>
                    `;
            return tpl;
        },
        link : function(scope, element, attrs){
            let tclTable=scope.$eval(attrs["tclQuadTable"]);//表格数据

            //////////////////////表格整体样式设置////////////////////////

            function resizeHeight(){
                if(tclTable.height!=null){
                    //设置整表的高度
                    element.height(tclTable.height);
                    
                    //计算body的高度：总高减头部高，再减footer高
                    const ROW_HEIGHT=38;//默认行高38像素，如果用户设计了别的，此处需计算出来-暂时预留
                    let headerHeight=tclTable.columns.length*ROW_HEIGHT;
                    let footerHeight=tclTable.footerHeight||0;//默认为0
                    let diffHeight=tclTable.height-headerHeight-footerHeight;
                    let finalHeight=diffHeight>0?diffHeight:500;//如果设置太低，默认为500
                    if(diffHeight<=0){
                        element.height(500+headerHeight+footerHeight+exBorderHeight);
                    }
                    element.find(".fixed-body .fixed-left").height(finalHeight);
                    element.find(".fixed-body .table-content").height(finalHeight);
                }
            }

            //计算PinLeft列的宽度，设置左右表的容器宽
            function resizeWidth(){
                const ALLWIDTH=element.width();
                let LEFTWIDTH=0;
                const firstColumns=tclTable.columns[0];
                if(!firstColumns){
                    return;
                }
                for(let i=0;i<firstColumns.length;i++){
                    if(firstColumns[i].pinLeft===true){
                        LEFTWIDTH+=(firstColumns[i].width||100);//没有设置则默认100
                    }
                }
                
                const RIGHTWIDTH=ALLWIDTH-LEFTWIDTH;
                const BORDERWIDTH=2;//左右两边的边框要减去
                element.find(".fixed-left").width(LEFTWIDTH-BORDERWIDTH);
                element.find(".table-content").width(RIGHTWIDTH-BORDERWIDTH);
            }
            resizeHeight();
            setTimeout(resizeWidth);

            tclTable.setPinnedColumn=function(column,pined){
                if(pined){
                    column.pinLeft=true;
                    
                    
                }else{
                    //左侧减少，右侧增加
                    column.pinLeft=false;
                }
                var dataSourceName=attrs["tclQuadTable"];

                //右侧减少，左侧增加
                
                element.find(".fixed-body .table-content").remove();//清空
                
                let body_body=$compile(`<div class="table-content table-overflow" tcl-complex-table-body="${dataSourceName}"></div>`)(scope);
                element.find(".fixed-body").append(body_body);

                element.find(".fixed-body .fixed-left").remove();//清空

                let head_body=$compile(`<div class="fixed-left table-overflow" tcl-complex-table-body-pin-left="${dataSourceName}"></div>`)(scope);
                element.find(".fixed-body").prepend(head_body);

                setTimeout(resizeHeight);
                setTimeout(resizeWidth);
                // tclTableService.renderMultiHeaderData(tclTable,row,element,2);
            };
            tclTable.reRenderTable=function(){
                var dataSourceName=attrs["tclQuadTable"];
                //右侧减少，左侧增加
                element.find(".fixed-body .table-content").remove();//清空
                
                let body_body=$compile(`<div class="table-content table-overflow" tcl-complex-table-body="${dataSourceName}"></div>`)(scope);
                element.find(".fixed-body").append(body_body);

                element.find(".fixed-body .fixed-left").remove();//清空

                let head_body=$compile(`<div class="fixed-left table-overflow" tcl-complex-table-body-pin-left="${dataSourceName}"></div>`)(scope);
                element.find(".fixed-body").prepend(head_body);

                setTimeout(resizeHeight);
                setTimeout(resizeWidth);
            };
            
        }
    };
}])
//下面的两个指令直接写在父指令里，省去
// .directive("tclComplexTableHeaderPinLeft",["$compile",'tclTableService',function($compile,tclTableService){
//     return{
//         restrict:"A",
//         template:function(ele,attrs){
//             var dataSourceName=attrs["tclComplexTableHeaderPinLeft"];
//             var tpl= `<div ng-if="${dataSourceName}.loading==true" class="tcl-table-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
//                       <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
//                         <thead>
//                             <tr ng-repeat="columnGroup in ${dataSourceName}.columns">
//                                 <th ng-repeat="column in columnGroup" ng-if="column.pinLeft===true"  attr-colspan="{{column.colspan||''}}" attr-rowspan="{{column.rowspan||''}}" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass"  ng-style="{'width':column.width||100 }"><div ng-style="{'width':column.width||100 }">{{column.displayName}}</div></th>
//                             </tr>
//                         </thead>
//                     </table>`;
//             return tpl;
//         },
//         link : function(scope, element, attrs){
            
//         }
//     };
// }])
// .directive("tclComplexTableHeader",["$compile",'tclTableService',function($compile,tclTableService){
//     return{
//         restrict:"A",
//         template:function(ele,attrs){
//             var dataSourceName=attrs["tclComplexTableHeader"];
//             var tpl= `<div ng-if="${dataSourceName}.loading==true" class="tcl-table-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
//                     <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
//                         <thead>
//                             <tr ng-repeat="columnGroup in ${dataSourceName}.columns">
//                                 <th ng-repeat="column in columnGroup"  ng-if="column.pinLeft!==true" attr-colspan="{{column.colspan||''}}" attr-rowspan="{{column.rowspan||''}}" ng-style="{width:column.width||100}" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass"><div ng-style="{width:column.width||100 }" >{{column.displayName}}</div></th>
//                             </tr>
//                         </thead>
//                     </table>`;
//             return tpl;
//         },
//         link : function(scope, element, attrs){
            
//         }
//     };
// }])
.directive("tclComplexTableBodyPinLeft",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        template:function(ele,attrs){
            var dataSourceName=attrs["tclComplexTableBodyPinLeft"];  
            var tpl= `<table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
                        <tbody>
                            <tr  ng-repeat="row in ${dataSourceName}.data" table-row-class="${dataSourceName}" tcl-subtable="row" data-colspan="${dataSourceName}.columns" ng-click="${dataSourceName}.on.rowClick(row,$event)" class="info-bg">
                                <td table-body-pined-due-columns="${dataSourceName}.columns"></td>
                            </tr>
                        </tbody>
                    </table>`;
            return tpl;
        },
        link : function(scope, element, attrs){
        }
    };
}])
.directive("tclComplexTableBody",["$compile",'tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        template:function(ele,attrs){
            var dataSourceName=attrs["tclComplexTableBody"];  
            var tpl= `<table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
                        <tbody>
                            <tr  ng-repeat="row in ${dataSourceName}.data" table-row-class="${dataSourceName}" tcl-subtable="row" data-colspan="${dataSourceName}.columns" ng-click="${dataSourceName}.on.rowClick(row,$event)" class="info-bg">
                                <td table-body-unpined-due-columns="${dataSourceName}.columns"></td>
                            </tr>
                        </tbody>
                    </table><div ng-if="(!!${dataSourceName}.data==false || ${dataSourceName}.data=='') && ${dataSourceName}.loading!==true && ${dataSourceName}.emptyTip===true" class="table-with-no-data">暂无数据</div>`;
            return tpl;
        },
        link : function(scope, element, attrs){
            let tclTable=scope.$eval(attrs["tclComplexTableBody"]);//表格数据
            
            element.on("scroll",function(e){
                e.stopPropagation();
                // debugger;
                let left=$(e.target).find(".table").offset().left;
                let top=$(e.target).find(".table").offset().top;
                //非冻结表头随之滚动
                $(e.target).parents(".table-fixed-columns").find(".fixed-head>.table-content .tclTable").offset({
                    top:0,
                    left:left
                }).css("top",0);//TODO：检查是谁修改了样式中的top
                
                //冻结表数据随之滚动
                $(e.target).parents(".table-fixed-columns").find(".fixed-body>.fixed-left .tclTable").offset({
                    left:0,
                    top:top
                });
            });
        }
    };
}])
//渲染冻结表数据
.directive("tableBodyPinedDueColumns",['$compile','tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        replace:true,
        link : function(scope, element, attrs){
            let attrColumn=attrs["tableBodyPinedDueColumns"];
            let tableName=attrColumn.substr(0,attrColumn.indexOf("."));
            let tclTable=scope.$eval(tableName);//表格数据

            let row=scope.$eval("row");
            tclTableService.renderMultiHeaderData(tclTable,row,element,1);
        }
    };
}])
//渲染非冻结数据
.directive("tableBodyUnpinedDueColumns",['$compile','tclTableService',function($compile,tclTableService){
    return{
        restrict:"A",
        replace:true,
        link : function(scope, element, attrs){
            let attrColumn=attrs["tableBodyUnpinedDueColumns"];
            let tableName=attrColumn.substr(0,attrColumn.indexOf("."));
            let tclTable=scope.$eval(tableName);//表格数据

            let row=scope.$eval("row");
            tclTableService.renderMultiHeaderData(tclTable,row,element,2);
        }
    };
}])
//表三
//对应样式table-besides-columns
.directive("tclBisidesTable",["$compile","$window",'tclTableService',function($compile,$window,tclTableService){
    return{
        restrict:"A",
        template:function(ele,attrs){
            var dataSourceName=attrs["tclBisidesTable"];
            var tpl= `<div ng-if="${dataSourceName}.loading==true" class="tcl-table-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
                <div class="pinLeft" ng-style="{width:${dataSourceName}.$$pinLeftWidth}">
                    <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
                        <thead>
                            <tr ng-repeat="columnGroup in ${dataSourceName}.columns" ng-if="$index<${dataSourceName}.$$leftRows">
                                <th ng-repeat="column in columnGroup" title="{{column.displayName}}" ng-if="column.pinLeft===true" attr-colspan="{{column.colspan||''}}" attr-rowspan="{{column.rowspan||''}}" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass"  ng-style="{width:column.width||100 }">
                                    <div class="tcl-header-cell" ng-style="{width:column.width||100 }" >{{column.displayName}}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr  ng-repeat="row in ${dataSourceName}.data" tcl-subtable="row"  table-row-class="${dataSourceName}"  data-colspan="${dataSourceName}.columns" ng-click="${dataSourceName}.on.rowClick(row,$event)" class="info-bg">
                                <td table-body-pined-due-columns="${dataSourceName}.columns"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-content" ng-style="{width:${dataSourceName}.$$wholeWidth-${dataSourceName}.$$pinLeftWidth-16}">
                    <table class="table table-bordered table-striped tclTable" ng-class="{loading:${dataSourceName}.loading==true && (${dataSourceName}.data==null || ${dataSourceName}.data.length==0)}">
                        <thead>
                            <tr ng-repeat="columnGroup in ${dataSourceName}.columns" ng-if="$index<${dataSourceName}.$$rightRows">
                                <th ng-repeat="column in columnGroup" ng-if="column.pinLeft!==true" attr-colspan="{{column.colspan||''}}" attr-rowspan="{{column.rowspan||''}}" ng-class="{hide:column.visible===false}" table-header-cell-class="column.headerCellClass" ng-style="{width:column.width||100 }">
                                    <div class="tcl-header-cell" ng-style="{width:column.width||100 }" >{{column.displayName}}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr  ng-repeat="row in ${dataSourceName}.data" tcl-subtable="row"  table-row-class="${dataSourceName}"  data-colspan="${dataSourceName}.columns" ng-click="${dataSourceName}.on.rowClick(row,$event)" class="info-bg">
                                <td table-body-unpined-due-columns="${dataSourceName}.columns"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="clear:both;"></div>
                `;
            
            return tpl;
        },
        link : function(scope, element, attrs){
            let tclTable=scope.$eval(attrs["tclBisidesTable"]);//表格数据
            const theWidth=attrs["tclBisidesTable"]+".$$wholeWidth";
            $window.addEventListener("resize",function(){
                // console.log(element.width());
                scope.$apply(function(){
                     tclTable.$$wholeWidth=element.width();
                     element.find(".table-content").width(element.width()-tclTable.$$pinLeftWidth-16);
                 });
            });
        }
    };
}])
;