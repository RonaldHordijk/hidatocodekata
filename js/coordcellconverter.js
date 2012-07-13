/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
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
    NRVISIBLECELLS = 20,
    path_,
    borderSize_,
    cellSize_,
    orientation_,
    celloffset_,
    result = {};

  result.resize = function (width, height) {
    borderSize_ = Math.min(BORDERFACTOR * width, BORDERFACTOR * height);

    if (width < height) {
      orientation_ = 'vert';
    } else {
      orientation_ = 'hort';
    }

    if (orientation_ === 'vert') {
      cellSize_ = (width - 2 * borderSize_) / NRVISIBLECELLS;
      celloffset_ = height - borderSize_ - cellSize_;
    } else {
      cellSize_ = (height - 2 * borderSize_) / NRVISIBLECELLS;
      celloffset_ = width - borderSize_ - cellSize_;
    }
  };

  result.initialize = function (path, width, height) {
    path_ = path;

    result.resize(width, height);
  };

  result.celltoRect = function (cell) {
    if (orientation_ === 'vert') {
      return {
        x1: borderSize_ + cell.sol * cellSize_,
        y1: celloffset_,
        x2: borderSize_ + cell.sol * cellSize_ + cellSize_,
        y2: celloffset_ + cellSize_,
      };
    } else {
      return {
        x1: celloffset_,
        y1: borderSize_ + cell.sol * cellSize_,
        x2: celloffset_ + cellSize_,
        y2: borderSize_ + cell.sol * cellSize_ + cellSize_,
      };
    }
  };

  return result;
}());