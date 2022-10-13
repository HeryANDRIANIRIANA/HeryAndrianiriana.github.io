var widget1={//widget principal personel
    acc:"#widget-container-col-1",
    defaultClass:'col-xs-12 col-sm-12 widget-container-col',
    class1:'col-xs-12 col-sm-8 widget-container-col',
    _resize:()=>{
      //changement de la dimmension tab princiipal
      //toggle dimmension
     let _o=widget1;
     let _className=$(_o.acc).attr('class');
     switch (_className) {
      case _o.class1:
        $(_o.acc).attr("class", _o.defaultClass);
		widget2._remove();
        break;
      default:
        $(_o.acc).attr("class", _o.class1);
		let sw=widget2._isLoaded;
			console.log(sw);
		switch(sw){
			case true:
			widget2._show();
			break;
			case false:
			widget2.getSkl();
			break;
		}
		
        break;
     } 
     //redimmension grid
      $(window).triggerHandler('resize.jqGrid');
  
    }
  }

  var widget2={
    _parent:$("[data-repere='row-1']"),
	_selector:'#widgetPointage',
	_isLoaded:false,
   
    getSkl:()=>{
      $.ajax({
      method: 'GET',
      url: 'html/personnelWidgetPointage.html',
      dataType: 'html',
      })
      .done(function( msg ) {
      widget2._parent.append(msg);
	  widget2._show();
	  widget2._isLoaded=true;
      setTimeout(() => {
       // widget2._initMenuBtn();
		pointage_personnel._init();//defined in "js/pointagePersonel.js" /!\
		
      }, 10);
	  
      }).fail(()=>{
      console.error('erreur de chargement');
      });
    },
	_show:()=>{
		let selector=widget2._selector;
		$(selector).attr('class','col-xs-12 col-sm-4 widget-container-col');
	},
	_remove:()=>{		
		let selector=widget2._selector;
		$(selector).attr('class','col-xs-12 col-sm-4 widget-container-col hidden');
	}
	
  }//fin widget2
  
  var _dialog={
	  _confirm:{
		  _selector:"#dialog-confirm",
		  _alert_selector:"#dialog-confirm .alert",
		  _question_selector:"#dialog-confirm p.bolder ",
		  _title:"Données secondaire absents",
		  _alert:"",
		  _question:"",
		  _okFunction:()=>{
			$(_dialog._confirm._selector).dialog("close")  ;
		  },
		  _setDetails:(_a,_q)=>{
			  let _o=_dialog._confirm;
			  $(_o._alert_selector).html(_a);
			  $(_o._question_selector).html(_q);
		  },
		  _init:()=>{
			  let _o=_dialog._confirm;
			  let _s=_dialog._confirm._selector;
			  
			  $( _s ).removeClass('hide').dialog({
						resizable: false,
						width: '320',
						modal: true,
						autoOpen:false,
						title: "<div class='widget-header'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle red'></i> "+_o._title+"?</h4></div>",
						title_html: true,
						buttons: [
							{
								html: "<i class='ace-icon fa fa-trash-o bigger-110'></i>&nbsp; Oui",
								"class" : "btn btn-danger btn-minier",
								click: function() {
									//$( this ).dialog({button:[]})
									//$( this ).dialog( "close" );
									setTimeout(_o._okFunction,10);
									//alert('the last');
								}
							},
							{
								html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Annuler",
								"class" : "btn btn-minier",
								click: function() {
									$( this ).dialog( "close" );
								}
							}
						],
					});
		  },
		  _load:()=>{
			  $.ajax({
				  url:'html/_dialog.html',
			  }).done((o)=>{
				  $('body').append(o);
				  _dialog._confirm._init();
			  }).fail(()=>{
				  console.error('Erreur de chargement composant dialog confirm');
			  });
			  
			}
	  }
	  
  }
  