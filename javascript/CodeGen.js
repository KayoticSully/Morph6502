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
    // private
    var generators      = new Generators6502(this);
    var currentScope    = null;
    
    var tempId          = null;
    var stringId        = null;
    var jumpId          = null;
    var jumpToLetter    = null;
    var compiledCode    = null;
    
    var symbolTemps     = null;
    var stringTable     = null;
    var jumpTable       = null;
    
    var systemTemps     = null;
    
    // public
    Object.defineProperty(this, 'systemTempId', {
        writeable       : false,
        enumerable      : false,
        get             : function() {
            return systemTemps[systemTemps.length - 1];
        }
    });
    
    this.generate = function(symbolTable, AST) {
        // setup
        currentScope    = symbolTable.root;
        tempId          = 'P0 XX'; // P for Pointer
        stringId        = 'S0 XX'; // S for String
        jumpId          = 'J0 XX'; // J for Jump
        jumpToLetter    = 'L';     // L for Location
        compiledCode    = '';
        systemTemps     = ['T0 XX'];
        symbolTemps     = [this.systemTempId];
        jumpTable       = [];
        stringTable     = [];
        
        log('-----------------------');
        log('Code Generation', 'info');
        log('-----------------------');
        
        // kick off
        var root = AST.root;
        if (root.getType() === T_BRACE_OPEN) {
            this.generateBlock(root);
        } else {
            this.generateNode(root);
        }
        
        // make sure program ends
        this.addCode('00');
        
        // replace temps
        backPatch(); 
        
        //trim
        compiledCode = trim(compiledCode);
        
        // make sure program isnt too long
        var length = memoryLocationFromIndex(compiledCode.length - 1);
        
        if (length > 255) {
            log('Resulting code is too long.  Program will not run in Test OS', 'warning');
        }
        
        return compiledCode;
    }
    
    /**
     * Generate all statements within a block
     */
    this.generateBlock = function(blockNode) {
        
        log("Entering new code block", 'info', true);
        
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
    
    /**
     * Generate a specific Node
     */
    this.generateNode = function(node) {
        var nodeType = node.getType();
        
        console.log(node.getType());
        log('Generating Code for Node ' + Tokens[node.getType()].name, 'info', true);
        
        // Run specific generator for the node or return nothing
        if (nodeType in generators) {
            return generators[nodeType](node.children);
        } else {
            return '';
        }
    }
    
    /**
     * Make sure space is allocated for an identifier
     */
    this.allocate = function(identifier) {
        // get symbol and assign tempId
        var symbol = currentScope.getSymbol(identifier, true);
        symbol.tempId = tempId;
        
        // add tempId to list
        symbolTemps.push(tempId);
        
        // store nextTempId
        tempId = nextTemp(tempId);
        
        return symbol.tempId;
    }
    
    /**
     * Make sure space is allocated for a specific string
     */
    this.allocateString = function(string) {
        var length = string.length + 1;
        
        var record = {
            id : stringId,
            length : length,
            string : string
        }
        
        // update
        stringTable.push(record);
        stringId = nextTemp(stringId);
        
        return record.id;
    }
    
    this.getSymbol = function(identifier) {
        identifier = trim(identifier);
        var symbol = currentScope.getSymbol(identifier, true);
        return symbol;
    }
    
    this.addCode = function(code) {
        code = trim(code);
        compiledCode += ' ' + code;
    }
    
    this.requestTempLocation = function() {
        // get next location
        var nextLocation = nextTemp(this.systemTempId);
        
        // push location onto stack
        systemTemps.push(nextLocation);
        
        // make sure location will be given space
        if (! (nextLocation in symbolTemps)) {
            symbolTemps.push(nextLocation);
        }
    }
    
    this.releaseTempLocation = function() {
        systemTemps.pop();
    }
    
    this.getJump = function(backwardJump) {
        if (backwardJump === undefined) {
            backwardJump = false;
        }
        
        var currentJump = { id: jumpId, startLocation : 0, endLocation: 0, backward : backwardJump };
        
        jumpId = nextTemp(jumpId);
        
        if (!currentJump.backward) {
            // +2 for the two locations taken up by this command (D0 XX)
            this.computeJumpStart(currentJump, 2);
        }
        
        jumpTable.push(currentJump);
        
        return currentJump;
    }
    
    this.computeJumpStart = function(jump, extraOffset) {
        if (extraOffset === undefined) {
            extraOffset = 0;
        }
        
        var location = computeCurrentLocation();
        location += extraOffset;
        
        jump.startLocation = location;
    }
    
    this.computeJumpEnd = function(jump, extraOffset) {
        if (extraOffset === undefined) {
            extraOffset = 0;
        }
        
        var location = computeCurrentLocation();
        location += extraOffset;
        
        jump.endLocation = location;
    }
    
    function computeCurrentLocation() {
        var indexOfNextInstruction = trim(compiledCode).length + 1;
        var location = memoryLocationFromIndex(indexOfNextInstruction);
        
        location = location - stringTable.length - jumpTable.length; // offset replacements
        
        return location;
    }
    
    this.getJumpSet = function() {
        var length = jumpTable.length;
        var nextJump = null;
        console.log('Jump Length: ' + length);
        
        if (length > 0) {
            var last = jumpTable[length - 1];
            
            console.log(last.id);
            var nextId = nextTemp(last.id);
            
            nextJump = {
                id : nextId,
                location : jumpToLetter + nextId.substring(1)
            }
        } else { // defaults
            nextJump = {
                id : jumpId,
                location : jumpToLetter + jumpId.substring(1)
            }
        }
        
        console.log('Jump Alloc');
        console.log(nextJump);
        
        jumpTable.push(nextJump);
        
        return nextJump;
    }
    
    // private functions
    function nextTemp(lastVal) {
        var firstChar = lastVal[0];
        var pattern = new RegExp('[' + firstChar + '|X]', 'g');
        
        var hexNum = lastVal.replace(pattern, '');
        var decNum = parseInt(hexNum, 16);
        
        decNum++;
        
        var newHex = decNum.toString(16).toUpperCase();
        
        if (newHex.length == 1) {
            newHex += 'X';
        }
        
        newHex = firstChar + newHex.substring(0, 1) + ' ' + newHex.substring(1) + 'X';
        
        return newHex;
    }
    
    function backPatch() {
        // GET RID OF THAT DAMN WHITESPACE!
        compiledCode = trim(compiledCode);
        
        // figure out where the program ends
        var decimalLocation = compiledCode.split(' ').length;
        
        // Subtract the number of string patches. This
        // is done since strings patches replace 2 locations
        // with one.
        decimalLocation = decimalLocation - (stringTable.length);
        
        // Subtract twice the number of jump patches.
        var jumpLength = jumpTable.length;
        decimalLocation = decimalLocation - jumpLength;
        
        // we now have the actual ending memory location
        
        // replace symbols
        for (var i in symbolTemps) {
            var tempId = symbolTemps[i];
            
            var location = toHex(decimalLocation) + ' 00';
            decimalLocation += 1;
            
            var replace = new RegExp(tempId, 'g');
            console.log("Replacing " + tempId + " with " + location);
            
            compiledCode = compiledCode.replace(replace, location) + ' 00';
        }
        
        // replace strings
        for (var s in stringTable) {
            var record = stringTable[s];
            
            var location = toHex(decimalLocation);
            decimalLocation += record.length;
            
            var replace = new RegExp(record.id, 'g');
            console.log("Replacing " + record.id + " with " + location);
            
            // replace reference
            compiledCode = compiledCode.replace(replace, location);
            
            // add string to program image
            var hexString = encodeToHex(record.string);
            for(var p = 0; p < hexString.length; p += 2) {
                compiledCode += ' ' + hexString.substring(p, p + 2);
            }
            
            // terminate string with null
            compiledCode += ' 00';
        }
        
        
        console.log(compiledCode);
        
        // replace jumps
        for (var j = jumpTable.length - 1; j >= 0; j--) {
            var jump = jumpTable[j];
            
            console.log(jump);
            
            var offset = 0
            
            if (jump.backward) {
                offset = 255 - jump.startLocation + jump.endLocation;
            } else {
                offset = jump.endLocation - jump.startLocation;
            }
            
            compiledCode = compiledCode.replace(jump.id, toHex(offset));
        }
        
    }
    
    function memoryLocationFromIndex(decimalIndex) {
        console.log(decimalIndex);
        // 1/3 of the characters are whitespace since the generated code
        // has the format ## ## ## ...
        var whiteSpace       = decimalIndex / 3;
        
        console.log(whiteSpace);
        // Subtract the amount of whitespace to get the number
        // of actual chracters used in the program up to this index
        var memoryCharacters = decimalIndex - whiteSpace;
        
        // Divide by two since every memory location
        // is two characters
        
        return memoryCharacters / 2;
    }
}