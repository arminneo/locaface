/*
 ---

 name: ViewController.Home

 description:

 license:

 authors:
 - Your name

 requires:

 provides:
 - ViewController.Home

 ...
 */

if (!window.ViewController) window.ViewController = {};

var HomeViewController;
HomeViewController = new Class({
    Extends: Locaface.Section,
    myindicator: null,
    mytxt: null,
    helloButton: null,
    isindicator: false,
    imag: null,
    count: 0,
    p0: null, p1: null,
    homePostContainer: null,
    noMSG :null,
    initialize: function () {
        this.parent();
        this._name = "homeViewController";

    },

    loadView: function () {

        this.view = Moobile.PullRefresh.at('templates/views/home-view.html');
    },
    viewDidLoad: function () {
        this.isHome = true;
        this.parent();
        this.homePostContainer = this.view.getDescendantComponent('HomePosts');
        var that = this;
        this.noMSG = this.view.getDescendantComponent('noMSG');
        AppService.NearPostsList = function (msg) {

            var d = msg.params.data;
            var post = null;
            var givenPointsString = '';
            var postComponent = new Array();
                if(d != null){


            for (var i = 0; i < d.length; i++) {

                post = d[i];

                var exPost = that.homePostContainer.getChildComponent('post ' + post[0]);

                if (exPost == null) {

                    postComponent[i] = makeHomePost(post[0], post[1], post[2], post[3], post[4], post[5], post[6], post[7], post[8], post[9], post[10], that);
                    console.log("Post:");
                    console.log(post);
                    givenPointsString += post[0] + ',';
                    that.homePostContainer.addChildComponent(postComponent[i]);

                }
                else {

                    exPost.UPdate(post[6], post[8], post[9],post[5],post[10]);

                }


            }
                }
            else    {
                    //TODO: think about it!
                }

            givenPointsString = givenPointsString.substring(0, givenPointsString.length - 1);

            that.preloader.element.setStyle('opacity', '0');
            console.log('ino dadim... :' + givenPointsString);

            AppService.getGivenPoints(givenPointsString);
            setTimeout(function () {
                that.preloader.hide();
            }, 600);
           if(that.homePostContainer.getChildComponents().length > 0){
               that.noMSG.hide();
           }
            else{
               that.noMSG.show();
           }
        }

        AppService.onGivenPointsRecieved = function (msg) {
            console.log('givenPoints:');
            console.log(msg.params);
            var pst = msg.params;
            for (var i = 0; i < pst.length; i++) {
                var ps = pst[i];
                that.homePostContainer.getChildComponent('post ' + ps[1]).isSelfLike(true);
            }


        }

    },
    viewDidEnter: function () {


        this.parent();
        AppService.GetNearPosts(AppService.createPosition(AppVars.PosLON, AppVars.PosLAT),  AppVars.PosRad, 100, 0);
        //Navigation._getPosts =  setInterval(function(){AppService.GetNearPosts(AppService.createPosition(AppVars.PosLON, AppVars.PosLAT),  AppVars.PosRad, 100, 0);},1000*60*2);
        var that = this;
        var vc = this.getViewControllerStack().getChildViewControllers();
        vc.forEach(function (v) {
            if (v.getName() != 'homeViewController' && v.getName() != 'loginViewController') {
                that.getViewControllerStack().removeChildViewController(v);
            }

        });
        /*

         this.myindicator = new indicator();

         this.mytxt = this.myindicator.getChildComponent('pullStateText');
         this.mytxt.setText('Pull to Refresh...');




         this.view.getElements('.indctr').setStyle('position', 'fixed');
         this.view.getElements('.indctr').setStyle('top', '58px');
         */


        //AppService.PositionSend(longitude, latitude);


        // myindicator.addChildComponent(myindicator,'top');
    },

    destroy: function () {
        /* alert('distroy');
         //this.helloButton.removeEvent('tap', this.bound('onHelloButtonTap'));
         //this.helloButton = this.view.getChildComponent('hello-button');
         this.myindicator=null;
         this.mytxt=null;
         this.helloButton=null;
         this.isindicator=false;
         this.imag=null;
         this.count=0;
         this.view.removeEvent('scroll', this.bound('onScrollMainPage'));
         */
        this.parent();
    },

    onScrollMainPage: function (e, sender) {
        var sc = this.view.getContentScroll();
        var a = this.view.getContentSize();
        var b = this.view.getContentWrapperSize();
        console.log(a.y + ' ' + sc.y)
        if (sc.y <= -8) {

            if (sc.y < -10 && sc.y > -49) {

                this.mytxt.setText('Pull to Refresh...');
                this.myindicator.show();
                console.log(this.myindicator);
                //this.isindicator = true ;
                // this.view.getElements('.indctr').setStyle('height', sc.y * -1);
            }
            else if (sc.y < -50) {
                //  this.myindicator.show();
                this.mytxt.setText('Release to Refresh');
                //  this.isindicator = true ;
                // this.view.getElements('.indctr').setStyle('height', sc.y * -1);
            }
            else if (sc.y >= -9) {
                this.myindicator.hide()
                //  this.isindicator = false;
                // this.view.getElements('.indctr').setStyle('height', sc.y * -1);
            }

        }
        else {


            this.myindicator.hide();
            if (sc.y + b.y > a.y - 50) {

                for (i = 1; i < 9; i++) {

                    this.count++;
                    var tp = new makeHomePost(0, ' This post has beed added by code ...' + this.count, '', i + '.jpg', '100', '3', '', '', 'Masoud Teymouri');
                    var ip = new makeHomePost(1, 'This post has beed added by code ...' + this.count, '', i + '.jpg', '100', '3', '', '', 'Masoud Teymouri');
                    this.view.addChildComponent(tp);
                    this.view.addChildComponent(ip);
                    tp.addEvent('tap', this.bound('onPostTap'));
                    ip.addEvent('tap', this.bound('onPostTap'));
                }
                console.log('added');
            }
            //  this.isindicator = false;
        }


    }

});
