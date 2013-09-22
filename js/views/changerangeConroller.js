var changeRangeViewController = new Class({

    Extends: Locaface.Section,

     loadmap:null,
    map:null,
    mapProp:null,
    slider:null,
    valInd:null,
    loadView:function () {

        this.view = Moobile.View.at('templates/views/changerange-view.html');

    },
    viewDidLoad: function() {
        this.parent();
       this.slider = this.view.getDescendantComponent('slider');
        this.slider.addEvent('show', this.bound('loadMaptoView'));
        this.slider.hide();
        this.valInd = this.view.getDescendantComponent('rangeNumber');
        this.valInd.setText(converter.displayDistance(AppVars.PosRad));

    },
   initSlider:function(){
       this.slider.setMinimum(200);
       this.slider.setMaximum(10000);
       this.slider.setValue(AppVars.PosRad);
       this.slider.refresh();

       this.slider.addEvent('change',this.bound('rangeChanged'));


   },
    viewDidEnter: function() {
        this.parent();
        this.slider.show();

    },
    rangeChanged:function(){
        console.log(this.slider.getValue());
       AppVars.PosRad = this.slider.getValue();
        this.valInd.setText(converter.displayDistance(AppVars.PosRad));
        userRadius.change(AppVars.PosLAT, AppVars.PosLON, AppVars.PosRad);
        userRadius.fit();
    },

    destroy: function() {
        this.mapProp = null;
        this.map = null;

        this.parent();
       userRadius.radiusCircle = null;
    },

    loadMaptoView: function() {
       try{


        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(AppVars.PosLAT, AppVars.PosLON),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            // Armin
            maxZoom: 18
        };
        map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

        //Armin
        createLandMaster(map);

        google.maps.visualRefresh = true;
        for (eventName in events) {
            setupListener(map, eventName, events[eventName]);
        }

        userRadius.showUser(AppVars.PosLAT, AppVars.PosLON, usrPos.Rad);

        /********** MASOUD: Example **********/
        userRadius.change(AppVars.PosLAT, AppVars.PosLON, AppVars.PosRad);
        userRadius.fit();
        this.initSlider();
        this.preloader.element.setStyle('opacity', '0');
        var that = this;
        setTimeout(function () {
            that.preloader.hide();
        }, 600);
       }
        catch (ex){
            setTimeout(function () {
                that.loadMaptoView();
            }, 1500);
        }
        // this.slider.addEvent('change',this.bound('rangeChanged'));
    }

});


