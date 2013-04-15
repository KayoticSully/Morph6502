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
        log('New Identifier: ' + id + " | " + type, 'info');
    }
    
    return added;
}

/**
 * Represents a single identifier and its type
 * 
 * @class
 * @author Ryan Sullivan
 * @version 20130414
 */
var Symbol = function(identifier, symbolType) {
    this.id = identifier;
    this.type = symbolType;
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

Scope.prototype.hasId = function(id) {
    for (index in this.symbols) {
        if (this.symbols[index].id == id) {
            return true;
        }
    }
    
    return false;
}