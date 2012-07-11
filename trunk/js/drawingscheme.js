/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.drawingScheme = (function () {
  'use strict';

  var
    result = {
      backgroundColor: 'black',
      lineColor: 'lime',
      CellbackgroundColorFixed: 'rgb(25, 25, 25)',
      CellbackgroundColorUsed: 'black',
      CellbackgroundColorOpen: 'black',
      fontColorFixed: 'blue',
      fontColorUsed: 'rgb(120,120,255)',
    };

  result.drawCellBackgroundFixed = function(context, rect) {
    context.lineWidth = 1;
    context.fillStyle = result.CellbackgroundColorFixed;
    context.strokeStyle = result.lineColor;

    context.beginPath();
    context.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
    context.rect(rect.x1 + 3, rect.y1 + 3, rect.x2 - rect.x1 - 6, rect.y2 - rect.y1 - 6);
    context.fill();
    context.stroke();
  }

  return result;
}());
