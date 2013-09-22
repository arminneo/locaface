var SettingViewController = new Class({

    Extends: Locaface.Section,
    ptype:null,


    loadView:function () {


        this.view = Moobile.PullRefresh.at('templates/views/setting-view.html');
        var changePasswordBtn = this.view.getDescendantComponent('changePassword');
        changePasswordBtn.addEvent('tap',this.bound('onChangePassword'));
    },
    viewDidLoad: function() {

        this.parent();


    },

    destroy: function() {

        this.parent();
    },
    onChangePassword:function(){
        this.getViewControllerStack().pushViewController(new ChangePassowrdViewController, new Moobile.ViewTransition.Slide);
    }



});
