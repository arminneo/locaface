var MYPostDetailViewController = new Class({

    Extends: Locaface.Section,
    ptype:null,
    postID:null,
    postOwner:null,
    //postTitle:null,
    postBody:null,
    postLikeText:null,
    postLikeButton:null,
    postImage:null,
    commentPlaceHolder:null,
    sendButton:null,
    editButton: null,
    initialize: function(postID){

        this.postID = postID;
        this.parent();
    },
    loadView:function () {


        this.view = Moobile.ScrollView.at('templates/views/mypostpost-detail.html');

    },
    viewDidLoad: function() {
        this.parent();
    },

    viewDidEnter: function() {

        this.postImage = this.view.getChildComponent("DetailImage");
        this.postOwner = this.view.getChildComponent("DetailOwner");
        //this.postTitle = this.view.getDescendantComponent("DetailImage");
        this.postBody = this.view.getChildComponent("DetailPostBody");
        this.postLikeButton = this.view.getChildComponent("DetailLikeButton");
        this.postLikeButton.addEvent('tap',this.bound('onAddLike'));
        this.postLikeText = this.postLikeButton.getChildComponent("DetailLikeText");
        this.commentPlaceHolder =  this.view.getChildComponent("CommentPlaceHoder");
        this.sendButton = this.view.getChildComponent("CommentSend");
        this.sendButton.addEvent('tap',this.bound('onSendComment'));
        var commentElement = '<div class="comment" data-role="text" data-name="Comment"><div class="commentOwner" data-role="text" data-name="CommentOwner"></div><div class="commentText" data-role="text" data-name="CommentText"></div></div>';


        var that = this;
        AppService.onSinglePostRecieved = function(msg){

            var pst = msg.params[0];
            that.postOwner.setText(pst[9]);
            that.postBody.setText(pst[2]);
            that.postLikeText.setText(pst[6]);

            that.preloader.element.setStyle('opacity','0');
            setTimeout(function(){that.preloader.hide();},600 );
        }

        AppService.onCommentsRecieved = function(msg){
            that.commentPlaceHolder.removeAllChildComponents();
            var addingComponent= new Array();
            var c = msg.params;
            for(var i=0; i < c.length; i++){
                console.log('adding...')
                addingComponent[i]  = new  Moobile.Component(commentElement);
                that.commentPlaceHolder.addChildComponent(addingComponent[i]);
                console.log(c[i]);
                addingComponent[i].getChildComponent("CommentOwner").setText(c[i][5] + ':');
                addingComponent[i].getChildComponent("CommentText").setText(c[i][2]);
            }
        }
        AppService.onLikesRecievedDetail = function(msg){
            var lk = msg.params;
            if(lk > -1){
                that.postLikeText.setText(lk);
            }
            //else fohsh bede
        }
        AppService.getSinglePost(this.postID);
        AppService.getCommentsList(this.postID);
        this.postImage.setSource(AppVars.postimgURL + this.postID +".jpg?rnd="+ Date.now());
        this.editButton = this.view.getDescendantComponent('edit-button');
        this.editButton.addEvent('tap', this.bound('onEditButtonTap'));
        this.parent();

        this.view.addEvent('show',this.bound('onReady'));
    },
    onReady:function(){

    },

    destroy: function() {

        this.parent();
    },

    onSendComment: function() {
        var cmnt = document.getElementById('commentTextBox').value;
        if(cmnt != ''){
            AppService.sendComment(this.postID,cmnt);
        }

        AppService.getCommentsList(this.postID);
        document.getElementById('commentTextBox').value = '';
    },
    onAddLike:function(){
        AppService.addLike(this.postID);
    },

    onEditButtonTap: function() {
        this.getViewControllerStack().pushViewController(new PostEditorViewController(this.postID), new Moobile.ViewTransition.Slide);

    }

});
