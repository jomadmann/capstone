var d3 = require('d3');

/*
 * Given an importData structure, a plate number, a label category,
 * and the coordinates of the negative and positive controls, this
 * will normalize the values for that label against the controls,
 * returning the results as a 2d array.
 */
exports.normalize = function (importData, plateNum, label,
                              negativeControls, positiveControls) {
    var plate = importData.plates[plateNum];
    var negativeMean = d3.mean(negativeControls.map(function (a) {
        return plate.rows[a[0]].columns[a[1]].labels[label];
    }));
    var positiveMean = d3.mean(positiveControls.map(function (a) {
        return plate.rows[a[0]].columns[a[1]].labels[label];
    }));
    var scale = d3.scale.linear().domain([negativeMean, positiveMean])
	    	    .range([0, 1]);

    var normalized = [];
    for (var i=0; i<plate.rows.length; i++) {
        normalized[i] = []
	for (var j=0; j<plate.rows[i].columns.length; j++) {
            var raw_value = plate.rows[i].columns[j].labels[label];
            normalized[i][j] = scale(raw_value);
        }
    }

    return normalized;
}

