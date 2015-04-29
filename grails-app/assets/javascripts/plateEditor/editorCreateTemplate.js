/*jslint browser: true*/
/*global $, jQuery, alert*/

// constants
var DIMENSION = 100;
var GRID_HEIGHT = 100;
var GRID_WIDTH = 100;
var CELL_HEIGHT = 25;
var CELL_WIDTH = 40;
var plateModel = {};
var wellGroupings = [];
var grid;
var currentHighlightKeys = [];
var highlightKeyCounter = 0;
var currentHighlightColor = "#D5E3E3";
var highlightedCoords = [];

/**
 * A function that creates a blank data set for initializing the grid example
 * page. The data set is of dimension DIMENSION x DIMENSION.
 */
function createBlankData() {
	"use strict";
	var i, j, result;
	result = [];

	for (i = 0; i < GRID_HEIGHT; i++) {
		result[i] = [];
		for (j = 0; j < GRID_WIDTH; j++) {
			result[i][j] = null;
		}
	}
	return result;
}

/**
 * A function that creates a random data set for displaying in the grid example
 * page. The data set is of dimension DIMENSION x DIMENSION.
 */
function createRandomData() {
	"use strict";
	var i, j, result;
	result = [];

	for (i = 0; i < GRID_HEIGHT; i++) {
		result[i] = [];
		for (j = 0; j < GRID_WIDTH; j++) {
			result[i][j] = "L" + Math.floor(Math.random() * 100);
		}
	}
	return result;
}

function txtFieldFocus() {
	"use strict";
	$("#newLabelValue").focus();
}

/**
 * A handler function for when the selected cells in the grid changes. This
 * function is registered to listen for these events in the createGrid
 * function using the registerSelectedCellsCallBack function of the Grid
 * Class. This function changes the background color of all selected cells
 * to the currentHighlightColor.
 */
function handleSelectedCells(startRow, startCol, endRow, endCol) {
	"use strict";
	var out, i, j, key, coordinatesToHighlight;
	// write to the selected cells div, the cells that are selected
	out = document.getElementById("cellRange");
	out.innerHTML = Grid.getRowLabel(startRow) + startCol + ":" + Grid.getRowLabel(endRow) + endCol;


	// highlight those cells with the current color
	coordinatesToHighlight = [];
	for (i = startRow; i <= endRow; i++) {
		for (j = startCol; j <= endCol; j++) {
			coordinatesToHighlight.push([i, j]);
			// set global record of highlights
			highlightedCoords.push([i, j]);
		}
	}
	key = "key" + highlightKeyCounter;
	grid.setCellColors(coordinatesToHighlight, currentHighlightColor, key);
	currentHighlightKeys.push(key);
	highlightKeyCounter++;
	txtFieldFocus();
}

/**
 * This function handles the event that the removeHighlighting button is
 * clicked by removing the most recent cell background color change. This
 * is achieved by calling the removeCellColors method of the Grid class with
 * the most key used to create the most recent background color change as
 * stored in the currentHighlightKeys array.
 */
function removeHighlightedArea() {
	"use strict";
	if (currentHighlightKeys.length > 0) {
		grid.removeCellColors(currentHighlightKeys.pop());

		// need to decrement highlightedCoords here !! 
		//(not the same number of items removed !!!)
		highlightedCoords.pop();	// need to fix !!
	}
}

/**
 * This function handles the event that the removeHighlighting button is
 * clicked by removing the most recent cell background color change. This
 * is achieved by calling the removeCellColors method of the Grid class with
 * the most key used to create the most recent background color change as
 * stored in the currentHighlightKeys array.
 */
function removeAllHighlightedCells() {
	"use strict";
	while (currentHighlightKeys.length > 0) {
		grid.removeCellColors(currentHighlightKeys.pop());
	}
	// removing all selected cells, so global count disappears
	highlightedCoords = [];
}

/**
 * This function creates a new grid applying it to the "myGrid" div on the
 * page. It then creates a blank data set and displays it in the grid.
 * It also registers the handleSelectedCells function as a listener for
 * the event that user selected cell ranges in the grid change.
 */
function createGrid() {
	"use strict";
	// construct the Grid object with the id of the html container element
	// where it should be placed (probably a div) as an argument
	grid  = new Grid("myGrid");

	// set the data to be displayed which must be in 2D array form
	grid.setData(createBlankData());

	// display the data
	grid.fillUpGrid(CELL_WIDTH, CELL_HEIGHT);

	// register a function to be called each time a new set of cells are
	// selected by a user
	grid.registerSelectedCellCallBack(handleSelectedCells);

}

