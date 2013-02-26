/**
 * @file Houses the Parser class
 * @author Ryan Sullivan
 * @version 20130225
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
        
        // Kick it off!
        return parseProgram();
    }
    
    //-----------------------
    // Productions
    //-----------------------
    /**
     * Checks for the Program production
     */
    function parseProgram() {
        if(!parseStatement()) return false;
        
        if(tokenStream.length > 0) {
            if(checkToken(T_$)) {
                return true;
            } else {
                return false;
            }
        } else {
            log("Warning: Program did not end with $.  Remember it next time!", 'warning');
        }
        
        return true;
    }
    
    /**
     * Checks for the Statement production
     */
    function parseStatement() {
        // run the proper sub-parse for the current token type
        switch(tokenType()) {
            case T_P:
                return subStatement1();
            break;
            
            case T_CHARACTER:
                return subStatement2();
            break;
            
            case T_INT:
            case T_CHAR:
                return subStatement3();
            break;
            
            case T_BRACE_OPEN:
                return subStatement4();
            break;
            
            default:
                return false;
        }
        
        return false;
    }
    
    function subStatement1() {
        if(checkToken(T_P)) {
            
        } else {
            return false;
        }
        
        if(checkToken(T_PAREN_OPEN)) {
            
        } else {
            return false;
        }
        
        if(!parseExpr()) return false;
        
        if(checkToken(T_PAREN_CLOSE)) {
            
        } else {
            return false;
        }
        
        return true;
    }
    
    function subStatement2() {
        if(!parseId()) return false;
        
        if(checkToken(T_EQUALS)) {
            
        } else {
            return false;
        }
        
        if(!parseExpr()) return false;
        
        return true;
    }
    
    function subStatement3() {
        return parseVarDecl();
    }
    
    function subStatement4() {
        
        if(checkToken(T_BRACE_OPEN)) {
            
        } else {
            return false;
        }
        
        if(!parseStatementList()) return false;
        
        if(checkToken(T_BRACE_CLOSE)) {
            
        } else {
            return false;
        }
        
        return true;
    }
    
    /**
     * Checks for the StatementList production
     */
    function parseStatementList() {
        // See if a statement is possible.  If it is try to parse it,
        // if not return true, since this production can go to epsilon.
        switch(tokenType()) {
            case T_P:
            case T_CHARACTER:
            case T_INT:
            case T_CHAR:
            case T_BRACE_OPEN:
                if(parseStatement()) {
                    return parseStatementList();
                } else {
                    return false;
                }
            break;
            
            default:
                return true;
        }
        
        return true;
    }
    
    /**
     * Checks for the Expr production
     */
    function parseExpr() {
        switch(tokenType()) {
            case T_DIGIT:
                return subExpr1();
            break;
            
            case T_QUOTE:
                return subExpr2();
            break;
            
            case T_CHAR:
                return subExpr3();
            break;
            
            default:
                return false;
        }
        
        return false;
    }
    
    function subExpr1() {
        return parseIntExpr();
    }
    
    function subExpr2() {
        return parseCharExpr();
    }
    
    function subExpr3() {
        return parseId();
    }
    
    /**
     * Checks for the IntExpr production
     */
    function parseIntExpr() {
        var forwardToken = lookAhead(1);
        
        switch(forwardToken) {
            case T_MINUS:
            case T_PLUS:
                return subIntExpr();
            break;
            
            default:
                return parseDigit();
        }
        
        return false;
    }
    
    function subIntExpr() {
        if(!parseDigit()) return false;
        
        if(!parseOp()) return false;
        
        if(!parseExpr()) return false;
        
        return true;
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
            return false;
        }
    }
    
    /**
     * Checks for the CharList production
     */
    function parseCharList() {
        // See if a character is possible.  If it is try to parse it,
        // if not return true, since this production can go to epsilon.
        switch(tokenType()) {
            case T_CHARACTER:
                if(parseCharacter()) {
                    return parseCharList();
                } else {
                    return false;
                }
            break;
            
            default:
                return true;
        }
        
        return true;
    }
    
    /**
     * Checks for the VarDecl production
     */
    function parseVarDecl() {
        if(!parseType()) return false;
        
        if(!parseId()) return false;
        
        return true;
    }
    
    /**
     * Checks for the Type production
     */
    function parseType() {
        if(multiCheckToken([T_INT, T_CHAR])) {
            return true;
        } else {
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
            return false;
        }
    }
    
    /**
     * Checks for the Op production
     */
    function parseOp() {
        if(multiCheckToken([T_PLUS, T_MINUS])) {
            return true;
        } else {
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
     * @param {Boolean} displayError Should function display error on fail? Defaults to true
     * @returns {Boolean} true if token type is matched false otherwise
     */
    function checkToken(type, displayError) {
        if(displayError === undefined) {
            displayError = true;
        }
        
        // see if the token is of the expected type
        var currentTokenType = tokenType();
        if(currentTokenType === type) {
            // only consume the token if the type matches
            if(consume()) {
                // only return true if the token was consumed
                return true;
            } else {
                return false;
            }
        } else if(displayError) {
            expectedError(type);
            return false;
        }
        
        // if all else fails something went very wrong
        return false
    }
    
    /**
     * Checks the next token against a series of types
     * 
     * @param {Array} types Array of types to match
     * @returns {Boolean} true if token matches any of the types false otherwise
     */
    function multiCheckToken(types) {
        for(var index in types) {
            var type = types[index];
            // check token but do not display errors
            if(checkToken(type, false)) {
                return true;
            }
        }
        
        // now display error
        expectedError(types.join("|"));
        
        // no matches
        return false;
    }
    
    /**
     * Consumes a token in the {@link tokenStream}
     *
     * @returns {Boolean} False if the tokenStream is empty otherwise true.
     */
    function consume() {
        
        // make sure there is more
        if(tokenStream.length > 0) {
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
        if(tokenStream.length > 0) {
            var token = tokenStream[0];
            return token.type;
        } else {
            return false;
        }
    }
    
    /**
     * Get the line number of the current token
     *
     * @returns {Integer} line number
     */
    function tokenLine() {
        if(tokenStream.length > 0) {
            var token = tokenStream[0];
            return token.line;
        } else {
            return 'Last Line';
        }
    }
    
    /**
     * Logs an error of the format "Expected x, found y"
     *
     * @param {String} expected The expected token type
     */
    function expectedError(expected) {
        log(tokenLine() + " : Expected " + expected + ", found " + tokenType(), 'error');
        // disregard rest of line
        nextLine();
    }
    
    /**
     * Fast forwards to the next line
     */
    function nextLine() {
        if(tokenStream.length > 0) {
            var thisLine = tokenLine();
            while(thisLine == tokenLine()) {
                consume();
            }
        }
    }
    
    /**
     * Returns the token the number of steps ahead requested
     *
     * @param {Integer} number The number of steps to look ahead
     * @returns {Token} The token asked for
     */
    function lookAhead(number) {
        return tokenStream[number];
    }
}