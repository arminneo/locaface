// post manager : 6.6.2013
// Writer : Masoud ;-)
var makeHomePost = function (pstid, usrid, pstbody, psttype, psttime, psthead, pstpoints, pstactive, pstcommentcount, distance, useralias, ViewCtrl) {

    var returingComponent = null;
    var psttype = 1;
    if (psttype == 0) {
        // Just Text Post
        mainelement = '<div class="post"><div class="postContainer" data-role="text" data-name="PostContainer"><img class="postImage" data-role="image" data-name ="PostImage"/><div class="postDetails"><div class="postOwner" data-role="text" data-name="PostOwner"></div><div class="postTitle" data-role="text" data-name="PostTitle"></div></div></div><div class="postBottom"><div class="postLike"><div class="postButtonContainer" data-role="text" data-name="PostLikeButton"><div class="postIcon"><img src="./images/locaface/star-red.png" class="postIconH" data-name="PostLikeIMG" data-role="image"/><img src="./images/locaface/star.png" class="postIcon" /></div><div class="postButtonP" data-role="text" data-name="PostLikeText">123</div></div></div><div class="postComments"><div class="postButtonContainer" data-role="text" data-name="PostCommentButton"><div class="postIcon"><img src="./images/locaface/comment.png" class="postIcon"/></div><div class="postButtonP" data-role="text" data-name="PostCommentText"></div></div></div><div class="postDistance"><div class="postButtonContainer" data-role="text" data-name="PostRangeButton"><div class="postIcon"><img src="./images/locaface/range.png" class="postIcon"/></div><div class="postButtonP" data-role="text" data-name="PostRangeText"></div></div></div></div></div>'
        returingComponent = new Moobile.Component(mainelement, null, 'post ' + pstid);
        /* mainComponent.addEvent('tap', onPostTap0);*/
        //returingComponent = mainComponent;

    }
    else if (psttype == 1) {
        // Post Has Image
        mainelement = '<div class="post"><div class="postContainer" data-role="text" data-name="PostContainer"><img class="postImage" data-role="image" data-name ="PostImage"/><div class="postDetails"><div class="postOwner" data-role="text" data-name="PostOwner"></div><div class="postTitle" data-role="text" data-name="PostTitle"></div></div></div><div class="postBottom"><div class="postLike"><div class="postButtonContainer" data-role="text" data-name="PostLikeButton"><div class="postIcon"><img src="./images/locaface/star-red.png" class="postIconH"  data-name="PostLikeIMG" data-role="image"/><img src="./images/locaface/star.png" class="postIcon"/></div><div class="postButtonP" data-role="text" data-name="PostLikeText">123</div></div></div><div class="postComments"><div class="postButtonContainer" data-role="text" data-name="PostCommentButton"><div class="postIcon"><img src="./images/locaface/comment.png" class="postIcon"/></div><div class="postButtonP" data-role="text" data-name="PostCommentText"></div></div></div><div class="postDistance"><div class="postButtonContainer" data-role="text" data-name="PostRangeButton"><div class="postIcon"><img src="./images/locaface/range.png" class="postIcon"/></div><div class="postButtonP" data-role="text" data-name="PostRangeText"></div></div></div></div></div>'

        returingComponent = new Moobile.Component(mainelement, null, 'post ' + pstid);
//        mainComponent.addEvent('tap', onPostTap1);
        //  returingComponent = mainComponent;
    }
    var postcontainer = returingComponent.getChildComponent('PostContainer');
    var posttitleC = postcontainer.getChildComponent('PostTitle');
    var postownerC = postcontainer.getChildComponent('PostOwner');

    var postlikebuttonC = returingComponent.getChildComponent('PostLikeButton');
    var postlikebuttonI = postlikebuttonC.getChildComponent('PostLikeIMG');
    var postliketextC = postlikebuttonC.getChildComponent('PostLikeText');


    var postcommentbuttonC = returingComponent.getChildComponent('PostCommentButton');
    var postcommenttextC = postcommentbuttonC.getChildComponent('PostCommentText');
    var postrangebuttonC = returingComponent.getChildComponent('PostRangeButton');
    var postrangetextC = postrangebuttonC.getChildComponent('PostRangeText');

    var isSelfLiked = false;

    var postimageC = null;

    if (psttype == 1) {

        postimageC = postcontainer.getChildComponent('PostImage');
    }
    returingComponent.isSelfLike = function (val) {
        isSelfLiked = val;
        if (val == true) {
            postlikebuttonI.element.setStyle('opacity', '100');
        }
        else {
            postlikebuttonI.element.setStyle('opacity', '0');
        }


    }

    returingComponent.setTitle = function (value) {
        posttitleC.setText(value);

    };

    returingComponent.setOwner = function (value) {
        postownerC.setText(value)

    };

    returingComponent.setLike = function (value) {
        /*if(value <= 0){*/

        /*returingComponent.isSelfLike(false);*/
        /* value = 0;*/
        postliketextC.setText(value)
        console.log('added :' + value);

    };

    returingComponent.setComment = function (value) {
        postcommenttextC.setText(value);

    };

    returingComponent.setRange = function (value) {

        postrangetextC.setText(converter.displayDistance(value));

    };

    returingComponent.setImage = function (value) {
        postimageC.setSource(value)

    };
    //startup initialize
    returingComponent.setLike(pstpoints);
    returingComponent.setComment(pstcommentcount);
    returingComponent.setRange(distance);
    returingComponent.setTitle(psthead);
    returingComponent.setOwner(useralias);
    if (psttype == 1) {
        returingComponent.setImage( AppVars.postimgURL +pstid + '.jpg?rnd='+ Date.now())
    }

    returingComponent.onPostTap = function () {
        //alert('2');
        returingComponent.setUp();
        console.log(ViewCtrl);
        ViewCtrl.getViewControllerStack().pushViewController(new PostDetailViewController(pstid), new Moobile.ViewTransition.Slide);

    }
    returingComponent.onAddLike = function () {

        returingComponent.setUp();

        console.log('1')
        if (isSelfLiked) {
            console.log('1.1')
            returingComponent.isSelfLike(false);
            AppService.unLike(pstid);
        }
        else {
            console.log('1.2')
            returingComponent.isSelfLike(true);
            AppService.addLike(pstid);
        }


    }


    postcontainer.addEvent('tap', returingComponent.onPostTap);
    postlikebuttonC.addEvent('tap', returingComponent.onAddLike);

    returingComponent.setUp = function () {
        AppService.onLikesRecievedHome = function (msg) {

            var lk = msg.params;


            returingComponent.setLike(lk);


            //else fohsh bede
        }
        AppService.onCommentCountRecieved = function (msg) {

            var cmc = msg.params;
            returingComponent.setComment(cmc);
        }

    }

    returingComponent.UPdate=function(pstpoints, pstcommentcount, distance,pstHead,userAlias){
       returingComponent.setLike(pstpoints);
        returingComponent.setComment(pstcommentcount);
        returingComponent.setRange(distance);
        returingComponent.setTitle(pstHead);
        returingComponent.setOwner(userAlias);
    }

    return returingComponent;


}
