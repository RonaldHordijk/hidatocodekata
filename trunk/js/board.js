/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.board = (function () {
  'use strict';

  var
    result = {
      nRows: 0,
      nCols: 0,
      level: 0,
      cells: [],
    };

  result.getCell = function (row, col) {
    var
      index = row * result.nCols + col;

    if (!result.cells[index]) {
      result.cells[index] = {
        type: 'none',
        x: row,
        y: col
      };
    }
    return result.cells[index];
  };

  result.initialize = function (data) {
    var
      i, j, cell;

    result.nRows = data.nRows;
    result.nCols = data.nCols;
    result.level = data.level;

    for (i = 0; i < result.nRows; i++) {
      for (j = 0; j < result.nCols; j++) {
        cell = result.getCell(i, j);

        if (data.solution[i][j] < 0) {
          cell.type =  'unused';
        } else if (data.start[i][j] === 0) {
          cell.type = 'open';
          cell.sol = data.solution[i][j];
        } else {
          cell.type =  'fixed';
          cell.sol = data.solution[i][j];
        }
      }
    }
  };

  return result;
}());