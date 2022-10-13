/* note! globalGrid is defined in paiePersonnel.js */
class _cPersonnel{
	constructor(d){
		this.data=d;
	}
	convertTOIdPointageRef(){
		let _ar0=this.data;
		let _ar1=[];
		$.each(_ar0,(_k,_v)=>{
			_ar1[_v.idPointage]=_v;
		});
		return _ar1;
	}
}
var personnel={
grid_selector:'#grid-personnel',
pager_selector:'#pager-personnel',
_init:()=>{
    
},
_barMenu:{
  btnActualise_Selector:"#actualiserListPersonnels",
  btnPointage_Selector:"#showPointagePanel",
	_init:()=>{
	  let btnSelector=personnel._barMenu.btnActualise_Selector;
	  $(btnSelector).click(()=>{
		personnel._updateDBSecondaire();
	  });
	  let btnPoi_Selector=personnel._barMenu.btnPointage_Selector;
	  $(btnPoi_Selector).click(()=>{
		  widget1._resize();
      //geting sklt of colonne
		
	  });
	}
},
colNames:['NomPrenom', 'CIN', 'NomFonction', 'TypePersonnel', 'DateEmbauche', 'Sexe', 'Contact', 'Adresse', 'EsTravail', 'Matrimoniale', 'Formation', 'Experiences', 'Motif', 'DateLicence', 'idPointage', 'initial'],
_gridInit:()=>{
let cm0=globalGrid.createColModel(personnel.colNames);
//hideBydefault
let defHidedCols=['TypePersonnel', 'DateEmbauche', 'Sexe', 'Contact', 'Adresse', 'EsTravail', 'Matrimoniale', 'Formation', 'Experiences', 'Motif', 'DateLicence', 'idPointage','initial'];
cm1=globalGrid.hideDefaultHidden(cm0,defHidedCols);
//hideBydefault
//froseByDefalut
let defFrozeCols=['NomPrenom'];
cm1=globalGrid.froze(cm0,defFrozeCols);
//froseByDefalut

personnel.colModel=cm1;

let grid_selector=personnel.grid_selector;
let pager_selector=personnel.pager_selector;

jQuery (grid_selector).jqGrid ({
    //direction: "rtl",
    //subgrid options
    subGrid: false,
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
    frozen:true,
    toppager: true,

    multiselect: false,
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
  });

  //navButtons
  jQuery (grid_selector).jqGrid (
    'navGrid',
    personnel.pager_selector,
    {
      //navbar options
      edit: true,
      editicon: 'ace-icon fa fa-pencil blue',
      add: true,
      addicon: 'ace-icon fa fa-plus-circle purple',
      del: true,
      delicon: 'ace-icon fa fa-trash-o red',
      search: true,
      searchicon: 'ace-icon fa fa-search orange',
      refresh: true,
      refreshicon: 'ace-icon fa fa-refresh green',
      view: true,
      viewicon: 'ace-icon fa fa-search-plus grey',
    },
    {
      //edit record form
      //closeAfterEdit: true,
      //width: 700,
      recreateForm: true,
      beforeShowForm: function (e) {
        var form = $ (e[0]);
        form
          .closest ('.ui-jqdialog')
          .find ('.ui-jqdialog-titlebar')
          .wrapInner ('<div class="widget-header" />');
        style_edit_form (form);
      },
    },
    {
      //new record form
      //width: 700,
      closeAfterAdd: true,
      recreateForm: true,
      viewPagerButtons: false,
      beforeShowForm: function (e) {
        var form = $ (e[0]);
        form
          .closest ('.ui-jqdialog')
          .find ('.ui-jqdialog-titlebar')
          .wrapInner ('<div class="widget-header" />');
        style_edit_form (form);
      },
    },
    {
      //delete record form
      recreateForm: true,
      beforeShowForm: function (e) {
        var form = $ (e[0]);
        if (form.data ('styled')) return false;

        form
          .closest ('.ui-jqdialog')
          .find ('.ui-jqdialog-titlebar')
          .wrapInner ('<div class="widget-header" />');
        style_delete_form (form);

        form.data ('styled', true);
      },
      onClick: function (e) {
        //alert(1);
      },
    },
    {
      //search form
      recreateForm: true,
      afterShowSearch: function (e) {
        var form = $ (e[0]);
        form
          .closest ('.ui-jqdialog')
          .find ('.ui-jqdialog-title')
          .wrap ('<div class="widget-header" />');
        style_search_form (form);
      },
      afterRedraw: function () {
        style_search_filters ($ (this));
      },
      multipleSearch: true,
      /**
            multipleGroup:true,
        showQuery: true
        */
    },
    {
      //view record form
      recreateForm: true,
      beforeShowForm: function (e) {
        var form = $ (e[0]);
        form
          .closest ('.ui-jqdialog')
          .find ('.ui-jqdialog-title')
          .wrap ('<div class="widget-header" />');
      },
    }
  );

  let parent_column = $(grid_selector).closest('[class*="col-"]');
  //resize to fit page size
  $(window).on('resize.jqGrid', function () {
    $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
    })
  
  //resize on sidebar collapse/expand
  $(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
    if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
      //setTimeout is for webkit only to give time for DOM changes and then redraw!!!
      setTimeout(function() {
        $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
      }, 20);
    }
    });
  //if your grid is inside another element, for example a tab pane, you should use its parent's width:
  
  $(window).on('resize.jqGrid', function () {
    let parent_width = $(grid_selector).closest('.widget-main').width();
    let parent_Height = $(grid_selector).closest('.widget-main').height();
    $(grid_selector).jqGrid( 'setGridWidth', parent_width );
    $(grid_selector).jqGrid( 'setGridHeight', parent_Height );
  })

  //filter toolbar
  jQuery(grid_selector).jqGrid('filterToolbar',{stringResult: true,searchOnEnter : false});

},//end _gridInit

_loadData:()=>{
	$.ajax({
		method:'GET',
		url:'_data/d0.json',
		dataType:'json'
	}).done((msg)=>{
		let grid_selector=personnel.grid_selector;
		let d=msg.data;
		let _l0=new _cPersonnel(d);
		personnel._cPersonnel0=_l0.convertTOIdPointageRef();
	$(grid_selector).jqGrid('setGridParam',{data:d}).trigger('reloadGrid');
	}).fail(()=>{
		alert('fail');
	});
	/**/
},//end loadData

_updateDBSecondaire:()=>{
  $.ajax({
  method: 'POST',
  url: 'php/personnel.drv.php',
  //data: { oper:'getData2', TypePersonnel:_paie2_0.TypePersonnel, month:_paie2_0.month },
  dataType: 'html',
  })
  .done(function( msg ) {
  console.log(msg);
  personnel._loadData();
  }).fail(()=>{
  alert('Ceci est une version demo!')
  });
}

}