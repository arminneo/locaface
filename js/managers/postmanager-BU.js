// post manager : 6.6.2013
// Writer : Masoud ;-)
var makeHomePost = function (postType, postTitle, postContent, postImgURL, postDistance, postPoints, postCommentCount, postID, postUserNick) {
    var returingComponent = null;
    var pointelement = '<div data-name="pointcomponent" >' + '+' + postPoints + '</div>'; //unitConversion.util.timeAgoInWords(postPoints);
    var pointcomponent = new Moobile.Component(pointelement);
    var distanceelement = '<div data-name="distancecomponent" >' + postDistance + '</div>' //unitConversion.util.displayDistance(postDistance);
    var distancecomponent = new Moobile.Component(distanceelement);
    if (postType == 0) {
        // Just Text Post
        mainelement = '<div class="post ptext" data-name="textPost">' +
            '<div class="pbar">' +
            '<table class="psinfo">' +
            '<tr><td rowspan="2">' +
            '<h3>' + ' ' + postUserNick + ':' + '</h3><p>' + ' ' + postTitle + '</p></td><td class="pspoints">' +
            '<div class="ppoints"></div>' +
            '</td></tr>' +
            '<tr><td class="psdistance"><div class="pdistance"></div></td></tr>' +
            '</table>' +
            '</div>' +
            '</div>'
        var mainComponent = new Moobile.Component(mainelement);
        pointcomponent.addEvent('tap', onPostLike);
        mainComponent.addEvent('tap', onPostTap);
        returingComponent = mainComponent.addChildComponentInside(pointcomponent, '.ppoints').addChildComponentInside(distancecomponent, '.pdistance');

    }
    else if (postType == 1) {
        // Post Has Image
        mainelement = '<div class="post ppic" data-name="imagePost">' +
            '<div class = "imgph"></div>' +  //TODO: this will change to component
            '<div class="pbar">' +
            '<table class="psinfo">' +
            '<tr><td rowspan="2">' +
            '<h3>' + ' ' + postUserNick + ': ' + '</h3><p>' + ' ' + postTitle + '</p></td><td class="pspoints">' +
            '<div class="ppoints"></div>' +
            '</td></tr>' +
            '<tr><td class="psdistance"><div class="pdistance"></div></td></tr>' +
            '</table>' +
            '</div>' +
            '</div>'

        var mainComponent = new Moobile.Component(mainelement);
        var imageelement = new Moobile.Image();
        imageelement.setSource(postImgURL);


        returingComponent = mainComponent.addChildComponentInside(pointcomponent, '.ppoints').addChildComponentInside(distancecomponent, '.pdistance').addChildComponentInside(imageelement, '.imgph');
    }
    return returingComponent;


}
var onPostLike = function (e, sender) {
    //alert('liked');
    // this.view.removeEvent('scroll', this.bound('onScrollMainPage'));
}
var onPostTap = function (e, sender) {
    //alert('tapped the post');
    // this.view.removeEvent('scroll', this.bound('onScrollMainPage'));
}
