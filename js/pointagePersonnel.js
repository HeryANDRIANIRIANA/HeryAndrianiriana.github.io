var fonc = {
	extractDT: (m) => {
		//date must be in mm/YYYY
		let d = m.split('/')
		d['m'] = d[0];
		d['y'] = d[1];
		return d;
	},
	preActualisePtgeMonth: () => {
		let _d = _dialog._confirm;
		_d._setDetails("Acceder au donnée secondaire, prendra plus de temps que prévu", "Voulez vous porsuivre?");
		$(_d._selector).dialog({
			title: "<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> Données secondaire absents?</h4></div>",
			buttons: [
				{
					html: "<i class='ace-icon fa fa-trash-o bigger-110'></i>&nbsp; Oui",
					"class": "btn btn-danger btn-minier",
					click: function () {
						fonc.getPointageMonthDb();
					}
				},
				{
					html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Annuler",
					"class": "btn btn-minier",
					click: function () {
						$(this).dialog('close');
					}
				}
			]
		}).dialog('open');
	},
	getPointageMonthDb: () => {
		let _d = _dialog._confirm;
		let _pg = "<div class='progress  progress-striped active pos-rel' data-percent='10%'><div class='progress-bar' style='width:10%;'></div></div>";
		_d._setDetails("Chargement", _pg);
		$(_d._selector).dialog({
			title: "<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle yelow'></i>" + pointage_personnel._month + "</h4></div>",
			buttons: []
		});
		$.ajax({
			url: 'php/pointage.Drv.php',
			method: 'POST',
			data: { oper: 'actualisePointage', m: pointage_personnel._month }
		}).done(
			(msg) => {
				//console.log(msg);
				let _d = _dialog._confirm
				let pct = 100;
				let _pg = "<div class='progress  progress-striped active pos-rel' data-percent='" + pct + "%'><div class='progress-bar' style='width:" + pct + "%;'></div></div>";
				_d._setDetails("Chargement", _pg);
				setTimeout(() => {
					fonc.chargementTermined();
				}, 1000);
			}
		).fail(() => {
			alert('failure');
		});
	},
	chargementTermined: () => {
		let _d = _dialog._confirm;
		_d._setDetails("Terminé", '');
		$(_d._selector).dialog({
			title: "<div class='widget-header'><h4 class=' label label-success arrowed'><i class='ace-icon fa fa-exclamation-triangle yelow'></i>" + pointage_personnel._month + "</h4></div>",
			buttons: [{
				html: "<i class='ace-icon glyphicon glyphicon-check bigger-110'></i>&nbsp; Merci",
				"class": "btn btn-minier",
				click: function () {
					setTimeout(pointage_personnel._checkMonthRecap(), 100);
					$(this).dialog('close');

				}
			}]
		})
	}
}//end fonc
/*<span class='label label-success arrowed'>Success</span>*/
class fragmentationProgressMan {
	// juste pour la gestion des progress bar
	constructor(_id) {
		this._id = _id;
		this._s0 = '#' + this._id + ' .clearfix span.pull-right';
		this._s1 = '#' + this._id + ' .progress';
		this._s2 = '#' + this._id + ' .progress .progress-bar';
	}
	setValue(v) {
		$(this._s0).text(v + '%');
		$(this._s1).attr('data-percent', v + '%');
		$(this._s2).attr('style', 'width:' + v + '%');
	}
};

