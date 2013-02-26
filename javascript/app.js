/**
 * @file Initializes page and loads main functions
 * @author Ryan Sullivan
 * @version 20130226
 */

/** @global */
var api,
    lexer,
    parser,
    logLevel;

$(document).ready(init);

/**
 * initializes Morph6502
 */
function init() {
    api = impress();
    api.init();
    setupKeyboardEvents();
    logLevel = 'normal';
    
    // Start animations while everything loads in
    if(window.location.hash == '' || window.location.hash == '#/step-1')
    {
        setTimeout(api.next, 500);
        
        setTimeout(function(){
            api.next();
        }, 2500);
    }
    
    // Format code input box
    $(".lined").linedtextarea();
    
    // Load Lexer
    lexer = new Lexer();
    parser = new Parser();
}

/**
 * Enables all special keyboard events that the interface requires
 */
function setupKeyboardEvents() {
    $('#input').on('keydown', specialKeys);
}

/**
 * Handles keyboard events
 */
function specialKeys(event) {
    const TABKEY = 9;
    
    if(event.keyCode == TABKEY) {
        event.preventDefault();
        this.value += "    ";
    }
}

/**
 * Toggles verbose mode
 */
function setVerbose(event) {
    if(event.checked) {
        logLevel = 'verbose';
    } else {
        logLevel = 'normal';
    }
}