var LocaLandViewController = new Class({

    Extends: Locaface.Section,

    loadmap:null,
    map:null,
    mapProp:null,
    daystoBuy:null,
    postchoose:null,
    purchase:null,
    selectMode:null,
    controlls :null,
    noBlock:null,
    selected:null,
    theLand:null,
    loadView:function () {

        this.view = Moobile.PullRefresh.at('templates/views/localand-view.html');

    },
    viewDidLoad: function() {
        this.parent();

        var that = this
        this.selectMode = this.view.getDescendantComponent('selectButton');
        this.selectMode.setLabel("Select Mode");
        this.selectMode.addEvent('tap', this.bound('onSelectModeChange'));
        this.selectMode.addEvent('ready', this.bound('loadMap'));
        this.purchase = this.view.getDescendantComponent('purchaseButton');
        this.purchase.addEvent('tap',function(){
            AppService.rentLand(that.postchoose.value,AppVars.Alias,that.daystoBuy.value,landMaster.fromCode(that.theLand).x,landMaster.fromCode(that.theLand).y)

        })
         this.controlls = this.view.getDescendantComponent('rentControlls');
        this.noBlock = this.view.getDescendantComponent('noBlock');


    },

    viewDidEnter: function() {
        var that = this
        this.postchoose = document.getElementById("postrent");
        this.daystoBuy = document.getElementById("dayrent");
        this.daystoBuy.addEvent('change',function(){
             var val=  that.daystoBuy.value *  1
           that.purchase.setLabel("Purchase " +  val + '$') ;
        });


        AppService.onMyPostsRecieved = function (msg) {

            var pst = msg.params;
            var cnt = 0;



            for (var i = 0; i < pst.length; i++) {
                cnt = i + 1;
                var Pst = pst[i];
                var option=document.createElement("option");
                option.text=Pst[5].substring(0,15) + '...';
                option.value = Pst[0];
                that.postchoose.add(option,null)
                             }
            that.preloader.element.setStyle('opacity', '0');
            setTimeout(function () {
                that.preloader.hide();
            }, 600);
        };

        this.controlls.hide();
        AppService.rentedland = function(msg){
            var al = new Moobile.Alert;
            al.setTitle('Locaface');


            if(msg.params.success){
             al.setMessage('Congratulations, you have successfully rented this land!');
                al.showAnimated();

            }
            else {
                al.setMessage('An error occurred while renting this land, please try again later.');
                al.showAnimated();
            }
            that.noBlock.show();
            that.controlls.hide();
        }
        AppService.getMyPosts();
        this.parent();
    },

    destroy: function() {
        this.mapProp = null;
    this.map = null;
        this.parent();
        userRadius.radiusCircle = null;
    },

    loadMap: function() {

        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(AppVars.PosLAT, AppVars.PosLON),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            // Armin
            maxZoom: 18
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        //Armin
        createLandMaster(map);

        google.maps.visualRefresh = true;
        for (eventName in events) {
            setupListener(map, eventName, events[eventName]);
        }
        userRadius.showUser(AppVars.PosLAT, AppVars.PosLON, usrPos.Rad);
    },

    onSelectModeChange: function(){
        var that = this;
        landMaster.setBuyMode(!landMaster.isBuyMode());
        this.selectMode.setLabel((landMaster.isBuyMode())?"Finished selecting land" : "Select Mode")
        if(!landMaster.isBuyMode()){
            that.selected = false;
            landMaster.areas.forEach(function(value, key){
                if(value == 1){
                  that.selected = true;
                    that.theLand = key;
                }


            });

            if(that.selected){
                that.controlls.show();
                that.noBlock.hide();

            }
            else{
                that.controlls.hide();
                that.noBlock.show();
                //doo
            }
        }
        else{
            that.controlls.hide();
            that.noBlock.hide();
        }
    }

});


