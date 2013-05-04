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
        var code = '';
        var childNode = children[0];
        
        switch (childNode.getType()) {
            // numeric constant
            case T_DIGIT:
                // load Y reg with value
                code += 'A0 ' + toHex(childNode.getValue()) + ' ';
                
                // load X reg with constant 01
                code += 'A2 01 ';
            break;
            
            // With IntExpr
            case T_PLUS:
            case T_MINUS:
                // generate code for IntExpr,
                // final value in Acc
                code += parent.generateNode(childNode);
                var pointer = parent.allocate();
                
                // store Acc in memory
                code += '8D ' + pointer + ' ';
                
                // load Y register from memory
                code += 'AC ' + pointer + ' ';
                
                // load X reg with constant 01
                code += 'A2 01 '; 
            break;
            
            case T_STRING:
                
            break;
        }
        
        // System call to print
        code += 'FF ';
        return code;
    }
    
    //=========================
    // Int Expression Node
    //=========================
    this[T_PLUS] = function(children) {
        var code = '';
        
        // has to be an integer at this point
        var leftVal = children[0];
        
        // what happens depends on what the right child is
        var rightVal = children[1];
        
        switch (rightVal.getType()) {
            case T_DIGIT:
                // load Acc with right
                code += 'A9 ' + toHex(rightVal.getValue()) + ' ';
            break;
            
            case T_PLUS:
            case T_MINUS:
                code += parent.generateNode(rightVal);
            break;
            
            case T_CHARACTER:
                
            break;
        }
        
        // store Acc
        var tempId = 'FA 00';//parent.allocate();
        code += '8D ' + tempId + ' ';
        
        // load left to Acc
        code += 'A9 ' + toHex(leftVal.getValue()) + ' ';
        
        // add Temp
        code += '6D ' + tempId + ' ';
        
        return code;
        //parent.generateNode(childNode);
    }
    
    this[ST_DECLARATION] = function(children) {
        var type = children[0];
        var id   = children[1];
        
        
    }
}