function enableGridSelection() {
	"use strict";
	removeAllHighlightedCells();
	grid.enableCellSelection();
}

function disableGridSelection() {
	"use strict";
	removeAllHighlightedCells();
	grid.disableCellSelection();
}

/**
 * This function changes the style of a particular cell
 */
function addTemplateValue() {
	"use strict";
	var selCells, cellValue, cell, row, column, wgs;
	selCells = highlightedCoords;
	// console.log(selCells);
	cellValue = document.getElementById("newLabelValue").value;

	// just keeping list of well values
	if (wellGroupings.indexOf(cellValue) === -1) {
		wellGroupings.push(cellValue);
	}

	// update selected grid cells with label
	for (cell in selCells) {
		if (selCells.hasOwnProperty(cell)) {
			row = selCells[cell][0];
			column = selCells[cell][1];

			if (plateModel.rows === undefined) {
				plateModel.rows = {};
			}

			if (plateModel.rows[row] === undefined) {
				plateModel.rows[row] = {};
			}

			if (plateModel.rows[row].columns === undefined) {
				plateModel.rows[row].columns = {};
			}

			if (plateModel.rows[row].columns[column] === undefined) {
				plateModel.rows[row].columns[column] = {};
				plateModel.rows[row].columns[column].wellGroupName = cellValue;
			}

			grid.updateCellContents(row, column, cellValue);
		}
	}

	console.log("plateModel1:" + JSON.stringify(plateModel));

	wgs = document.getElementById("wellGroupSpan");
	wgs.innerHTML = wellGroupings;

	// clear current selection
	removeAllHighlightedCells();
}



/**
 * addEvent - This function adds an event handler to an html element in
 * a way that covers many browser types.
 * @param elementId - the string id of the element to attach the handler to
 * or a reference to the element itself.
 * @param eventType - a string representation of the event to be handled
 * without the "on" prefix
 * @param handlerFunction - the function to handle the event
 */
function addEvent(elementId, eventType, handlerFunction) {
	'use strict';
	var element;

	if (typeof elementId === "string") {
		element = document.getElementById(elementId);
	} else {
		element = elementId;
	}

	if (element.addEventListener) {
		element.addEventListener(eventType, handlerFunction, false);
	} else if (window.attachEvent) {
		element.attachEvent("on" + eventType, handlerFunction);
	}
} // end of function addEvent

//data format translation
function translateModelToOutputJson(pModel) {
	'use strict';
	var plateJson, plate, row, column, well, labels, catKey, labKey, label;
	plateJson = {};
	plate = {};
	plate.name = window.tName;			// should do null check ???
	plate.width = GRID_WIDTH;
	plate.height = GRID_HEIGHT;

	plate.experimentID = window.expId;
	plate.labels = [];		// plate level labels, should set these if available already !!!
	plate.wells = [];
	for (row in pModel.rows) {
		if (pModel.rows.hasOwnProperty(row)) {
			for (column in pModel.rows[row].columns) {
				well = {};
				well.row = row;
				well.column = column;
				well.control = null;
				labels = [];
				for (catKey in pModel.rows[row].columns[column].categories) {
					for (labKey in pModel.rows[row].columns[column].categories[catKey]) {
						label = {};
						label.category = catKey;
						label.name = labKey;
						label.color = pModel.rows[row].columns[column].categories[catKey][labKey];
						labels.push(label);
					}
				}
				well.labels = labels;
				well.groupName = pModel.rows[row].columns[column].wellGroupName;
				plate.wells.push(well);
			}
		}
	}
	plateJson.plate = plate;
	return plateJson;
}

// data format translation
function translateInputJsonToModel(plateJson) {
	"use strict";
	var pModel, plate, i, j, row, column, groupName, labels;
	pModel = {};
	pModel.rows = {};
	plate = plateJson.plate;

	for (i = 0; i < plate.wells.length; i++) {
		row = plate.wells[i].row;
		column = plate.wells[i].column;
		groupName = plate.wells[i].groupName;
		labels = plate.wells[i].labels;

		if (pModel.rows[row] === undefined) {
			pModel.rows[row] = {};
			pModel.rows[row].columns = {};
		}

		if (pModel.rows[row].columns[column] === undefined) {
			pModel.rows[row].columns[column] = {};
			pModel.rows[row].columns[column].wellGroupName = groupName;
			pModel.rows[row].columns[column].categories = {};
		}

		for (j = 0; j < labels.length; j++) {
			if (pModel.rows[row].columns[column].categories[labels[j].category] === undefined) {
				pModel.rows[row].columns[column].categories[labels[j].category] = {};
			}
			pModel.rows[row].columns[column].categories[labels[j].category][labels[j].name] = labels[j].color;
		}
	}

	return pModel;
}

