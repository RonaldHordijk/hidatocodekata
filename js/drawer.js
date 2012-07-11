/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.drawer = (function () {
  'use strict';

  var
    result = {
      backgroundAnimations: [],
      foregroundAnimations: []
    },
    canvas_,
    context_,
    board_,
    coordCellConverter_,
    drawingScheme_;

  result.initialize = function (canvas, drawingScheme, coordCellConverter) {
    canvas_ = canvas;
    context_ = canvas_.getContext("2d");

    drawingScheme_ = drawingScheme;  
    coordCellConverter_ = coordCellConverter;
  };

  function drawBackground() {
    if (drawingScheme_.drawBackground) {
      drawingScheme_.drawBackground(context_, canvas_.width, canvas_.height);
    }

    context_.fillStyle = drawingScheme_.backgroundColor || 'white';
    context_.fillRect(0, 0, canvas_.width, canvas_.height);
  }

  function drawCellBackground() {
    board_.cells.forEach(function (cell) {
      var
        rect = coordCellConverter_.celltoRect(cell);

      if (cell.type === 'unused') {
        if (drawingScheme_.drawCellBackgroundUnUsed) {
          drawingScheme_.drawCellBackgroundUnUsed(context_, rect, cell);
        }
        return;
        
      } else if (cell.type === 'fixed') {
        if (drawingScheme_.drawCellBackgroundFixed) {
          drawingScheme_.drawCellBackgroundFixed(context_, rect, cell);
          return;
        }

        context_.fillStyle = drawingScheme_.CellbackgroundColorFixed || 'white';
      } else if (cell.type === 'used') {
        if (drawingScheme_.drawCellBackgroundUsed) {
          drawingScheme_.drawCellBackgroundUsed(context_, rect, cell);
          return;
        }

        context_.fillStyle = drawingScheme_.CellbackgroundColorUsed || 'white';
      } else if (cell.type === 'open') {
        if (drawingScheme_.drawCellBackgroundOpen) {
          drawingScheme_.drawCellBackgroundOpen(context_, rect, cell);
          return;
        }

        context_.fillStyle = drawingScheme_.CellbackgroundColorOpen || 'white';
      }   
  
      // default handling    
      context_.lineWidth = 1;
      context_.strokeStyle = drawingScheme_.lineColor || 'black';

      context_.beginPath();
      context_.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
      context_.fill();
      context_.stroke();
    });
  }

  function removeAnimation(animation) {
    var
      i;

    for (i = result.backgroundAnimations.length - 1; i >= 0; i++) {
      if (result.backgroundAnimations === animation) {
        result.backgroundAnimations.splice(i, 1);
      }
    }

    for (i = result.foregroundAnimations.length - 1; i >= 0; i++) {
      if (result.foregroundAnimations === animation) {
        result.foregroundAnimations.splice(i, 1);
      }
    }

  }

  function drawAfterCellBackground(time) {
    result.backgroundAnimations.forEach(function (animation) {
      if (!animation.isInitialized()) {
        animation.initialize(context_, coordCellConverter_, drawingScheme_,  time);
      }

      animation.animate(time);

      if (animation.isFinished(time)) {
        removeAnimation(animation);
      }

    });
  }

  function drawCellForeground() {
    var
      rect = coordCellConverter_.celltoRect(board_.cells[0]),
      textSize = 0.4 * (rect.y2 - rect.y1);

    context_.font = textSize + "pt " + (drawingScheme_.fontName || "Calibri");
    context_.textAlign = "center";

    board_.cells.forEach(function (cell) {
      var
        rect = coordCellConverter_.celltoRect(cell);

      if (cell.type === 'unused') {
        return;
      }

      if (cell.type === 'fixed') {
        context_.fillStyle = drawingScheme_.fontColorFixed || "black";
        context_.fillText(cell.sol, 0.5 * (rect.x1 + rect.x2), 0.5 * (rect.y1 + rect.y2 + textSize));
      }

      if (cell.type === 'used') {
        context_.fillStyle = drawingScheme_.fontColorUsed || "blue";
        context_.fillText(cell.val, 0.5 * (rect.x1 + rect.x2), 0.5 * (rect.y1 + rect.y2 + textSize));
      }
    });
  }

  function drawAfterCellForeground(time) {

  }

  result.draw = function (board, time) {
    board_ = board;

    drawBackground();
    drawCellBackground();
    drawAfterCellBackground(time);
    drawCellForeground();
    drawAfterCellForeground(time);

  };

  return result;
}());
