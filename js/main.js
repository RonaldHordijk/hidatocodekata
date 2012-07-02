/*jslint browser: true, windows: true, es5: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global Ext: false, window: false, hidato: false */

window.requestAnimFrame = (function() {
  'use strict';  
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
}());

function animate() {
  'use strict';
    
  window.requestAnimFrame(animate);
  hidato.drawer.draw(hidato.board);
}

window.onresize = function() {
  var
    canvas = document.getElementById('mycanvas');

  if (canvas) {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  }
}

function initialize() {
  'use strict';
    
  var
    canvasDiv = document.getElementById('canvasdiv'),
    canvas,
    context;
    
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'mycanvas');
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  canvasDiv.appendChild(canvas);
   
  hidato.board.initialize(hidato.data);
  hidato.path.initialize(hidato.board);
  hidato.drawer.initialize(canvas);

  animate(); 
}

function onDeviceReady() {
  'use strict';
    
  initialize(); 
}

function onLoad() {
  'use strict';
    
//  if (cordova !== undefined) {
//    document.addEventListener("deviceready", onDeviceReady, false);
//  } else {
    initialize(); 
//  }
}

    