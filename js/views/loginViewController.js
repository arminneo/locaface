var LogInViewController = new Class({

    Extends: Moobile.ViewController,
    ptype: null,
    loginButton: null,
    userName: null,
    Password: null,
    Indicator: null,
    signupButton:null,
    initialize: function () {
        this.parent();
        this._name = "loginViewController";

    },
    loadView: function () {


        this.view = Moobile.View.at('templates/views/login-view.html');

    },
    viewDidLoad: function () {
        this.parent();
    },

    viewDidEnter: function () {


        this.parent();

        var that = this;
        var vc = this.getViewControllerStack().getChildViewControllers();
        vc.forEach(function (v) {
            if (v.getName() != 'loginViewController') {
                that.getViewControllerStack().removeChildViewController(v);
            }

        });

        this.loginButton = this.view.getDescendantComponent('loginButton');
        this.signupButton = this.view.getDescendantComponent('signupButton');
        this.signupButton.addEvent('tap',this.bound('onSignupPressed'));
        this.loginButton.addEvent('tap', this.bound('onLoginPressed'));
        this.Indicator = this.view.getDescendantComponent('MyActivityIndicator');
        this.Indicator.hide();
    },

    destroy: function () {

        this.parent();
    },
    onSignupPressed:function(){
        this.getViewControllerStack().pushViewController(new SignUpViewController, new Moobile.ViewTransition.Fade);
    },
    onLoginPressed: function () {
        var userName = document.getElementById('usernameinput').value;
        var Password = document.getElementById('passwordinput').value;

        if(userName.trim().length <= 0){
            document.getElementById('usernameinput').focus();
            return;
        }
        if(Password.length <= 0){
            document.getElementById('passwordinput').focus();
            return;
        }

        this.Indicator.show();
        this.Indicator.start();
        var login = false;
        var that = this;

        var myconnected = function () {
            Navigation.getPos();
            Navigation._getPos = setInterval(Navigation.getPos, 1.5 * 60 * 1000);
            console.log("baleh");
            AppVars.PosRad = 1000;      //TODO:change it

            AppService.LoginReceived = function (msg) {
                console.log("Login Received!!!!");
                that.Indicator.hide();
                console.log(msg);
                if (msg.params.access) {
                    if(that.getViewControllerStack().getTopViewController().getName() ==  "loginViewController"){


                    console.log("Your are !!!IN!!@@#!@#!");
                    AppVars.UserID = msg.params.userid;
                    converter.setTimeDifference(converter.stringToDate(msg.params.now));
                    AppVars.imgURL = msg.params.imageurl;

                    AppVars.postimgURL= AppVars.imgURL + 'posts/';
                    AppVars.userimgURL= AppVars.imgURL + 'users/';
                   /* AppVars.PosLAT = 37.758162;
                    AppVars.PosLON = -122.43654;*/
                    AppVars.Alias = msg.params.alias;
                        AppService.LoginReceived = null;
                        //Port.onconnected = function(){console.log('Connected Again!')};
                    that.getViewControllerStack().pushViewController(new HomeViewController, new Moobile.ViewTransition.Fade);
                    }
                }
                else {
                    var alrt = new Moobile.Alert();
                    alrt.setTitle('Locaface');
                    if(msg.params.error){
                        alrt.setMessage('An error has been occurred: ' + "\r\n" + msg.params.message);
                    }
                    else{
                        alrt.setMessage('Incorrect username/password.');
                    }
                    document.getElementById('passwordinput').value = "";
                    alrt.showAnimated();
                }
            };

            AppService.LoginSend(userName, Password);

            console.log("yes " + Port.isConnected());
        }

        if (!Port.isConnected()) {
            console.info("Connect pro");
            Port.onconnected = myconnected;
            Port.initialize();
            if (Port.isConnected()) alert("yes");

        }
        else {
            console.info("Recheck pro");
            myconnected();
        }


    }



});


