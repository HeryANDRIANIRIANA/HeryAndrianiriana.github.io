popgrid=()=>{
    //définir en tant que dialog autoopen true,
    //if c is an object who contain the cible of the dialog
    console.log('fired');
    let rowid=heureSupGrid0.lineSelected['rowid'];
   
    let grdSelector=heureSupGrid0.lineSelected['grdSelector'];
    let dialContainerSelector='.popDial0';
 
    $(dialContainerSelector).removeClass('hide');
    $(dialContainerSelector).dialog({
      modal:true,
      width:500,      
      open:()=>{
        let p=personnel;
        let gSelector='#grid-P0';
        let pSelector='#pager-P0';
        $(gSelector).jqGrid({
          colNames:p.colNames,
          colModel:p.colModel,
          datatype:'local',
          data:personnel._data,
          viewrecords: true,
          rowNum: 10,
          rowList: [10, 20, 30],
          pager: pSelector,
          loadComplete: () => {
            var table = this;
            setTimeout(() => {
                styleCheckbox(table);
                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);
            }, 0);
          },
          ondblClickRow:(rowid, iRow, iCol, e)=>{
            let rdt=$(gSelector).getRowData(rowid);
            let SB_Heure=parseInt(rdt.SB_Heure);
            console.log(rowid+', selected');
            let prowid=heureSupGrid0.lineSelected['rowid'];
            let grdSelector=heureSupGrid0.lineSelected['grdSelector'];
            $(grdSelector).jqGrid('setRowData',prowid,{NomPrenom:rdt.NomPrenom,CIN:rdt.CIN,SB_Heure:SB_Heure});
            $(grdSelector).jqGrid('saveRow',prowid);
            
            let _coefJ=heureSupGrid0._coefJ;
            let _coefN=heureSupGrid0._coefN;
            let prdt=$(grdSelector).getRowData(prowid);
            let _durationJ=parseInt(prdt.DurerJour);
            let _durationN=parseInt(prdt.DurerNuit);

            let montantJ=parseInt(SB_Heure*_durationJ*_coefJ);
            let montantN=parseInt(SB_Heure*_durationN*_coefN);

            $(grdSelector).jqGrid('setRowData',prowid,{NomPrenom:rdt.NomPrenom,CIN:rdt.CIN,SB_Heure:SB_Heure,MontantJour:montantJ, MontantNuit:montantN, _s:"<a href='#' class='heureSupSLine'>U</a>"});
            $(grdSelector).jqGrid('saveRow',prowid);
          }
        });
       
       // console.log(personnel._data[0]);
         let parent_column=$("#ui-id-2");//popDial0 ui-dialog-content ui-widget-content
         let d=personnel._data;
         $(gSelector).jqGrid('setGridWidth', parent_column.width());
         $(gSelector).jqGrid('setGridHeight', parent_column.height());
      }
    });

  }

_dateRangePicker=(arId)=>{
  //console.log(arId);
  let id=heureSupGrid0.lineSelected['rowid'];
  let grdSelector=heureSupGrid0.lineSelected['grdSelector'];
  let DebutSlector="#"+id+"_Debut";
  let nomPrenomSlector="#"+id+"_NomPrenom";
 
  setTimeout(() => {
    //console.log($(nomPrenomSlector).html());
    $(nomPrenomSlector,grdSelector).click(()=>{
      //alert('test');
      popgrid();
    });

    $(DebutSlector,grdSelector).daterangepicker({
      timePicker: true,
      timePicker24Hour:true,
      timePickerIncremenet:15,
      maxDate:moment().startOf('hour').add(24, 'hour'),
     //startDate: moment().startOf('hour'),
      //endDate: moment().startOf('hour').add(24, 'hour'),
      locale: {
        format: 'DD/MM/YY HH:mm'
      }
    },function (start,end,label){
      let grdSelector=heureSupGrid0.lineSelected["grdSelector"];
      
      let rowid=heureSupGrid0.lineSelected["rowid"];
      //let cellname=arId["cellname"];
      let _form='DD-MM-YYYY HH:mm';
      let _s=start.format(_form);
      let _e=end.format(_form);
      //console.log();
      let oldRdt=$(grdSelector).jqGrid('getRowData',rowid);
      let SalaireB=parseInt(oldRdt.SalaireB);
      
      //calcul de la durée
      let _durationJ=0;
      let _durationN=0;
      let _d1=start.format('DD');
      let _d2=end.format('DD');
      let _h1=start.format('HH');
      let _h2=end.format('HH');
      
      let _lim=heureSupGrid0._lim;
      

      let _mlim=moment({
        years: start.format('YYYY'),
        months: start.get('month'),
        date: start.format('DD'),
        hours: 21
          });
          //console.log(_mlim.format('DD-MM-YYYY HH:mm'));
      if(_d1==_d2){// s'ils sont sur le m^me jour
        if(_h1<=_lim){//si le départ est inférieur à21
          if(_h2<=_lim){//si la fin est avant 21
            _durationJ+=moment.duration(end.diff(start)).asHours();//il y a durée J
          }else{//si la fin après 21
            _durationJ+=moment.duration(_mlim.diff(start)).asHours();
            _durationN+=moment.duration(end.diff(_mlim)).asHours();//il ya durée J et durée N
          }
        }else{//si le départ est après21
          //il y a seulement durée Nuit
          _durationN+=moment.duration(end.diff(_mlim)).asHours();
        }
      }else{
        _durationJ+=moment.duration(_mlim.diff(start)).asHours();//il y a durée J
        _durationN+=moment.duration(end.diff(_mlim)).asHours();//il ya durée J et durée N
      }
      
      let _coefJ=heureSupGrid0._coefJ;
      let _coefN=heureSupGrid0._coefN;
      let montantJ=parseInt(SalaireB*_durationJ*_coefJ);
      let montantN=parseInt(SalaireB*_durationN*_coefN);
     
      $(grdSelector).jqGrid('setRowData',rowid,{Debut:_s,Fin:_e,DurerJour:_durationJ,DurerNuit:_durationN,MontantJour:montantJ, MontantNuit:montantN, _s:"<a href='#' class='heureSupSLine'>U</a>"});
      $(grdSelector).jqGrid('saveRow',rowid);
      
    } );
  }, 10);
}

_heureSuplineEditInit=(id)=>{
  //let grd=heureSup._gridParam;
  // let grdSelector="#grid-saisieHeureSup";
  // let _selector=("#"+id+"NomPrenom",grdSelector);
  _dateRangePicker(heureSupGrid0.lineSelected);
}