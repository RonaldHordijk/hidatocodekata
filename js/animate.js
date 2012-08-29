/*jslint browser: true, windows: true, es5: true, nomen: true, plusplus: true, maxerr: 500, indent: 2*/
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

  result.initialize = function (context, drawingScheme, startTime) {
    context_ = context;
    drawingScheme_ = drawingScheme;
    startTime_ = startTime;
  };

  result.getTimeStep = function (time) {
    return (0.0001 * time) % 1;
  };

  result.getColor = function (alpha) {
    return drawingScheme_.getBeginColor(alpha) || drawingScheme_.beginColor || 'rgba(200,255,100,' + alpha + ')';
  };

  result.animate = function (coordCellConverter, time) {
    var
      NRCIRCLES = 5,
      i, r,
      radius,
      center = {},
      rect,
      timestep = result.getTimeStep(time);

    coordCellConverter_ = coordCellConverter;

    rect = coordCellConverter_.celltoRect(cell_);

    center.x = 0.5 * rect.x1 + 0.5 * rect.x2;
    center.y = 0.5 * rect.y1 + 0.5 * rect.y2;
    radius = 0.7 * (rect.x2 - rect.x1);

    context_.lineWidth = Math.max(1, 0.25 * radius / NRCIRCLES);

    for (i = 0; i < NRCIRCLES; i++) {
      r = (i / NRCIRCLES + timestep) % 1;
      context_.strokeStyle = result.getColor(1 - r);
//      context_.strokeStyle = result.getColor(1);
      context_.beginPath();
      context_.arc(center.x, center.y, r * radius, 0, 2 * Math.PI, false);
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
    drawingScheme_,
    result = hidato.createStartAnimation(cell);

  result.baseinitialize = result.initialize;

  result.initialize = function (context, drawingScheme, startTime) {
    drawingScheme_ = drawingScheme;

    result.baseinitialize(context, drawingScheme, startTime);
  };

  result.getColor = function (alpha) {
    return drawingScheme_.getEndColor(alpha) || drawingScheme_.endColor || 'rgba(200,255,100,' + alpha + ')';
  };

  result.getTimeStep = function (time) {
    return (-0.0001 * time) % 1 + 1;
  };

  return result;
};


hidato.createActiveSegmentAnimation = function (startCell, endCell) {
  'use strict';

  var
    context_,
    coordCellConverter_,
    drawingScheme_,
    startCell_ = startCell,
    endCell_ = endCell,
    startTime_,
    result = {};

  result.isInitialized = function () {
    return context_ !== undefined;
  };

  result.initialize = function (context, drawingScheme, startTime) {
    context_ = context;
    drawingScheme_ = drawingScheme;
    startTime_ = startTime;
  };

  result.animate = function (coordCellConverter, time) {
    var
      rect;

    if (startCell_ === endCell_) {
      return;
    }

    coordCellConverter_ = coordCellConverter;

    rect = coordCellConverter_.celltoRect(startCell_);

    context_.fillStyle = drawingScheme_.getBeginColor(0.7) || drawingScheme_.beginColor || 'rgba(128,128,255,0.7)';
    context_.beginPath();
    context_.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
    context_.fill();

    rect = coordCellConverter_.celltoRect(endCell_);

    context_.fillStyle = drawingScheme_.getEndColor(0.7) || drawingScheme_.endColor || 'rgba(128,255,128,0.7)';
    context_.beginPath();
    context_.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
    context_.fill();
  };

  result.isFinished = function (time) {
    return false;
  };

  result.update = function (startCell, endCell) {
    startCell_ = startCell;
    endCell_ = endCell;
  };

  return result;
};

hidato.createSelectAnimation = function (cell) {
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

  result.initialize = function (context, drawingScheme, startTime) {
    context_ = context;
    drawingScheme_ = drawingScheme;
    startTime_ = startTime;
  };

  result.animate = function (coordCellConverter, time) {
    var
      alpha,
      radius,
      center = {},
      rect;

    coordCellConverter_ = coordCellConverter;

    rect = coordCellConverter_.celltoRect(cell_);

    center.x = 0.5 * rect.x1 + 0.5 * rect.x2;
    center.y = 0.5 * rect.y1 + 0.5 * rect.y2;
    radius = 0.5 * (1 + 0.0035 * (time - startTime_)) * (rect.x2 - rect.x1);
    alpha = 1 - 0.003 * (time - startTime_);

    context_.lineWidth = 2;
    context_.strokeStyle = 'rgba(200,200,255,' + alpha + ')';
    context_.beginPath();
    context_.arc(center.x, center.y, radius, 0, 2 * Math.PI, true);
    context_.stroke();

  };

  result.isFinished = function (time) {
    return (time - startTime_) > 1000;
  };

  return result;
};

hidato.createFinishedAnimation = function (cells) {
  'use strict';

  var
    context_,
    coordCellConverter_,
    drawingScheme_,
    cells_ = cells,
    startTime_,
    minPos_,
    maxPos_,
    result = {};

  function calcMinMaxPos() {
    var 
      i, cell;
      
    minPos_ = 100;
    maxPos_ = 0;  
    for(i = 1; i < cells.length; i++) {
      cell = cells_[i].cell || cells_[i];
      
      minPos_ = Math.min(minPos_, cell.x - cell.y); 
      maxPos_ = Math.max(maxPos_, cell.x - cell.y); 
    }  
    
  }


  result.isInitialized = function () {
    return context_ !== undefined;
  };

  result.initialize = function (context, drawingScheme, startTime) {
    context_ = context;
    drawingScheme_ = drawingScheme;
    startTime_ = startTime;
    
    
  };

  result.animate = function (coordCellConverter, time) {
    var
      i,
      cell, 
      pos,
      t,
      radius,
      center = {},
      rect;

    coordCellConverter_ = coordCellConverter;

    t = (0.0003 * (time - startTime_) * (maxPos_ - minPos_)) % (maxPos_ - minPos_);
    
    for(i = 1; i < cells.length; i++) {
      cell = cells_[i].cell || cells_[i];
      
      pos = cell.x - cell.y;
      pos = pos - minPos_;
      
      if (Math.abs(t - pos) < 1.5) {

        rect = coordCellConverter_.celltoRect(cell);
    
        context_.fillStyle = 'rgba(128,128,255,0.4)';
        context_.beginPath();

        center.x = 0.5 * rect.x1 + 0.5 * rect.x2;
        center.y = 0.5 * rect.y1 + 0.5 * rect.y2;
        center.w = 0.5 * (rect.x2 - rect.x1);
        center.h = 0.5 * (rect.x2 - rect.x1);
        
        rect.x1 = center.x - Math.min(1, 1.5 - Math.abs(t - pos)) * center.w;  
        rect.x2 = center.x + Math.min(1, 1.5 - Math.abs(t - pos)) * center.w;  
        rect.y1 = center.y - Math.min(1, 1.5 - Math.abs(t - pos)) * center.h;  
        rect.y2 = center.y + Math.min(1, 1.5 - Math.abs(t - pos)) * center.h;  

        context_.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
        context_.fill();
        
      }
      
    }  

  };

  result.isFinished = function (time) {
    return false;
  };

  calcMinMaxPos();

  return result;
};
