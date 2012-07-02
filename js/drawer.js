/*jslint browser: true, windows: true, es5: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */


hidato.drawer = (function () {
  'use strict';

  var
    result = {},
    canvas_,
    context_,
    board_;
    
  function getCellRect(cell) {
    return {
      x1: 100 + cell.x * 40,
      y1: 100 + cell.y * 40,
      x2: 100 + cell.x * 40 + 39,
      y2: 100 + cell.y * 40 + 39,
    }
  }
    

  result.initialize = function (canvas) {
    canvas_ = canvas;
    context_ = canvas_.getContext("2d");
  };
  
  function drawBackground() {
    context_.fillStyle = 'rgb(204,205,245)';
    context_.fillRect(0, 0, canvas_.width, canvas_.height);
  }
  
  function drawCellBackground() {
    context_.lineWidth = 1;
    context_.strokeStyle = 'black';

    board_.cells.forEach(function (cell) {
      var 
        rect = getCellRect(cell);
       
      if (cell.type === 'unused') {
        return;
      }
        
      context_.beginPath();
      context_.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
      context_.lineWidth = 1;
      context_.strokeStyle = 'black';
      context_.stroke();        
       
    });  
    
  }
  
  function drawAfterCellBackground() {
    
  }
  
  function drawCellForeground() {
    var
      rect = getCellRect(board_.cells[0]);

    context_.font = "10pt Calibri";
    context_.textAlign = "center";
    context_.fillStyle = "black";
    
    board_.cells.forEach(function (cell) {
      var 
        rect = getCellRect(cell);
       
      if (cell.type === 'unused') {
        return;
      }
        
      if (cell.type === 'fixed') {
        context_.fillText(cell.sol, 0.5 * (rect.x1 + rect.x2), 0.5 * (rect.y1 + rect.y2));
      }  
    });  
  }

  function drawAfterCellForeground() {

  }
  
  result.draw = function (board) {
    board_ = board;
    
    drawBackground();
    drawCellBackground();
    drawAfterCellBackground();
    drawCellForeground();
    drawAfterCellForeground();
   
  };

  return result;
} ());
