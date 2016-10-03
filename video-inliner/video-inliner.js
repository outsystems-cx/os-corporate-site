    /*

    The MIT License (MIT)

    Copyright (c) 2016 Samir Zahran

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    */
    /*
            Based on the work of https://github.com/samiare/whitewater-mobile-video 
            30/9/16
    */

    function Whitewater(canvas, inputPath, options) {
        "use strict";


        var context = null;
        var imageIndex = 0;
        var coordinates = {
            x: 0,
            y: 0
        };
        var imagesLoaded = 0;
        var firstImage = new Image();
        var diffImages = [];
        var animationFrame = null;
        var frames = null;
        var manifest = null;
        var path = '';
        var settings = {};

        // Page Visibility API compatibility
        var hiddenProperty = null;
        var documentHidden = false;


        // Public members

        this.state = 'loading';
        this.currentFrame = 0;
        this.progress = 0;
        this.timestamp = '00:00.000';
        this.maxTime = '00:00.000';
        this.secondsElapsed = 0.0;


        // Check dependencies and initialize video

        if (Whitewater.supported) {
            init.call(this);
        }


        // ---------------------------------------------------------------------- //


        // Private Functions

        function addCanvasMethods() {
            this.canvas.play = this.play;
            this.canvas.pause = this.pause;
            this.canvas.playpause = this.playpause;
            this.canvas.stop = this.stop;
        }

        function addVisibilityListener() {
            if ('hidden' in document) {
                hiddenProperty = 'hidden';
                document.addEventListener('visibilitychange', softPause.bind(this), false);
            } else if ('mozHidden' in document) {
                hiddenProperty = 'mozHidden';
                document.addEventListener('mozvisibilitychange', softPause.bind(this), false);
            } else if ('msHidden' in document) {
                hiddenProperty = 'msHidden';
                document.addEventListener('msvisibilitychange', softPause.bind(this), false);
            } else if ('webkitHidden' in document) {
                hiddenProperty = 'webkitHidden';
                document.addEventListener('webkitvisibilitychange', softPause.bind(this), false);
            } else if ('onfocusin' in document) {
                document.addEventListener('focusin', softPause.bind(this, false), false);
                document.addEventListener('focusout', softPause.bind(this, true), false);
            } else if ('onpageshow' in window) {
                window.addEventListener('pageshow', softPause.bind(this, false), false);
                window.addEventListener('pagehide', softPause.bind(this, true), false);
            } else {
                window.addEventListener('focus', softPause.bind(this, false), false);
                window.addEventListener('blur', softPause.bind(this, true), false);
            }
        }

        function checkImagesLoaded() {

            imagesLoaded++;

            if (imagesLoaded > settings.imagesRequired) {

                this.canvas.setAttribute('data-state', 'ready');
                this.state = 'ready';

                var loadEvent = new CustomEvent('whitewaterload', getEventOptions.call(this));
                this.canvas.dispatchEvent(loadEvent);

                if (options.autoplay) {
                    this.play();
                }

            }

        }

        function drawFrame() {

            var frameToDraw = null;

            if (this.currentFrame === 0) {
                frameToDraw = firstImage;
            } else {
                frameToDraw = getPrecompositedFrame(frames[this.currentFrame - 1]);
            }

            context.drawImage(frameToDraw, 0, 0);
            this.currentFrame++;
            setProgress.call(this);

        }

        function getEventOptions() {
            return {
                detail: {
                    video: this,
                    currentFrame: this.currentFrame,
                    progress: this.progress,
                    timestamp: this.timestamp,
                    maxTime: this.maxTime,
                    state: this.state,
                    secondsElapsed: this.secondsElapsed
                },
                bubbles: true,
                cancelable: false
            };
        }

        function getPrecompositedFrame(frameToRender) {

            var buffer = document.createElement('canvas');
            buffer.width = settings.videoWidth;
            buffer.height = settings.videoHeight;

            for (var j = 0; j < frameToRender.length; j++) {
                var position = frameToRender[j][0];
                var consecutive = frameToRender[j][1];
                var positionArray = getCoordinatesFromPosition(position);
                var chunkWidth = consecutive * settings.blockSize;

                buffer.getContext('2d').drawImage(
                    diffImages[imageIndex],
                    coordinates.x * settings.blockSize,
                    coordinates.y * settings.blockSize,
                    chunkWidth,
                    settings.blockSize,
                    positionArray[0] * settings.blockSize,
                    positionArray[1] * settings.blockSize,
                    chunkWidth,
                    settings.blockSize
                );

                coordinates.x += consecutive;
                if (coordinates.x >= settings.sourceGrid) {
                    // Jump to next row
                    coordinates.x = 0;
                    coordinates.y++;
                    if (coordinates.y >= settings.sourceGrid) {
                        // Jump to next diffmap
                        coordinates.y = 0;
                        imageIndex++;
                        if (imageIndex >= diffImages.length) {
                            throw 'imageIndex exceeded diffImages.length\n\nmapLength = ' + frameToRender.length + '\nj = ' + j;
                        }
                    }
                }
            }

            return buffer;

        }

        function loadRequiredImages() {
            var Video = this;
            firstImage.addEventListener('load', function() {
                checkImagesLoaded.call(Video);
                setPosterImage.call(Video);
            }, false);
            firstImage.src = path + 'first.' + settings.format;

            for (var i = 1; i <= settings.imagesRequired; i++) {
                var image = new Image();
                image.addEventListener('load', checkImagesLoaded.bind(this), false);
                if (i > 99) {
                    image.src = path + 'diff_' + i + '.' + settings.format;
                } else if (i > 9) {
                    image.src = path + 'diff_0' + i + '.' + settings.format;
                } else {
                    image.src = path + 'diff_00' + i + '.' + settings.format;
                }
                diffImages.push(image);
            }

        }

        function parseManifestFile(callbacks) {

            var Video = this;
            var request = new XMLHttpRequest();

            request.open('GET', path + 'manifest.json', false);
            request.addEventListener('load', onManifestLoad.bind(this), false);
            request.addEventListener('error', onManifestError.bind(this), false);
            request.send();

            function onManifestLoad() {

                try {
                    manifest = JSON.parse(request.responseText);
                } catch (error) {
                    this.constructor._throwError(error);
                    return;
                }

                setVideoOptions.call(this);
                setSize.call(this);

                var myWorker = null;

                var webWorker = function() {
                    var workerIsIncluded = false;

                    workerIsIncluded = true;

                    onmessage = function(e) {
                        var frames = e.data;
                        var videoData = [];

                        for (var i = 0; i < frames.length; i++) {
                            var frame = frames[i];
                            var frameData = [];

                            if (frame !== "") {
                                var map = frame.match(/.{1,5}/g);
                                var mapLength = map.length;

                                for (var j = 0; j < mapLength; j++) {
                                    var position = toBase10(map[j].substr(0, 3));
                                    var consecutive = toBase10(map[j].substr(3, 2));

                                    frameData.push([position, consecutive]);
                                }
                            }

                            videoData.push(frameData);
                        }

                        postMessage(videoData);
                    };

                    function toBase10(val) {
                        var order = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        var num = 0,
                            r;
                        while (val.length) {
                            r = order.indexOf(val.charAt(0));
                            val = val.substr(1);
                            num *= 64;
                            num += r;
                        }
                        return num;
                    }

                    return workerIsIncluded;
                };

                if (webWorker()) {

                    var URL = window.URL || window.webkitURL;
                    var workerBlob = new Blob(['(' + webWorker.toString() + ')()'], {
                        type: 'text/javascript'
                    });

                    myWorker = new Worker(URL.createObjectURL(workerBlob));

                } else {

                    myWorker = new Worker('whitewater.worker.js');

                }

                myWorker.postMessage(manifest.frames);

                myWorker.onmessage = function(event) {
                    frames = event.data;
                    myWorker.terminate();

                    for (var i = 0; i < callbacks.length; i++) {
                        callbacks[i]();
                    }

                    if (options.controls) {
                        setPlayPauseControls.call(Video);
                    }
                };

            }

            function onManifestError() {

                try {
                    throw this.constructor.errors.MANIFEST;
                } catch (error) {
                    this.constructor._throwError(error);
                    return;
                }

            }

        }

        function resetVideo() {

            imageIndex = 0;
            coordinates.x = 0;
            coordinates.y = 0;
            this.currentFrame = 0;

            context.clearRect(0, 0, settings.videoWidth, settings.videoHeight);

        }

        function setCanvasElement() {

            if (canvas instanceof HTMLCanvasElement) {
                this.canvas = canvas;
                context = this.canvas.getContext('2d');
            } else {
                throw this.constructor.errors.CANVAS;
            }

        }

        function setFilePath() {

            if (typeof inputPath === 'string') {
                path = inputPath;
                if (inputPath.substr(-1) !== '/') {
                    path += '/';
                }
            } else {
                throw this.constructor.errors.PATH;
            }

        }

        function setOptions() {

            if (options) {

                var speed = 1;
                if (options.speed && options.speed < 1) {
                    speed = options.speed;
                }

                options = {
                    loop: options.loop || false,
                    autoplay: options.autoplay || false,
                    controls: options.controls || false,
                    speed: speed
                };

            }

        }

        function setPlayPauseControls() {
            var element = this.canvas;

            if (typeof options.controls !== 'boolean') {
                element = options.controls;
            }

            var clickEvent = getClickEvent();
            element.addEventListener(clickEvent, this.playpause);
        }

        function setPosterImage() {

            var src = firstImage.src;
            var top = this.canvas.style.paddingTop;

            this.canvas.style.background = 'transparent url(' + src + ') no-repeat center ' + top;
            this.canvas.style.backgroundSize = 'contain';

        }

        function setProgress() {

            this.progress = getNumberWithDecimals(this.currentFrame / settings.frameCount * 100, 3);

            var currentTime = this.currentFrame / settings.framesPerSecond;
            this.timestamp = getFormattedTime(currentTime);
            this.secondsElapsed = getNumberWithDecimals(currentTime, 3);

            var playingEvent = new CustomEvent('whitewaterprogressupdate', getEventOptions.call(this));
            this.canvas.dispatchEvent(playingEvent);

        }

        function setSize() {
            this.canvas.setAttribute('width', settings.videoWidth + 'px');
            this.canvas.setAttribute('height', settings.videoHeight + 'px');
        }

        function setVideoOptions() {
            var format = '';

            switch (manifest.format) {
                case 'JPEG':
                    format = 'jpg';
                    break;
                case 'PNG':
                    format = 'png';
                    break;
                case 'GIF':
                    format = 'gif';
                    break;
                default:
                    format = 'jpg';
                    break;
            }

            settings = {
                videoWidth: manifest.videoWidth,
                videoHeight: manifest.videoHeight,
                imagesRequired: manifest.imagesRequired,
                frameCount: manifest.frameCount - 1,
                blockSize: manifest.blockSize,
                sourceGrid: manifest.sourceGrid,
                framesPerSecond: Math.round(manifest.framesPerSecond),
                format: format
            };

            var lengthInSeconds = settings.frameCount / settings.framesPerSecond;
            this.maxTime = getFormattedTime(lengthInSeconds);
        }

        function softPause(hidden) {
            if (hidden !== undefined) {
                documentHidden = hidden;
            }

            if ((document[hiddenProperty] || documentHidden === true) && Video.state === 'playing') {
                this.state = 'suspended';
                this.pause();
            } else if (Video.state === 'suspended') {
                this.play();
            }
        }

        function init() {
            try {
                setCanvasElement.call(this);
                setFilePath();
                setOptions();

                var callAfterManifest = [
                    loadRequiredImages.bind(this),
                    addCanvasMethods.bind(this),
                    addVisibilityListener.bind(this)
                ];

                parseManifestFile.call(this, callAfterManifest);

            } catch (error) {
                this.constructor._throwError(error);
                return;
            }

        }


        // Helper Functions

        function getClickEvent() {
            var isTouchDevice = 'ontouchstart' in document.documentElement;
            //var startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
            var endEvent = isTouchDevice ? 'touchend' : 'mouseup';

            return endEvent;
        }

        function getCoordinatesFromPosition(position) {

            var coordinates = [];
            var columns = Math.ceil(settings.videoWidth / settings.blockSize);

            if (position < columns) {
                coordinates = [position, 0];
            } else {
                coordinates = [position % columns, Math.floor(position / columns)];
            }

            return coordinates;

        }

        function getFormattedTime(time) {

            var minutes = Math.floor(time / 60);
            var seconds = Math.floor(time % 60);
            var milliseconds = Math.floor((time % 60 % 1) * 1000);

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            if (milliseconds < 10) {
                milliseconds = '00' + milliseconds;
            } else if (milliseconds < 100) {
                milliseconds = '0' + milliseconds;
            }

            return minutes + ':' + seconds + '.' + milliseconds;

        }

        function getNumberWithDecimals(number, digits) {
            var multiplier = Math.pow(10, digits);
            return Math.round(number * multiplier) / multiplier;
        }


        // Public Functions

        var Video = this;

        this.pause = function() {
            if (Video.state === 'paused') {
                return;
            }

            if (Video.state !== 'suspended') {
                Video.canvas.setAttribute('data-state', 'paused');
                Video.state = 'paused';

                var pauseEvent = new CustomEvent('whitewaterpause', getEventOptions.call(Video));
                Video.canvas.dispatchEvent(pauseEvent);
            }

            cancelAnimationFrame(animationFrame);
        };

        this.play = function() {
            if (Video.state === 'playing') {
                return;
            } else if (Video.state === 'ended') {
                resetVideo.call(Video);
            }

            var resume = Video.state === 'suspended';

            Video.canvas.setAttribute('data-state', 'playing');
            Video.state = 'playing';

            if (!resume) {
                var playEvent = new CustomEvent('whitewaterplay', getEventOptions.call(Video));
                Video.canvas.dispatchEvent(playEvent);
            }

            var milliseconds = 1 / settings.framesPerSecond * 1000;
            var interval = getNumberWithDecimals(milliseconds / options.speed, 2);
            var previousTime = window.performance.now();

            animate(previousTime);

            function animate(currentTime) {

                var timeSinceLastDraw = currentTime - previousTime;

                if (timeSinceLastDraw >= interval) {

                    if (Video.currentFrame < settings.frameCount + 1) {

                        drawFrame.call(Video);

                    } else if (options.loop) {

                        resetVideo.call(Video);
                        drawFrame.call(Video);

                        var loopEvent = new CustomEvent('whitewaterloop', getEventOptions.call(Video));
                        Video.canvas.dispatchEvent(loopEvent);

                    } else {

                        Video.stop();

                        Video.canvas.setAttribute('data-state', 'ended');
                        Video.state = 'ended';

                        var endEvent = new CustomEvent('whitewaterend', getEventOptions.call(Video));
                        Video.canvas.dispatchEvent(endEvent);

                    }

                    var lag = timeSinceLastDraw - interval;
                    previousTime = currentTime - lag;

                }

                if (!(document[hiddenProperty] || documentHidden === true) && Video.state === 'playing') {
                    animationFrame = requestAnimationFrame(animate);
                }
            }
        };

        this.playpause = function() {

            if (Video.state === 'playing') {
                Video.pause();
            } else if (Video.state !== 'loading') {
                Video.play();
            }
        };

        this.stop = function() {

            if (Video.state === 'ready') {
                return;
            }

            Video.canvas.setAttribute('data-state', 'ready');
            Video.state = 'ready';

            var stopEvent = new CustomEvent('whitewaterend', getEventOptions.call(Video));
            Video.canvas.dispatchEvent(stopEvent);

            cancelAnimationFrame(animationFrame);

            resetVideo.call(Video);
            setProgress.call(Video);

        };

    }

    Whitewater.errors = {
        pre: 'Whitewater: ',
        MISC: 'Whatever.',
        WEBWORKERS: 'This browser does not support Web Workers.',
        BLOBCONSTRUCTOR: 'This browser does not support the Blob() constructor.',
        VISIBILITYAPI: 'This browser does not support the Visiblity API',
        CANVAS: '"canvas" must be a valid HTML canvas element.',
        PATH: '"path" must be a path to a directory containing a manifest.json file',
        MANIFEST: 'A manifest.json file could not be found.'
    };

    Whitewater._checkSupport = function() {
        try {
            if (!window.Blob) {
                throw this.errors.WEBWORKERS;
            } else if (!window.Worker) {
                throw this.errors.BLOBCONSTRUCTOR;
            } else if (!(('hidden' in document) ||
                    ('mozHidden' in document) ||
                    ('msHidden' in document) ||
                    ('webkitHidden' in document))) {
                throw this.errors.VISIBILITYAPI;
            } else {
                return true;
            }
        } catch (error) {
            this._throwError(error);
            return false;
        }
    };

    Whitewater._throwError = function(error) {
        console.warn(this.errors.pre + error);
    };

    Whitewater.supported = Whitewater._checkSupport();



    /*
    dam Code

    Custom for OutSystems
    */

    function videoInliner(canvasSource, videoSource, id) {

        if (id === undefined) {
            id = "canvas-video";
        }

        var isMobile = false; //initiate as false

        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

        //on Mobile devices print Canvas with video
        if (isMobile === true) {
            var canvasOut = document.write('<canvas class="video-canvas" id="' + id + '"></canvas>');
            var canvas = document.getElementById(id);
            var source = canvasSource;
            var options = {
                autoplay: true,
                loop: true,
                controls: false
            }
            var video = new Whitewater(canvas, source, options);
        } else {
            //on other devices print Video    
            var videoOut = document.write('<video id="' + id + '" autoplay="" loop=""><source src="' + videoSource + '" type="video/mp4"><source src="' + videoSource + '_webm" type="video/webm"><source src="' + videoSource + '_ogg" type="video/ogg"></video>');
        }
    }
