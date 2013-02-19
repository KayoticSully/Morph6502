//===================================
// app.js
//-----------------------------------
// Initializes page and loads main
// functions
//-----------------------------------
// Author: Ryan Sullivan
// Created: 2/16/2013
// Updated: 2/19/2013
//===================================

var api,
    lexer;

$(document).ready(init);

/**
 * @name init
 * 
 * @description initializes Morph6502
 */
function init() {
    api = impress();
    api.init();
    setupKeyboardEvents();
    
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
}

/**
 * @name setupKeyboardEvents
 * 
 * @description Enables all special keyboard events that the interface requires
 */
function setupKeyboardEvents() {
    $('#input').on('keydown', specialKeys);
}

/**
 * @name specialKeys
 *
 * @description Handles keyboard events
 */
function specialKeys(event) {
    const TABKEY = 9;
    
    if(event.keyCode == TABKEY) {
        event.preventDefault();
        this.value += "  ";
    }
}