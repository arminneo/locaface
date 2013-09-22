var landbounds = {};
(function(){
    const M_PI = Math.PI;

    landbounds.zoom = 18;

    landbounds.long2tilex = function (lon)
    {
        var z = landbounds.zoom;
        return (Math.floor((lon + 180.0) / 360.0 * Math.pow(2.0, z)));
    }

    landbounds.lat2tiley = function (lat)
    {
        var z = landbounds.zoom;
        return (Math.floor((1.0 - Math.log(Math.tan(lat * M_PI / 180.0) + 1.0 / Math.cos(lat * M_PI / 180.0)) / M_PI) / 2.0 * Math.pow(2.0, z)));
    }

    landbounds.tilex2long = function (x)
    {
        var z = landbounds.zoom;
        return x / Math.pow(2.0, z) * 360.0 - 180;
    }

    landbounds.tiley2lat = function(y)
    {
        var z = landbounds.zoom;
        var n = M_PI - 2.0 * M_PI * y / Math.pow(2.0, z);
        return 180.0 / M_PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    }

    landbounds.getTile = function(latlon)
    {
        var pos = {};
        pos.x = landbounds.long2tilex(latlon.lng());
        pos.y = landbounds.lat2tiley(latlon.lat());
        return pos;
    }

    landbounds.getLatLon = function(x, y)
    {
        return new google.maps.LatLng(landbounds.tiley2lat(y),
            landbounds.tilex2long(x));
    }

}());