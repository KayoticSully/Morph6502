//===================================
// Lexer.js
//-----------------------------------
// Parses code source into a token
// stream.
//-----------------------------------
// Author: Ryan Sullivan
// Created: 2/16/2013
// Updated: 2/16/2013
//===================================

//----------------------------
// Lexer is a full closure to
// encapulate the Lexer's
// inner workings
//----------------------------
var Lexer = function() {
    /**
    * @name Lexer
    * @param {String} source The source code to convert into tokens
    * @returns {Array} An array of tokens
    */
    function Lexer() {
        // First trim the source
        var src = trim(source);
        
        // Split on New Line so we can track line numbers
        const lines = src.split('\n');
        return lines;
    }

    //----------------------------
    // Helper functions that ONLY
    // Lex is allowed to use
    //----------------------------
    function parseLines() {
        
    }
    
    function parseLine() {
        console.log('line');
    }
    
    //----------------------------
    // Return the Lexer so we
    // have full closure
    //----------------------------
    return Lexer;
}