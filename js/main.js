/*jslint browser: true, windows: true, es5: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global Ext: false, window: false, hidato: false */

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function animate() {
  requestAnimFrame(animate);
  hidato.drawer.draw(hidato.board);
}

function initialize() {
  var
    canvasDiv = document.getElementById('canvasdiv'),
    canvas,
    context;
    
  canvas = document.createElement('canvas');
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  canvasDiv.appendChild(canvas);
   
  hidato.board.initialize(hidato.data);
  hidato.path.initialize(hidato.board);
  hidato.drawer.initialize(canvas);

  animate(); 
}

function onDeviceReady() {
  initialize(); 
}

function onLoad() {
//  if (cordova !== undefined) {
//    document.addEventListener("deviceready", onDeviceReady, false);
//  } else {
    initialize(); 
//  }
}

    