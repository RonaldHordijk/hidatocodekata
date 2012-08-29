/*jslint browser: true, windows: true, es5: true, nomen: true, maxerr: 500, indent: 2*/
/*global window: false, hidato: false */


(function setup() {
  'use strict';

  var
    segmentAnimation_;

  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
    );
  }());

  function animate(time) {
    window.requestAnimFrame(animate);

    time = time || Date.now();

    hidato.drawer.drawBackground();
    hidato.drawer.drawCells(hidato.board.cells, hidato.boardCoordCellConverter, time);
    hidato.drawer.drawCells(hidato.path.path, hidato.pathCoordCellConverter, time);
  }

  hidato.windowresize = function () {
    hidato.resize(window.innerWidth, window.innerHeight);
  };

  hidato.resize = function (width, height) {
    if (!hidato.canvas) {
      return;
    }

    hidato.canvas.setAttribute('width', width);
    hidato.canvas.setAttribute('height', height);

    hidato.boardCoordCellConverter.resize(width, height);
    hidato.pathCoordCellConverter.resize(width, height);
  };

  function onclick(event) {
    var
      cell;

    if (!hidato.viewport.isMainForm()) {
      return;
    }

    cell = hidato.boardCoordCellConverter.getCellFromCoordinates({x: event.offsetX || event.pageX, y: event.offsetY || event.pageY});

    if (!cell) {
      cell = hidato.pathCoordCellConverter.getCellFromCoordinates({x: event.offsetX || event.pageX, y: event.offsetY || event.pageY});
    }

    if (!cell) {
      return;
    }

    if (hidato.path.isFinished()) {
      return;
    }

    hidato.path.select(cell);

    segmentAnimation_.update(hidato.path.startSegment(), hidato.path.endSegment());

    hidato.animationPool.addSelectAnimation(cell);

    hidato.pathCoordCellConverter.setNextAdd(hidato.path.nextSelect());

    if (hidato.path.isFinished()) {
      hidato.animationPool.addFinishedAnimation(hidato.path.path);
    }
  }

  hidato.changepuzzle = function (puzzledata) {

    hidato.board.initialize(puzzledata);
    hidato.path.initialize(hidato.board);
    hidato.boardCoordCellConverter.initialize(hidato.board, hidato.canvas.width, hidato.canvas.height);
    hidato.pathCoordCellConverter.initialize(hidato.path, hidato.canvas.width, hidato.canvas.height);
    hidato.drawer.initialize(hidato.canvas, hidato.drawingSchemes.active, hidato.animationPool);

    hidato.animationPool.clear();

    hidato.animationPool.addStartAnimation(hidato.path.path[1]);
    hidato.animationPool.addEndAnimation(hidato.path.path[hidato.path.path.length - 1]);

    segmentAnimation_ = hidato.animationPool.addSegmentAnimation(hidato.path.startSegment(), hidato.path.endSegment());
  };

  hidato.setupCanvas = function (divname, width, height) {
    var
      canvasDiv = document.getElementById(divname),
      animation,
      context;

    hidato.canvas = document.createElement('canvas');
    hidato.canvas.setAttribute('id', 'mycanvas');
    hidato.canvas.setAttribute('width', width);
    hidato.canvas.setAttribute('height', height);
    canvasDiv.appendChild(hidato.canvas);

    hidato.changepuzzle(hidato.data[2]);

    hidato.canvas.addEventListener("click", onclick, false);

    animate(Date.now());
  };

}());

function onLoad() {
  'use strict';

  //  if (cordova !== undefined) {
  //    document.addEventListener("deviceready", onDeviceReady, false);
  //  } else {
  hidato.setupCanvas('canvasdiv', window.innerWidth, window.innerHeight);
  window.onresize = hidato.windowresize;
  //  }
}

function onDeviceReady() {
  'use strict';

  hidato.setupCanvas('canvasdiv', window.innerWidth, window.innerHeight);
  window.onresize = hidato.windowresize;
}
