var map;
var usrPos = {
    Lat: 37.73753,
    Lon: -122.417221,
    Rad: 150
};

var landMaster = {};
function createLandMaster(map)
{
    const zoomMin = 15;
    const zoomMax = 18;
    /*
     Status Codes:
     0: Nothing
     1: Selected
     2: Owned by me
     3: Owned by others
     */
    var colors = ["#FFFFFF", "#00BBFF", "#00FFBB", "#000000"];
    var selectionEnabled = false;
    var buyMode = false;
    var multiSelection = false;

    landMaster.lands = new Hash();
    landMaster.areas = new Hash();

    landMaster.isMultiSelect = function(){ return multiSelection; }
    landMaster.setMultiSelect = function(enabled){multiSelection = enabled;}


    landMaster.isSelection = function() { return selectionEnabled; }
    landMaster.setSelection = function(value)
    {
        if (value == selectionEnabled) return;

        selectionEnabled = value;

        landMaster.drawLands();
    }


    landMaster.isBuyMode = function() { return buyMode; }
    landMaster.setBuyMode = function(enabled){
        if (enabled == buyMode) return;

        buyMode = enabled;


        if (enabled){
            var zoomLevel = map.getZoom();
            if (zoomLevel < zoomMin || zoomLevel > zoomMax)
                map.setZoom(zoomMin);

            userRadius.hideUser();

            AppService.onNearLands = function(msg) { landMaster.loadAreas(msg); };

            var vp = getViewPortBounds();
            AppService.getNearLands(vp.tx, vp.ty, vp.bx, vp.by);
        }
        else
        {
            userRadius.showUser(null, null, 150);
            AppService.onNearLands = function(msg) {}

            landMaster.areas.forEach(function(value, key){
                if (value != 1){
                    landMaster.areas.erase(key);
                }
            });
        }

        map.set('disableDoubleClickZoom', buyMode);
        map.set('disableDefaultUI', buyMode);
        map.set('draggable', !buyMode);
        map.set('scaleControl', !buyMode);
        map.set('scrollwheel', !buyMode);
        map.set('keyboardShortcuts', !buyMode);
        map.set('mapTypeControl', !buyMode);
        map.set('panControl', !buyMode);
        map.set('rotateControl', !buyMode);
        map.set('zoomControl', !buyMode);

        landMaster.setSelection(buyMode);
        landMaster.drawLands();
    }


    landMaster.code = function (x, y)
    {
        return x + "x" + y;
    }

    landMaster.fromCode = function(code) {
        var strXY = code.split("x");
        var xy = {
            x: parseInt(strXY[0]),
            y: parseInt(strXY[1])
        }
        return xy;
    }

    landMaster.loadAreas = function(msg)
    {
        try {
            if (null != msg.params ){
                var lands = msg.params;
                var key = "";
                var value = 0;
                for (var i = 0; i < lands.length; i++){
                    key = landMaster.code(lands[i][3], lands[i][4]);
                    value = (lands[i][2] ==  AppVars.UserID) ? 2 : 3;
                    landMaster.areas.set(key, value);
                }

                areaColors();
            }
        } catch (e){}
    }

    landMaster.clearLands = function()
    {
        landMaster.lands.each(function(v, k){
            v.setMap(null);
        });

        landMaster.lands =  new Hash();
    }

    function getViewPortBounds(){
        var bounds = map.getBounds();
        var topright = landbounds.getTile(bounds.getNorthEast());
        var bottomleft = landbounds.getTile(bounds.getSouthWest());
        var viewbox = {
            tx: bottomleft.x,
            ty: topright.y,
            bx: topright.x,
            by: bottomleft.y
        };
        return viewbox;
    }

    landMaster.drawLands = function ()
    {
        var zoomLevel = map.getZoom();
        var bounds = map.getBounds();
        var viewbox = getViewPortBounds();

       landMaster.clearLands();
        if (zoomLevel < zoomMin || zoomLevel > zoomMax)
        {
            landMaster.clearLands();
            return;
        }

        var boxes = new Array();

        if (buyMode) {
            for (var i = viewbox.tx; i <= viewbox.bx; i++)
            {
                for (var j = viewbox.ty; j <= viewbox.by; j++)
                {
                    boxes.push({
                        bounds: new google.maps.LatLngBounds(landbounds.getLatLon(i, j), landbounds.getLatLon(i + 1, j + 1)),
                        code: landMaster.code(i, j),
                        x: i,
                        y: j
                    });
                }
            }
        }
        else
        {
            landMaster.areas.forEach(function(value, key){
                if (value == 1){
                    var xy = landMaster.fromCode(key);

                    boxes.push({
                        bounds: new google.maps.LatLngBounds(landbounds.getLatLon(xy.x, xy.y), landbounds.getLatLon(xy.x + 1, xy.y + 1)),
                        code: landMaster.code(xy.x, xy.y),
                        x: xy.x,
                        y: xy.y
                    })

                }
            });
        }

        var curRect;
        var area;
        var color;

        landMaster.clearLands();
        for (var k = 0; k < boxes.length; k++)
        {
            if (landMaster.areas.has(boxes[k].code))
            {
                area = landMaster.areas.get(boxes[k].code);
                color = colors[area];
            }
            else
            {
                color = colors[0];
            }

            curRect = new google.maps.Rectangle({
                strokeColor: color,
                strokeOpacity: 0.7,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: 0.3,
                map: map,
                bounds: boxes[k].bounds,
                x: boxes[k].x,
                y: boxes[k].y
            });

            if (selectionEnabled){
                google.maps.event.addListener(curRect, 'click', function(e){ landMaster.onClickLand(e); });
            }

            landMaster.lands.set(boxes[k].code, curRect);
        }

    };


    landMaster.onClickLand = function(e)  // Selection Handler
    {
        var clickedTile = landbounds.getTile(e.latLng);
        var key = landMaster.code(clickedTile.x, clickedTile.y);

        if (landMaster.areas.has(key))  // Found
        {
            if (landMaster.areas.get(key) == 1){
                landMaster.areas.erase(key);
            }
        }
        else  // Not Found
        {
            if (!multiSelection){
                landMaster.areas.forEach(function(value, key){
                    if (value == 1){
                        landMaster.areas.erase(key);
                    }

                });
            }

            landMaster.areas.set(key, 1);
        }

        areaColors();
    };


    function areaColors(){
        landMaster.drawLands();

        landMaster.areas.forEach(function(value, key){
            var color = colors[value];
            landMaster.lands[key].setOptions(
                {
                    strokeColor: color,
                    fillColor: color
                });
        });
    }
}

