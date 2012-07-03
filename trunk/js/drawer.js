/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.drawer = (function () {
  'use strict';

  var
    result = {},
    canvas_,
    context_,
    board_,
    borderSize_,
    cellSize_;

  function getCellRect(cell) {
    return {
      x1: borderSize_ + cell.x * cellSize_,
      y1: borderSize_ + cell.y * cellSize_,
      x2: borderSize_ + cell.x * cellSize_ + cellSize_,
      y2: borderSize_ + cell.y * cellSize_ + cellSize_,
    };
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
      textSize = 0.4 * cellSize_,
      rect = getCellRect(board_.cells[0]);

    context_.font = textSize + "pt Calibri";
    context_.textAlign = "center";
    context_.fillStyle = "black";

    board_.cells.forEach(function (cell) {
      var
        rect = getCellRect(cell);

      if (cell.type === 'unused') {
        return;
      }

      if (cell.type === 'fixed') {
        context_.fillText(cell.sol, 0.5 * (rect.x1 + rect.x2), 0.5 * (rect.y1 + rect.y2 + textSize));
      }
    });
  }

  function drawAfterCellForeground() {

  }

  result.resize = function (board) {
    borderSize_ = Math.min(0.05 * canvas_.width, 0.05 * canvas_.height);
    cellSize_ = Math.min((canvas_.width - 2 * borderSize_) / board.nCols,
                         (canvas_.height - 2 * borderSize_) / board.nRows);
  };

  result.draw = function (board) {
    board_ = board;

    result.resize(board);

    drawBackground();
    drawCellBackground();
    drawAfterCellBackground();
    drawCellForeground();
    drawAfterCellForeground();

  };

  return result;
}());
