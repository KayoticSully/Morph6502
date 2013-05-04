/**
 * @file Handles Code Generation
 * @author Ryan Sullivan
 * @version 20130503
 */

/**
 * Handles code generation
 * 
 * @class
 */
function CodeGen() {
    var jumpTable = [];
    var currentScope = null;
    
    var generators = new Generators6502(this);
    
    this.generate = function(symbolTable, AST) {
        currentScope = symbolTable.root;
        return this.generateBlock(AST.root);
    }
    
    this.generateBlock = function(blockNode) {
        currentScope = blockNode.scope;
        var children = blockNode.children;
        var code = '';
        
        for (var child in children) {
            var node = children[child];
            // Note: T_BRACE_OPEN == Block Node
            if (node.getType() == T_BRACE_OPEN) {
                code += this.generateBlock(node);
            } else {
                code += this.generateNode(node);
            }
        }
        
        return code;
    }
    
    this.generateNode = function(node) {
        var nodeType = node.getType();
        
        // Run specific generator for the node or return nothing
        if (nodeType in generators) {
            return generators[nodeType](node.children);
        } else {
            return '';
        }
    }
    
    this.allocate = function() {
        var tempId = 'T0 XX';
        var tableLength = pointerTable.length;
        
        // update tempId to next id
        if (tableLength > 0) {
            tempId = nextTemp(pointerTable[tableLength - 1].id);
        }
        
        // build pointer
        pointerData = { id : tempId, len : 1 };
        pointerTable.push(pointerData);
        
        return tempId;
    }
    
    this.translateId = function(id) {
        var id = 
    }
    
    function nextTemp(lastVal) {
        var hexNum = lastVal.replace(/[X, T]/g, '');
        var decNum = parseInt(hexNum, 16);
        
        decNum++;
        
        var newHex = decNum.toString(16).toUpperCase();
        
        if (newHex.length == 1) {
            newHex += 'X';
        }
        
        newHex = 'T' + newHex.substring(0, 1) + ' ' + newHex.substring(1) + 'X';
        
        return newHex;
    }
}