class Widget0{
constructor(){
this.sklt='html/widget0.html';
this.c0='#widget-container-col-1';
this.c1='#widget-container-col-2';
this.wd0sklt='';
this.nbr=0;
this.wdgid=0;
this.wdpref="wdg";
this.contentUrls=['html/informationsPersonnels.html','html/EbaucheDeCreation.html','html/experienceProfessionnel.html','html/stages.html','html/diplomes.html','html/langues.html'];
this.titles=['<i class="ace-icon glyphicon glyphicon-user"></i><span>Informations personnels</span>','<i class="ace-icon fa fa-gift"></i><span>Ebauches de création</span>','<i class="ace-icon fa fa-flask"></i><span>Expériences professionnel</span>','<i class="ace-icon fa fa-briefcase"></i><span>Stages</span>','<i class="ace-icon glyphicon glyphicon-book"></i><span>Diplômes et formations</span>','<i class="ace-icon fa fa-globe"></i><span>Compétances linguistiques</span>'];
this.contents=[];
this.loaderContentManager={
    _start:()=>{
        this.Ci=0;
        this.loaderContentManager._act();
    },
    _getNext:()=>{
        this.Ci++;
        let ar=this.contentUrls;
        let l=ar.length;
        if(this.Ci<l){
            this.loaderContentManager._act();
        }else{
            this.loaderContentManager._end();
        }
    },
    _end:()=>{
        console.log('Content loaded');
        setTimeout(() => {
            this.renderContainers._start();
        }, 100);
    },
    _act:()=>{
        let c=this.Ci;
        let ar=this.contentUrls;
        let url=ar[c];
        $.ajax({
            url:url,
            method:'GET'
        }).done((m)=>{
            let c=this.Ci;
            this.contents[c]=m;
            setTimeout(() => {
                this.loaderContentManager._getNext();
            }, 100);
        });
        
    }
};
this.wdg0Loader={
    _load:()=>{
        $.ajax({
        url:this.sklt,
        method:'GET'
        }).done((m)=>{
            this.wd0sklt=m;
            console.log('wd0 loaded');
            setTimeout(() => {
                this.loaderContentManager._start();
            }, 100);
        });
    }
};
this.renderContainers={
    _start:()=>{
        this.Ci=0;
        this.renderContainers._act();
    },
    _getNext:()=>{
        this.Ci++;
        let ar=this.contentUrls;
        let l=ar.length;
        if(this.Ci<l){
            this.renderContainers._act();
        }else{
            this.renderContainers._end();
        }
    },
    _end:()=>{
        this.renderContent._start();
    },
    _act:()=>{
        let id=this.wdpref+this.Ci;
        let i=this.Ci;
        let c=(i<3)?this.c0:this.c1;
        let txt='<div class="col-xs-4 col-sm-4 widget-container-col" id="'+id+'"></div>';
        $(c).append(txt);
        $("#"+id).append(this.wd0sklt);
        $("#"+id+" .widget-box .widget-header .widget-title").append(this.titles[i]);
        setTimeout(() => {
            this.renderContainers._getNext();
        }, 100);

    }
};
this.renderContent={
    _start:()=>{
        this.Ci=0;
        this.renderContent._act();
    },
    _end:()=>{
        this.initContent._do();
    },
    _getNext:()=>{
        this.Ci++;
        let ar=this.contentUrls;
        let l=ar.length;
        if(this.Ci<l){
            this.renderContent._act();
        }else{
            this.renderContent._end();
        }
    },
    _act:()=>{
        let id=this.wdpref+this.Ci;
        let i=this.Ci;
        $("#"+id+" .widget-box .widget-body .widget-main").append(this.contents[i]);
        setTimeout(() => {
            this.renderContent._getNext();
        }, 100);
    }
};
this.initContent={
    _do:()=>{
        $('.easy-pie-chart.percentage').each(function(){
            $(this).easyPieChart({
                barColor: $(this).data('color'),
                trackColor: '#EEEEEE',
                scaleColor: false,
                lineCap: 'butt',
                lineWidth: 8,
                animate: ace.vars['old_ie'] ? false : 1000,
                size:75
            }).css('color', $(this).data('color'));
        });
    }
}

}
loadThenSet(){
    this.wdg0Loader._load();

}

// setContent(){
//     let id=this.wdpref+this.wdgid;
//     let titleSelector="#"+id+" .widget-box .widget-header h5.widget-title";
//     $(titleSelector).html(this.titles[this.wdgid]);
//     this.loadContent();
//     // switch (this.wdgid) {
//     //     case 1:
//     //         console.log('1');
//     //             $(titleSelector).html('');
//     //         break;
//     //     case 4:
//     //             console.log('4');
//     //                 $(titleSelector).html('<span>Informations personnels</span>');
//     //             break;
//     //     default:
//     //         break;
//     // }
// }

}