var fonc={
	extractDT:(m)=>{
		//date must be in mm/YYYY
		let d=m.split('/')
		d['m']=d[0];
		d['y']=d[1];
		return d;
	},
	preActualisePtgeMonth:()=>{		
		let _d=_dialog._confirm;
			_d._setDetails("Acceder au donnée secondaire, prendra plus de temps que prévu", "Voulez vous porsuivre?");
			$(_d._selector).dialog({
				title: "<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Données secondaire absents?</h4></div>",
				buttons:[
				{
					html: "<i class='ace-icon fa fa-trash-o bigger-110'></i>&nbsp; Oui",
					"class" : "btn btn-danger btn-minier",
					click: function() {
						fonc.getPointageMonthDb();
					}
				},
				{
					html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Annuler",
					"class" : "btn btn-minier",
					click: function() {
						$(this).dialog('close');
					}
				}
				]
			}).dialog('open');
	},
	getPointageMonthDb:()=>{
		let _d=_dialog._confirm;		
		let _pg="<div class='progress  progress-striped active pos-rel' data-percent='10%'><div class='progress-bar' style='width:10%;'></div></div>";
		_d._setDetails("Chargement", _pg);
		$(_d._selector).dialog({
				title: "<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle yelow'></i>"+pointage_personnel._month+"</h4></div>",
				buttons:[]
			});
		$.ajax({
			url:'php/pointage.Drv.php',
			method:'POST',
			data:{oper:'actualisePointage',m:pointage_personnel._month}
		}).done(
		(msg)=>{
			//console.log(msg);
			let _d=_dialog._confirm
			let pct=100;
			let _pg="<div class='progress  progress-striped active pos-rel' data-percent='"+pct+"%'><div class='progress-bar' style='width:"+pct+"%;'></div></div>";
			_d._setDetails("Chargement", _pg);
			setTimeout(()=>{
				fonc.chargementTermined();
			},1000);
		}
		).fail(()=>{
			alert('failure');
		});
	},
	chargementTermined:()=>{
		let _d=_dialog._confirm;		
		_d._setDetails("Terminé", '');
		$(_d._selector).dialog({
				title: "<div class='widget-header'><h4 class=' label label-success arrowed'><i class='ace-icon fa fa-exclamation-triangle yelow'></i>"+pointage_personnel._month+"</h4></div>",
				buttons:[{
					html: "<i class='ace-icon glyphicon glyphicon-check bigger-110'></i>&nbsp; Merci",
					"class" : "btn btn-minier",
					click: function() {
						setTimeout(pointage_personnel._checkMonthRecap(),100);
						$(this).dialog('close');
						
					}
				}]
			})
	}
}//end fonc
/*<span class='label label-success arrowed'>Success</span>*/
class fragmentationProgressMan{
		constructor(_id){
			this._id=_id;
			this._s0='#'+this._id+' .clearfix span.pull-right';
			this._s1='#'+this._id+' .progress';
			this._s2='#'+this._id+' .progress .progress-bar';
		}
		setValue(v){
			$(this._s0).text(v+'%');
			$(this._s1).attr('data-percent',v+'%');
			$(this._s2).attr('style','width:'+v+'%');
		}
	};

