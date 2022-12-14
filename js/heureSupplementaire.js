var heureSupGrid0={
    _lim:21,
    _coefJ:1.3,
    _coefN:1.7,
    lineSelected:[],
    _lineRecalculDuration:(arId)=>{
        //console.log(arId);
        let cellname=arId['cellname']; 
        let grsSelector=arId['grsSelector']; 
        let iCol=arId['iCol']; 
        let iRow=arId['iRow']; 
        let value=arId['value']; 
    //console.log(arId);
    },
    _addLineTodb:(_o)=>{
        let l={ 
            "NomPrenom": '',
            "IdAnnee": '2022',
            "Mois": '0',
            "Debut": '',
            "Fin": '',
            "DurerJour": '',
           "MontantJour": '',
           "DurerNuit": '',
           "SalaireB": 0,
           "MontantNuit": '',
           "EsPayer": "Non",
           "Observ": '',
           "NumOrdreHS":0
            };
            
        _o=(typeof(_o)!=='undefined')?_o:l;
        $.ajax({
            url:'php/heureSup.drv.php',
            data:{
            oper:'addLineHeureSup',
            l:_o
            }
        }).done((msg)=>{
            console.log(msg);
        }).fail(()=>{
            alert('test');
        });
    }
}

class _heureSup{
    constructor(){
        //console.log(personnel._loadDataFromDb('forList')+'ICI');
        this.personnelList0='';
        this.lastsel3;
        this.url='html/heureSup.html';
        this.cible='[data-repere="row-2"]';
        this._isInit=false;
        this.defaultGridLine={
             "NomPrenom": "",
             "IdAnnee": "",
             "Mois": "",
             "Debut": "",
             "Fin": "",
             "DurerJour": "0",
            "MontantJour": "0",
            "DurerNuit": "0",
            "SalaireB": "0",
            "MontantNuit": "0",
            "EsPayer": "Non",
            "Observ": "",
            "NumOrdreHS": "0"
        };
        this.btnAddAction=(e)=>{
           // console.log(e.target)
        //define the gid
        let grdParam=this._gridParam;
        let gridName=grdParam.gridselector;
        let rowData=$(gridName).jqGrid('getRowData');        
        let selectedRowId=$(gridName).jqGrid('getGridParam','selrow');
        let selectedRDt=$(gridName).jqGrid('getRowData',selectedRowId);
       // console.log(selectedRDt);
        // selectedRDt.rowid=4;
        // console.log(selectedRDt);

       // let _dt=(selectedRowId==null)?this.defaultGridLine:selectedRDt;
       if(selectedRowId!=null){
        this.defaultGridLine={
            "NomPrenom": "",
            "IdAnnee": selectedRDt.IdAnnee,
            "Mois": selectedRDt.Mois,
            "Debut": selectedRDt.Debut,
            "Fin": selectedRDt.Fin,
            "DurerJour": selectedRDt.DurerJour,
           "MontantJour": selectedRDt.MontantJour,
           "DurerNuit": selectedRDt.DurerNuit,
           "SalaireB": 0,
           "MontantNuit": selectedRDt.MontantNuit,
           "EsPayer": "Non",
           "Observ": selectedRDt.Observ,
           "NumOrdreHS": "0"
       };
       }

        let newRowId=rowData.length++;
        
        //console.log(selectedRowId);
        //$(gridName).jqGrid('addRowData',newRowId,this.defaultGridLine);
        heureSupGrid0._addLineTodb( this.defaultGridLine);

        };
        //this.s=personnel._formatDataForList();
        this._gridParam={
            
            btnAddParam:{
               caption:"Ajout", buttonicon:"ce-icon fa fa-plus-circle purple", onClickButton:this.btnAddAction, position: "last", title:"", cursor: "pointer"
            },
            querry:'SELECT PERSONNEL.NomPrenom, DURER_SUPPLEMENTAIRE.IdAnnee, DURER_SUPPLEMENTAIRE.Mois, DURER_SUPPLEMENTAIRE.Debut, DURER_SUPPLEMENTAIRE.Fin, DURER_SUPPLEMENTAIRE.DurerJour, DURER_SUPPLEMENTAIRE.MontantJour, DURER_SUPPLEMENTAIRE.DurerNuit, DURER_SUPPLEMENTAIRE.SalaireB, DURER_SUPPLEMENTAIRE.MontantNuit, DURER_SUPPLEMENTAIRE.EsPayer, DURER_SUPPLEMENTAIRE.Observ, DURER_SUPPLEMENTAIRE.NumOrdreHS FROM DURER_SUPPLEMENTAIRE INNER JOIN PERSONNEL ON DURER_SUPPLEMENTAIRE.CIN = PERSONNEL.CIN WHERE (((DURER_SUPPLEMENTAIRE.IdAnnee) Like "*2022*") AND ((DURER_SUPPLEMENTAIRE.Debut) Like "*29/09/2022*") AND ((DURER_SUPPLEMENTAIRE.NumOrdreHS)>3325)) ORDER BY DURER_SUPPLEMENTAIRE.NumOrdreHS;',
            gridselector:'#grid-saisieHeureSup',
            pagerSelector:'#pager-saisieHeureSup',
            colNames:['NomPrenom', 'IdAnnee', 'Mois', 'Debut', 'Fin', 'DurerJour', 'MontantJour', 'DurerNuit', 'SalaireB', 'MontantNuit', 'EsPayer', 'Observ', 'NumOrdreHS','_s'],
            colModel:[
                {index:'NomPrenom', name:'NomPrenom', editable:true},
                {index:'IdAnnee', name:'IdAnnee', hidden:true},
                {index:'Mois', name:'Mois', hidden:true},
                {index:'Debut', name:'Debut',editable:true,width:300},
                {index:'Fin', name:'Fin', hidden: true},
                {index:'DurerJour', name:'DurerJour'},
                {index:'MontantJour', name:'MontantJour'},
                {index:'DurerNuit', name:'DurerNuit'},
                {index:'SalaireB', name:'SalaireB',hidden:true},
                {index:'MontantNuit', name:'MontantNuit'},
                {index:'EsPayer', name:'EsPayer',hidden:true},
                {index:'Observ', name:'Observ',hidden:false, editable:true},
                {index:'NumOrdreHS', name:'NumOrdreHS', hidden:true},
                {index:'_s', name:'_s',width:40},
            ],
            param:{

            }

        }
        this._init();
    }
    _init(){
        $.ajax({
            methode:'GET',
            url:this.url,
        })
        .done((msg)=>{
            //console.log(msg);
            $(this.cible).prepend(msg);
            this._initGrid0();
        })
        .fail(()=>{
            console.log(this._isInit);
        });
        
    }
    _initGrid0(){
        //console.log(personnel);
        //this.personnelList0=personnel._loadDataFromDb('forList');
        //console.log('test');
        let grd=this._gridParam;
        let grdSelector=grd.gridselector;
        let pagerSelector=grd.pagerSelector;
        $(grdSelector).jqGrid({
            colNames:grd.colNames,
            colModel:grd.colModel,
            datatype: 'local', 
            caption:'Saisie Heure Supplementaire',
            toppager:true,
            loadComplete: () => {
                let parent_column=$(grdSelector).closest('.widget-main');
                $(grdSelector).jqGrid('setGridWidth', parent_column.width());
                $(grdSelector).jqGrid('setGridHeight', parent_column.height());

                var table = this;
                setTimeout(() => {
                    styleCheckbox(table);
                    updateActionIcons(table);
                    updatePagerIcons(table);
                    enableTooltips(table);
                }, 0);
            },
            //gridview:true,
            forceFit :true,
            cellEdit:false,
            rownumbers:true,
            cellsubmit:'clientArray',
            afterEditCell:function(rowid, cellname, value, iRow, iCol){
                console.log('afterEditCell fired');
                console.log(rowid, cellname, value, iRow, iCol);
                let arId=[];
                arId['rowid']=rowid;
                arId['cellname']=cellname; 
                arId['value']=value; 
                arId['iRow']=iRow; 
                arId['iCol']=iCol;
                arId['grdSelector']=grdSelector
                // console.log(arId);
                switch(cellname){
                    case 'Debut':
                       // console.log(grdSelector);
                        _dateRangePicker(arId);
                        break;
                    case 'NomPrenom':
                        //alert('test');
                        //popDial0
                        let c={
                            dialContainerSelector:('.popDial0'),
                            arId:arId
                        }
                        popgrid(c);
                        break;
                }
            },
            afterSaveCell:function(rowid, cellname, value, iRow, iCol){
                console.log('afterSaveCell Fired');
            },
            afterRestoreCell:function(rowid, cellname, value, iRow, iCol){
                console.log('afterRestoreCell Fired');
            },
            beforeSaveCell:function(rowid, cellname, value, iRow, iCol){
                console.log('beforeSaveCell Fired');
                let arId=[];
                arId['rowid']=rowid;
                arId['cellname']=cellname; 
                arId['value']=value; 
                arId['iRow']=iRow; 
                arId['iCol']=iCol;
                arId['grdSelector']=grdSelector
                switch(cellname){
                    case 'Debut':
                        heureSupGrid0._lineRecalculDuration(arId);
                        //let hs=extends(_heureSup);
                        //hs._grid0LineRecalculDuration(arId);

                        
                        break;
                }
            },
            onSelectRow:(rowid,status,e)=>{
               heureSupGrid0.lineSelected['rowid']=rowid;
               heureSupGrid0.lineSelected['grdSelector']=grdSelector;
               
            },
            ondblClickRow: function(id){
                if(id && id!==this.lastsel3){
                    $(grdSelector).restoreRow(this.lastsel3);
                    $(grdSelector).editRow(id,true,_heureSuplineEditInit);//,pickdates
                    this.lastsel3=id;
                    //,_heureSuplineEditInit(id,grdSelector)
                }
           },
            
            pager:grd.pagerSelector
        });
        $(grdSelector).jqGrid('navGrid', grd.pagerSelector,
        {
            edit:false,
            add:false,
            addicon: 'ace-icon fa fa-plus-circle purple',
            del: false,
            delicon: 'ace-icon fa fa-trash-o red',
            refresh: true,
            refreshicon: 'ace-icon fa fa-refresh green',
            view: true,
            viewicon: 'ace-icon fa fa-search-plus grey',
        }
        );
        //$(grdSelector).jqGrid('inlineNav',grd.pagerSelector);
        $(grdSelector).jqGrid("navButtonAdd",grd.pagerSelector, grd.btnAddParam)
        let parent_column=$(grdSelector).closest('.widget-main');
        $(window).on('resize.jqGrid',()=>{
            let grd=this._gridParam;
            let grdSelector=grd.gridselector;
            $(grdSelector).jqGrid('setGridWidth', parent_column.width());
            $(grdSelector).jqGrid('setGridHeight', parent_column.height());
        });
        //getData
        this._getGrid0Data();
    }
    _getGrid0Data(){
        $.ajax({
            method:'GET',
            url:'_data/heureSup_11_2022.json'
        }).done((m)=>{
            //console.log(m);
            let grd=this._gridParam;
            let grdSelector=grd.gridselector;
            $(grdSelector).jqGrid('setGridParam',{data:m.data}).trigger('reloadGrid');
        });
    }
    
   
}