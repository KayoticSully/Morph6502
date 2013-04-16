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
var SemanticAnalysis = function() {
    
    var errors;
    
    this.analyze = function(symbolTable, AST) {
        
        errors = new Array();
        
        log('-----------------------');
        log('Semantic Analysis Start', 'info');
        log('-----------------------');
        
        // First Pass: warn if variables uninitialized, unused or both
        checkVariables(symbolTable);
        
        // Second Pass: Type Check
        checkTypes(symbolTable, AST);
    }
    
    /**
     * Returns errors found during parsing
     * @returns {Array} Errors
     */
    this.getErrors = function() {
        return errors;
    }
    
    function checkVariables(symbolTable) {
        checkScope(symbolTable.root);
        
        function checkScope(scope) {
            // check every symbol
            for (var symbolIndex in scope.symbols) {
                checkSymbol(scope.symbols[symbolIndex]);
            }
            
            // get all subscopes
            for (var scopeIndex in scope.subScopes) {
                checkScope(scope.subScopes[scopeIndex]);
            }
        }
        
        function checkSymbol(symbol) {
            if (!symbol.initialized) {
                log("Warning: uninitialized symbol " + symbol.id + " on line " + symbol.line, "warning");
            }
            
            if (!symbol.used) {
                log("Warning: unused symbol " + symbol.id + " on line " + symbol.line, "warning");
            }
        }
    }
    
    function checkTypes(symbolTable, AST) {
        
        var scope = symbolTable.root;
        checkNode(AST.root);
        
        function checkNode(node) {
            if (node.token === null) {
                return;
            }
            
            switch (node.token.type) {
                // block
                case T_BRACE_OPEN:
                    // enter scope
                    scope = node.scope;
                    // check children
                    for (var child in node.children) {
                        checkNode(node.children[child]);
                    }
                    
                    // pop back a scope
                    scope = scope.parent;
                break;
                
                // print!
                case T_PRINT:
                    checkType(node.children[0]);
                break;
                
                // assignment
                case T_EQUALS:
                // operation
                case T_PLUS:
                case T_MINUS:
                    checkType(node);
                break;
            }
        }
        
        function checkType(node){
            if(node.children.length == 0) {
                // last node in expression!
                return getType(node);
            } else {
                // get leftHand type
                var leftHand = node.children[0];
                var leftType = getType(leftHand);
                
                // get rightHand
                var rightHand = node.children[1];
                var rightType = checkType(rightHand);
                
                if (rightType === false) {
                    return false;
                } else if (leftType === rightType) {
                    return leftType;
                } else {
                    // type mis-match!
                    // print error!
                    var line = node.token.line;
                    var msg = line + ' : ' + 'Type mis-match. ' +
                             'Expected ' + Tokens[leftType].name + ' found ' + Tokens[rightType].name;
                    
                    if (errors[line] == undefined) {
                        errors[line] = new Array();
                    }
                    
                    errors[line].push(msg);
                    
                    log(msg, 'error');
                    return false;
                }
            }
        }
        
        function getType(node) {
            switch (node.token.type) {
                case T_DIGIT:
                    return T_INT;
                break;
                
                case T_CHARACTER:
                    var id = node.name;
                    var symbol = scope.getSymbol(id, true);
                    return symbol.type;
                break;
                
                case T_QUOTE:
                    return T_STRING;
                break;
            }
            
            return false;
        }
    }
}