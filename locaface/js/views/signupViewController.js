var SignUpViewController = new Class({

    Extends: Moobile.ViewController,
    ptype: null,
    emailAddrees: null,
    userAlias: null,
    Password: null,
    firstName: null,
    lastName: null,
    birthday: null,
    sex: null,
    agree: null,
    cancelButton: null,
    signupButton: null,
    indicator: null,
    initialize: function () {
        this.parent();
        this._name = "signupViewController";

    },
    loadView: function () {


        this.view = Moobile.View.at('templates/views/signup-view.html');

    },
    viewDidLoad: function () {
        this.parent();
        this.signupButton = this.view.getDescendantComponent("signupButton");
        this.cancelButton = this.view.getDescendantComponent("cancelButton");
        this.indicator = this.view.getDescendantComponent("MyActivityIndicator");
        this.indicator.hide();

        this.cancelButton.addEvent('tap', this.bound('onCancelButton'));
        this.signupButton.addEvent('tap', this.bound('onSignUpButton'));
        var that = this;
        AppService.signUpResponse=function(msg){
            that.indicator.hide();
            var alt = new Moobile.Alert();
            alt.setTitle('Locaface');
            if(msg.params.success == false){

                alt.setMessage(msg.params.message);
                alt.showAnimated();
            }
            else{
                alt.setMessage('Congratulations, you are a locaface member now <br> Please sign in.');
                alt.showAnimated();
                that.getViewControllerStack().popViewController();
            }

        }

    },

    viewDidEnter: function () {


    },

    destroy: function () {

        this.parent();
    }, onCancelButton: function () {
        this.getViewControllerStack().popViewController();
    },
    onSignUpButton: function () {
        var that = this;

        function looksLikeMail(str) {
            var lastAtPos = str.lastIndexOf('@');
            var lastDotPos = str.lastIndexOf('.');
            return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
        }

        var alrt = new Moobile.Alert();
        alrt.setTitle('Locaface');
        var btnok = new Moobile.Button;
        btnok.setLabel('OK');
        alrt.addButton(btnok);
        var emailenty = document.getElementById("emailinput").value.trim();

        if (emailenty != "") {

            if (looksLikeMail(emailenty)) {
                this.emailAddrees = emailenty;
            }
            else {
                alrt.setMessage('Not a valid Email address');
                alrt.showAnimated();

                btnok.addEvent('tap', function () {
                    document.getElementById("emailinput").focus();
                })
                return;
            }

        }
        else {

            alrt.setMessage('Email field can not be empty!');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("emailinput").focus();
            })

            return;
        }
        var aliasentry = document.getElementById("aliasinput").value.trim();

        if (aliasentry != "") {

            this.userAlias = aliasentry;

        }
        else {

            alrt.setMessage('Locaface name field can not be empty!');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("aliasinput").focus();
            })

            return;
        }
        var pass1 = document.getElementById("passwordinputsignup").value;

        if (pass1 == "") {

            alrt.setMessage('Password field can not be empty!');
            btnok.addEvent('tap', function () {
                document.getElementById("passwordinputsignup").focus();
            })
            alrt.showAnimated();


            return;
        }

        var pass2 = document.getElementById("repasswordinputsignup").value;

        if (pass2 == "") {

            alrt.setMessage('Please retype your password!');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("repasswordinputsignup").focus();
            })

            return;
        }

        if (pass1 == pass2) {
            this.Password = pass1;
        }
        else {
            alrt.setMessage('Password does not match the confirm password!');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("repasswordinputsignup").focus();
            })

            return;
        }

        var firstnameentry = document.getElementById("firstnameinput").value.trim();

        if (firstnameentry != "") {

            this.firstName = firstnameentry;

        }
        else {

            alrt.setMessage('First name field can not be empty!');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("firstnameinput").focus();
            })

            return;
        }
        var lastnameentry = document.getElementById("lastnameinput").value.trim();

        if (lastnameentry != "") {

            this.lastName = lastnameentry;

        }
        else {

            alrt.setMessage('Last name field can not be empty!');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("lastnameinput").focus();
            })

            return;
        }

        var dateentry = document.getElementById("dateinput").value.trim();

        if (dateentry != "") {

            this.birthday = dateentry;

        }
        else {

            alrt.setMessage('Please specify your birthdate');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("dateinput").focus();
            })

            return;
        }

        var sexentry = document.getElementById("sexinput").value;

        this.sex = sexentry;

        var agreeentry = document.getElementById("cb");

        if (agreeentry.checked) {

            this.indicator.show();
            this.indicator.start();

            var signupProgress = function () {
                AppService.signUp(that.emailAddrees, that.Password, that.firstName, that.lastName, that.sex, that.userAlias, that.birthday);
            }
            if (!Port.isConnected()) {
                console.info("Connect pro");
                Port.onconnected = signupProgress;
                Port.initialize();


            }
            else {
                console.info("Recheck pro");
                signupProgress();
            }
        }
        else {
            alrt.setMessage('You have to accept agreement in order to signup!');
            alrt.showAnimated();
            btnok.addEvent('tap', function () {
                document.getElementById("cb").focus();
            })

            return;
        }
    }


});


