var ChangePassowrdViewController = new Class({

    Extends: Locaface.Section,
    ptype:null,
    oldPass:null,
    newPass:null,
    ReNewPass:null,
    ChangeButton:null,


    loadView:function () {


        this.view = Moobile.View.at('templates/views/changepassword-view.html');
        this.parent();
    },
    viewDidLoad: function() {

        this.parent();
       /* this.oldPass = document.getElementById('oldpass');
        this.newPass = document.getElementById('newpass');
        this.ReNewPass = document.getElementById('renewpass');*/
        this.ChangeButton = this.view.getDescendantComponent('changePassButton');
         this.ChangeButton.addEvent('tap',this.bound('onChangePressed'));
    },

    destroy: function() {

        this.parent();
    },
    onChangePressed:function(){
         var old,newp,renewp
        var olde =  document.getElementById('oldpass').value;
        var newe = document.getElementById('newpass').value;
        var renewe = document.getElementById('renewpass').value;
        var al = new Moobile.Alert;
        al.setTitle('Locaface');
        if( olde.trim() != ''){
            old = olde ;
        }
        else{
         al.setMessage('Please enter old password.');
            al.showAnimated();
            return;
        }
        if( newe.trim() != ''){
            newp = newe ;
        }
        else{
            al.setMessage('Please enter new password.');
            al.showAnimated();
            return;
        }
        if( renewe.trim() != ''){
            renewp = renewe ;
        }
        else{
            al.setMessage('Please confirm new password.');
            al.showAnimated();
            return;
        }

        if(newp != renewp){
            al.setMessage('Password does not match the confirm password!');
            al.showAnimated();
            return;

        }
        var that = this;
        AppService.paswordChanged = function(msg){
          var al = new Moobile.Alert;

            al.setTitle('Locaface');
            if(msg.params){
                al.setMessage('Your password has changed.');
                al.showAnimated();
                that.getViewControllerStack().popViewController();
            }
            else{
                al.setMessage('Your old password is not correct!');
                al.showAnimated();

            }
        };

        AppService.changePassword(old,newp);

    }



});