// ajax save object call
function saveConfigToServer() {
	"use strict";
	var plateJson, jqxhr;
	plateJson = translateModelToOutputJson(plateModel);
	console.log("SendingToServer:" + JSON.stringify(plateJson));

	jqxhr = $.ajax({
		url: hostname + "/plateTemplate/save",
		type: "POST",
		data: JSON.stringify(plateJson),
		processData: false,
		contentType: "application/json; charset=UTF-8"
	}).done(function() {
		console.log("success");
	}).fail(function() {
		console.log("error");
	}).always(function() {
		console.log("complete");
	});

	// Set another completion function for the request above
	jqxhr.always(function(resData) {
		var storedTemplate = JSON.stringify(resData);
		console.log("second complete");
		console.log("result=" + storedTemplate);		// should parse for id
		console.log("storedTemplate['plateTemplate']=" + resData.plateTemplate);
		console.log("storedTemplate['plateTemplate']['id']=" + resData.plateTemplate.id);

		if (resData.plateTemplate !== undefined &&  resData.plateTemplate.id !== undefined) {
			plateModel.templateID = resData.plateTemplate.id;
			// use less hacky method !!
			if (window.expId !== undefined) {
				// if we're in an experiment, then continue to assignlabels page
				window.location.href = hostname + "/experimentalPlateSet/createPlate" + '?expid=' + window.expId + '&tmpid=' + plateModel.templateID;
			} else {
				// if we're not in an experiment, then return to homepage
				window.location.href = hostname + "/";
			}
		} else {
			alert("An error while saving the template: " + storedTemplate);
		}

	});
}

/**
 * Loads a json plate model and updates the grid and category legend
 */
function loadJsonData(plateJson) {
	"use strict";
	var row, column, newContents;
	plateModel = translateInputJsonToModel(plateJson);

	for (row in plateModel.rows) {
		if (plateModel.rows.hasOwnProperty(row)) {
			for (column in plateModel.rows[row].columns) {
				if (plateModel.rows[row].columns.hasOwnProperty(column)) {
					newContents = plateModel.rows[row].columns[column].wellGroupName;

					grid.updateCellContents(row, column, newContents);
				}
			}
		}
	}
}

/**
 * This function handles the window load event. It initializes and fills the
 * grid with blank data and sets up the event handlers on the
 */
function init() {
	"use strict";
	if (window.tWidth !== undefined) {
		GRID_WIDTH = window.tWidth;
	}

	if (window.tHeight !== undefined) {
		GRID_HEIGHT = window.tHeight;
	}
	createGrid();

	// allows for passing input Json, but it not used here. Perhaps refactor!
	//var testInputJson = {"plate":{"wells":[{"row":"2","column":"2","control":null,"labels":[{"category":"c1","name":"l1","color":"#ffff00"}],"groupName":"L67"},{"row":"2","column":"3","control":null,"labels":[{"category":"c1","name":"l2","color":"#4780b8"}],"groupName":"L5"},{"row":"3","column":"2","control":null,"labels":[{"category":"c1","name":"l1","color":"#ffff00"},{"category":"c2","name":"l3","color":"#8d7278"}],"groupName":"L51"},{"row":"3","column":"3","control":null,"labels":[{"category":"c1","name":"l2","color":"#4780b8"},{"category":"c2","name":"l3","color":"#8d7278"}],"groupName":"L17"},{"row":"4","column":"2","control":null,"labels":[{"category":"c2","name":"l3","color":"#8d7278"}],"groupName":"L2"},{"row":"4","column":"3","control":null,"labels":[{"category":"c2","name":"l3","color":"#8d7278"}],"groupName":"L47"}],"labels":[]}};
	//loadJsonData(testInputJson);

	addEvent("addTemplateValueBtn", "click", addTemplateValue);
	addEvent("clearAllSelection", "click", removeAllHighlightedCells);
	addEvent("saveTemplate", "click", saveConfigToServer);

	// initially disable selection of grid cells
	enableGridSelection();
}

window.onload = init;