class calculRefTime{
	//cette classe définit une opération : calcul de l'heure d'entrée
	// qui se produit sur uen liste de date s'lectionnné
	// puis sur chaque date lire parcouir les pointage par utilisateur
	constructor(){
		pointage_personnel.arRefTime=[];
		this.op1=(ar,i)=>{
			//each line of a daily pointage is ar;
			let _ar=ar[i];
			//console.log(_ar);
			let _flag=_ar.flagMS;
			let _dtMS=_ar.dateMSoir;
			let _refT=parseInt(_ar.dateH)*60+parseInt(_ar.dateMin);

			let _defRefT=0;
			switch (_flag) {
				case "S":
					_defRefT=840;
					break;
			
				default:
					_defRefT=420
					break;
			}
			let bContinue=true;
			console.log(_refT, pointage_personnel.arRefTime);
			if(typeof(pointage_personnel.arRefTime[_dtMS])=='undefined'){
				if(_defRefT>_refT){
					pointage_personnel.arRefTime[_dtMS]=_defRefT;
					bContinue=false;
				}else{
					pointage_personnel.arRefTime[_dtMS]=_refT;
				}
			}else{
				if(pointage_personnel.arRefTime[_dtMS]>_refT){
					pointage_personnel.arRefTime[_dtMS]=_refT;
				}
			}
			// if(typeof(this.arRefTime[_dtMS])=='undefined'){
			// 	if(typeof(_refT)=='undefined' || _refT<_defRefT){
			// 		this.arRefTime[_dtMS]=_defRefT;
			// 		bContinue=false;
			// 	}else{
			// 		this.arRefTime[_dtMS]=_refT;
			// 	}
			// }else{
			// 	if(this.arRefTime[_dtMS]<_refT)this.arRefTime[_dtMS]=_refT;
			// }
			return bContinue;
		};
		this.op0=(ar,i)=>{
			console.log(ar[i]);
			
			return false;
		};
		
		this.ar= pointage_personnel.selectedArDtId;
		this.prestart=()=>{
			if(typeof(this.ar)=='undefined'||this.ar.length==0){
				alert('aucune ligne spécifié');
			}else{
				//console.log(this.ar);
				this.parcou=new _parcours(this.ar,null,this.op0,this.op1);
				let p0={};
				$.extend(p0,this.parcou);
				
				if($('#'+p0.id_encPple).length==0){
					p0._render._root();
					p0._render._badge();
				}
				p0._start();
			}
		}
	}
	
}

