/*jslint browser: true, windows: true, es5: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.path = (function () {
  'use strict';

  var
    result = {
      path: []
    };  

  result.initialize = function (board) {
    board.cells.forEach(function (cell) {
      if (cell.sol > 0 ){
        result.path[cell.sol] = cell;           
      }
    });
  };

  return result;
} ());
