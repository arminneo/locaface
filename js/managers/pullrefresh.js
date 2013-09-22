/**

 * User: Masood Teymouri
 * Date: 5/29/13
 * Time: 11:04 AM

 */
 Moobile.PullRefresh = new Class({
Extends : Moobile.ScrollView/*,
    options: { //IScroll
        scroller: ['IScroll'],
        scroll:'vertical',
        scrollbar: 'vertical',
        bounce: true,
        momentum: true,
        fixedScrollbar:false,
        initialScrollX: 0,
        initialScrollY: 0
}*/

}
);
Moobile.PullRefresh.at = function(path, options, name) {

    var element = Element.at(path);
    if (element) {
        return Moobile.Component.create(Moobile.PullRefresh, element, 'data-view', options, name);
    }

    return null;
};
function indicator()
{
    var element = '<div class="indctr">' +
        '<div data-role="text" data-name="pullStateText"></div>'+
            '</div>'
        ;


    var pullrefreshindicator = new Moobile.Component(element);

    // component.getChildComponent('my-button-image'); // returns null! The image is a child of the button.
    // component.getChildComponent('my-button').getChildComponent('my-button-image'); // returns a Moobile.Image instance.
    return pullrefreshindicator;
}