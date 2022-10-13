//pointage.js ligne80
jQuery(grid_selector).jqGrid({
    //direction: "rtl",

    //subgrid options
    subGrid : true,
    //subGridModel: [{ name : ['No','Item Name','Qty'], width : [55,200,80] }],
    //datatype: "xml",
    subGridOptions : {
        plusicon : "ace-icon fa fa-plus center bigger-110 blue",
        minusicon  : "ace-icon fa fa-minus center bigger-110 blue",
        openicon : "ace-icon fa fa-chevron-right center orange"
    },
    //for this example we are using local data
    subGridRowExpanded: function (subgridDivId, rowId) {
        var subgridTableId = subgridDivId + "_t";
        $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
        $("#" + subgridTableId).jqGrid({
            datatype: 'local',
            data: subgrid_data,
            colNames: ['No','Item Name','Qty'],
            colModel: [
                { name: 'id', width: 50 },
                { name: 'name', width: 150 },
                { name: 'qty', width: 50 }
            ]
        });
    },
    


    data: grid_data,
    datatype: "local",
    height: 250,
    colNames:[' ', 'ID','Last Sales','Name', 'Stock', 'Ship via','Notes'],
    colModel:[
        {name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
            formatter:'actions', 
            formatoptions:{ 
                keys:true,
                //delbutton: false,//disable delete button
                
                delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback},
                //editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
            }
        },
        {name:'id',index:'id', width:60, sorttype:"int", editable: true},
        {name:'sdate',index:'sdate',width:90, editable:true, sorttype:"date",unformat: pickDate},
        {name:'name',index:'name', width:150,editable: true,editoptions:{size:"20",maxlength:"30"}},
        {name:'stock',index:'stock', width:70, editable: true,edittype:"checkbox",editoptions: {value:"Yes:No"},unformat: aceSwitch},
        {name:'ship',index:'ship', width:90, editable: true,edittype:"select",editoptions:{value:"FE:FedEx;IN:InTime;TN:TNT;AR:ARAMEX"}},
        {name:'note',index:'note', width:150, sortable:false,editable: true,edittype:"textarea", editoptions:{rows:"2",cols:"10"}} 
    ], 

    viewrecords : true,
    rowNum:10,
    rowList:[10,20,30],
    pager : pager_selector,
    altRows: true,
    //toppager: true,
    
    multiselect: true,
    //multikey: "ctrlKey",
    multiboxonly: true,

    loadComplete : function() {
        var table = this;
        setTimeout(function(){
            styleCheckbox(table);
            
            updateActionIcons(table);
            updatePagerIcons(table);
            enableTooltips(table);
        }, 0);
    },

    editurl: "./dummy.php",//nothing is saved
    caption: "jqGrid with inline editing"

    /*autowidth: true,


    
    grouping:true, 
    groupingView : { 
         groupField : ['name'],
         groupDataSorted : true,
         plusicon : 'fa fa-chevron-down bigger-110',
         minusicon : 'fa fa-chevron-up bigger-110'
    },
    caption: "Grouping"
    */

});
//fin ligne 80


{
    //direction: "rtl",

    //subgrid options
    subGrid: true,
    //subGridModel: [{ name : ['No','Item Name','Qty'], width : [55,200,80] }],
    //datatype: "xml",
    subGridOptions: {
      plusicon: 'ace-icon fa fa-plus center bigger-110 blue',
      minusicon: 'ace-icon fa fa-minus center bigger-110 blue',
      openicon: 'ace-icon fa fa-chevron-right center orange',
    },
    //for this example we are using local data
    subGridRowExpanded: function (subgridDivId, rowId) {
      var subgridTableId = subgridDivId + '_t';
      $ ('#' + subgridDivId).html (
        "<table id='" + subgridTableId + "'></table>"
      );
      $ ('#' + subgridTableId).jqGrid ({
        datatype: 'local',
        data: subgrid_data,
        colNames: ['No', 'Item Name', 'Qty'],
        colModel: [
          {name: 'id', width: 50},
          {name: 'name', width: 150},
          {name: 'qty', width: 50},
        ],
      });
    },

    //data: grid_data,
    datatype: 'local',
    //height: 250,
    colNames: personnel.colNames,
    colModel: personnel.colModel,
    width:'auto',
    viewrecords: true,
    rowNum: 10,
    rowList: [10, 20, 30],
    pager: pager_selector,
    altRows: true,

    toppager: true,

    multiselect: true,
    //multikey: "ctrlKey",
    multiboxonly: true,

    loadComplete: function () {
      var table = this;
      setTimeout (function () {
        styleCheckbox (table);

        updateActionIcons (table);
        updatePagerIcons (table);
        enableTooltips (table);
      
      }, 0);
    },

    //editurl: './dummy.php', //nothing is saved
    caption: 'Liste du paiePersonnel',
    
    /*autowidth: true,
    grouping:true, 
    groupingView : { 
         groupField : ['name'],
         groupDataSorted : true,
         plusicon : 'fa fa-chevron-down bigger-110',
         minusicon : 'fa fa-chevron-up bigger-110'
    },
    caption: "Grouping"
    */
  }