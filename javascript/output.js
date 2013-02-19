//===================================
// output.js
//-----------------------------------
// Helper functions to display output
// to the web interface
//-----------------------------------
// Author: Ryan Sullivan
// Created: 2/19/2013
// Updated: 2/19/2013
//===================================

/**
 * @name displayOutput
 */
function displayOutput() {
    $('#productions').addClass('hidden');
    $('#output, #clearOutput').removeClass('hidden');
}

/**
 * @name clearOutput
 * 
 * @description Completely clears output and shows productions pane
 */
function clearOutput() {
    $('#productions').removeClass('hidden');
    $('#output, #clearOutput').addClass('hidden');
    $('.lineselect').removeClass('lineselect');
}

/**
 * @name resetOutput
 * 
 * @description Only clears output pane and line highlighting
 */
function resetOutput() {
    // reset line highlighting and output pane
    $('.lineselect').removeClass('lineselect');
    $('#output').html('');
}

/**
 * @name log
 * @param {String} line A line to add to output list
 * @param {String} type Classes to add to output list item
 *
 * @description Controls compiler output
 */
function log(line, type) {
    
    if(type === undefined) type = '';
    
    var str =   '<li class="' + type + '">' +
                    line +
                '</li>';
    $('#output').append(str);
}

/**
 * @name displayTokenErrors
 * @param {Object} tokenErrors An object with line numbers for keys and the number of errors on that line as values
 *
 * @description Handles the display of errors found during Lexing
 */
function displayTokenErrors(tokenErrors) {
    for(lineNumber in tokenErrors) {
        var errors = tokenErrors[lineNumber];
        var amountModifier = 's';
        var preposition = 'are';
        
        if(errors == 1) {
            amountModifier = ' ';
            preposition = 'is ';
        }
        
        var str =   'There ' + preposition + ' ' +
                    errors + ' unknown character' + amountModifier +
                    ' on line ' + lineNumber;
        
        log(str, 'error');
        
        var index = parseInt(lineNumber) - 1
        $('.codelines .lineno:eq(' + index + ')').addClass('lineselect');
    }
    
    displayOutput();
}