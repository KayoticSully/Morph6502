/**
 * @file Houses the HexCode Generator
 * @author Ryan Sullivan
 * @version 20130503
 */

/**
 * Generates Hex code for our OS Projects
 * 
 * @class
 */
function Generators6502(parent){
    //=========================
    // Print Node
    //=========================
    this[T_PRINT] = function(children) {
        
        var childNode = children[0];
        
        switch (childNode.getType()) {
            // numeric constant
            case T_DIGIT:
                // load Y reg with value
                parent.addCode('A0 ' + toHex(childNode.getValue()));
                // load X reg with constant 01
                parent.addCode('A2 01');
            break;
            
            // With IntExpr
            case T_EQUALITY:
            case T_PLUS:
            case T_MINUS:
                // generate code for IntExpr,
                // final value in Acc
                parent.generateNode(childNode);
                // store Acc in memory
                parent.addCode('8D ' + parent.systemTempId);
                // load Y register from memory
                parent.addCode('AC ' + parent.systemTempId);
                // load X reg with constant 01
                parent.addCode('A2 01'); 
            break;
            
            case T_QUOTE:
                var string   = getString(childNode);
                var stringId = parent.allocateString(string);
                // load Y Reg with string location
                parent.addCode('A0 ' + stringId);
                // load X reg with constant 02 for string mode
                parent.addCode('A2 02');
            break;
            
            case T_CHARACTER:
                var symbol = parent.getSymbol(childNode.getValue());
                
                // load Y reg with memory location
                parent.addCode('AC ' + symbol.tempId);
                
                if (symbol.type == T_STRING) {
                    // load X reg with constant 02 for string mode
                    parent.addCode('A2 02');
                } else {
                    // load X reg with constant 01 for literal mode
                    parent.addCode('A2 01');
                }
            break;
            
            case T_TRUE:
            case T_FALSE:
                equalityBranch(childNode, false, parent);
                
                // store Acc in memory
                parent.addCode('8D ' + parent.systemTempId);
                // load Y register from memory
                parent.addCode('AC ' + parent.systemTempId);
                // load X reg with constant 01
                parent.addCode('A2 01'); 
            break;
        }
        
        // System call to print
        parent.addCode('FF');
    }
    
    //=========================
    // Int Expression Node
    //=========================
    this[T_PLUS] = function(children) {
        // has to be an integer at this point
        var leftVal = children[0];
        
        // what happens depends on what the right child is
        var rightVal = children[1];
        
        switch (rightVal.getType()) {
            case T_DIGIT:
                // load Acc with right
                parent.addCode('A9 ' + toHex(rightVal.getValue()));
            break;
            
            case T_PLUS:
            case T_MINUS:
                parent.generateNode(rightVal);
            break;
            
            case T_CHARACTER:
                var symbol = parent.getSymbol(rightVal.getValue());
                // load Acc from memory
                parent.addCode('AD ' + symbol.tempId);
            break;
        }
        
        // store Acc
        var tempId = parent.systemTempId;
        parent.addCode('8D ' + tempId);
        
        // load left to Acc
        parent.addCode('A9 ' + toHex(leftVal.getValue()));
        
        // add Temp
        parent.addCode('6D ' + tempId);
    }
    
    //=========================
    // Var Decl Node
    //=========================
    this[ST_DECLARATION] = function(children) {
        var type = children[0];
        var id   = children[1];
        
        var tempId = parent.allocate(id.getValue());
        // load Acc with default (00)
        parent.addCode('A9 00');
        // store Acc in memory
        parent.addCode('8D ' + tempId);
    }
    
    //=========================
    // Assignment Node
    //=========================
    this[T_EQUALS] = function(children) {
        
        var symbol = parent.getSymbol(children[0].getValue());
        var rightVal = children[1];
        
        switch (rightVal.getType()) {
            // constant number or boolean
            case T_TRUE:
            case T_FALSE:
            case T_DIGIT:
                // load Acc with right
                parent.addCode('A9 ' + toHex(resolvePrimitiveLeaf(rightVal)));
            break;
            
            // With IntExpr
            case T_PLUS:
            case T_MINUS:
            case T_EQUALITY:
                // generate code for IntExpr,
                // final value in Acc
                parent.generateNode(rightVal);
            break;
            
            // string
            case T_QUOTE:
                var string   = getString(rightVal);
                var stringId = parent.allocateString(string);
                parent.addCode('A9 ' + stringId);
            break;
            
            case T_CHARACTER:
                var rightSymbol = parent.getSymbol(rightVal.getValue());
                parent.addCode('AD ' + rightSymbol.tempId);
            break;
        }
        
        // The Acc should have what we need.
        // So just store that in memory
        parent.addCode('8D ' + symbol.tempId);
    }
    
    //=========================
    // Equality Node
    //=========================
    this[T_EQUALITY] = function(children) {
        
        // check to see if children is an array of parameters
        var left = children[0];
        var right = children[1];
        
        // branch right first
        equalityBranch(right, false, parent);
        
        // then branch left
        equalityBranch(left, true, parent);
        
        // store Acc
        parent.addCode('8D ' + parent.systemTempId);
        // assume False in Acc
        parent.addCode('A9 00');
        // compare temp to X
        parent.addCode('EC ' + parent.systemTempId);
        // Branch past load true if compare is false
        parent.addCode('D0 02');
        // load true
        parent.addCode('A9 01');
    }
    
    this[T_IF] = function(children) {
        var condition = children[0];
        var block     = children[1];
        
        // generate condition
        if (condition.getType() == T_TRUE || condition.getType() == T_FALSE){
            equalityBranch(condition, false, parent);
        } else {
            parent.generateNode(condition);
        }
        
        // store result of boolean expression in system temp
        parent.addCode('8D ' + parent.systemTempId);
        // load true (01) into X register
        parent.addCode('A2 01');
        // compare result of boolean expression
        parent.addCode('EC ' + parent.systemTempId);
        // jump to end of block if not equal
        var jump      = parent.getJump();
        parent.addCode('D0 ' + jump.id);
        
        // generate innerblock
        parent.generateBlock(block);
        
        // insert jump placeholder
        parent.computeJumpEnd(jump);
        //parent.addCode(jump.location);
        
    }
    
    this[T_WHILE] = function(children) {
        var condition     = children[0];
        var block         = children[1];
        
        // jump to condition
        parent.addCode('A9 01');
        parent.addCode('8D ' + parent.systemTempId);
        parent.addCode('A2 00');
        parent.addCode('EC ' + parent.systemTempId);
        
        // compute 1 jump start
        var firstJump     = parent.getJump();
        parent.addCode('D0 ' + firstJump.id);
        
        // get second jump
        // compute jump 2 end
        var conditionJump = parent.getJump(true);
        parent.computeJumpEnd(conditionJump, 1);
        //parent.addCode(conditionJump.location);
        
        // generate block
        parent.generateBlock(block);
        
        parent.computeJumpEnd(firstJump, 1);
        //parent.addCode(firstJump.location);
        
        // generate condition
        if (condition.getType() == T_TRUE || condition.getType() == T_FALSE){
            equalityBranch(condition, false, parent);
        } else {
            parent.generateNode(condition);
        }
        
        // store result of boolean expression in system temp
        parent.addCode('8D ' + parent.systemTempId);
        // load true (01) into X register
        parent.addCode('A2 00');
        // compare value to true
        parent.addCode('EC ' + parent.systemTempId);
        
        // compare result of boolean expression
        parent.computeJumpStart(conditionJump, 2);
        parent.addCode('D0 ' + conditionJump.id);
        
    }
    
    function equalityBranch(node, left, codeGen) {
        var loadConstant = 'A9';
        var loadMemory = 'AD';
        var saveState = false;
        
        if (left) {
            loadConstant = 'A2';
            loadMemory = 'AE';
        }
        
        switch(node.getType()) {
            case T_PLUS:
            case T_MINUS:
            case T_EQUALITY:
                // if left branch save state
                if (left) {
                    // save Acc to temp
                    codeGen.addCode('8D ' + codeGen.systemTempId);
                    // request temp level
                    codeGen.requestTempLocation();   
                }
                
                // branch again
                codeGen.generateNode(node);
                
                // if left pop state
                if (left) {
                    // kick out a level
                    codeGen.releaseTempLocation();
                    // load X reg with saved temp
                    codeGen.addCode(loadMemory + ' ' + codeGen.systemTempId);    
                }
            break;
            
            case T_TRUE:
            case T_FALSE:
            case T_DIGIT:
                // always load right to Acc
                codeGen.addCode(loadConstant + ' ' + toHex(resolvePrimitiveLeaf(node)));
            break;
            
            case T_QUOTE:
                var string   = getString(node);
                var stringId = codeGen.allocateString(string);
                codeGen.addCode(loadConstant + ' ' + stringId);
            break;
            
            case T_CHARACTER:
                var rightSymbol = codeGen.getSymbol(node.getValue());
                codeGen.addCode(loadMemory + ' ' + rightSymbol.tempId);
            break;
        }
    }
    
    function resolvePrimitiveLeaf(leafNode) {
        // get value upper case just to make sure
        switch (leafNode.getType()) {
            case T_TRUE:
                return '1';
            break;
            
            case T_FALSE:
                return '0';
            break;
            
            case T_DIGIT:
                return leafNode.getValue();
            break;
        }
        
        return null;
    }
    
    // helper functions
    function getString(node) {
        var string = node.name;
        return string.replace(/"/g, '');
    }
}