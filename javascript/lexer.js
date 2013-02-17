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
    
    var currentLine = 1;
    
    /**
    * @name Lexer
    * @param {String} source The source code to convert into tokens
    * @returns {Array} An array of tokens
    */
    function Lexer(source) {
        // First trim the source
        var src = trim(source);
        // start processing source
        var tokens = process(src);
        // check for errors
        return tokens;
    }
    
    function process(src) {
        // get next token info
        var token = checkToken(src);
        var length = 1;
        
        // increment line number at
        // the end of each line
        if(token === CT_NEW_LINE) {
            currentLine++;
        }
        // if an error was encountered
        else if(token == null) {
            console.log(currentLine + " : " + "Unknown token encountered");
        }
        // must be identified token
        else
        {
            length = Tokens[token].length;
        }
        
        
        if(src.length > 1) {
            return new Array(token).concat(process(src.substr(length))); // YAY RECURSION!
        } else {
            return token;// return token
        }
    }
    
    function checkToken(str) {
        // for each possible token
        for(token in Tokens) {
            // test to see if the next token is this one
            var pattern = Tokens[token].pattern;
            
            if(pattern.test(str)) {
                return token;
            }
        }
        
        // no supported token was found
        return null;
    }
    
    //----------------------------
    // Return the Lexer so we
    // have full closure
    //----------------------------
    return Lexer;
}