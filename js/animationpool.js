/*jslint browser: true, windows: true, es5: true, nomen: false, plusplus: false, maxerr: 500, indent: 2*/
/*global hidato: false */

hidato.animationPool = (function () {
  'use strict';

  var
    result = {
      backgroundAnimations: [],
      foregroundAnimations: []
    },
    context_,
    drawingScheme_;

  result.initialize = function (context, drawingScheme) {
    context_ = context;
    drawingScheme_ = drawingScheme;
  };

  function removeAnimation(animations, animation) {
    var
      i;

    for (i = animations.length - 1; i >= 0; i--) {
      if (animations[i] === animation) {
        animations.splice(i, 1);
      }
    }
  }

  function drawAnimations(animations, coordCellConverter, time) {
    animations.forEach(function (animation) {
      if (!animation.isInitialized()) {
        animation.initialize(context_, drawingScheme_, time);
      }

      animation.animate(coordCellConverter, time);

      if (animation.isFinished(time)) {
        removeAnimation(animations, animation);
      }
    });
  }

  result.addStartAnimation = function (cell) {
    var
      animation = hidato.createStartAnimation(cell);

    result.backgroundAnimations.push(animation);

    return animation;
  };

  result.addEndAnimation = function (cell) {
    var
      animation = hidato.createEndAnimation(cell);

    result.backgroundAnimations.push(animation);

    return animation;
  };

  result.addSegmentAnimation = function (cell1, cell2) {
    var
      animation = hidato.createActiveSegmentAnimation(cell1, cell2);

    result.backgroundAnimations.push(animation);

    return animation;
  };

  result.addSelectAnimation = function (cell) {
    var
      animation = hidato.createSelectAnimation(cell);

    result.foregroundAnimations.push(animation);

    return animation;
  };

  result.clear = function () {
    result.backgroundAnimations = [];
    result.foregroundAnimations = [];
  };

  result.drawForegroundAnimations = function (coordCellConverter, time) {
    drawAnimations(result.foregroundAnimations, coordCellConverter, time);
  };

  result.drawBackgroundAnimations = function (coordCellConverter, time) {
    drawAnimations(result.backgroundAnimations, coordCellConverter, time);
  };

  return result;
}());
