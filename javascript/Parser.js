/**
 * @file Houses the Parser class
 * @author Ryan Sullivan
 * @version 20130226
 */

/**
 * Parses a token stream.
 * 
 * @class
 */
var Parser = function() {
    
    /** The token stream from the Lexer **/
    var tokenStream;
    var lastToken;
    var errors;
    var symbolTable;
    var AST;
    var stringBuffer;
    
    /**
     * Traverses the source code input to verify and build a token stream.
     * 
     * @param {Array} tokens Token Stream from Lex
     */
    this.parse = function(tokens) {
        // set defaults
        tokenStream = tokens;
        errors = new Array();
        symbolTable = new SymbolTable();
        AST = new Tree();
        stringBuffer = '';
        
        log('------------');
        log('Parser Start', 'info');
        log('------------');
        
        // Kick it off!
        var success = parseProgram();
        
        if(success && tokenStream.length != 0) {
            log("Warning: Content after end of program symbol ($) ignored.", 'warning');
        }
    }
    
    /**
     * Returns errors found during parsing
     * @returns {Array} Errors
     */
    this.getErrors = function() {
        return errors;
    }
    
    /**
     * Returns the Symbol Table build during parsing
     * @returns {Object} Symbol Table
     */
    this.getSymbolTable = function() {
        return symbolTable;
    }
    
    /**
     * Returns the AST Tree
     * @returns {Object} AST Tree
     */
    this.getAST = function() {
        return AST;
    }
    
    //-----------------------
    // Productions
    //-----------------------
    /**
     * Checks for the Program production | Statement $
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
        var type = tokenType();
        // run the proper sub-parse for the current token type
        
        // this may be the first set.... need to compute that.
        var types = new Array(T_PRINT, T_CHARACTER, T_INT, T_STRING, T_BRACE_OPEN, T_BOOLEAN, T_WHILE, T_IF);
        
        if(types.indexOf(type) >= 0 ) {
            switch(type) {
                case T_PRINT:
                    return subStatement1();
                break;
                
                case T_CHARACTER:
                    return subStatement2();
                break;
                
                case T_INT:
                case T_STRING:
                case T_BOOLEAN:
                    return subStatement3();
                break;
                
                case T_BRACE_OPEN:
                    return subStatement4();
                break;
                
                case T_WHILE:
                    return subStatement5();
                break;
                
                case T_IF:
                    return subStatement6();
                break;
            }
        } else {
            expectedError(types.join("|"));
            return false;
        }
        
        return false;
    }
    
    /**
     * Checks for the Statement production P(Expr)
     */
    function subStatement1() {
        AST.addNode('print', 'branch', tokenStream[0]);
        if(checkToken(T_PRINT) && checkToken(T_PAREN_OPEN) && parseExpr() && checkToken(T_PAREN_CLOSE)) {
            AST.endChildren();
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Statement production Id = Expr
     */
    function subStatement2() {
        AST.addNode(Tokens[T_EQUALS].name, 'branch', lookAhead(1));
        if(parseId('initialized') && checkToken(T_EQUALS) && parseExpr()) {
            AST.endChildren();
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Statement production VarDecl
     */
    function subStatement3() {
        return parseVarDecl();
    }
    
    /**
     * Checks for the Statement production {StatementList}
     */
    function subStatement4() {
        AST.addNode('block', 'branch', tokenStream[0]);
        // we expect a new scope to begin
        symbolTable.openScope();
        // link block to scope
        AST.cur.scope = symbolTable.workingScope;
        
        if(checkToken(T_BRACE_OPEN) && parseStatementList() && checkToken(T_BRACE_CLOSE)) {
            // close this scope
            symbolTable.closeScope();
            AST.endChildren();
            return true;
        } else  {
            return false;
        }
    }
    
    /**
     * Checks for the Statement production WhileStatement
     */
    function subStatement5() {
        return parseWhileStatement();
    }
    
    /**
     * Checks for the Statement production IfStatement
     */
    function subStatement6() {
        return parseIfStatement();
    }
    
    /**
     * Checks for the StatementList production | Statement StatementList || Epsilon
     */
    function parseStatementList() {
        // See if a statement is possible.  If it is try to parse it,
        // if not return true, since this production can go to epsilon.
        switch(tokenType()) {
            // expect a symbol in the Statement's First Set to continue
            case T_PRINT:
            case T_CHARACTER:
            case T_INT:
            case T_STRING:
            case T_BRACE_OPEN:
            case T_WHILE:
            case T_IF:
            case T_BOOLEAN:
                // It actually does not matter what this returns.
                // If there is an error, it will be logged and we want to move
                // onto the next line anyway
                parseStatement();
                return parseStatementList();
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
            // Production IntExpr
            case T_DIGIT:
                return parseIntExpr();
            break;
            
            // Production CharExpr
            case T_QUOTE:
                return parseStringExpr();
            break;
            
            // Production Id
            case T_CHARACTER:
                return parseId('used');
            break;
            
            case T_PAREN_OPEN:
            case T_TRUE:
            case T_FALSE:
                return parseBooleanExpr();
            break;
            
            default:
                return false;
        }
        
        return false;
    }
    
    /**
     * Checks for the WhileStatement production
     */
    function parseWhileStatement() {
        
        AST.addNode(Tokens[T_WHILE].name, 'branch', tokenStream[0]);
        
        //     while                BooleanExpr       { StatementList }
        if(checkToken(T_WHILE) && parseBooleanExpr() && subStatement4()) {
            AST.endChildren();
            return true;
        } else  {
            return false;
        }
    }
    
    /**
     * Checks for the IfStatement production
     */
    function parseIfStatement() {
        
        AST.addNode(Tokens[T_IF].name, 'branch', tokenStream[0]);
        
        //     if                BooleanExpr       { StatementList }
        if(checkToken(T_IF) && parseBooleanExpr() && subStatement4()) {
            AST.endChildren();
            return true;
        } else  {
            return false;
        }
    }
    
    /**
     * Checks for the BooleanExpr production
     */
    function parseBooleanExpr() {
        if (tokenType() == T_PAREN_OPEN) {
            return subBooleanExpr1();
        } else {
            AST.addNode(tokenValue(), 'leaf', tokenStream[0]);
            return parseBoolVal();
        }
    }
    
    function subBooleanExpr1() {
        // Kind of cheating.... but necessary
        var token = new Token();
        token.type = T_EQUALITY;
        token.value = '==';
        token.line = tokenLine();
        
        AST.addNode(Tokens[T_EQUALITY].name, 'branch', token);
        
        if(checkToken(T_PAREN_OPEN) && parseExpr() && checkToken(T_EQUALITY) && parseExpr() && checkToken(T_PAREN_CLOSE)) {
            AST.endChildren();
            return true;
        } else  {
            return false;
        }
    }
    
    function parseBoolVal() {
        if(multiCheckToken([T_TRUE, T_FALSE])) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the IntExpr production | digit op Expr || digit
     */
    function parseIntExpr() {
        
        var digit = tokenStream[0];
        // this has to start with a digit
        if(parseDigit()) {
            // see if there is an operation after
            // if not just return true we are done here
            switch(tokenType()) {
                case T_MINUS:
                case T_PLUS:
                    
                    // add the operation and first leaf node here
                    // it just needs to work this way due to the order
                    // of function calls.
                    AST.addNode(tokenValue(), 'branch', tokenStream[0]);
                    AST.addNode(digit.value, 'leaf', digit);
                    
                    // we can assume that subIntExpr will parse properly
                    // since the AST will not be used if it does not.
                    // We just need to delay the return untill after
                    // we can close off the AST branch node
                    var subIntResult = subIntExpr();
                    AST.endChildren();
                    return subIntResult;
                break;
            }
            
            // this is the last statement in an IntExpr
            AST.addNode(digit.value, 'leaf', digit);
            //AST.endChildren();
            
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the sub-production op Expr
     */
    function subIntExpr() {
        if(parseOp() && parseExpr()) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the StringExpr production | "CharList"
     */
    function parseStringExpr() {
        // make sure stringBuffer is empty
        stringBuffer = '';
        var stringStart = tokenStream[0];
        if(parseQuote() && parseCharList() && parseQuote()) {
            // wait until after parseCharList has executed so
            // the string characters can buffer up.
            AST.addNode('"' + stringBuffer + '"', 'leaf', stringStart);
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Quote sub-production | "
     */
    function parseQuote() {
        if(checkToken(T_QUOTE)) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the CharList production | Char CharList || Epsilon
     */
    function parseCharList() {
        // See if a character is possible.  If it is try to parse it,
        // if not return true, since this production can go to epsilon.
        
        // This is ugly, probably bad practice, but it works.
        
        // true is passed into parseCharacter and parseSpace
        // to tell it to add the character
        // to the stringBuffer rather than
        // directly onto the AST
        switch(tokenType()) {
            case T_CHARACTER:
                if(parseCharacter(true)) {
                    return parseCharList();
                } else {
                    return false;
                }
            break;
            
            case T_SPACE:
                if(parseSpace(true)) {
                    return parseCharList();
                } else {
                    return false;
                }
            break;
        }
        
        return true;
    }
    
    /**
     * Checks for the VarDecl production | Type Id
     */
    function parseVarDecl() {
        // preemptively
        var typeToken = tokenStream[0];
        var idToken   = tokenStream[1];
        
        var varDeclToken = new Token();
        varDeclToken.type = ST_DECLARATION;
        varDeclToken.line = typeToken.line;
        
        // token field is a special token here since this does not
        // really have a source code token associated with it
        AST.addNode('VarDecl', 'branch', varDeclToken);
        
        if(parseType() && parseId('declared')) {
            // see if new variable declaration is in the symbol table
            if(! symbolTable.addIdentifier(idToken, typeToken)) {
                var line = idToken.line;
                var error = line + " : Redeclared Identifier " + idToken.value;
                
                if(errors[line] === undefined) {
                    errors[line] = new Array();
                }
                
                // Store error
                errors[line].push(error);
                
                // log error
                log(error, 'error');
            }
            
            AST.endChildren();
            
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Type production | int || char
     */
    function parseType() {
        AST.addNode(tokenStream[0].value, 'leaf', tokenStream[0]);
        
        if(multiCheckToken([T_INT, T_STRING, T_BOOLEAN])) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Id production | Char
     */
    function parseId(action) {
        if (action !== 'declared') {
            var id = tokenValue();
            
            if(! symbolTable.workingScope.hasId(id, true)) {
                var msg = "Undeclared identifier " + id;
                logError(tokenLine(), msg)
                return false;
            }
            
            // set attribues now that we know
            // the id is valid
            switch (action) {
                case 'initialized':
                    symbolTable.workingScope.initializedSymbol(id);
                break;
                
                case 'used':
                    symbolTable.workingScope.usedSymbol(id);
                break;
            }   
        }
        
        return parseCharacter();
    }
    
    /**
     * Checks for the Character production | a || b || c ... z
     */
    function parseCharacter(buffer) {
        if (buffer) {
            stringBuffer += tokenValue();
        } else {
            AST.addNode(tokenValue(), 'leaf', tokenStream[0]);
        }
        
        if(checkToken(T_CHARACTER)) {
            
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Space production 
     */
    function parseSpace(buffer) {
        if (buffer) {
            stringBuffer += tokenValue();
        } else {
            AST.addNode(tokenValue(), 'leaf', tokenStream[0]);
        }
        
        if(checkToken(T_SPACE)) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Digit production | 1 || 2 || 3 ... 9 || 0
     */
    function parseDigit() {
        
        if(checkToken(T_DIGIT)) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Checks for the Op production | + || -
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
        
        // log verbose data
        log("Expecting " + type, 'info', true);
        
        // see if the token is of the expected type
        var currentTokenType = tokenType();
        
        if(currentTokenType === type) {
            // log verbose data
            log("Got " + currentTokenType, 'info', true);
            
            // only consume the token if the type matches
            if(consume()) {
                log("Token Consumed!", 'info', true);
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
        
        // store last token because of an edge case
        lastToken = tokenStream[0];
        
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
        } else if(lastToken !== undefined) {
            return lastToken.line;
        } else {
            return 'Last Line';
        }
    }
    
    /**
     * Get the value of the current token
     *
     * @returns {string} value
     */
    function tokenValue() {
        if(tokenStream.length > 0) {
            var token = tokenStream[0];
            return token.value;
        } else if(lastToken !== undefined) {
            return lastToken.value;
        } else {
            return '';
        }
    }
    
    /**
     * Logs an error of the format "Expected x, found y"
     *
     * @param {String} expected The expected token type
     */
    function expectedError(expected) {
        console.log(expected + " : " + tokenType());
        console.log(Tokens[expected].name);
        // build error info
        var line = tokenLine();
        var error = "Expected " + Tokens[expected].name + ", found " + Tokens[tokenType()].name;
        
        logError(line, error);
    }
    
    /**
     * Stores and logs error in format line : message
     *
     * @param {int} line error is on
     * @param {string} error message
     */
    function logError(line, message) {
        // Make sure there the line is initialized
        if(errors[line] === undefined) {
            errors[line] = new Array();
        }
        
        // format message
        message = line + " : " + message;
        
        // Store error
        // Parser can only detect one error per line so no need for an array here
        errors[line].push(message);
        
        // log error
        log(message, 'error');
        
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