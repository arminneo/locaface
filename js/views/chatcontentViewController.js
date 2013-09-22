var ChatContentViewController = new Class({

    Extends: Locaface.Section,
    ptype:null,
    userID:null,
    userAlias:null,
    inElement:null,
    outElement:null,
    messageContainer:null,
    MessageSendButton:null,
    titleC:null,
    title:null,
    util:null,
    initialize: function(userID,title){

        this.userID = userID;
        this.title = title;
        this.parent();
        this._name  = "chatContentViewController";
    },
    loadView:function () {


        this.view = Moobile.PullRefresh.at('templates/views/chatcontent-view.html');
        this.util = converter;
    },
    viewDidLoad: function() {
        this.inElement = '<div class="chatcontenItemReceived">'+
            '<div class="chatcontentOwner" data-role="text" data-name="ChatOwner">'+
             '</div>'+
                '<div class="chatcontentTime" data-role="text" data-name="ChatTime">'+
                '</div>'+
                '<div class="chatcontentText" data-role="text" data-name="ChatText">'+
                 '</div>'+
            '</div>';

        this.outElement = '<div class="chatcontenItemSent">'+
            '<div class="chatcontentOwner" data-role="text" data-name="ChatOwner">'+
            '</div>'+
            '<div class="chatcontentTime" data-role="text" data-name="ChatTime">'+
            '</div>'+
            '<div class="chatcontentText" data-role="text" data-name="ChatText">'+
            '</div>'+
            '</div>';

        this.parent();
        this.view.addEvent('scroll',this.bound('onLog'));
        this.messageContainer = this.view.getDescendantComponent('ChatContent');
        this.MessageSendButton = this.view.getDescendantComponent('MessageSend');
        this.MessageSendButton.addEvent('tap',this.bound('onSendMessage'));
    },
    onLog:function(){
      //  console.clear();
        console.log('Current: ' + this.view.getScroll().y);
        console.log('size: ' + this.view.getContentSize().y);
        console.log('size: ' + this.view.getContentWrapperSize().y);
    },
    onSendMessage:function(){




        var messge = document.getElementById('messageTextBox').value;
        if(messge != ''){
            AppService.sendChat(this.userID,messge);
        }
        document.getElementById('messageTextBox').value = '';
        AppService.getMessagesOfAUser(this.userID);
    },

    createMessageItem:function(type,owner,time,text){
     var returningC = null;
      if(type==true){

          returningC = new Moobile.Component(this.inElement);

      }
        else{
          owner = AppVars.Alias;
          returningC = new Moobile.Component(this.outElement);
      }
        returningC.getChildComponent('ChatOwner').setText(owner);
        returningC.getChildComponent('ChatTime').setText(this.util.timeAgoInWords(time));
        returningC.getChildComponent('ChatText').setText(text);

       var x = this.messageContainer.addChildComponent(returningC);



    },
    viewDidEnter: function() {

        var InItem = new Array();
        var OutItem = new Array();
        var that = this;

        this.titleC = this.view.getDescendantComponent('chatTitle');
        this.titleC.setText(this.title);
        AppService.onMessagesOfAUserRecieved = function(msg){
            try{


            console.log('MsgContent!!!:');
            console.log(msg);
            that.titleC.setText(msg.params[0][6]);
            that.messageContainer.removeAllChildComponents();
           var msgS = msg.params;
            var item = null;
            for(var i=0;i< msgS.length;i++){
             item = msgS[i];
                console.log(item);
           that.createMessageItem(item[4],item[6],item[3],item[2]);


                var sct = null;
                setTimeout( function(){ sct = that.view.getContentSize().y - that.view.getContentWrapperSize().y;  that.view.scrollTo(0,sct,100); }, 500);


            }
            }
            catch (e){

            }
            that.preloader.element.setStyle('opacity','0');
            setTimeout(function(){that.preloader.hide();},600 );
        }

        AppService.getChat=function(msg){

            var inmsg = msg.params;
            try{
                navigator.notification.vibrate(100);
            }
            catch(e) {
                console.log(e);
            }

           try{


            if(inmsg.fromuserid == that.userID){
            that.createMessageItem(true,inmsg.fromname,inmsg.senttime,inmsg.message);
                var sct = null;
                setTimeout( function(){ sct = that.view.getContentSize().y - that.view.getContentWrapperSize().y;  that.view.scrollTo(0,sct,100); }, 500);
            }
           }
           catch(e) {
               console.log(e);
           }

        }

        AppService.getMessagesOfAUser(this.userID);


        this.parent();


    },

    destroy: function() {

        this.view.removeEvent('scroll',this.bound('onLog'));
        this.MessageSendButton.removeEvent('tap',this.bound('onSendMessage'));
        this.view = null;
        this.parent();
    }



});

