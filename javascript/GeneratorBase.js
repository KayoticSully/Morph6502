/**
 * @file Handles Code Generation
 * @author Ryan Sullivan
 * @version 20130425
 */

/**
 * Handles code generation
 * 
 * @class
 */
var GaneratorBase = function() {
    var jumpTable = {};
    var pointerTable = {};
    
    this.nodeGenerators = {};
}

GeneratorBase.prototype.nodeGenerate = function(node) {
    var nodeType = node.token.type;
    
    if (nodeType in this.nodeGenerators) {
        return this.nodeGenerators[nodeType](node.children);
    } else {
        return false;
    }
}