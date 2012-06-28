/*jslint browser: true, windows: true, es5: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global Ext: false, window: false */

Ext.onReady(function () {
  'use strict';

  function initialize() {
    var
      canvasDiv = document.getElementById('canvasdiv'),
      canvas,
      context;
      
      
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    canvasDiv.appendChild(canvas);
  
    context = canvas.getContext("2d");
  }

  initialize();
});
