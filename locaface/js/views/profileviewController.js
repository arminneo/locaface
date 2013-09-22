var ProfileViewController = new Class({

    Extends: Locaface.Section,
    ptype:null,
    userID:null,
    nickName:null,
    firstName:null,
    lastName:null,
    sex:null,
    birthDay:null,
    email:null,
    aboutme:null,
    phoneNumber:null,
    rank:null,
    profileImage:null,
    myprofile:null,
    msgButton:null,
    ISLDD:false,
    informationC:null,
    initialize: function(userID,isMyProfile){

        this.userID = userID
        this.myprofile = isMyProfile;
        this.parent();
    },
    loadView:function () {


        this.view = Moobile.View.at('templates/views/profile-view.html');

    },
    viewDidLoad: function() {
        if(this.myprofile){
            this.hasEdit = true;
        }
        this.parent();
    },

    viewDidEnter: function() {



         this.informationC =   this.view.getChildComponent("ProfileInformationField");
        this.nickName = this.view.getChildComponent("ProfileNickName");
        this.profileImage =  this.view.getChildComponent("ProfileImage");
        this.firstName =  this.informationC.getChildComponent("ProfileFirstName");
        this.lastName =  this.informationC.getChildComponent("ProfileLastName");
        this.sex =  this.informationC.getChildComponent("ProfileSex");
        this.birthDay =  this.informationC.getChildComponent("ProfileBirthDay");
        this.email =  this.informationC.getChildComponent("ProfileEmail");
        this.aboutme =  this.informationC.getChildComponent("ProfileAbout");
        this.phoneNumber =  this.informationC.getChildComponent("ProfilePhone");
        this.rank =  this.informationC.getChildComponent("ProfileGrade");
        this.msgButton =  this.informationC.getChildComponent("ProfileMessageButton");

        if(this.myprofile){
            this.msgButton.hide();
        }
        else{
            this.msgButton.addEvent('tap',this.bound('onMessageButton'));
        }




        var that = this;
        AppService.onProfileinformationRecieved = function(msg){
            console.log('UserInf :');
            console.log(msg.params);
            that.nickName.setText(msg.params.alias);
            that.profileImage.setSource( AppVars.userimgURL +  that.userID + ".jpg?rnd="+ Date.now()); //Change it
            if(msg.params.private == true){
              that.informationC.hide();
            }
            else{
                that.firstName.setText(msg.params.firstname);
                that.lastName.setText(msg.params.lastname)
                that.sex.setText(msg.params.sex? "Male" : "Female");

                that.birthDay.setText(msg.params.ibirthday);
                that.email.setText(msg.params.iemail);
                that.aboutme.setText(msg.params.iabout);
                that.phoneNumber.setText(msg.params.iphone);
                that.rank.setText(msg.params.grade);
            }
           that.ISLDD = true;
            that.preloader.element.setStyle('opacity','0');
            setTimeout(function(){that.preloader.hide();},600 );
        }

        AppService.getProfileInformation(this.userID);
        this.parent();


    },

    destroy: function() {

        this.parent();
    },

    onNextButtonTap: function() {
        this.getViewControllerStack().popViewController();
    },
    onMessageButton:function(){
        if(this.ISLDD){
            try{
                that.getViewControllerStack().removeChildViewController(that.getViewControllerStack().getChildViewController('chatContentViewController'));
            }
            catch (e){}
            this.getViewControllerStack().pushViewController(new ChatContentViewController(this.userID,this.nickName), new Moobile.ViewTransition.Slide);
        }

    }

});