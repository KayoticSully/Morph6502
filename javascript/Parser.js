/**
 * @file Houses the Parser class
 * @author Ryan Sullivan
 * @version 20130223
 */

/**
 * Parses a token stream.
 * 
 * @class
 */
var Parser = function() {
    
    /** The token stream from the Lexer **/
    var tokenStream;
    
    /**
     * Traverses the source code input to verify and build a token stream.
     * 
     * @param {Array} tokens Token Stream from Lex
     */
    this.parse = function(tokens) {
        tokenStream = tokens;
        
        while(consume()) {
            parseCharacter();
        }
    }
    
    /**
     * Checks for the Character production
     */
    function parseCharacter() {
        if(checkToken(T_CHARACTER)) {
            return true;
        } else {
            console.log('ERROR');
            return false;
        }
    }
    
    /**
     * Checks the next token against a series of types
     * 
     * @param {String} type Type of token to match
     * @returns {Boolean} true if token type is matched false otherwise
     */
    function checkToken(type) {
        // consume token
        console.log(tokenStream);
        var token = tokenStream[0];
        console.log(token);
        if(token.type === type) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Consumes a token in the {@link tokenStream}
     *
     * @returns {Boolean} False if the tokenStream is empty otherwise true.
     */
    function consume() {
        // make sure there is more 
        if(tokenStream.length > 1) {
            tokenStream.splice(0, 1);
            return true;
        }
        
        return false;
    }
}