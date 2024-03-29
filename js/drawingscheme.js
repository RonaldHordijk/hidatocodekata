/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.drawingSchemes =
  {
    active: null
  };

(function () {
  'use strict';

  var
    result = {
      name: 'Dark',
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

  hidato.drawingSchemes[result.name] = result;
}());

(function () {
  'use strict';

  var
    result = {
      name: 'Light',
      backgroundColor: 'rgb(255,245,205)',
      lineColor: 'black',
      cellbackgroundColorFixed: 'rgb(236, 232, 129)',
      cellbackgroundColor: 'rgb(248, 248, 179)',
      fontColorFixed: 'rgb(48,118,168)',
      fontColorUsed: 'rgb(138,202,247)',
      fontColorError: 'red',
      beginColor: 'rgb(120,200,120)',

    };

  result.getBeginColor = function (alpha) {
    return 'rgba(130,255,186,' + alpha + ')';
  };

  result.getEndColor = function (alpha) {
    return 'rgba(200,200,220,' + alpha + ')';
  };

  hidato.drawingSchemes[result.name] = result;
  hidato.drawingSchemes.active = result;
}());
