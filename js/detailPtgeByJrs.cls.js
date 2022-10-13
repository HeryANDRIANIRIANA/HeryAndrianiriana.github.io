class detailPtgeByJrs{
constructor(){
	this.grdPgeMoisSelector=pointage_personnel._grid_selector;
	let selectedId=$(this.grdPgeMoisSelector).jqGrid('getGridParam','selarrrow');
	this.selectedPtgDays=$(this.grdPgeMoisSelector).jqGrid('getRowData',selectedId);
	this.grdDetPtgeByDateSelector=personnel.grid_selector;
	
}
_show(){
	let selectedId=$(this.grdPgeMoisSelector).jqGrid('getGridParam','selarrrow');
	this.selectedPtgDays=$(this.grdPgeMoisSelector).jqGrid('getRowData',selectedId);
	console.log(selectedId);
}

}