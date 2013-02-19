//===================================
// compile.js
//-----------------------------------
// Controls flow of compilation.
// 1. Cleans up input
// 2. Lexer
//-----------------------------------
// Author: Ryan Sullivan
// Created: 2/19/2013
// Updated: 2/19/2013
//===================================

/**
 * @name compile
 *
 * @description Controls the flow of compilation
 */
function compile() {
    //----------------------
    // Setup
    //----------------------
    resetOutput();
    
    // First we need to get the input from the textarea
    var input   = document.getElementById('input');
    var source  = trim(input.value);
    
    // stop if there was no input
    if(source == '') {
        log('There was no input to compile.', 'error');
        displayOutput();
        return false;
    }
    
    //----------------------
    // Lexer
    //----------------------
    log('Lexer:');
    var lexerReults = lexer(source);
    var tokenStream = lexerReults.tokens;
    var tokenErrors = lexerReults.errors;
    
    if(tokenErrors.length > 0)
    {
        displayTokenErrors(tokenErrors);
        return false;
    }
    
    // print out token stream to console
    for(token in tokenStream) {
        console.log(tokenStream[token]);
    }
    
    displayOutput();
    
    return true;
}