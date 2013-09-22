var Port = {};

if (typeof PacketManager !== 'object')
    var PacketManager = {};
if (typeof AppService !== 'object')
    var AppService = {};
if (typeof AppVars !== 'object')
    var AppVars = {};
if (typeof Navigation !== 'object')
    var Navigation = {};

AppVars.UserID = null;
AppVars.PosLAT = null;
AppVars.PosLON = null;
AppVars.Alias = null;
AppVars.imgURL = null;
AppVars.postimgURL = null;
AppVars.userimgURL = null;
AppVars.PosRad = null;
AppVars.iZoom = null;
AppVars.iX = null;
AppVars.iY = null;
AppVars.VPW = null;
AppVars.VPH = null;
// Badge settings;

AppVars.BadgesWholeNumner = null;
AppVars.BadgesWholeMessages = null;
AppVars.BadgesWholePosts = null;
AppVars.BadgesWholeLands = null;

//  End Badge settings;

Port.socket = null;
Port.address = "locaface.com:8080";
Port.secureLayer = false;
Port._myinvterval = null;
Port._reconnecting = false;

Navigation._getPos = null;
Navigation._getPosts = null;
Port.connect = (function (host) {
    console.log("Connecting to: " + host);

    // iOS Crash issue resolve here
    Port.onOpen = function () {
        console.log("Websocket Connected. outside");
        Port.onconnected();
        Port.endReconnect();


    };

    Port.onClose = function () {
        console.log("Websocket Closed! outside");
        Port.onclosesocket();
        Port.reconnect();
    };


    Port.onMessage = function (message) {
        console.log("Message: " + message.data);
        PacketManager.processMessage(message.data);

    }

    if ('WebSocket' in window) {
        Port.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        Port.socket = new MozWebSocket(host);
    } else {
        alert('Error: WebSocket is not supported by this browser.');
        return;
    }

    console.log(Port.socket);

    Port.socket.onopen = function () {
        Port.onOpen();
    };

    // Armin
    Port.socket.onclosesocket = function () {
        AppService.socketClose();
        Port.onClose();
    };

    /* iOS Crash fix */
    Port.socket.onmessage = function (message) {
        setTimeout(function () {
            console.log("eh timeout");
            Port.onMessage(message);
        }, 0);
    };

    // Armin
    Port.socket.onerror = function () {
        AppService.socketError();
        Port.onerror();
    }


});

Port.onconnected = function () {


}

Port.onerror = function () {

}

Port.onclosesocket = function () {
    clearInterval(Navigation._getPos);
}

Port.endReconnect = function () {
    Port._reconnecting = false;
    if (Port._myinvterval === null) return;
    clearInterval(Port._myinvterval);

}

Port.doConnect = function () {
    if (Port.isConnected()) {
        Port.endReconnect();
        return;
    }

    if (Port.secureLayer) {
        Port.connect('wss://' + Port.address + '/server/core');
    } else {
        Port.connect('ws://' + Port.address + '/server/core');
    }
}

Navigation.getPos = function () {

    navigator.geolocation.getCurrentPosition(function (position) {
        var element = document.getElementById('geolocation');
        AppVars.PosLAT = position.coords.latitude;
        AppVars.PosLON = position.coords.longitude;
        PacketManager.sendMessage(AppService.PositionMessageCreate(AppVars.PosLON, AppVars.PosLAT));
    }, function (error) {

       alert('Location services must be enabled. Application requires location services.');

    });
}

Port.reconnect = function () {
    const MS_RECONNECT = 1500;
    if (Port._reconnecting) return;
    Port._reconnecting = true;
    Port._myinvterval = setInterval(Port.doConnect, MS_RECONNECT);
}

Port.isConnected = function () {
    if (null == Port.socket)
        return false;

    return (Port.socket.readyState == WebSocket.OPEN);
}

Port.initialize = function () {
    Port.doConnect();
    Port.reconnect();
};

Port.sendMessage = (function (message) {
    if (!Port.isConnected()) {
        Port.initialize();

    }
    if (message != '') {
        try {
            Port.socket.send(message);
        }
        catch (e) {
            console.log(e);
        }
    }
    console.log(message);
});


// Armin
var fileInterface = {
    messageHandler: function (event) {

    },

    errorHandler: function (event) {

    },
    closeHandler: function (event) {

    },
    setBinaryType: function (t) {
    },

    send: function (data) {
        const MSG_FILE = 30;
        data = '[{"params":' + data + ', "code":' + MSG_FILE + '}]'

        Port.socket.send(data);
    },

    isOpen: function () {
        return true;
    }
};


