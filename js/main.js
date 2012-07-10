/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global window: false, hidato: false */

function onLoad() {
  'use strict';

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
    hidato.drawer.draw(hidato.board, time);
  }

  window.onresize = function () {
    var
      canvas = document.getElementById('mycanvas');

    if (canvas) {
      canvas.setAttribute('width', window.innerWidth);
      canvas.setAttribute('height', window.innerHeight);
      hidato.coordCellConverter.resize();
    }
  };

  function onclick(event) {
    var
      cell = hidato.coordCellConverter.getCellFromCoordinates({x: event.pageX, y: event.pageY});

    if (!cell) {
      return;
    }

    hidato.path.select(cell);
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

    hidato.board.initialize(hidato.data);
    hidato.path.initialize(hidato.board);
    hidato.coordCellConverter.initialize(canvas, hidato.board);
    hidato.drawer.initialize(canvas, hidato.coordCellConverter);

    animation = hidato.createStartAnimation(hidato.path.path[1]);
    hidato.drawer.backgroundAnimations.push(animation);
    animation = hidato.createEndAnimation(hidato.path.path[hidato.path.path.length - 1]);
    hidato.drawer.backgroundAnimations.push(animation);

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