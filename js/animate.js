/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.createStartAnimation = function (cell) {
  'use strict';

  var
    context_,
    coordCellConverter_,
    drawingScheme_,
    cell_ = cell,
    startTime_,
    result = {};

  result.isInitialized = function () {
    return context_ !== undefined;
  };

  result.initialize = function (context, coordCellConverter, drawingScheme, startTime) {
    context_ = context;
    coordCellConverter_ = coordCellConverter;
    drawingScheme_ = drawingScheme;
    startTime_ = startTime;
  };

  result.getTimeStep = function (time) {
    return (0.0001 * time) % 1;
  };

  result.animate = function (time) {
    var
      NRCIRCLES = 5,
      i, r,
      radius,
      center = {},
      rect = coordCellConverter_.celltoRect(cell_),
      timestep = result.getTimeStep(time);

    center.x = 0.5 * rect.x1 + 0.5 * rect.x2;
    center.y = 0.5 * rect.y1 + 0.5 * rect.y2;
    radius = 0.7 * (rect.x2 - rect.x1);

    context_.lineWidth = 0.25 * radius / NRCIRCLES;

    for (i = 0; i < NRCIRCLES; i++) {
      r = (i / NRCIRCLES + timestep) % 1;
      context_.strokeStyle = 'rgba(200,255,100,' + (1 - r) + ')';
      context_.beginPath();
      context_.arc(center.x, center.y, r * radius, 0, 2 * Math.PI, true);
      context_.stroke();
    }

  };

  result.isFinished = function (time) {
    return false;
  };

  return result;
};

hidato.createEndAnimation = function (cell) {
  'use strict';

  var
    result = hidato.createStartAnimation(cell);

  result.getTimeStep = function (time) {
    return (-0.0001 * time) % 1 + 1;
  };

  return result;
};