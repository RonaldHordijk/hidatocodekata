/*jslint browser: true, windows: true, es5: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/

var
  hidato = {};

hidato.board = (function () {
  'use strict';
  
  var
    result = {},
    nRows_ = 0,
    nCols_ = 0,
    cells_ = [], 
    path_ = []; 
    
  function getCell(row, col) {
    var
      index = row * nCols_ + col;
    
    if (!cells_[index]) {
      cells_[index] = {type: 'none'};  
    }
    return cells_[index];
  }  
    
  result.initialize = function (data) {
    var
      i, j, cell;

    nRows_ = data.nRows;
    nCols_ = data.nCols;
    result.level = data.level;

    for (i = 0; i < nRows_; i++) {
      for (j = 0; j < nCols_; j++) {
        cell = getCell(i, j);
        
        if (data.start[i][j] === 0) {
          cell.type = 'open'; 
          cell.sol = data.solution[i][j];
        } else {
          cell.type =  'fixed'; 
          cell.sol = data.solution[i][j];
        }  
        
        if (data.solution[i][j] > 0) {
          path_[data.solution[i][j]] = {
            cell: cell, 
            row: i, 
            col: j
          };
        } 
        
      }
    }
  };

  return result;
} ());