(function () {

    // Authentication -> zone.core
    // Authentication -> zone.core
    const MSG_FORCECLOSE = -1;
    const MSG_NOTIN = 0;
    const MSG_LOGIN = 1;
    const MSG_LOGOUT = MSG_NOTIN;

    // Common Tasks
    const MSG_CHANGELOCATION = 2;
    const MSG_NEARPOSTS = 3;

    //Posts
    const MSG_POST = 4;
    const MSG_USERPOSTS = 5;
    const MSG_EDITPOST = 6;
    const MSG_ACTIVEPOST = 8;

    //Comment
    const MSG_LISTCOMMENT = 9;
    const MSG_ADDCOMMENT = 10;

    //Point
    const MSG_ADDPOINT = 11;
    const MSG_GIVENPOINT = 12;
    const MSG_ASKUSER = 13;

    // Chat -> zone.users.chat.ChatMan
    const MSG_CHAT = 17;
    const MSG_LISTCHAT = 18;
    const MSG_LISTCHATUSERS = 19;
    const MSG_MESSAGEBYUSER = 20;

    // Notification -> zone.users.NotifyMan
    const MSG_NOTIFICATION = 29;

    // File -> zone.file.FileMan
    const MSG_FILE = 30;

    // Land
    const MSG_NEARLANDS = 32;
    const MSG_MYLANDS = 33;
    const MSG_LANDFLAG = 34;
    const MSG_GETLAND = 35;
    const MSG_BUYLAND = 36;


    // Removing
    const MSG_REMOVECHAT = 53;
    const MSG_REMOVEPOINT = 52;
    const MSG_REMOVECOMMENT = 51;
    const MSG_REMOVEPOST = 50;

    // User Tasks
    const MSG_CHANGEPASSWORD = 100;
    const MSG_CHANGEUSERINFO = 101;

    // Registration
    const MSG_REGISTER = 1000;

    // Error Handlers
    const MSG_ERR_NULL = 0;
    const MSG_ERR_DBPRO = 1;
    /*
     const MSG_ERR_LOGIN_BAD = 100;
     */

    PacketManager.createMessage = function (msgtype, params) {
        var message = new Object();
        message.code = msgtype;
        message.params = params;

        return message;
    };

    PacketManager.messageToString = function (message) {
        var strout = JSON.stringify(message);
        return strout;
    };

    PacketManager.stringToMessage = function (strmessage) {
        return JSON.parse(strmessage);
    };

    PacketManager.processMessage = function (msgString) {
        console.log("processMessage: " + msgString);
        var message = new Object();
        message = PacketManager.stringToMessage(msgString);

        if (message instanceof Array) {
            for (var i = 0; i < message.length; i++) {
                PacketManager.processSingle(message[i]);
            }
        }
        else {
            PacketManager.processSingle(message);
        }
    };

    PacketManager.processSingle = function (response) {
        switch (response.id) {
            case MSG_LOGIN:
                AppService.LoginReceived(response);
                break;
            case MSG_NEARPOSTS:
                AppService.NearPostsList(response);
                break;
            case MSG_POST: //single poste in
                AppService.onSinglePostRecieved(response);
                break;
            case MSG_LISTCOMMENT:
                AppService.onCommentsRecieved(response);
                break;
            case MSG_ADDPOINT:
                AppService.onLikesRecievedHome(response);
                AppService.onLikesRecievedDetail(response);
                break;
            case MSG_REMOVEPOINT:
                AppService.onLikesRecievedHome(response);
                AppService.onLikesRecievedDetail(response);
                break;
            case MSG_ADDCOMMENT:
                AppService.onCommentCountRecieved(response);
                break;
            case MSG_ASKUSER :
                AppService.onProfileinformationRecieved(response);
                break;
            case MSG_USERPOSTS :
                AppService.onMyPostsRecieved(response);
                break;
            case MSG_LISTCHATUSERS:
                AppService.onChatListUsersRecieved(response);
                break;
            case MSG_MESSAGEBYUSER:
                AppService.onMessagesOfAUserRecieved(response);
                break;
            case MSG_CHAT:
                AppService.getChat(response);
                break;
            case MSG_REMOVECHAT:
                AppService.OnDeleteChat(response);
                break;
            case MSG_GIVENPOINT:
                AppService.onGivenPointsRecieved(response);
                break;
            case  MSG_REMOVECOMMENT:
                AppService.onCommentRemoved();
                break;

            // Armin
            case MSG_FILE:
                AppService.fileHandler(response);
                break;

            case MSG_NEARLANDS:
                AppService.onNearLands(response);
                break;

            case MSG_MYLANDS:
                AppService.onMyLandsReceived(response);
                break;
            case MSG_REGISTER:
                AppService.signUpResponse(response);
                break;
            case MSG_BUYLAND:
                AppService.rentedland(response);
                break;
            case MSG_CHANGEUSERINFO:
                AppService.ProfileInfoChanged(response);
                break;
            case MSG_CHANGEPASSWORD:
                AppService.paswordChanged(response);
                break;
        }
    };

    PacketManager.sendMessage = function (message) {
        if (!(message instanceof Array)) {
            message = new Array(message);
        }

        var msgbody = PacketManager.messageToString(message);
        Port.sendMessage(msgbody);

    };
    AppService.sendComment = function (postID, commentText) {
        var params = {};
        params.postid = postID;
        params.comment = commentText;
        var sendingmsg = PacketManager.createMessage(MSG_ADDCOMMENT, params);
        PacketManager.sendMessage(sendingmsg);
    };
    AppService.getGivenPoints = function (posts) {

        var params = {};

        params.posts = posts;
        var sendingmsg = PacketManager.createMessage(MSG_GIVENPOINT, params);

        PacketManager.sendMessage(sendingmsg);

    };
    AppService.onGivenPointsRecieved = function (msg) {

    };

    AppService.getProfileInformation = function (usrID) {
        var params = {};

        params.user = usrID;
        var sendingmsg = PacketManager.createMessage(MSG_ASKUSER, params);

        PacketManager.sendMessage(sendingmsg);
    };

    AppService.signOut = function () {

        var sendingmsg = PacketManager.createMessage(MSG_NOTIN, null);
        PacketManager.sendMessage(sendingmsg);
    };

    AppService.getMessagesOfAUser = function (userID) {
        var params = {};
        params.user = userID;
        var sendingmsg = PacketManager.createMessage(MSG_MESSAGEBYUSER, params);
        PacketManager.sendMessage(sendingmsg);
    };
    AppService.rentedland = function (msg) {

    };

    AppService.rentLand = function (postid, landname, days, x, y) {

        var params = {};
        params.postid = postid;
        params.name = landname;
        params.days = days;
        params.x = x;
        params.y = y;
        console.log(params);
        var sendingmsg = PacketManager.createMessage(MSG_BUYLAND, params);

        PacketManager.sendMessage(sendingmsg);
    }
    AppService.signUp = function (idEmail, Password, firstName, lastName, Sex, Alias, BirthDay) {
        var params = {};
        params.idemail = idEmail;
        params.password = Password;
        params.firstname = firstName;
        params.lastname = lastName;
        params.sex = Sex;
        params.alias = Alias;
        params.birthday = BirthDay;
        var sendingmsg = PacketManager.createMessage(MSG_REGISTER, params);
        console.log(sendingmsg);
        PacketManager.sendMessage(sendingmsg);
    };
    AppService.signUpResponse = function (msg) {

    };
    AppService.changeProfileInfo = function (alias, privacy, about, phone) {
        var params = {};
        params.alias = alias;
        params.private = privacy;
        params.about = about;
        params.phone = phone;
        var sendingmsg = PacketManager.createMessage(MSG_CHANGEUSERINFO, params);
        PacketManager.sendMessage(sendingmsg);

    };
    AppService.paswordChanged = function(msg){

    };
     AppService.changePassword = function(oldpass,newpass){
         var params = {};
         params.oldpassword = oldpass;
         params.newpassword = newpass;

         var sendingmsg = PacketManager.createMessage(MSG_CHANGEPASSWORD, params);
         PacketManager.sendMessage(sendingmsg);
     }
    AppService.ProfileInfoChanged = function (msg) {

    };
    AppService.removeComponent = function (postID, commentID) {
        var params = {};
        params.postid = postID;
        params.commentid = commentID;
        var sendingmsg = PacketManager.createMessage(MSG_REMOVECOMMENT, params);
        PacketManager.sendMessage(sendingmsg);

    };
    AppService.onCommentRemoved = function () {

    }
    AppService.setActivePost = function (postID, Active) {
        var params = {};
        params.postid = postID;
        params.active = Active;
        var sendingmsg = PacketManager.createMessage(MSG_ACTIVEPOST, params);
        PacketManager.sendMessage(sendingmsg);
    };
    AppService.onMessagesOfAUserRecieved = function (msg) {

    };
    AppService.getChatListUsers = function () {


        var sendingmsg = PacketManager.createMessage(MSG_LISTCHATUSERS);

        PacketManager.sendMessage(sendingmsg);
    };
    AppService.onChatListUsersRecieved = function (msg) {

    };

    AppService.sendChat = function (touser, message) {

        var params = {};
        params.touser = touser;
        params.message = message;
        var sendingmsg = PacketManager.createMessage(MSG_CHAT, params);
        PacketManager.sendMessage(sendingmsg);

    }

    AppService.getChat = function (msg) {
        try {
            navigator.notification.vibrate(100);
        }
        catch (e) {
            console.log(e);
        }

    };

    AppService.getMyPosts = function () {
        var sendingmsg = PacketManager.createMessage(MSG_USERPOSTS);
        PacketManager.sendMessage(sendingmsg);
    };
    AppService.onMyPostsRecieved = function (msg) {

    };
    AppService.onProfileinformationRecieved = function (msg) {

    };
    AppService.onSinglePostRecieved = function (msg) {


    };
    AppService.onCommentsRecieved = function (msg) {

    };
    AppService.onCommentCountRecieved = function (msg) {

    };
    AppService.editPost = function (postID, postBody, postHead, postType) {

        var params = {};
        params.postid = postID;
        params.body = postBody;
        params.head = postHead;
        params.type = postType;
        var sendingmsg = PacketManager.createMessage(MSG_EDITPOST, params);
        PacketManager.sendMessage(sendingmsg);

    };
    AppService.addLike = function (postID) {
        var params = {};
        params.postid = postID;
        var sendingmsg = PacketManager.createMessage(MSG_ADDPOINT, params);
        PacketManager.sendMessage(sendingmsg);
    };

    AppService.unLike = function (postID) {
        var params = {};
        params.postid = postID;
        var sendingmsg = PacketManager.createMessage(MSG_REMOVEPOINT, params);
        PacketManager.sendMessage(sendingmsg);
    };

    AppService.onLikesRecievedHome = function (msg) {

    };
    AppService.onLikesRecievedDetail = function (msg) {

    };
    AppService.getCommentsList = function (postID) {
        var params = {};
        params.postid = postID;
        var sendingmsg = PacketManager.createMessage(MSG_LISTCOMMENT, params);
        PacketManager.sendMessage(sendingmsg);
    }
    AppService.getSinglePost = function (postID) {
        var params = {};
        params.postid = postID;
        var sendingmsg = PacketManager.createMessage(MSG_POST, params);
        PacketManager.sendMessage(sendingmsg);
    };

    AppService.createPosition = function (dlon, dlat) {
        var position = {};
        position.lon = dlon;
        position.lat = dlat;

        return position;
    };

    AppService.PositionMessageCreate = function (dx, dy) {
        var ps = AppService.createPosition(dx, dy);
        var posmsg = PacketManager.createMessage(MSG_CHANGELOCATION, ps);

        return posmsg;
    };


    AppService.LoginReceived = function (message) {

    };

    AppService.LoginSend = function (username, password) {
        var params = {};
        params.user = username;
        params.pass = password;
        var logmessage = PacketManager.createMessage(MSG_LOGIN, params);

        console.log(logmessage);
        console.log('fohsh');
        console.log(username);
        PacketManager.sendMessage(logmessage);
    };


    AppService.PositionSend = function (dx, dy) {
        PacketManager.sendMessage(AppService.PositionMessageCreate(dx, dy));
    }

    AppService.GetNearPosts = function (pos, rad, lim, ofs) {
        var nearmsg = pos;
        nearmsg.radius = rad;
        nearmsg.limit = lim;
        nearmsg.offset = ofs;

        PacketManager.sendMessage(PacketManager.createMessage(MSG_NEARPOSTS, nearmsg));
    };

    AppService.NearPostsList = function (msg) {

    };

    AppService.RequstDeleteChat = function (userID) {
        var params = {};
        params.user = userID;
        var sendingmsg = PacketManager.createMessage(MSG_REMOVECHAT, params);
        PacketManager.sendMessage(sendingmsg)
    };

    AppService.OnDeleteChat = function (msg) {

    };


    // Armin

    AppService.getMyLands = function () {

        PacketManager.sendMessage(PacketManager.createMessage(MSG_MYLANDS, null));
    }

    AppService.onMyLandsReceived = function (msg) {

    }

    AppService.getNearLands = function (lowx, lowy, highx, highy) {

        var bounds = {
            lx: lowx,
            ly: lowy,
            hx: highx,
            hy: highy
        };
        console.log(bounds);
        PacketManager.sendMessage(PacketManager.createMessage(MSG_NEARLANDS, bounds));
    }

    AppService.onNearLands = function (msg) {

    }

    /*********** File System ********/


    AppService.askUploadUserImage = function () {
        PacketManager.sendMessage(Manager.createMessage(MSG_UPASKUSERIMAGE, null));
    }

    AppService.fileHandler = function (msg) {
        fileInterface.messageHandler(msg);
    }

    AppService.sendFile = function (msg) {
        Port.socket.send(msg);
    }

    AppService.socketClose = function () {
        fileInterface.closeHandler();

    }

    AppService.socketError = function () {
        fileInterface.errorHandler(event);

    }


}());