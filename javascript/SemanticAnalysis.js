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
    
    this.analyze = function(symbolTable, AST) {
        // First Pass: warn if variables uninitialized, unused or both
        checkVariables(symbolTable);
        
        // Second Pass: Type Check
        checkTypes(symbolTable, AST);
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
        
        function checkNode(node) {
            switch (node.token.type) {
                // block
                case T_BRACE_OPEN:
                break;
                
                // assignment
                case T_EQUALS:
                    // variable
                    var leftHand    = node.children[0];
                    var rightHand   = node.children[1];
                    
                break;
                
                // operation
                case T_PLUS:
                case T_MINUS:
                break;
            }
        }
        
        function checkAssignment(node) {
            //code
        }
        
        function checkOperation(node) {
            //code
        }
    }
}