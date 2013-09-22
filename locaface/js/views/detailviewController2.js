var PostDetailViewController2 = new Class({

    Extends: Locaface.Section,
    ptype:null,
    nextButton: null,

    loadView:function () {


    this.view = Moobile.PullRefresh.at('templates/views/post-detail2.html');

},
    viewDidLoad: function() {

        this.parent();
        this.nextButton = new Moobile.Button();
        this.nextButton.setLabel('Home');
        this.nextButton.addEvent('tap', this.bound('onNextButtonTap'));

    },

    destroy: function() {
        this.nextButton.removeEvent('tap', this.bound('onNextButtonTap'));
        this.nextButton = null;
        this.parent();
    },

    onNextButtonTap: function() {
        this.getViewControllerStack().popViewController();
    }

});