var events = {
    'bounds_changed': function() { landMaster.drawLands(); },
    'center_changed': null,
    'click': null,
    'dblclick': null,
    'drag': null,
    'dragend': null,
    'dragstart': null,
    'heading_changed': null,
    'idle': null,
    'maptypeid_changed': null,
    'mousemove': null,
    'mouseout': null,
    'mouseover': null,
    'projection_changed': null,
    'resize': null,
    'rightclick': null,
    'tilesloaded': null,
    'tilt_changed': null,

    'zoom_changed': function() {
        var zoomLevel = map.getZoom();
    }
};

function setupListener(map, name, fn) {
    if (null != fn)
        google.maps.event.addListener(map, name, fn);
}

userRadius = {
    radiusCircle: null,
    personMarker: null,
    displaying: false,
    lastLatLng: null,
    lastRadius: 100.0,

    showUser: function (Lat, Lng, Rad){
        var image = 'images/point.png';
        var ll = null;

        if (Lat != null && Lng != null){
            ll = new google.maps.LatLng(Lat, Lng);
            this.lastLatLng = ll;
            this.lastRadius = Rad;
        }
        else if (this.lastLatLng){
            ll = this.lastLatLng;
            Rad = this.lastRadius;
        }

        if (ll == null) return;


        if (this.radiusCircle == null)
        {
            var radiusOptions = {
                strokeColor: '#FF0000',
                strokeOpacity: 0.7,
                strokeWeight: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: ll, // Person Position
                radius: Rad // Radius meters
            };

            this.radiusCircle = new google.maps.Circle(radiusOptions);
            this.personMarker = new google.maps.Marker({
                position: ll,
                map: map,
                icon: image
            });
        }

        this.radiusCircle.setVisible(true);
        this.personMarker.setVisible(true);

        this.displaying = true;
    },

    change: function (Lat, Lng, Rad){
        ll = new google.maps.LatLng(Lat, Lng);
        this.lastLatLng = ll;
        this.lastRadius = Rad;

        this.radiusCircle.setRadius(Rad);
        this.radiusCircle.setCenter(ll);
        map.setCenter(ll);

        this.personMarker.setPosition(ll);
    },

    fit: function(){
        var bounds = this.radiusCircle.getBounds();
        map.fitBounds(bounds);
    },

    hideUser: function()
    {
        if (this.radiusCircle != null)
        {
            this.radiusCircle.setVisible(false);
            this.personMarker.setVisible(false);

            this.radiusCircle.setMap(null);
            this.personMarker.setMap(null);

            this.radiusCircle = null;
            this.personMarker = null;
        }

        this.displaying = false;
    }
}