class _parcours{
	constructor(_ar,id_parent,externOp,enfantOp){
		this._ar=_ar;
		this.externOp=externOp;
		this._arSucces=[];
		this._arError=[];
		this.id_parent_parcour=(typeof(id_parent)!="undefined" || id_parent != null)?id_parent:0;
		this.enfantOp=(typeof(enfantOp)!="undefined" || enfantOp != null)?enfantOp:0;
		this._ciblePPle='#widgetPointage .widget-box .widget-header';
		this.id_encPple=this.id_parent_parcour+'_progressPPle';
		this.badgeColor=['warning', 'succes', 'danger'];
		this._render={
			_root:()=>{
				let str='<div class="widget-toolbar" id="'+this.id_encPple+'"></div>';
				$(this._ciblePPle).append(str);
			},
			_badge:()=>{
				$.each(this.badgeColor,(k,v)=>{
					let str='<div class="widget-menu '+v+'"><a data-toggle="dropdown" class="dropdown-toggle" href="#"><span class="badge badge-'+v+'">0</span></a><ul class="dropdown-menu-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close"><li class="dropdown-header"><i class="ace-icon fa fa-check"></i>0 tâche</li></ul></div>';
					$('#'+this.id_encPple).append(str);
				});
			}
			
		};
		this.uptdrender=(_color,ar)=>{
			let v=ar.length;
			let i='<i class="ace-icon fa fa-check"></i>';
			let c=this.id_encPple;
			let s='#'+c+' .'+_color;
			let badge_s=s+' a span.badge-'+_color;
			let liHeader_s=s+' ul li.dropdown-header';
			$(badge_s).html(v);
			$(liHeader_s).html(i+v+' '+_color);
		};
		this._start=()=>{
			//console.log(this);
			//console.log(this.id_enfant_parcour);
			this.uptdrender('warning',this._ar);
			this.uptdrender('danger',[]);
			this.uptdrender('succes',[]);
			//this._manage();//fonctionnel mais j'ai changer vers subtask
			setTimeout(() => {
				this._curentI=0;
				this.subtask.prestart();
			}, 200);

		};
		this._getNext=()=>{
			let ar=this._ar;
			this._curentI++;
			let i=this._curentI;
			if(i<ar.length){
				this.subtask.prestart();
			}else{
				this._end();
			}
			
		};
		this._setError=()=>{
			let ar=this._ar;
			let i=this._curentI;
			this._arError.push(ar[i]);
			this.uptdrender('danger',this._arError);
			setTimeout(() => {
				this._getNext();
			}, 100);
		}
		this._setSucces=()=>{
			let ar=this._ar;
			let i=this._curentI;
			this._arSucces.push(ar[i]);
			this.uptdrender('succes',this._arSucces);
			setTimeout(() => {
				this._getNext();
			}, 100);
		}
		this._end=()=>{
			alert('done!');
		}
		this.subtask={
			_renderWarning:()=>{
				let _color='warning';
				let c=this.id_encPple;
				let s='#'+c+' .'+_color;
				let badge_s=s+' a span.badge-'+_color;
				let liHeader_s=s+' ul li.dropdown-header';
				let i=this._curentI;
				let l=this._ar.length;
				let v='subtask0';
				let _liSklt = '<li class="dropdown-hover" id="' + v + '"><a href="#"><div class="clearfix"><span class="pull-left">test</span><span class="pull-right">0%</span></div><div class="progress progress-mini progress-striped active pos-rel " style="width:100%;" data-percent="0%"><div class="progress-bar progress-bar-danger" style="width:0%"></div></div></a></li>';
				let _str = '<li class="dropdown-header">'+(i+1)+'/'+l+'</li>';
				$(s+ " ul").html(_str + _liSklt);
				this.subtask._start();
				//console.log('test');
			},
			_updateRWarning:(label,percent)=>{
				let s='#subtask0';
				let p=percent+"%";
				let l1Selector=s+" .clearfix span.pull-left";
				let l2Selector=s+" .clearfix span.pull-right";
				let envPbSelector=s+" .progress";
				let cntPbSelector=s+" .progress .progress-bar";
				$(l1Selector).text(label);
				$(l2Selector).text(p);
				$(envPbSelector).attr('data-percent',p);
				$(cntPbSelector).css('width',p);

			},
			prestart:()=>{
				this.subtask._ar=[];
				// geting details ptge
				let _rowId=this._ar[this._curentI];
				let _grd=pointage_personnel._grid_selector;
				let _rowData=$(_grd).getRowData(_rowId);
				//console.log(_rowData);
				let _url='_data/'+_rowData._date+' '+_rowData.flagMS+'.json';
				$.ajax({
					method:'post',
					url:_url
				}).done((msg)=>{
						this.subtask._ar=msg.data;
					//console.log(msg);
					setTimeout(() => {						
						this.subtask._renderWarning();
					}, 100);
				}).fail(()=>{
					this.subtask._ar=[];
					this._setError();
				});
				
			},
			_start:()=>{
				this.subtask._curentI=0;
				this.subtask._manage();
			},
			_manage:()=>{
				let ar=this.subtask._ar;
				let i=this.subtask._curentI;
				let label=ar[i].NomPrenom;
				let percent=100*(i+1)/ar.length;
				this.subtask._updateRWarning(label,percent);
				let er=this.enfantOp(ar,i);
					if(er){
						this.subtask._getNext();
					}else{
						this.subtask._abord();
					}
			},
			_getNext:()=>{
				let ar=this.subtask._ar;
				this.subtask._curentI++;
				let i=this.subtask._curentI;
				if(i<ar.length){
					setTimeout(() => {
						this.subtask._manage();
					}, 100);
				}else{
					this.subtask._end();
				}
			},
			_abord:()=>{
				
				this.subtask._end();
			},
			_end:()=>{
				console.log(pointage_personnel.arRefTime);
				setTimeout(() => {
					this._setSucces();
				}, 100);
			}
		}
	}
	_manage=()=>{
		let ar=this._ar;
		let i=this._curentI;
		//console.log(ar[i]);
		let er=this.externOp(ar,i);
		if(er){
			this._setError();
		}else{
			this._setSucces();
		}
	}
}

