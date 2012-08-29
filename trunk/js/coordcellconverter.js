/*jslint browser: true, windows: true, es5: true, nomen: true, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.boardCoordCellConverter = (function () {
  'use strict';

  var
    BORDERFACTOR = 0.03,
    board_,
    borderSize_,
    cellSize_,
    result = {};

  result.resize = function (width, height) {
    borderSize_ = Math.min(BORDERFACTOR * width, BORDERFACTOR * height);
    cellSize_ = Math.min((width - 2 * borderSize_) / board_.nCols,
                         (height - 2 * borderSize_) / board_.nRows);
  };

  result.initialize = function (board, width, height) {
    board_ = board;

    result.resize(width, height);
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

    if ((x < 0) || (x >= board_.nRows)) {
      return null;
    }

    if ((y < 0) || (y >= board_.nCols)) {
      return null;
    }

    return board_.getCell(x, y);
  };

  return result;
}());

hidato.pathCoordCellConverter = (function () {
  'use strict';

  var
    BORDERFACTOR = 0.03,
    NRVISIBLECELLS = 15,
    path_,
    borderSize_,
    cellSize_,
    width_,
    height_,
    orientation_,
    celloffset_,
    nextAdd_,
    result = {};

  result.resize = function (width, height) {
    width_ = width;
    height_ = height;

    borderSize_ = Math.min(BORDERFACTOR * width, BORDERFACTOR * height);

    if (width < height) {
      orientation_ = 'vert';
    } else {
      orientation_ = 'hort';
    }

    if (orientation_ === 'vert') {
      cellSize_ = (width - 2 * borderSize_) / NRVISIBLECELLS;
      celloffset_ = width + 2 * borderSize_;
    } else {
      cellSize_ = (height - 2 * borderSize_) / NRVISIBLECELLS;
      celloffset_ = height + 2 * borderSize_;
    }
  };

  result.initialize = function (path, width, height) {
    path_ = path;

    result.resize(width, height);

    nextAdd_ = 1;
  };

  result.setNextAdd = function (nextAdd) {
    nextAdd_ = nextAdd;
  };

  result.celltoRect = function (cell) {
    var
      pos = (cell.sol || cell.val) - nextAdd_;

    if (orientation_ === 'vert') {
      return {
        x1: pos * cellSize_ + 0.5 * width_ - 0.5 * cellSize_,
        y1: celloffset_,
        x2: pos * cellSize_ + cellSize_ + 0.5 * width_ - 0.5 * cellSize_,
        y2: celloffset_ + cellSize_,
      };
    } else {
      return {
        x1: celloffset_,
        y1: pos * cellSize_ + 0.5 * height_ - 0.5 * cellSize_,
        x2: celloffset_ + cellSize_,
        y2: pos * cellSize_ + 0.5 * height_ + 0.5 * cellSize_
      };
    }
  };

  result.getCellFromCoordinates = function (coord) {
    var
      index;

    if (orientation_ === 'vert') {
      index = Math.floor((coord.x - 0.5 * width_ + 0.5 * cellSize_) / cellSize_) + nextAdd_;
    } else {
      index = Math.floor((coord.y - 0.5 * height_ + 0.5 * cellSize_) / cellSize_) + nextAdd_;
    }

    return path_.path[index];
  };

  return result;
}());