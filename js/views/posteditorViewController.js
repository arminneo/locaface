var PostEditorViewController = new Class({

        Extends: Locaface.Section,
        ptype: null,
        myImage: null,
        deltaX: null,
        deltaY: null,
        curX: null,
        curY: null,
        posX: 0, posY: 0,
        startposX: null,
        startposY: null,
        myscale: null,
        pinching: null,
        touch: null,
        saveScale: null,
        frameWidth: null,
        frameHeight: null,
        framePadding: null,
        frameMargine: null,
        postID: null,
        saveButton: null,
        changeButton: null,
        resetButton: null,
        removeButton: null,
        newImage: false,

        initialize: function (postID) {

            this.postID = postID;
            this.parent();
        },
        loadView: function () {

            this.view = Moobile.PullRefresh.at('templates/views/post-editor.html');

        },
        viewDidLoad: function () {
            this.parent();

        },

        viewDidEnter: function () {

            this.framePadding = 3;
            this.frameMargine = 4;
            console.log('load');
            this.curX = 0;
            this.curY = 0;
            this.myscale = 1;
            this.pinching = false;

            imgelement = '<div class="posteditorImageContainer" id="posteditorImageContainer"><div class="posteditorImage" id = "posteditorImage"></div></div>';
            this.myImage = new Moobile.Component(imgelement);
            mainelement = '<div class="posteditor">' +
                '<div class="posteditorImagePart">' +
                '<div class="posteditorTitle">Post image:</div>' +
                '<div class="posteditorTip">Pan or zoom by swiping or draging after image change</div>' +
                '<div class="posteditorImageDiv" data-role="text" data-name="EditorImage"></div>' +
                '<div data-role="button-group" data-option-selectable="false">' +
                '<div data-role="button" data-name="changeButton">Change</div>' +
                /*'<div data-role="button" data-name="resetButton">Reset</div>' +*/

                '</div>' +
                '</div>' +
                '<div class="posteditorPostTitlePart">' +
                '<div class="posteditorTitle">Post title:</div>' +
                '<div class="posteditorTip">If you leave it blank first line of content will be used insted</div>' +
                '<input type="text" name="fname" placeholder="Post title" class="postEditorTitleText" id="EditorTitle" maxlength="40">' +
                '</div>' +
                '<div class="posteditorPostContentPart">' +
                '<div class="posteditorTitle">Post content:</div>' +
                '<div class="posteditorTip">Type your post content and details here</div>' +
                '<textarea rows="8" cols="50" placeholder="Post content" class="postEditorBodyText" id="EditorBody" maxlength="350">' +
                '</textarea>' +
                '</div>' +
                '</div>';
            var mainComponent = new Moobile.Component(mainelement);
            mainComponent.addChildComponentInside(this.myImage, '.posteditorImageDiv');
            this.view.addChildComponent(mainComponent);
            this.myImage.addEvent('touchstart', this.bound('ontouchstart'));
            this.myImage.addEvent('touchmove', this.bound('ontouchmove'));
            this.myImage.addEvent('touchend', this.bound('ontouchend'));
            this.myImage.addEvent('pinch', this.bound('onpinch'));
            this.parent();
            this.frameWidth = window.innerWidth - ((this.frameMargine * 2) + (this.framePadding * 2));
            this.frameHeight = this.frameWidth * 3 / 4;
            this.view.getElements('.posteditorImage').setStyle('background-size', '100%');
            this.view.getElements('.posteditorImage').setStyle('width', this.frameWidth + 'px');
            this.view.getElements('.posteditorImage').setStyle('height', this.frameHeight + 'px');
            this.saveButton = this.view.getDescendantComponent('save-button');

            var that = this;
            AppService.onSinglePostRecieved = function (msg) {

                var pst = msg.params[0];

                document.getElementById('EditorTitle').value = converter.text2HTML(pst[5]);
                document.getElementById('EditorBody').value = converter.text2HTML(pst[2]);
                //inja
                that.view.getElements('.posteditorImage').setStyle('background-image', 'url(' + AppVars.postimgURL + that.postID + ".jpg?rnd=" + Date.now() + ")");
                that.preloader.element.setStyle('opacity','0');
                setTimeout(function(){that.preloader.hide();},600 );
            }

            AppService.getSinglePost(this.postID);


            this.view.addEvent('ready', this.bound('onReady'));

            /** Armin **/
            var fileInputControl = document.getElementById("selectImageFile");
            var fileUploadProgress = document.getElementById("uploadPercent");

            var files = [];
            fileInputControl.addEvent("change", function (event) {

                files = event.target.files;
                if (files != null) {


                    var reader = new FileReader();

                    reader.onload = function (e) {
                        that.view.getElements('.posteditorImage').setStyle('background-image', 'url(' + e.target.result + ')');
                        that.newImage = true;
                    }

                    reader.readAsDataURL(files[0]);
                }
                console.log(files);
            });
            this.saveButton.addEvent('tap', function () {
                var al = new Moobile.Alert;
                al.setTitle('Locaface');
                al.setMessage('All comments and likes will be deleted. <br> Are you sure to edit your post?');
                var sv = new Moobile.Button;
                sv.setLabel('Save');
                var cn = new Moobile.Button;
                cn.setLabel('Cancel');
                sv.addEvent('tap', function () {


                    // Checks user has selected one or more files
                    if (that.newImage) {
                        if (files.length == 0) {
                            alert('select files first !');
                            return false;
                        }
                        that.view.disableTouch();
                        AppVars.iX = that.posX;
                        AppVars.iY = that.posY;
                        AppVars.iZoom = that.myscale;
                        AppVars.VPW = that.frameWidth;
                        AppVars.VPH = that.frameHeight;
                        for (var i = 0; i < files.length; i++) {



                            // Creates the transfer
                            var transfer = new WebSocketFileTransfer({
                                url: 'ws://' + window.location.host + '/server/core',
                                file: files[i],
                                uploadid: that.postID, // Masoud Upload PostID, UserID
                                uploadtype: 2, // User = 1, Post = 2
                                blockSize: 1024,
                                type: 'base64',

                                $progress: fileUploadProgress,
                                progress: function (event) {
                                    fileUploadProgress.innerHTML = "File upload: " +(event.percentage + '%');
                                },
                                success: function (event) {
                                    fileUploadProgress.innerHTML = "Finished";

                                    that.onSave();
                                    transfer = null;
                                },

                                open: function (event) {

                                },
                                error: function (event) {
                                    console.log(event);
                                    transfer = null;
                                }
                            });


                        }


                        console.log(transfer);


                        // Starts the transfer
                        transfer.start(fileInterface);
                        that.view.enableTouch();
                    }
                    else {
                        that.onSave();
                    }
                });
                al.addButton(sv);
                al.addButton(cn);
                al.showAnimated();
            });


            this.changeButton = this.view.getDescendantComponent('changeButton');
            /*this.resetButton = this.view.getDescendantComponent('resetButton');*/


            this.changeButton.addEvent('tap', function () {
                fileInputControl.focus();
                fileInputControl.click();
            });

        },


        onReady: function () {

        },
        destroy: function () {

            this.parent();

        },
        ontouchstart: function (event) {
            if (this.newImage) {


                this.view.didBuild();
                this.view._scroller.destroy();

                if (event.targetTouches.length == 1) {

                    this.startposX = event.touches[0].pageX;
                    this.startposY = event.touches[0].pageY;
                }
            }
            /* console.log('start!');*/
        },
        ontouchmove: function (event) {
            if (this.newImage) {
                if (event.targetTouches.length == 1 && this.pinching == false) {
                    this.touch = event.touches[0];
                    this.deltaX = -(this.startposX - this.touch.pageX);
                    this.deltaY = -(this.startposY - this.touch.pageY);
                    this.posX = this.curX + this.deltaX;
                    this.posY = this.curY + this.deltaY;
                    this.view.getElements('.posteditorImage').setStyle('background-position', this.posX + 'px ' + this.posY + 'px');


                }
                /* console.log('move!');*/
            }
        },
        ontouchend: function (event) {
            if (this.newImage) {
                if (this.pinching == false && event.targetTouches.length == 0) {
                    this.curX += this.deltaX;
                    this.curY += this.deltaY;
                    //get style kon!!

                }

                if (event.targetTouches.length == 0 && this.pinching == true) {
                    this.myscale *= this.saveScale;
                    console.log('saved:' + this.myscale);
                    this.pinching = false;
                    if (this.myscale < 1) {
                        this.myscale = 1;
                        this.view.getElements('.posteditorImage').setStyle('background-size', '100%');
                    }
                }
                //check limits
                if (this.posX > 0) {
                    this.posX = 0;
                    this.curX = 0;
                    this.view.getElements('.posteditorImage').setStyle('background-position', this.posX + 'px ' + this.posY + 'px');
                }
                if (this.posY > 0) {
                    this.posY = 0;
                    this.curY = 0;
                    this.view.getElements('.posteditorImage').setStyle('background-position', this.posX + 'px ' + this.posY + 'px');
                }

                if (this.posX < -((this.frameWidth * this.myscale) - this.frameWidth)) {
                    this.posX = -((this.frameWidth * this.myscale) - this.frameWidth);
                    this.curX = -((this.frameWidth * this.myscale) - this.frameWidth);
                    this.view.getElements('.posteditorImage').setStyle('background-position', this.posX + 'px ' + this.posY + 'px');
                }
                if (this.posY < -((this.frameHeight * this.myscale) - this.frameHeight)) {
                    this.posY = -((this.frameHeight * this.myscale) - this.frameHeight);
                    this.curY = -((this.frameHeight * this.myscale) - this.frameHeight);
                    this.view.getElements('.posteditorImage').setStyle('background-position', this.posX + 'px ' + this.posY + 'px');
                }
                this.view.didBuild();
            }
        },
        onpinch: function (event) {
            if (this.newImage) {
                if (event.targetTouches.length == 2) {
                    this.pinching = true;
                    var a = this.myscale * event.scale * 100;

                    this.view.getElements('.posteditorImage').setStyle('background-size', a + '%');
                    // console.clean();

                    this.saveScale = event.scale;
                }
            }
        },
        onSave: function () {

            var postHead, postBody, postType;
            postBody = document.getElementById('EditorBody').value;
            postHead = document.getElementById('EditorTitle').value;
            postType = 1;
            AppService.editPost(this.postID, postBody, postHead, postType);



            //this.getViewControllerStack().popViewControllerUntil(this.getViewControllerStack().getChildViewControllers()[1]);
            this.getViewControllerStack().popViewController();

        }



    })
    ;