class fragmentationTraite {
	constructor() {
		this._ar = pointage_personnel.selectedArDtId;
		this._free = true;
		this._dpp = pointage_personnel._dropdownProgress;
		this._grd1 = pointage_personnel._grid_selector;
		this._personnelList = personnel._cPersonnel0;

	}
	_start() {
		this._curentI = 0;
		this._free = false;
		setTimeout(() => {
			this._traiting();
		}, 0);
	}
	_updateGridPointageStatus() {
		let _ar0 = this._ar;
		let _i = this._curentI;
		let _c = _ar0[_i];
		$(this._grd1).jqGrid('setCell', _c, '_status', 3);
	}
	_traiting() {
		let _ar0 = this._ar;
		let _i = this._curentI;
		let _c = _ar0[_i];
		let v = pointage_personnel._rowidToObj(_c);
		let _ar1 = this._personnelList;
		//console.log(_i);

		$.ajax({
			url: 'php/pointage.Drv.php',
			method: 'POST',
			data: { _v: v, _arPerso: _ar1, oper: 'getFragmentPtge' }
		}).done(
			(msg) => {
				//console.log(msg);
				//jumping process
				this._updateGridPointageStatus();
				let frm = new fragmentationProgressMan(_c);
				frm.setValue(100);
				setTimeout(() => {
					this._getNext();
				}, 2000);
				//jumping process
			}
		).fail();
	}
	_getNext() {
		this._curentI++;
		if (this._curentI < this._ar.length) {

			this._traiting();
		} else {
			this._stop();
		}
	}
	_stop() {
		this._free = true;
		fonc.getPointageMonthDb();
		this._dpp._clear();
		//console.log('done');
	}
}
var myBtnFormat = () => {
	$str = '<button onclick="pointage_personnel.fnTest()" class="btn btn-warning btn-xs"><i class="ace-icon fa fa-wrench  bigger-110 icon-only"></i></button>';

	return $str;

}
var pointage_personnel = {
	_month: '',
	_grid_selector: '#grid-personnel-Pointage',
	_pager_selector: '#pager-personnel-Pointage',
	_colNames: ['id', 'Date', 'Status', 'flagMS', 'refTime'],//,'_act'
	_colModel: [
		{ name: 'id', index: 'id', hidden: true, editable: false, formatter: 'number' },
		{ name: '_date', index: '_date', hidden: false, editable: false, formatter: 'date', formatoptions: { srcformat: 'Y-m-d o', newformat: 'd-m-Y' } },
		{ name: '_status', index: '_status', hidden: false, editable: false },
		{ name: 'flagMS', index: 'flagMS', hidden: false, editable: false },
		{ name: 'refTime', index: 'refTime', hidden: false, editable: false, formatter: 'number' },
		//{name:'_act', index:'_act', hidden:false, editable:false, search:false,formatter:myBtnFormat},
	],

	fnTest: () => {
		//console.log();
	},

	_widget: {
		_init: () => {
			let _s = '[data-action="close_Personnel_Col_Config"]';
			$(_s).click(() => {
				widget1._resize();
			});
			let _mSelector = '#_month';
			//$(_mSelector).datepicker({format:'mm/yyyy' , autoclose:true});
			//
			$(_mSelector).monthpicker({
				showOn: 'focus',
				onSelect: (e) => {
					//console.log(e);
					$('#widgetPointage .widget-box .widget-header h5.widget-title').text(e);
					pointage_personnel._month = e;
					pointage_personnel._checkMonthRecap();
				}
			});

			//btn segmenter
			let _s0 = '#ptg_segment';
			$(_s0).click(() => {
				pointage_personnel._segmentation();

			});

			let _s1 = '#ptg_day_show';
			$(_s1).click(() => {
				//alert('test');
				let detPtg = new detailPtgeByJrs();
				detPtg._show();
			});

			let _s2 = '#calculHeureRef';
			$(_s2).click(() => {
				//alert('test');
				let cHref=new calculRefTime();
				cHref.prestart();
			});

		},//end of _init
		_pgbar: {
			//#widgetPointage .widget-box .widget-header .widget-toolbar .progress
			_Selector: '#wd_pg01 .progress',
			_setValue: (v) => {
				let o = pointage_personnel._widget._pgbar;
				$(o._Selector).attr("data-percent", v + "%");
				$(o._Selector + ' .progress-bar').css("width", v + "%");
			}
		}

	},

	_init: () => {
		//init widget bar bouton
		pointage_personnel._widget._init();
		//init widget bar bouton

		let o = pointage_personnel;
		let grid_selector = o._grid_selector;
		let pager_selector = o._pager_selector;
		$(grid_selector).jqGrid(
			{
				subGrid: false,
				subGridOptions: {
					plusicon: 'ace-icon fa fa-plus center bigger-110 blue',
					minusicon: 'ace-icon fa fa-minus center bigger-110 blue',
					openicon: 'ace-icon fa fa-chevron-right center orange',
				},
				subGridRowExpanded: (subGridDivId, rowId) => {
					let subgridTableId = subgridDivId + '_t';
					$('#' + subgridDivId).html(
						"<table id='" + subgridTableId + "'></table>"
					);
					$('#' + subgridTableId).jqGrid({
						datatype: 'local',
						data: subgrid_data,
						colNames: ['No', 'Item Name', 'Qty'],
						colModel: [
							{ name: 'id', width: 50 },
							{ name: 'name', width: 150 },
							{ name: 'qty', width: 50 },
						],
					});
				},
				colModel: o._colModel,
				colNames: o._colNames,
				datatype: 'local',
				viewrecords: true,
				rowNum: 10,
				rowList: [10, 20, 30],
				altRow: false,
				frozen: true,
				toppager: true,
				multiselect: true,
				//multikey:"ctrlKey",
				multiboxonly: true,
				loadComplete: () => {
					var table = this;
					setTimeout(() => {
						styleCheckbox(table);
						updateActionIcons(table);
						updatePagerIcons(table);
						enableTooltips(table);
					}, 0);
				},
				onSelectRow: (rowid, status, e) => {
					let _grd = pointage_personnel._grid_selector;
					let _ar = $(_grd).jqGrid('getGridParam', 'selarrrow');
					//console.log(_ar);
					pointage_personnel.selectedArDtId = _ar;

				},
				pager: o._pager_selector,
				caption: 'Pointage'

			}
		);//fin init jqgrid
		$(grid_selector).jqGrid('navGrid', pager_selector,
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
			$(grid_selector).jqGrid('setGridWidth', parent_column.width());
		});

		//resize on sidebar collapse/expand
		$(document).on('settings.ace.jqGrid', function (ev, event_name, collapsed) {
			if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
				//setTimeout is for webkit only to give time for DOM changes and then redraw!!!
				setTimeout(function () {
					$(grid_selector).jqGrid('setGridWidth', parent_column.width());
				}, 20);
			}
		});
		//if your grid is inside another element, for example a tab pane, you should use its parent's width:

		$(window).on('resize.jqGrid', function () {
			let parent_width = $(grid_selector).closest('.widget-main').width();
			let parent_Height = $(grid_selector).closest('.widget-main').height();
			$(grid_selector).jqGrid('setGridWidth', parent_width);
			$(grid_selector).jqGrid('setGridHeight', parent_Height);
		});
		//procedure d'ajustement de dimmension

		//filter toolbar
		jQuery(grid_selector).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false });



	},//fin init

	_checkMonthRecap: () => {
		let m = pointage_personnel._month;
		let d = fonc.extractDT(m);
		let _fName = d['m'] + '_' + d['y'] + '.json';
		//console.log(d);
		pointage_personnel._widget._pgbar._setValue(5);
		$.ajax({
			method: 'POST',
			url: '_data/' + _fName,
		}).done((msg) => {
			let _grid_selector = pointage_personnel._grid_selector;
			$(_grid_selector).jqGrid('clearGridData');
			$(_grid_selector).jqGrid('setGridParam', { data: msg.data }).trigger('reloadGrid');
			//console.log(msg);
			//alert('doit êre géré')
		}
		).fail(
			() => {
				fonc.preActualisePtgeMonth();
			}
		);
	},//end _checkMonthRecap

	_dlg: {
		_Selector: '#dialog-confirm',
		_open: () => {
			let _o = pointage_personnel._dlg;
			let _s = _o._Selector;

		}
	},

	_dropdownProgress: {
		_label0Selector: '#tsk_dropdown [data-toggle="dropdown"] span.badge',
		_ulSelector: '#tsk_dropdown ul',
		_labelHeaderSelector: '#tsk_dropdown ul li.dropdown-header',
		_contentSelector: '#tsk_dropdown ul ',
		_oper: 'Fragmentation',
		_isfree:true,
		_update: () => {
			let _liSklt = '';
			let _ar = pointage_personnel.selectedArDtId;
			let _pg = pointage_personnel._dropdownProgress;
			$(_pg._label0Selector).text(_ar.length);
			$(_pg._labelHeaderSelector).text(_ar.length + " tâches");
			let _i = 0;
			let _s = '';
			$.each(_ar, (k, v) => {
				let _l = pointage_personnel._rowidToObj(v);
				//console.log(_l);
				_liSklt = '<li class="dropdown-hover" id="' + v + '"><a href="#"><div class="clearfix"><span class="pull-left">' + _pg._oper + ' : ' + _l._date + ' ' + _l.flagMS + '</span><span class="pull-right">0%</span></div><div class="progress progress-mini progress-striped active pos-rel " style="width:100%;" data-percent="0%"><div class="progress-bar progress-bar-danger" style="width:0%"></div></div></a></li>';
				//$(_pg._contentSelector).append(_liSklt);
				_s += _liSklt;
				_i++;
				//console.log(v);
			});

			let _str = '<li class="dropdown-header"><i class="ace-icon fa fa-check"></i>' + _i + ' tâche</li>';
			$(_pg._ulSelector).html(_str + _s);
			pointage_personnel._dropdownProgress._isfree=(_ar.length>0)?false:true;
			/* let fgm=new fragmentationProgressMan(_ar[0]);
			fgm.setValue(30); */
		},
		_clear: () => {
			pointage_personnel.selectedArDtId = [];
			pointage_personnel._dropdownProgress._update();
		}
	},


	_rowidToObj: (rowid) => {
		let _grd = pointage_personnel._grid_selector;
		let _rdt = $(_grd).jqGrid('getRowData', rowid);
		return _rdt;
	},

	_segmentation: () => {
		let _grd = pointage_personnel._grid_selector;
		let _ar = $(_grd).jqGrid('getGridParam', 'selarrrow');
		if (_ar.length == 0) {
			alert('data non spécicié');
		} else {
			pointage_personnel.selectedArDtId = _ar;
			//console.log(_ar);
			setTimeout(() => {
				pointage_personnel._dropdownProgress._update();
				setTimeout(() => {
					let frt = new fragmentationTraite();
					frt._start();
				}, 10);
			}, 10);
		}

	},
	_calculRefTime:()=>{
	if(pointage_personnel._dropdownProgress._isfree){
		pointage_personnel._dropdownProgress._update();

	}else{
		alert('pascientez ...');
	}
	}
}
var pointageAsObject={
	currentId:0,
	currenDate:'',
	byDate:[],
	refTimes:[],
	currentLowPintageI:0,
	currentALLPointage:[]
}
var calculCongee={
	
	t_statusCalculCongee:{},
	_curentProcedure:'',
	_month:1,
	_year:2021,
	_timeRebours:()=>{
		let _c=$('.pointageOperation .log ._timing');//
		let _v=parseInt(_c.text());
		_v--;
		_c.text(_v);
		if(calculCongee._waitingServer){
			setTimeout(() => {	
				calculCongee._timeRebours();
			}, 1000);
		}
	},
	_waitingServer:false,
	_getStatusFromJson:(month=calculCongee._month,year=calculCongee._year)=>{
		let _url="_data/"+year+"/"+month+"/status.json";
		 $.get(_url,{},(m)=>{
			calculCongee.t_statusCalculCongee=m.data;
			 calculCongee.pannelCommandeLog._print(JSON.stringify(m));
			 let _msg="next step shoud: getAllDates";
			 calculCongee.pannelCommandeLog._print(_msg);
		 });
	},
	_setMonth:(month=calculCongee._month,year=calculCongee._year)=>{
		let _msg="recuperation des informations depuis la base...<span class='_timing'>60 </span>";
		calculCongee.pannelCommandeLog._print(_msg);
		calculCongee._waitingServer=true;
		calculCongee._month=month;
		calculCongee._year=year;
		$.ajax({
			url:'php/calculCongee.drv.php',
			data:{oper:'setMonth',month:month,year:year}
		}).done(
			(m)=>{
				calculCongee._waitingServer=false;
				_msg="status: "+m;
				//calculCongee.pannelCommandeLog._print(_msg);
				calculCongee._getStatusFromJson();
			}
		).fail(
			()=>{
				calculCongee._waitingServer=false;
				_msg="Fail to get Server";
				calculCongee.pannelCommandeLog._print(_msg);
			}
		);
		setTimeout(() => {
			calculCongee._timeRebours();
		}, 10);
	},
	_getAllDates:(month=calculCongee._month,year=calculCongee._year)=>{
		// l'objectif serai de chercher tout les jours travailées, ce serais bien d'avoir une stat eu chaine de cractère
		calculCongee._curentProcedure='getAllDates';
		let _msg="recuperation des informations depuis la base...<span class='_timing'>60 </span>";
		calculCongee.pannelCommandeLog._print(_msg);
		calculCongee._waitingServer=true;
		setTimeout(() => {
			calculCongee._timeRebours();
		}, 10);

		$.ajax({
			url:"php/calculCongee.drv.php",
			data:{
				oper:'getAllDates',
				month:month,
				year:year
			}
		}).done((m)=>{
			
			$.get("_data/"+calculCongee._year+"/"+calculCongee._month+"/"+"allDates.json",{},(m)=>{
				calculCongee._waitingServer=false;
				//console.log(calculCongee.t_statusCalculCongee[0].AllDtWithRefTime);
				calculCongee.t_statusCalculCongee[0].AllDt=m;
				let _msg=JSON.stringify(calculCongee.t_statusCalculCongee);
				calculCongee.pannelCommandeLog._print(_msg);
				_msg="next step shoud: _getPointageEachDt";
				calculCongee.pannelCommandeLog._print(_msg);
			});
			
		}).fail(()=>{
			calculCongee._waitingServer=false;
			alert('erreur réseau');
		});
	},
	_getLowPointage:{
		_start:()=>{
			let _msg='All refTime got saving to db ....';
				calculCongee.pannelCommandeLog._print(_msg);
			pointageAsObject.refTimes=[];
			pointageAsObject.currentId=0;
			let _i=pointageAsObject.currentId;
			let _allDt=calculCongee.t_statusCalculCongee[0].AllDt;
			pointageAsObject.currenDate=_allDt[_i];
			calculCongee._getLowPointage._exec();
		},
		_next:()=>{
			let _i=pointageAsObject.currentId;
			let _allDt=calculCongee.t_statusCalculCongee[0].AllDt;
			let _l=_allDt.length;
			_i++;
			if(_i<_l){
				pointageAsObject.currentId=_i;
				pointageAsObject.currenDate=_allDt[_i];
				setTimeout(() => {
					calculCongee._getLowPointage._exec();
				}, 10);
			}else{
				// console.log(pointageAsObject.refTimes);
				let _msg='All refTime got saving to db ....';
				calculCongee.pannelCommandeLog._print(_msg);
				calculCongee._storeRefTime();
				
			}
		},
		_exec:()=>{
			let _url='_data/'+calculCongee._year+'/'+calculCongee._month+'/'+pointageAsObject.currenDate+'.json';
			$.get(_url,{},(m)=>{
				// console.log(m);
				let filtred=false;
				filtred=calculCongee._getLowPointage._filter(m);
				// console.log(filtred.answer);
				if(filtred._status)calculCongee._getLowPointage._next();
			});
		},
		_filter:(m)=>{
			// get M or S
			let _dt=pointageAsObject.currenDate;
			let _MorS=_dt.split(' ')[1];
			let _defRef=420;
			switch(_MorS){
				case 'S': _defRef=840;
			}
			let _ref=0;
			let _i=0;
			let _continue=true;
			let _l=m.length;
			let _dateH=0;
			let _dateMin=0;
			let _h=0;
			do{
				//console.log(m[_i]);
				_dateH=parseInt(m[_i].dateH);
				_dateMin=parseInt(m[_i].dateMin);
				_h=_dateH*60+_dateMin;
				if(_h<=_defRef){
					_ref=_defRef;
					_continue=false;
				}else{
					if(_ref==0){
						_ref=_h;
					}else{
						_ref=(_h<_ref)?_h:_ref;
					}
					_i++;
					_continue=(_i<_l)?true:false;
				}
				
			}while(_continue);
			let _r0=[];
			_r0[_dt]=_ref;
			pointageAsObject.refTimes[_dt]=_ref;
			let r={_status:true, answer:_r0};
			return r;
		}
	},
	_getPointageEachDt:{
		//allDt:calculCongee.t_statusCalculCongee[0].AllDt,
		currentDtId:0,
		_start:()=>{
			let _o=calculCongee._getPointageEachDt;
			pointageAsObject.currentId=0;
			let _i=pointageAsObject.currentId;
			let _allDt=calculCongee.t_statusCalculCongee[0].AllDt;
			pointageAsObject.currenDate=_allDt[_i];
			_o._exec();
		},
		_next:()=>{
			let _allDt=calculCongee.t_statusCalculCongee[0].AllDt;
			let _i=pointageAsObject.currentId;
			_i++;
			let _l=_allDt.length;
			if(_i<_l){
				let _allDt=calculCongee.t_statusCalculCongee[0].AllDt;				
				pointageAsObject.currentId=_i;
				let _dt=_allDt[_i];
				pointageAsObject.currenDate=_dt;
				setTimeout(() => {
					let _o=calculCongee._getPointageEachDt;
					_o._exec();
				}, 10);
			}else{
			pointageAsObject.currentId=0;
			calculCongee.pannelCommandeLog._print('_getPointageEachDt done line 832');
			console.log(pointageAsObject.byDate);
			calculCongee.pannelCommandeLog._print(pointageAsObject.byDate);
			calculCongee.pannelCommandeLog._print('nextStep: _getLowPointage');
			}
		},
		_exec:(_date=pointageAsObject.currenDate)=>{
			let _o=calculCongee._getPointageEachDt;
			calculCongee.pannelCommandeLog._print(_date);
			pointageAsObject.byDate.push(_date);
			$.ajax({
				url:'php/calculCongee.drv.php',
				data:{oper:'getAllPointageAt',_date:_date, month:calculCongee._month, year:calculCongee._year}
			}).done(
				(m)=>{
					let _o=calculCongee._getPointageEachDt;
					let _d=pointageAsObject.currenDate;
					//pointageAsObject.byDate[_d]=m;
					calculCongee.pannelCommandeLog._print(m);
					_o._next();

				}
			).fail(()=>{console.error('fail')});
			
		}
	},
	_storeRefTime:()=>{
		$.ajax({
			url:'php/calculCongee.drv.php',
			data:{
				oper:'storeRefTime',
				month:calculCongee._month,
				year:calculCongee._year,
				AllDtWithRefTime:pointageAsObject.refTimes
			}
		}).done((m)=>{
			let _msg='Done. next step: _getPersonnelList';
				calculCongee.pannelCommandeLog._print(_msg);
		}).fail(()=>{console.error('network error');});
	},
	
	pannelCommandeLog:{
		_print:(msg)=>{
			cible=$('.pointageOperation .log');
			cible.prepend(msg+'</br>');
		},
		_resize:()=>{
			comBoxSelector="#comm";
			parent_column = $(comBoxSelector).closest('[class*="widget-main"]');
			_w=parent_column.width()-10;
			$(comBoxSelector).width(_w);
		},
		_availableTags:['setMonth', 'getStatus'],
		_init:()=>{
			comBoxSelector="#comm";
			setTimeout(() => {
				calculCongee.pannelCommandeLog._resize();
			}, 10);
			$(window).on('resize.jqGrid', function () {
				calculCongee.pannelCommandeLog._resize();
			  })
			$(comBoxSelector).autocomplete({
				source:calculCongee.pannelCommandeLog._availableTags
			}).keydown((e)=>{
				//calculCongee.pannelCommandeLog._print(e);
				// console.log(e);
				if(e.key=='Enter'){
					let _o=e.currentTarget;
					let _v=	e.currentTarget.value;
					
					$(_o).val('');
					switch(_v){
						case 'setMonth':
							calculCongee._curentProcedure='setMonth';
							let _answer="Procedure setMonth engagée, veuillez saisir Mois,Annee";
							calculCongee.pannelCommandeLog._print(_answer);
							break;
						case 'getAllDates':
							calculCongee._curentProcedure='getAllDates';
							calculCongee._getAllDates();
							break;
						case '_getPointageEachDt':
							calculCongee._getPointageEachDt._start();
							break;
						case '_getLowPointage':
							calculCongee._getLowPointage._start();
							break;
						default:
							switch (calculCongee._curentProcedure) {
								case "setMonth":
									let _m=_v.split(',')[0];
									let _y=_v.split(',')[1];
									calculCongee.pannelCommandeLog._print("demarrage procedure sur "+_m+"/"+_y);
									calculCongee._setMonth(_m,_y);
									break;
							
								default:
									break;
							}
							break;
					}
					
				}
			});
			//console.log(_w);
			//resize to fit page size
			// $(window).on('resize.jqGrid', function () {
			//   $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
			//   })
		}
	}
}