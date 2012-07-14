/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global window: false, hidato: false */

function onLoad() {
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
    hidato.drawer.drawBackground();
    hidato.drawer.drawCells(hidato.board.cells, hidato.boardCoordCellConverter, time);
    hidato.drawer.drawCells(hidato.path.path, hidato.pathCoordCellConverter, time);
  }

  window.onresize = function () {
    var
      canvas = document.getElementById('mycanvas');

    if (canvas) {
      canvas.setAttribute('width', window.innerWidth);
      canvas.setAttribute('height', window.innerHeight);
      hidato.boardCoordCellConverter.resize(canvas.width, canvas.heigth);
      hidato.pathCoordCellConverter.resize(canvas.width, canvas.heigth);
    }
  };

  function onclick(event) {
    var
      cell = hidato.boardCoordCellConverter.getCellFromCoordinates({x: event.pageX, y: event.pageY});

    if (!cell) {
      return;
    }

    hidato.path.select(cell);
    segmentAnimation_.update(hidato.path.startSegment(), hidato.path.endSegment());
  }

  function initialize() {
    var
      canvasDiv = document.getElementById('canvasdiv'),
      canvas,
      animation,
      context;

    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'mycanvas');
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    canvasDiv.appendChild(canvas);

    hidato.board.initialize(hidato.data[1]);
    hidato.path.initialize(hidato.board);
    hidato.boardCoordCellConverter.initialize(hidato.board, canvas.width, canvas.height);
    hidato.pathCoordCellConverter.initialize(hidato.path, canvas.width, canvas.height);
    hidato.drawer.initialize(canvas, hidato.drawingScheme);

    animation = hidato.createStartAnimation(hidato.path.path[1]);
    hidato.drawer.backgroundAnimations.push(animation);
    animation = hidato.createEndAnimation(hidato.path.path[hidato.path.path.length - 1]);
    hidato.drawer.backgroundAnimations.push(animation);

    segmentAnimation_ = hidato.createActiveSegmentAnimation(hidato.path.startSegment(), hidato.path.endSegment());
    hidato.drawer.backgroundAnimations.push(segmentAnimation_);

    canvas.addEventListener("click", onclick, false);

    animate(Date.now());
  }

  function onDeviceReady() {
    initialize();
  }


  //  if (cordova !== undefined) {
  //    document.addEventListener("deviceready", onDeviceReady, false);
  //  } else {
  initialize();
  //  }

}