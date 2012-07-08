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
    coordCellConverter_;

  result.initialize = function (canvas, coordCellConverter) {
    canvas_ = canvas;
    context_ = canvas_.getContext("2d");

    coordCellConverter_ = coordCellConverter;
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
        rect = coordCellConverter_.celltoRect(cell);

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

  function removeAnimation(animation) {
    var
      i;

    for (i = result.backgroundAnimations.length - 1; i >= 0; i++) {
      if (result.backgroundAnimations === animation) {
        result.backgroundAnimations.plice(i, 1);
      }
    }

    for (i = result.foregroundAnimations.length - 1; i >= 0; i++) {
      if (result.foregroundAnimations === animation) {
        result.foregroundAnimations.plice(i, 1);
      }
    }

  }

  function drawAfterCellBackground(time) {
    result.backgroundAnimations.forEach(function (animation) {
      if (!animation.isInitialized()) {
        animation.initialize(context_, time);
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

    context_.font = textSize + "pt Calibri";
    context_.textAlign = "center";
    context_.fillStyle = "black";

    board_.cells.forEach(function (cell) {
      var
        rect = coordCellConverter_.celltoRect(cell);

      if (cell.type === 'unused') {
        return;
      }

      if (cell.type === 'fixed') {
        context_.fillText(cell.sol, 0.5 * (rect.x1 + rect.x2), 0.5 * (rect.y1 + rect.y2 + textSize));
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
