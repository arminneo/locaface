window.unitConversion = {};
unitConversion.util = new Class({
    lengthUnit: false, // false=Metric, true = Imperial/US
    dateDifference: null,

    stringToDate: function(date){
        var arr = date.split(/[-/ :]/);
        return (new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]));
    },

    setTimeDifference: function(serverTime){
        var mytime = new  Date();

        this.dateDifference = mytime.getTime() - serverTime.getTime();
        console.log(this.dateDifference);
    },

    localizeTime: function(date){
        return  new Date(date.getTime() + this.dateDifference);
    },


    timeAgoInWords: function (date) {
        try {
            date = this.stringToDate(date);
            console.log('ghabl' + date);
            date = this.localizeTime(date);
            console.log('bad' + date);
            var now = Math.ceil(Number(new Date()) / 1000),
                dateTime = Math.ceil(Number(date) / 1000),
                diff = now - dateTime,
                str;

            if (diff < 60) {
                return "Just a moment ago";//String(diff) + ' seconds ago';
            } else if (diff < 3600) {
                str = String(Math.ceil(diff / (60)));
                return str + (str == "1" ? ' minute' : ' minutes') + ' ago';
            } else if (diff < 86400) {
                str = String(Math.ceil(diff / (3600)));
                return str + (str == "1" ? ' hour' : ' hours') + ' ago';
            } else if (diff < 60 * 60 * 24 * 365) {
                str = String(Math.ceil(diff / (60 * 60 * 24)));
                return str + (str == "1" ? ' day' : ' days') + ' ago';
            } else {
                return date.format('db');
            }
        } catch (e) {
            return e;
        }
    },

    displayDistance: function (dist) {
        if (this.lengthUnit) {
            return this.displayImperial(dist);
        }
        else {
            return this.displayMeters(dist);
        }
    },

    displayMeters: function (dist) {
        if (dist < 100)
            return 'near';
        else if (dist < 1500)
            return parseInt(dist - (dist % 100)) + 'm'
        else
            return (dist / 1000.0).toFixed(1) + 'km';

    },

    displayImperial: function (dist) {
        if (dist < 110){
            return 'near';
        }
        else if (dist < 1610) {
            var yds = this.meterToYard(dist);
            return parseInt(yds - (yds % 100)) + 'yd'
        }
        else {
            return this.meterToMiles(dist).toFixed(1) + ' miles';
        }
    },

    meterToYard: function (meters) {
        return meters * 1.1;

    },
    meterToMiles: function (meters) {
        return meters / 1609.0
    },

    pointDisplay: function (poins) {
        return '+' + poins;
    },

    text2HTML: function(instr){
        instr = instr.replace(/<br\s*\/?>/mg,"\n");
        //instr = instr.replace("<br>", "\n");
        instr = instr.replace("&lt;", "<");
        instr = instr.replace("&gt;", ">");
        instr = instr.replace("&amp;", "&" );
        instr = instr.replace("\\047", "'" );
        return instr;
    }

});

var converter = new unitConversion.util();