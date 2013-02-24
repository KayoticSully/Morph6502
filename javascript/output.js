/**
 * @file Helper functions to display output to the web interface
 * @author Ryan Sullivan
 * @version 20130219
 */

/**
 * Displays compiler output pane
 */
function displayOutput() {
    $('#productions').addClass('hidden');
    $('#output, #clearOutput').removeClass('hidden');
}

/**
 * Completely clears output and shows productions pane
 */
function clearOutput() {
    $('#productions').removeClass('hidden');
    $('#output, #clearOutput').addClass('hidden');
    $('.lineselect').removeClass('lineselect');
}

/**
 * Only clears output pane and line highlighting
 */
function resetOutput() {
    // reset line highlighting and output pane
    $('.lineselect').removeClass('lineselect');
    $('#output').html('');
}

/**
 * Controls compiler output
 * 
 * @param {String} line A line to add to output list
 * @param {String} type Classes to add to output list item
 */
function log(line, type) {
    
    if(type === undefined) type = '';
    
    var str =   '<li class="' + type + '">' +
                    line +
                '</li>';
    $('#output').append(str);
}

/**
 * Handles the display of errors found during Lexing
 * 
 * @name displayTokenErrors
 * @param {Object} tokenErrors An object with line numbers for keys and the number of errors on that line as values
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