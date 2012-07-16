/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.drawingScheme = (function () {
  'use strict';

  var
    result = {
      backgroundColor: 'black',
      lineColor: 'lime',
      cellbackgroundColorFixed: 'rgb(25, 25, 25)',
      cellbackgroundColorUsed: 'black',
      cellbackgroundColorOpen: 'black',
      cellbackgroundColorError: 'black',
      fontColorFixed: 'blue',
      fontColorUsed: 'rgb(120,120,255)',
      fontColorError: 'red',
      beginColor: 'rgb(120,200,120)',

    };

  result.drawCellBackgroundFixed = function (context, rect) {
    context.lineWidth = 1;
    context.fillStyle = result.cellbackgroundColorFixed;
    context.strokeStyle = result.lineColor;

    context.beginPath();
    context.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
    context.rect(rect.x1 + 3, rect.y1 + 3, rect.x2 - rect.x1 - 6, rect.y2 - rect.y1 - 6);
    context.fill();
    context.stroke();
  };

  result.getBeginColor = function (alpha) {
    return 'rgba(120,200,120,' + alpha + ')';
  };

  result.getEndColor = function (alpha) {
    return 'rgba(200,200,120,' + alpha + ')';
  };

  return result;
}());
