// TODO: Write destroy for all functions and events...

var Locaface = {
    Component: {},
    Event: {}
};

Locaface.Section = new Class({

    Extends: Moobile.ViewController,
    isHome:false,
    backButton: null,
    homelogo:null,
    menu:null,
    titlebar:null,
    preloader:null,
    preloaderInd:null,
    editButton:null,
    hasEdit:false,
    viewDidLoad: function() {


        var that = this;
        this.preloader = this.view.getDescendantComponent('preLoader');
        if(this.preloader != null){
            this.preloaderInd = this.preloader.getChildComponent('preloaderIndicator');
            this.preloaderInd.start();
        }
        if(this.isHome== false){
        this.backButton = this.view.getDescendantComponent('back-button');

        this.backButton.addEvent('tap', this.bound('onBackButtonTap'));
          }
        else{
            this.homelogo = this.view.getDescendantComponent('homelogo');
            this.homelogo.setSource('images/locaface/logotype.png');

          }
        this.menu = this.view.getDescendantComponent('menu');
        this.editButton = this.view.getDescendantComponent('editButton');
        if(this.hasEdit){
          if(this.menu != null)  this.menu.hide();
            this.editButton.addEvent('tap',function(){
                that.getViewControllerStack().pushViewController(new ProfileEditorViewController, new Moobile.ViewTransition.Flip);
            })

        }
        else{
            if(this.editButton!=null) this.editButton.hide();

            if(this.menu != null){
                var menuimg = this.menu.getChildComponent('menuimg');
                menuimg.setSource('images/locaface/menu.png');
                this.menu.addEvent('touchstart', this.bound('onMenu'));}
        }
       // this.view.disableTouch();

    },

    destroy: function() {
        try{
            this.backButton.removeEvent('onBackButtonTap');
            this.backButton = null;
            this.parent();
        }
        catch(e) {

        }

    },

    onBackButtonTap: function() {
        this.getViewControllerStack().popViewController();
    },
    onMenu: function() {
//        var mvc = this.getViewControllerStack().getChildViewController('menuViewController');
//        if(mvc != null){
//         this.getViewControllerStack().pushViewController(mvc);
//        }
//        else{
            this.getViewControllerStack().pushViewController(new menuViewController, new Moobile.ViewTransition.Drop);
        /*}*/

    }

});