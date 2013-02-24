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
    
    //-----------------------
    // Productions
    //-----------------------
    
    /**
     * Checks for the Program production
     */
    function parseProgram() {
        
    }
    
    /**
     * Checks for the Statement production
     */
    function parseStatement() {
        
    }
    
    /**
     * Checks for the StatementList production
     */
    function parseStatementList() {
        
    }
    
    /**
     * Checks for the Expr production
     */
    function parseExpr() {
        
    }
    
    /**
     * Checks for the IntExpr production
     */
    function parseIntExpr() {
        
    }
    
    /**
     * Checks for the CharExpr production
     */
    function parseCharExpr() {
        if(!parseQuote()) {
            return false;
        }
        
        if(!parseCharList()) {
            return false;
        }
        
        if(!parseQuote()) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Checks for the Quote sub-production
     */
    function parseQuote() {
        if(checkToken(T_QUOTE)) {
            return true;
        } else {
            expectedError(T_QUOTE);
            return false;
        }
    }
    
    /**
     * Checks for the CharList production
     */
    function parseCharList() {
        
    }
    
    /**
     * Checks for the VarDecl production
     */
    function parseVarDecl() {
        
    }
    
    /**
     * Checks for the Type production
     */
    function parseType() {
        if(checkToken(T_INT) || checkToken(T_CHAR)) {
            return true;
        } else {
            expectedError(T_INT + " | " + T_CHAR);
            return false;
        }
    }
    
    /**
     * Checks for the Id production
     */
    function parseId() {
        return parseCharacter();
    }
    
    /**
     * Checks for the Character production
     */
    function parseCharacter() {
        if(checkToken(T_CHARACTER)) {
            return true;
        } else {
            expectedError(T_CHARACTER);
            return false;
        }
    }
    
    /**
     * Checks for the Digit production
     */
    function parseDigit() {
        if(checkToken(T_DIGIT)) {
            return true;
        } else {
            expectedError(T_DIGIT);
            return false;
        }
    }
    
    /**
     * Checks for the Op production
     */
    function parseOp() {
        if(checkToken(T_PLUS) || checkToken(T_MINUS)) {
            return true;
        } else {
            expectedError(T_PLUS + " | " + T_MINUS);
            return false;
        }
    }
    
    //-----------------------
    // Helpers
    //-----------------------
    /**
     * Checks the next token against a series of types
     * 
     * @param {String} type Type of token to match
     * @returns {Boolean} true if token type is matched false otherwise
     */
    function checkToken(type) {
        // consume token
        if(tokenType() === type) {
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
    
    /**
     * Get the type of the current token
     *
     * @returns {String} token constant
     */
    function tokenType() {
        var token = tokenStream[0];
        return token.type;
    }
    
    /**
     * Get the line number of the current token
     *
     * @returns {Integer} line number
     */
    function tokenLine() {
        var token = tokenStream[0];
        return token.line;
    }
    
    /**
     * Logs an error of the format "Expected x, found y"
     *
     * @param {String} expected The expected token type
     */
    function expectedError(expected) {
        log(tokenLine() + " : Expected " + T_CHARACTER + ", found " + tokenType(), 'error');
        nextLine();
    }
    
    function nextLine() {
        var thisLine = tokenLine();
        while(thisLine == tokenLine()) {
            console.log(thisLine + " == " + tokenLine());
            consume();
        }
    }
}