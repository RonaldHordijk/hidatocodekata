/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.coordCellConverter = (function () {
  'use strict';

  var
    BORDERFACTOR = 0.03,
    canvas_,
    board_,
    borderSize_,
    cellSize_,
    result = {};

  result.resize = function () {
    borderSize_ = Math.min(BORDERFACTOR * canvas_.width, BORDERFACTOR * canvas_.height);
    cellSize_ = Math.min((canvas_.width - 2 * borderSize_) / board_.nCols,
                         (canvas_.height - 2 * borderSize_) / board_.nRows);
  };

  result.initialize = function (canvas, board) {
    canvas_ = canvas;
    board_ = board;

    result.resize();
  };

  result.celltoRect = function (cell) {
    return {
      x1: borderSize_ + cell.x * cellSize_,
      y1: borderSize_ + cell.y * cellSize_,
      x2: borderSize_ + cell.x * cellSize_ + cellSize_,
      y2: borderSize_ + cell.y * cellSize_ + cellSize_,
    };
  };

  result.getCellFromCoordinates = function (coord) {
    var
      x = Math.round((coord.x - borderSize_) / cellSize_ - 0.5),
      y = Math.round((coord.y - borderSize_) / cellSize_ - 0.5);

    return board_.getCell(y, x);
  };

  return result;
}());