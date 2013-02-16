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
    function Lexer(source) {
        // First trim the source
        var src = trim(source);
        
        // Split on New Line so we can track line numbers
        const lines = src.split('\n');
        return lexLines(lines);
    }

    //----------------------------
    // Helper functions that ONLY
    // Lex is allowed to use
    //----------------------------
    /**
     * @name lexLines
     * @param {Array} lines All of the lines from the source code
     * @returns {Array} Token stream
     */
    function lexLines(lines) {
        var tokenStream = new Array();
        
        for(index in lines) {
            var lineTokens = lexLine(lines[index]);
            tokenStream = tokenStream.concat(lineTokens);
        }
        
        return tokenStream;
    }
    
    /**
     * @name lexLine
     * @param {String} line A single like from the source code
     */
    function lexLine(line) {
    }
    
    //----------------------------
    // Return the Lexer so we
    // have full closure
    //----------------------------
    return Lexer;
}