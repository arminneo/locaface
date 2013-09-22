var PostDetailViewController = new Class({

    Extends: Locaface.Section,
    ptype: null,
    postID: null,
    postOwner: null,
    //postTitle:null,
    postBody: null,
    postLikeText: null,
    postLikeButton: null,
    postImage: null,
    commentPlaceHolder: null,
    sendButton: null,
    ownerID: null,
    initialize: function (postID) {

        this.postID = postID;
        this.parent();
    },
    loadView: function () {


        this.view = Moobile.ScrollView.at('templates/views/post-detail.html');

    },
    viewDidLoad: function () {
        this.parent();
    },

    viewDidEnter: function () {


        this.postImage = this.view.getChildComponent("DetailImage");
        this.postOwner = this.view.getChildComponent("DetailOwner");
        this.postOwner.addEvent('tap', this.bound('onOwnerLink'));
        //this.postTitle = this.view.getDescendantComponent("DetailImage");
        this.postBody = this.view.getChildComponent("DetailPostBody");
        this.postLikeButton = this.view.getChildComponent("DetailLikeButton");
        this.postLikeButton.addEvent('tap', this.bound('onAddLike'));
        this.postLikeText = this.postLikeButton.getChildComponent("DetailLikeText");
        this.commentPlaceHolder = this.view.getChildComponent("CommentPlaceHoder");
        this.sendButton = this.view.getChildComponent("CommentSend");
        this.sendButton.addEvent('tap', this.bound('onSendComment'));
        var commentElement = '<div class="comment" data-role="text" data-name="Comment"><div class="commentOwner" data-role="text" data-name="CommentOwner"></div><div class="commentText" data-role="text" data-name="CommentText"></div><div class ="commentDeleteButton" data-name="commentDeleteButton" data-role="button">x</div> </div>';
        var that = this;
        AppService.onSinglePostRecieved = function (msg) {
            var pst = msg.params[0];

            that.ownerID = pst[1];
            that.postOwner.setText(pst[9]);
            that.postBody.setText(pst[2]);
            that.postLikeText.setText(pst[6]);

            that.preloader.element.setStyle('opacity', '0');
            setTimeout(function () {
                that.preloader.hide();
            }, 600);

        }

        AppService.onCommentsRecieved = function (msg) {
            that.commentPlaceHolder.removeAllChildComponents();
            var addingComponent = new Array();
            var c = msg.params;
            for (var i = 0; i < c.length; i++) {
                console.log('adding...')
                addingComponent[i] = new Moobile.Component(commentElement, null, c[i][1] + '_' + c[i][4]);

                that.commentPlaceHolder.addChildComponent(addingComponent[i]);
                console.log(c[i]);
                addingComponent[i].getChildComponent("CommentOwner").setText(c[i][5] + ':').addEvent('tap', function () {

                    that.getViewControllerStack().pushViewController(new ProfileViewController(this.getParentComponent().getName().split('_')[0], false), new Moobile.ViewTransition.Flip);

                });
                addingComponent[i].getChildComponent("CommentText").setText(c[i][2]);

                addingComponent[i].getChildComponent("commentDeleteButton").addEvent('tap',function(){
                    var cmntID = this.getParentComponent().getName().split('_')[1];
                    var alrt = new Moobile.Alert();
                    var btnDelete = new Moobile.Button();
                    var btnCancel = new Moobile.Button();

                    btnDelete.setLabel('Delete');
                    btnDelete.addEvent('tap',function(){
                        AppService.removeComponent(that.postID,cmntID);

                    })
                    btnCancel.setLabel('Cancel');
                    alrt.addButton(btnDelete);

                    alrt.addButton(btnCancel);
                    alrt.setTitle('Locaface');
                    alrt.setMessage('Are you sure to delete this comment?');
                    alrt.showAnimated();



                })

                if(c[i][1] == AppVars.UserID ||  that.ownerID == AppVars.UserID){
                    addingComponent[i].getChildComponent("commentDeleteButton").show();
                }
                else{
                    addingComponent[i].getChildComponent("commentDeleteButton").hide();
                }
            }
        }
       AppService.onCommentRemoved = function(){
           AppService.getCommentsList(that.postID);
       }

        AppService.onLikesRecievedDetail = function (msg) {
            var lk = msg.params;
            try{
                if (lk > -1) {
                    that.postLikeText.setText(lk);
                }
            }
             catch (e){

             }
            //else fohsh bede
        }
        AppService.getSinglePost(this.postID);
        AppService.getCommentsList(this.postID);
        this.postImage.setSource(AppVars.postimgURL + this.postID + ".jpg?rnd="+ Date.now());

        this.parent();
    },

    destroy: function () {

        this.parent();
    },

    onSendComment: function () {
        var cmnt = document.getElementById('commentTextBox').value;
        if (cmnt != '') {
            AppService.sendComment(this.postID, cmnt);
        }

        AppService.getCommentsList(this.postID);
        document.getElementById('commentTextBox').value = '';
    },
    onAddLike: function () {
        AppService.addLike(this.postID);
    },
    onOwnerLink: function () {
        this.getViewControllerStack().pushViewController(new ProfileViewController(this.ownerID, false), new Moobile.ViewTransition.Flip);
    }


});
