/* Flot plugin for stacking bars (mix of positive and negative).

Copyright (c) 2007-2012 IOLA and Ole Laursen.
Licensed under the MIT license.

Based on the jquery.flot.stack plugin and stackpercent plugin by skeleton9

Modified by ericliao 2013-1-29 to support stacking of positive and negative values

IMPORTANT: Only tested to work properly with bar charts, for other chart types
           please use the official stacking plugin.

*/

(function ($) {
    var options = {
        series: { stack_neg: null } // or number/string
    };

    function init(plot) {

        var stackBases_pos = {};
        var stackBases_neg = {};

        function stackData(plot, s, datapoints) {
            var i;
            var allseries = plot.getData();

            var all_bars = true;
            for (i = 0; i < allseries.length; i++) {
                if (!allseries[i].bars.show && (allseries[i].lines && allseries[i].lines.show)) {
                  if(allseries[i].stack_neg) {
                    all_bars = false;
                    break;
                  }
                }
            }
            if (s.stack_neg == null || !all_bars || !s.bars.show)
                return;
            var newPoints = [];
            horizontal = s.bars.horizontal;
            keyOffset = horizontal ? 1 : 0;
            accumulateOffset = horizontal ? 0 : 1;
            for (i = 0; i < datapoints.points.length; i += datapoints.pointsize) {
                if (!stackBases_pos[datapoints.points[i+keyOffset]]) {
                    stackBases_pos[datapoints.points[i+keyOffset]] = 0;
                }
                if (!stackBases_neg[datapoints.points[i+keyOffset]]) {
                    stackBases_neg[datapoints.points[i+keyOffset]] = 0;
                }

                newPoints[i+keyOffset] = datapoints.points[i+keyOffset];
                if (datapoints.points[i + accumulateOffset] > 0) {
                    newPoints[i + accumulateOffset] = datapoints.points[i + accumulateOffset] + stackBases_pos[datapoints.points[i+keyOffset]];
                    newPoints[i + 2] = stackBases_pos[datapoints.points[i+keyOffset]];
                    stackBases_pos[datapoints.points[i+keyOffset]] += datapoints.points[i + accumulateOffset];
                } else {
                    newPoints[i + accumulateOffset] = datapoints.points[i + accumulateOffset] + stackBases_neg[datapoints.points[i+keyOffset]];
                    newPoints[i + 2] = stackBases_neg[datapoints.points[i+keyOffset]];
                    stackBases_neg[datapoints.points[i+keyOffset]] += datapoints.points[i + accumulateOffset];
                }
            }
            datapoints.points = newPoints;
        }
        plot.hooks.processDatapoints.push(stackData);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stackbars',
        version: '1.0'
    });
})(jQuery);
