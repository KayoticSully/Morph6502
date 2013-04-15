/**
 * Tracks identifiers in scopes
 * 
 * @class
 * @author Ryan Sullivan
 * @version 20130414
 */
var SymbolTable = function() {
    this.root = new Scope(null);
    this.workingScope = this.root;
}

SymbolTable.prototype.openScope = function() {
    var newScope = new Scope(this.workingScope);
    this.workingScope.subScopes.push(newScope);
    this.workingScope = newScope;
    log('Opened Scope', 'info');
}

SymbolTable.prototype.closeScope = function() {
    this.workingScope = this.workingScope.parent;
    log('Closed Scope', 'info');
}

SymbolTable.prototype.addIdentifier = function(id, type) {
    var symbol = new Symbol(id, type);
    var added = this.workingScope.addSymbol(symbol);
    
    if (added) {
        var message = 'Identifier: ' + symbol.id + " | " + symbol.type + ' on line ' + symbol.line;
        log(message, 'info');
    }
    
    return added;
}

/**
 * Represents a single identifier and its type
 * 
 * @class
 * @author Ryan Sullivan
 * @version 20130415
 */
var Symbol = function(idToken, typeToken) {
    // idToken and typeToken are private variables
    // and can be used as such
    
    this.used = false;
    this.initialized = false;
    
    Object.defineProperty(this, 'id', {
        writeable       : false,
        enumerable      : false,
        get             : function() {
            return idToken.value;
        }
    });
    
    Object.defineProperty(this, 'type', {
        writeable       : false,
        enumerable      : false,
        get             : function() {
            return typeToken.type;
        }
    });
    
    Object.defineProperty(this, 'line', {
        writeable       : false,
        enumerable      : false,
        get             : function() {
            return idToken.line;
        }
    });
}

/**
 * Represents an independent namespace block
 * 
 * @class
 * @author Ryan Sullivan
 * @version 20130414
 */
var Scope = function(parent) {
    this.parent = parent;
    this.symbols = new Array();
    this.subScopes = new Array();
}

Scope.prototype.addSymbol = function(symbol) {
    if (! this.hasId(symbol.id)) {
        this.symbols.push(symbol);
        return true;
    } else {
        return false;
    }
}

Scope.prototype.getSymbol = function(id) {
    for (index in this.symbols) {
        if (this.symbols[index].id == id) {
            return this.symbols[index];
        }
    }
    
    return false;
}

Scope.prototype.hasId = function(id) {
    if (this.getSymbol(id) != false) {
        return true;
    }
    
    return false;
}

Scope.prototype.usedSymbol = function(id) {
    var symbol = this.getSymbol(id);
    
    if (symbol != false) {
        symbol.used = true;
    }
}

Scope.prototype.initializedSymbol = function(id) {
    var symbol = this.getSymbol(id);
    
    if (symbol != false) {
        symbol.initialized = true;
    }
}