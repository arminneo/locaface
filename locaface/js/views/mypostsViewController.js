var MyPostsViewController = new Class({

    Extends: Locaface.Section,
    ptype: null,
    isBtn: false,
    loadView: function () {


        this.view = Moobile.PullRefresh.at('templates/views/myposts-view.html');

    },
    viewDidLoad: function () {
        this.parent();

    },

    viewDidEnter: function () {

        this.list = this.view.getChildComponent('list');
        this.list.addEvent('select', this.bound('onListSelect'));
        this.parent();
        var that = this;
        AppService.onMyPostsRecieved = function (msg) {
            that.list.removeAllItems();
            var pst = msg.params;
            var cnt = 0;
            console.log('User Posts!');
            console.log(pst);
            for (var i = 0; i < pst.length; i++) {
                cnt = i + 1;
                var Pst = pst[i];
                var listItem = new Array();
                listItem[i] = new Moobile.ListItem(null, null, Pst[0]);
                listItem[i].setLabel('Post ' + cnt + ((Pst[7] == true) ? ' (Active) ' : ''));
                listItem[i].setImage(AppVars.postimgURL + Pst[0] + ".jpg?rnd="+ Date.now());
                listItem[i].setDetail(Pst[5]);
                listItem[i].setStyle('disclosed');
                listItem[i].setButton(new Moobile.Button(null, null, Pst[0]).setLabel((Pst[7] == true) ? ' Deactivate Post ' : ' Activate Post ').addEvent('tap', function () {
                    that.isBtn = true;
                    AppService.setActivePost(this.getName(), (this.getLabel().element.innerText == ' Activate Post ' ));
                    AppService.getMyPosts();
                }));
                that.list.addItem(listItem[i]);
            }
            that.preloader.element.setStyle('opacity', '0');
            setTimeout(function () {
                that.preloader.hide();
            }, 600);
        };
        AppService.getMyPosts();
        console.log('sent!!');

    },

    destroy: function () {

        this.parent();
    },
    onListSelect: function (item) {

        if (!this.isBtn) {
            this.getViewControllerStack().pushViewController(new MYPostDetailViewController(item.getName()), new Moobile.ViewTransition.Slide);
        }
        else {
            this.isBtn = false;
            this.list.setSelectedItemIndex(-1);
        }


    }

});
/**
 * Created with JetBrains WebStorm.
 * User: Masood
 * Date: 7/10/13
 * Time: 3:15 PM
 * To change this template use File | Settings | File Templates.
 */
