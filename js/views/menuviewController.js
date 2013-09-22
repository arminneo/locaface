var menuViewController = new Class({

    Extends: Locaface.Section,
    menuItem1:null,
    menuItem2:null,
    menuItem3:null,
    menuItem4:null,
    menuItem5:null,
    menuItem6:null,
    menuItem7:null,
    menuItem8:null,
    menuImg1:null,
    menuImg2:null,
    menuImg3:null,
    menuImg4:null,
    menuImg5:null,
    menuImg6:null,
    menuImg7:null,
    menuImg8:null,


    initialize:function(){
        this.parent();
        this._name  = "menuViewController";

    }
    ,

    loadView:function () {

        this.view = Moobile.View.at('templates/views/menu-view.html');
    },
    viewDidLoad: function() {
        this.parent();
        this.menuItem1 = this.view.getDescendantComponent('menuItem1');
        this.menuImg1 = this.view.getDescendantComponent('menuImg1');
        this.menuImg1.setSource('images/locaface/profile.png');
        this.menuItem1.addEvent('tap', this.bound('onProfile'));
        this.menuItem2 = this.view.getDescendantComponent('menuItem2');
        this.menuImg2 = this.view.getDescendantComponent('menuImg2');
        this.menuImg2.setSource('images/locaface/home.png');
        this.menuItem2.addEvent('tap',this.bound('onHome'));
        this.menuItem3 = this.view.getDescendantComponent('menuItem3');
        this.menuImg3 = this.view.getDescendantComponent('menuImg3');
        this.menuImg3.setSource('images/locaface/messages.png');
        this.menuItem3.addEvent('tap',this.bound('onChat'));
        this.menuItem4 = this.view.getDescendantComponent('menuItem4');
        this.menuImg4 = this.view.getDescendantComponent('menuImg4');
        this.menuImg4.setSource('images/locaface/lands.png');
        this.menuItem4.addEvent('tap', this.bound('onLocaLand'));
        this.menuItem5 = this.view.getDescendantComponent('menuItem5');
        this.menuImg5 = this.view.getDescendantComponent('menuImg5');
        this.menuImg5.setSource('images/locaface/posts.png');
        this.menuItem5.addEvent('tap', this.bound('onPosts'));
        this.menuItem6 = this.view.getDescendantComponent('menuItem6');
        this.menuImg6 = this.view.getDescendantComponent('menuImg6');
        this.menuImg6.setSource('images/locaface/range.png');
        this.menuItem6.addEvent('tap', this.bound('onChangerange'));
        this.menuItem7 = this.view.getDescendantComponent('menuItem7');
        this.menuImg7 = this.view.getDescendantComponent('menuImg7');
        this.menuImg7.setSource('images/locaface/settings.png');
        this.menuItem7.addEvent('tap',this.bound('onSetting'));;
        this.menuItem8 = this.view.getDescendantComponent('menuItem8');
        this.menuImg8 = this.view.getDescendantComponent('menuImg8');
        this.menuImg8.setSource('images/locaface/signout.png');
        this.menuItem8.addEvent('tap',this.bound('onSignOut'));

    },

    destroy: function() {

        this.parent();
    },

    onNextButtonTap: function() {
        this.getViewControllerStack().popViewController();
    },
    onChangerange:function()
    {
        this.getViewControllerStack().pushViewController(new changeRangeViewController, new Moobile.ViewTransition.Cubic);
    },
    onProfile:function()
    {
        this.getViewControllerStack().pushViewController(new ProfileViewController(AppVars.UserID,true), new Moobile.ViewTransition.Flip);
    },
    onPosts:function()
    {
        this.getViewControllerStack().pushViewController(new MyPostsViewController, new Moobile.ViewTransition.Flip);
    },
    onLocaLand:function()
    {
        this.getViewControllerStack().pushViewController(new LocaLandViewController, new Moobile.ViewTransition.Flip);
    }
    ,onChat:function(){
        this.getViewControllerStack().pushViewController(new ChatListViewController, new Moobile.ViewTransition.Flip);
    }
    ,onSignOut:function(){
        var alrt = new Moobile.Alert();
        var btnsignOut = new Moobile.Button();
        var btnCancel = new Moobile.Button();
        var that = this;
        btnsignOut.setLabel('Sign out');
        btnsignOut.addEvent('tap',function(){
            clearInterval(Navigation._getPos);
           // clearInterval(Navigation._getPosts);
            Port.onconnected = function(){};
            AppService.signOut();
            Port.socket.close();

            clearInterval(Port._myinvterval);
            Port.socket = null;
            that.getViewControllerStack().popViewControllerUntil(that.getViewControllerStack().getChildViewControllers()[0]);

        })
        btnCancel.setLabel('Cancel');
        alrt.addButton(btnsignOut);

        alrt.addButton(btnCancel);
        alrt.setTitle('Locaface');
        alrt.setMessage('Are you sure to sign out ?');
        alrt.showAnimated();

    }
    ,onHome:function(){

        this.getViewControllerStack().popViewControllerUntil(this.getViewControllerStack().getChildViewControllers()[1]);
    },

    onSetting:function(){
        this.getViewControllerStack().pushViewController(new SettingViewController, new Moobile.ViewTransition.Flip);
    }

});

