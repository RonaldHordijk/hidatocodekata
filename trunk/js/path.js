/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.path = (function () {
  'use strict';

  var
    activeCell_,
    direction_ = 'up',
    nrCells_ = 0,
    startHole_,
    endHole_,
    startSegment_,
    endSegment_,
    result = {
      path: []
    };

  function flipDirection() {
    if (direction_ === 'up') {
      direction_ = 'down';
    } else {
      direction_ = 'up';
    }
  }

  function allFilled(cell) {
    var
      empty = false,
      i;

    for (i = 1; i < nrCells_; i++) {
      if (!result.path[i]) {
        empty = true;
        break;
      }
    }

    return !empty;
  }
  function checkSolution(cell) {
    var
      errors = false,
      i;

    for (i = 1; i < nrCells_; i++) {
      if ((result.path[i].val) && (result.path[i].val !== result.path[i].sol)) {
        result.path[i].type = 'error';
        errors = true;
      }
    }

    return !errors;
  }

  function findHole(cell) {
    var
      i;

    startHole_ = -1;

    if (direction_ === 'up') {
      for (i = cell.sol; i < nrCells_; i++) {
        if (!result.path[i]) {
          startHole_ = i;
          break;
        }
      }
    } else {
      for (i = cell.sol; i > 1; i--) {
        if (!result.path[i]) {
          startHole_ = i;
          break;
        }
      }
    }

    // no hole go the other direction
    if (startHole_ < 1) {
      flipDirection();
      findHole(cell);
    }

    // find end;    
    if (direction_ === 'up') {
      for (i = startHole_; i < nrCells_; i++) {
        if (result.path[i]) {
          endHole_ = i;
          break;
        }
      }
    } else {
      for (i = startHole_; i > 1; i--) {
        if (result.path[i]) {
          endHole_ = i;
          break;
        }
      }
    }

    //hole found mark segment

    if (direction_ === 'up') {
      for (i = startHole_; i > 0; i--) {
        if (result.path[i] && (result.path[i].type === 'fixed')) {
          startSegment_ = i;
          break;
        }
      }
    } else {
      for (i = startHole_; i < nrCells_; i++) {
        if (result.path[i] && (result.path[i].type === 'fixed')) {
          startSegment_ = i;
          break;
        }
      }
    }

    if (direction_ === 'up') {
      for (i = endHole_; i < nrCells_; i++) {
        if (result.path[i] && (result.path[i].type === 'fixed')) {
          endSegment_ = i;
          break;
        }
      }
    } else {
      for (i = endHole_; i > 0; i--) {
        if (result.path[i] && (result.path[i].type === 'fixed')) {
          endSegment_ = i;
          break;
        }
      }
    }

  }

  result.select = function (cell) {

    if (cell.type === 'none') {
      return;
    }

    if (cell.type === 'fixed') {
      if (cell === activeCell_) {
        flipDirection();
      }

      if (!allFilled()) {
        findHole(cell);
      }
    } else if (cell.type === 'open') {
      cell.type = 'used';
      cell.val = startHole_;
      result.path[startHole_] = cell;

      startHole_ = (direction_ === 'up') ? startHole_ + 1 : startHole_ - 1;

      if (startHole_ === endHole_) {
        if (allFilled()) {
          startHole_ = -1;
          endHole_ = -1;
        } else {
          findHole(cell);
        }
      }

      if (allFilled()) {
        checkSolution();
      }

    } else if ((cell.type === 'used') || (cell.type === 'error')) {
      cell.type = 'open';
      result.path[cell.val] = undefined;
      startHole_ = cell.val;
      endHole_ = (direction_ === 'up') ? startHole_ + 1 : startHole_ - 1;
    }

    activeCell_ = cell;
  };

  result.initialize = function (board) {
    board.cells.forEach(function (cell) {
      if (cell.type === 'fixed') {
        result.path[cell.sol] = cell;
      }
    });

    if (result.path[1]) {
      result.path[1].special = 'start';
    }

    nrCells_ = result.path.length;
    if (result.path[nrCells_ - 1]) {
      result.path[nrCells_ - 1].special = 'end';
    }

    if (result.path[1]) {
      result.select(result.path[1]);
    }
  };

  result.startSegment = function () {
    return result.path[startSegment_];
  };

  result.endSegment = function () {
    return result.path[endSegment_];
  };

  return result;
}());
