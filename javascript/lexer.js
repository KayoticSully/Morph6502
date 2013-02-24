/**
 * @file Houses the Lexer class
 * @author Ryan Sullivan
 * @version 20130219
 */

/**
 * Converts source code into a token
 * stream.
 *
 * @class
 */
var Lexer = function() {
    
    var currentLine = 1;
    var errors = new Array();
    
    /**
     * Traverses the source code input to verify and build a token stream.
     * 
     * @param {String} source The source code to convert into tokens
     * @returns {Array} An array of tokens
     */
    this.lex = function(src) {
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
     * Each recursive itteration will have one less token removed from the front of the source.
     *
     * @param {String} src Source code to process.
     * @returns {Array} Stream of tokens found in source.
     */
    function process(src) {
        // get next token info
        var tokenType   = findToken(src);
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
     * Finds a token at the beginning of the source input.
     * 
     * @param {String} str A chunk of source code to be tested for a token at the start.
     * @returns {String} A token constant that represents the type of token found.
     */
    function findToken(str) {
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
     * Gets the length of a token.
     * 
     * @param {String} tokenType Type of token to find the length of
     * @return {Integer} length of token or 1 if token is not found
     */
    function getTokenLength(tokenType) {
        if(tokenType in Tokens) {
            return Tokens[tokenType].length;
        } else {
            return 1;
        }
    }
}