class fragmentationTraite{
	constructor(){
		this._ar=pointage_personnel.selectedArDtId;
		this._free=true;
		this._dpp=pointage_personnel._dropdownProgress;
		this._grd1=pointage_personnel._grid_selector;
		this._personnelList=personnel._cPersonnel0;
		
	}
	_start(){
		this._curentI=0;
		this._free=false;
		setTimeout(()=>{
			this._traiting();
		},0);
	}
	_updateGridPointageStatus(){
		let _ar0=this._ar;
		let _i=this._curentI;
		let _c=_ar0[_i];
		$(this._grd1).jqGrid('setCell',_c,'_status',3);
	}
	_traiting(){
		let _ar0=this._ar;
		let _i=this._curentI;
		let _c=_ar0[_i];
		let v=pointage_personnel._rowidToObj(_c);
		let _ar1=this._personnelList;
		//console.log(_i);
		
		$.ajax({
			url:'php/pointage.Drv.php',
			method:'POST',
			data:{_v:v, _arPerso:_ar1, oper:'getFragmentPtge'}
		}).done(
		(msg)=>{
			//console.log(msg);
			//jumping process
			this._updateGridPointageStatus();
			let frm=new fragmentationProgressMan(_c);
			frm.setValue(100);
			setTimeout(()=>{
				this._getNext();
			},2000);
			//jumping process
		}
		).fail();
	}
	_getNext(){
		this._curentI++;
		if(this._curentI<this._ar.length){
			
			this._traiting();
		}else{
			this._stop();
		}
	}
	_stop(){
		this._free=true;
		this._dpp._clear();
		//console.log('done');
	}
}
var myBtnFormat=()=>{
	$str='<button onclick="pointage_personnel.fnTest()" class="btn btn-warning btn-xs"><i class="ace-icon fa fa-wrench  bigger-110 icon-only"></i></button>';
	
	return $str;
	
}
var pointage_personnel={
	_month:'',
	_grid_selector:'#grid-personnel-Pointage',
	_pager_selector:'#pager-personnel-Pointage',
	_colNames:['id','Date','Status','flagMS','refTime'],//,'_act'
	_colModel:[
	{name:'id', index:'id', hidden:true, editable:false, formatter:'number'},
	{name:'_date', index:'_date', hidden:false, editable:false, formatter:'date', formatoptions:{srcformat:'Y-m-d o', newformat:'d-m-Y'}},
	{name:'_status', index:'_status', hidden:false, editable:false},
	{name:'flagMS', index:'flagMS', hidden:false, editable:false},
	{name:'refTime', index:'refTime', hidden:false, editable:false, formatter:'number'},
	//{name:'_act', index:'_act', hidden:false, editable:false, search:false,formatter:myBtnFormat},
	],
	
	fnTest:()=>{
		//console.log();
	},

	_widget:{
		_init:()=>{
		let _s='[data-action="close_Personnel_Col_Config"]';
		$(_s).click(()=>{
			widget1._resize();
		});
		let _mSelector='#_month';
		//$(_mSelector).datepicker({format:'mm/yyyy' , autoclose:true});
		//
		$(_mSelector).monthpicker({
			showOn:'focus',
			onSelect:(e)=>{
				console.log(e);
				$('#widgetPointage .widget-box .widget-header h5.widget-title').text(e);
				pointage_personnel._month=e;
				pointage_personnel._checkMonthRecap();
			}
		});
		
		//btn segmenter
		let _s0='#ptg_segment';
		$(_s0).click(()=>{
			pointage_personnel._segmentation();
			
		});
		
		let _s1='#ptg_day_show';
		$(_s1).click(()=>{
			//alert('test');
			let detPtg=new detailPtgeByJrs();
			detPtg._show();
		});
		
		
		},//end of _init
		_pgbar:{
			//#widgetPointage .widget-box .widget-header .widget-toolbar .progress
			_Selector:'#wd_pg01 .progress',
			_setValue:(v)=>{
			let o=pointage_personnel._widget._pgbar;
			$(o._Selector).attr("data-percent",v+"%");
			$(o._Selector+' .progress-bar').css("width",v+"%");
			}
		}
		
	},
	
	_init:()=>{
		//init widget bar bouton
		pointage_personnel._widget._init();
		//init widget bar bouton
		
		let o=pointage_personnel;
		let grid_selector=o._grid_selector;
		let pager_selector=o._pager_selector;
		$(grid_selector).jqGrid(
		{
			subGrid:false,
			subGridOptions:{
				plusicon: 'ace-icon fa fa-plus center bigger-110 blue',
				minusicon: 'ace-icon fa fa-minus center bigger-110 blue',
				openicon: 'ace-icon fa fa-chevron-right center orange',
			},
			subGridRowExpanded:(subGridDivId, rowId)=>{
				let subgridTableId = subgridDivId + '_t';
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
			colModel:o._colModel,
			colNames:o._colNames,
			datatype:'local',
			viewrecords:true,
			rowNum:10,
			rowList:[10,20,30],
			altRow:false,
			frozen:true,
			toppager:true,
			multiselect:true,
			//multikey:"ctrlKey",
			multiboxonly:true,
			loadComplete:()=>{
				var table=this;
				setTimeout(()=>{
					styleCheckbox (table);
					updateActionIcons (table);
					updatePagerIcons (table);
					enableTooltips (table);
				},0);
			},
			onSelectRow:(rowid, status, e)=>{
				console.log(e);
				
			},
			pager:o._pager_selector,
			caption:'Pointage'
			
		}
		);//fin init jqgrid
		$(grid_selector).jqGrid('navGrid',pager_selector,
		{
		  //navbar options
		  edit: false,
		  editicon: 'ace-icon fa fa-pencil blue',
		  add: false,
		  addicon: 'ace-icon fa fa-plus-circle purple',
		  del: false,
		  delicon: 'ace-icon fa fa-trash-o red',
		  search: false,
		  searchicon: 'ace-icon fa fa-search orange',
		  refresh: false,
		  refreshicon: 'ace-icon fa fa-refresh green',
		  view: false,
		  viewicon: 'ace-icon fa fa-search-plus grey',
		},
		{//edit record form
		},
		{//new redord form
			
		},
		{//delete form
			
		},
		{//search form
			
		}
		);//fin navbar init
		
		//procedure d'ajustement de dimmension
			let parent_column = $(grid_selector).closest('[class*="col-"]');
		  //resize to fit page size
		  $(window).on('resize.jqGrid', function () {
			$(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
			});
		  
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
		  });
		//procedure d'ajustement de dimmension
		
		  //filter toolbar
		jQuery(grid_selector).jqGrid('filterToolbar',{stringResult: true,searchOnEnter : false});
		
		
		
		},//fin init
		
	_checkMonthRecap:()=>{
		let m=pointage_personnel._month;
		let d=fonc.extractDT(m);
		let _fName=d['m']+'_'+d['y']+'.json';
		//console.log(d);
		pointage_personnel._widget._pgbar._setValue(5);
		$.ajax({
			method:'POST',
			url:'_data/'+_fName,
		}).done((msg)=>{			
			let _grid_selector=pointage_personnel._grid_selector;
			$(_grid_selector).jqGrid('clearGridData');
			$(_grid_selector).jqGrid('setGridParam',{data:msg.data}).trigger('reloadGrid');
			//console.log(msg);
			//alert('doit êre géré')
		}
		).fail(
		()=>{
			fonc.preActualisePtgeMonth();
		}
		);
	},//end _checkMonthRecap

	_dlg:{
		_Selector:'#dialog-confirm',
		_open:()=>{
			let _o=pointage_personnel._dlg;
			let _s=_o._Selector;
			
		}
	},
	
	_dropdownProgress:{
		 _label0Selector:'#tsk_dropdown [data-toggle="dropdown"] span.badge',
		 _ulSelector:'#tsk_dropdown ul',
		 _labelHeaderSelector:'#tsk_dropdown ul li.dropdown-header',
		 _contentSelector:'#tsk_dropdown ul ',
		 _oper:'Fragmentation',
		 _update:()=>{
			 let _liSklt='';
			 let _ar=pointage_personnel.selectedArDtId;
			 let _pg=pointage_personnel._dropdownProgress;
			 $(_pg._label0Selector).text(_ar.length);
			 $(_pg._labelHeaderSelector).text(_ar.length+" tâches");
			 let _i=0;
			 let _s='';
			 $.each(_ar,(k,v)=>{
				 let _l=pointage_personnel._rowidToObj(v);
				 //console.log(_l);
				 _liSklt='<li class="dropdown-hover" id="'+v+'"><a href="#"><div class="clearfix"><span class="pull-left">'+_pg._oper+' : '+_l._date+' '+_l.flagMS+'</span><span class="pull-right">0%</span></div><div class="progress progress-mini progress-striped active pos-rel " style="width:100%;" data-percent="0%"><div class="progress-bar progress-bar-danger" style="width:0%"></div></div></a></li>';
				 //$(_pg._contentSelector).append(_liSklt);
				 _s+=_liSklt;
				 _i++;
				 //console.log(v);
			 });
			 
			 let _str='<li class="dropdown-header"><i class="ace-icon fa fa-check"></i>'+_i+' tâche</li>';
			 $(_pg._ulSelector).html(_str+_s);
			 /* let fgm=new fragmentationProgressMan(_ar[0]);
			 fgm.setValue(30); */
		 },
		 _clear:()=>{
			 pointage_personnel.selectedArDtId=[];
			 pointage_personnel._dropdownProgress._update();
		 }
	},
	
	
	_rowidToObj:(rowid)=>{
		let _grd=pointage_personnel._grid_selector;
		let _rdt=$(_grd).jqGrid('getRowData',rowid);
		return _rdt;
	},
	
	_segmentation:()=>{
	let _grd=pointage_personnel._grid_selector;
	let _ar=$(_grd).jqGrid('getGridParam','selarrrow');
	if(_ar.length==0){
		alert('data non spécicié');
	}else{
		pointage_personnel.selectedArDtId=_ar;
		//console.log(_ar);
		setTimeout(()=>{
			pointage_personnel._dropdownProgress._update();
			setTimeout(()=>{
				let frt=new fragmentationTraite();
			frt._start();
			},10);
		},10);
	}
	
	}
	
}