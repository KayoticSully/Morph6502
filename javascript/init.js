//===================================
// Init.js
//-----------------------------------
// Initializes page and loads main
// functions
//-----------------------------------
// Author: Ryan Sullivan
// Created: 2/16/2013
// Updated: 2/16/2013
//===================================

var api,
    lexer;

$(document).ready(function(){
    api = impress();
    api.init();
    
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
});

function compile() {
    // First we need to get the input from the textarea
    var input   = document.getElementById('input');
    var source  = input.value;
    
    
    //var lexer = new Lexer();
    var lexed = lexer(source);
    
    alert(JSON.stringify(lexed));
}