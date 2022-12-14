$ ($ => {
  //override dialog's title function to allow for HTML titles
  $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
      var $title = this.options.title || '&nbsp;'
      if( ("title_html" in this.options) && this.options.title_html == true )
        title.html($title);
      else title.text($title);
    }
  }));

  //pie chart tooltip example
  var $tooltip = $(
    "<div class='tooltip top in'><div class='tooltip-inner'></div></div>"
  )
    .hide()
    .appendTo("body");
  var previousPoint = null;
  /////////////////////////////////////
  $(document).one("ajaxloadstart.page", function (e) {
    $tooltip.remove();
  });

  $(".dialogs,.comments").ace_scroll({
    size: 300,
  });
    personnel._gridInit();
    personnel._barMenu._init();
    personnel._loadData();
	_dialog._confirm._load();//defined in __widget.js
	_dialog._confirm._init();

//initialisation de l'interface de calul  
  calculCongee.pannelCommandeLog._init();
 
  var heureSup=new _heureSup();
  //console.log(heureSup);
  }); //end on load)