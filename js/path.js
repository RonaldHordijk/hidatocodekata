/*jslint browser: true, windows: true, es5: true, nomen: true, plusplus: true, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.path = (function () {
  'use strict';

  var
    activeCell_,
    direction_ = 'up',
    nrCells_ = 0,
    nextPick_,
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
      if (result.path[i].type === 'ref-open') {
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
      if ((result.path[i] === 'ref-used') && 
          (result.path[i].cell.val !== result.path[i].cell.sol)) {

        result.path[i].type = 'error';
        result.path[i].cell.type = 'error';

        errors = true;
      }
    }

    return !errors;
  }

  function findHole(startPoint) {
    var
      i,
      temp;

    nextPick_ = -1;

    if (direction_ === 'up') {
      for (i = startPoint; i < nrCells_; i++) {
        if (result.path[i].type === 'ref-open') {
          nextPick_ = i;
          break;
        }
      }
    } else {
      for (i = startPoint; i > 1; i--) {
        if (result.path[i].type === 'ref-open') {
          nextPick_ = i;
          break;
        }
      }
    }

    // no hole go the other direction
    if (nextPick_ < 1) {
      flipDirection();
      findHole(startPoint);
    }

    //hole found mark segment

    for (i = nextPick_; i > 0; i--) {
      if (result.path[i].type === 'fixed') {
        startSegment_ = i;
        break;
      }
    }
    for (i = nextPick_; i < nrCells_; i++) {
      if (result.path[i].type === 'fixed') {
        endSegment_ = i;
        break;
      }
    }

   if (direction_ !== 'up') {
     temp = startSegment_;
     startSegment_ = endSegment_;
     endSegment_ = temp;
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
        findHole(cell.sol);
      }
    } else if (cell.type === 'open') {
      cell.type = 'used';
      cell.val = nextPick_;
      result.path[nextPick_].type = 'used';
      result.path[nextPick_].val = nextPick_;
      result.path[nextPick_].cell = cell;

      if (allFilled()) {
        nextPick_ = -1;
      } else {
        findHole(nextPick_);
      }

      if (allFilled()) {
        checkSolution();
      }
    } else if (cell.type === 'ref-open') {
      findHole(cell.val);

    } else if ((cell.type === 'used') || (cell.type === 'error')) {
      
      if (cell.cell) { // reference cell
        cell = cell.cell;
      }
      
      cell.type = 'open';
      result.path[cell.val].type = 'ref-open';

      findHole(cell.val);
    }

    activeCell_ = cell;
  };

  result.initialize = function (board) {
    result.path = [];

    board.cells.forEach(function (cell) {
      if (cell.type === 'fixed') {
        result.path[cell.sol] = cell;
      } else {
        result.path[cell.sol] = {
          type: 'ref-open', 
          val: cell.sol, 
          cell: cell
        };
      }
    });

    nrCells_ = result.path.length;
    
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

  result.nextSelect = function () {
    return nextPick_;
  };
  
  return result;
}());
