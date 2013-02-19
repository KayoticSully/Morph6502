//===================================
// Lexer.js
//-----------------------------------
// Parses code source into a token
// stream.
//-----------------------------------
// Author: Ryan Sullivan
// Created: 2/16/2013
// Updated: 2/19/2013
//===================================

//----------------------------
// Lexer is a full closure to
// encapulate the Lexer's
// inner workings
//----------------------------
var Lexer = function() {
    
    var currentLine = 1;
    var errors = new Array();
    
    /**
    * @name Lexer
    * @param {String} source The source code to convert into tokens
    * @returns {Array} An array of tokens
    * 
    * @description Traverses the source code input to verify and build a token stream.
    */
    function Lexer(src) {
        // We can assume that the src input is already cleaned
        
        // make sure values are reset
        currentLine = 1;
        errors = new Array();
        
        // start processing source
        var results = {
            tokens : process(src),
            errors : errors
        }
        
        // check for errors
        return results;
    }
    
    /**
     * @name process
     * @param {String} src Source code to process.
     * @returns {Array} Stream of tokens found in source
     *
     * @description Each recursive itteration will have one less token removed from the front of the source.
     */
    function process(src) {
        // get next token info
        var tokenType   = checkToken(src);
        var length      = getTokenLength(tokenType);
        
        // string minus found token or error
        var progress    = src.substr(length); 
        
        // create new token up here
        // so it can be used throughout
        // the function
        var token       = new Token();
        
        // increment line number at
        // the end of each line
        switch(tokenType) {
            case CT_NEW_LINE:
                currentLine++;
                // return next token to remove this from the token stream
                return process(progress);
            break;
            
            // error
            case null:
                // add error count to the current line
                if(errors[currentLine] == undefined) {
                    errors[currentLine] = 1;
                } else {
                    errors[currentLine]++;
                }
            break;
            
            default:
                token.type = tokenType;
                token.line = currentLine;
                token.value = src.substr(0, length);
            break;
        }
        
        if(src.length > 1) {
            // concat is used here so arrays do not become nested
            return new Array(token).concat(process(progress)); // YAY RECURSION!
        } else {
            return token;
        }
    }
    
    /**
     * @name checkToken
     * @param {String} str A chunk of source code to be tested for a token at the start.
     * @returns {String} A token constant that represents the type of token found.
     *
     * @description Finds a token at the beginning of the source input.
     */
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
    
    /**
     * @name getTokenLength
     * @param {String} tokenType Type of token to find the length of
     * @return {Integer} length of token or 1 if token is not found
     *
     * @description Gets the length of a token.
     */
    function getTokenLength(tokenType) {
        if(tokenType in Tokens) {
            return Tokens[tokenType].length;
        } else {
            return 1;
        }
    }
    
    //----------------------------
    // Return the Lexer so we
    // have full closure
    //----------------------------
    return Lexer;
}