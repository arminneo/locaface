var ChatListViewController = new Class({

    Extends: Locaface.Section,
    ptype: null,
    chatListContainer: null,
    util: null,
    noMSG: null,
    loadView: function () {


        this.view = Moobile.PullRefresh.at('templates/views/chatlist-view.html');

    },
    viewDidLoad: function () {
        this.parent();
    },

    viewDidEnter: function () {
        this.util = converter;
        this.noMSG = this.view.getDescendantComponent('noMSG');
        var chatItemElement = '<div class="chatlistItem" data-role="text" data-name="ChatListItem">' +
            '<div  data-role="text" data-name="ChatListItemArea" class="ChatListItemArea">' +
            '<div class="chatlistImage">' +
            '<img class="chatlistimg" data-role="image" data-name="ChatListImage"/>' +
            '</div>' +
            '<div class="chatlistOwner" data-role="text" data-name="ChatOwner">' +
            '</div>' +
            '<div class="chatlistTime" data-role="text" data-name="ChatTime">' +
            '</div>' +
            '<div class="chatlistText" data-role="text" data-name="ChatText">' +
            '</div>' +
            '</div>' +
            '<div class="chatlistButton">' +

            '<div class="chatlistDeleteButton" data-role="button" data-name="delete-button">Delete</div>' +

            '</div>' +
            '</div>';

        this.chatListContainer = this.view.getChildComponent('ChatList');
        var chatItems = new Array();
        var that = this;
        var hasmsg = false;
        AppService.onChatListUsersRecieved = function (msg) {

            var chl = msg.params;

            that.chatListContainer.removeAllChildComponents();
            if (chl.length > 0) hasmsg = true;
            for (var i = 0; i < chl.length; i++) {

                var chalItem = chl[i];
                chatItems[i] = new Moobile.Component(chatItemElement, null, chalItem[0]);
                chatItems[i].getChildComponent('ChatListItemArea').getChildComponent('ChatOwner').setText(chalItem[3]);
                chatItems[i].getChildComponent('ChatListItemArea').getChildComponent('ChatListImage').setSource(AppVars.userimgURL + chalItem[0] + '.jpg?rnd=' + Date.now());
                chatItems[i].getChildComponent('ChatListItemArea').getChildComponent('ChatText').setText(chalItem[1]);
                chatItems[i].getChildComponent('ChatListItemArea').getChildComponent('ChatTime').setText(that.util.timeAgoInWords(chalItem[2]));
                chatItems[i].getChildComponent('delete-button').addEvent('tap', function () {
                    AppService.RequstDeleteChat(this.getParentComponent().getName());

                });
                chatItems[i].getChildComponent('ChatListItemArea').addEvent('tap', function () {
                    var w = this.getParentComponent().getChildComponent('delete-button').element.getStyle('width');
                    if (w == "60px") {
                        this.getParentComponent().getChildComponent('delete-button').element.setStyle('width', '0px');
                    }
                    else {
                        try {
                            that.getViewControllerStack().removeChildViewController(that.getViewControllerStack().getChildViewController('chatContentViewController'));
                        }
                        catch (e) {
                        }

                        that.getViewControllerStack().pushViewController(new ChatContentViewController(this.getParentComponent().getName(), ''), new Moobile.ViewTransition.Slide);
                    }

                });

                chatItems[i].getChildComponent('ChatListItemArea').addEvent('swipe', function (evt) {
                    if (evt.direction == "right") {
                        this.getParentComponent().getChildComponent('delete-button').element.setStyle('width', '60px');
                    }
                    else {
                        this.getParentComponent().getChildComponent('delete-button').element.setStyle('width', '0px');
                    }

                })

                that.chatListContainer.addChildComponent(chatItems[i]);


                /* AppService.getMessagesOfAUser(chalItem[0]);*/
            }

             if(hasmsg)that.noMSG.hide();
            that.preloader.element.setStyle('opacity', '0');
            setTimeout(function () {
                that.preloader.hide();
            }, 600);
        }


        AppService.getChatListUsers();
        this.parent();

        AppService.OnDeleteChat = function (msg) {
            that.chatListContainer.getChildComponent(msg.params).element.setStyle('opacity', '0');
            setTimeout(function () {
                that.chatListContainer.getChildComponent(msg.params).hide()
                that.chatListContainer.getChildComponent(msg.params).removeFromParentComponent(true);
                if(that.chatListContainer.getChildComponents().length < 1){
                    that.noMSG.show();
                }
            }, 300);

        }
    },

    destroy: function () {

        this.parent();
    }



});

