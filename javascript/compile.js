/**
 * @file Controls the flow of compilation. Cleans up input, runs Lexer, runs Parser
 * @author Ryan Sullivan
 * @version 20130226
 */
function compile() {
    //----------------------
    // Setup
    //----------------------
    resetOutput();
    
    // First we need to get the input from the textarea
    var input   = document.getElementById('input');
    var source  = trim(input.value);
    
    // stop if there was no input
    if(source == '') {
        log('There was no input to compile.', 'error');
        displayOutput();
        return false;
    }
    
    //----------------------
    // Lexer
    //----------------------
    var tokenStream = lexer.lex(source);
    var tokenErrors = lexer.getErrors();
    
    // Output
    if(tokenErrors.length > 0) {
        highlightErrorLines(tokenErrors);
        return false; // stop execution here
    }
    
    // print out token stream to console
    console.log('Token Stream');
    for(token in tokenStream) {
        console.log(tokenStream[token]);
    }
    
    //----------------------
    // Parser
    //----------------------
    var parseResults = parser.parse(tokenStream);
    var parseErrors = parser.getErrors();
    
    // Output
    if(parseErrors.length > 0) {
        highlightErrorLines(parseErrors);
        return false; // stop execution here
    }
    
    
    //----------------------
    // Final Output
    //----------------------
    log('------------');
    log("Success!", 'success');
    log('------------');
    
    // Display Symbol Table
    var symbolTable = parser.getSymbolTable();
    log('&nbsp;');
    log('Symbol Table', 'info');
    
    printSymbolTable(symbolTable);
    //for(var symbol in symbolTable) {
    //    var entry = '<span class="success">' + symbol + '</span> | <span class="info">' + symbolTable[symbol] + '</span>';
    //    log(entry);
    //}
    log('------------');
    
    displayOutput();
    return true;
}


function printSymbolTable(symbolTable) {
    var prefix = '-';
    
    function printScope(scope) {
        //alert('new scope!');
        log('------------');
        printSymbols(scope);
        
        prefix += '-';
        for (var scopeIndex in scope.subScopes) {
            var subScope = scope.subScopes[scopeIndex];
            printScope(subScope);
        }
        prefix = prefix.substring(1);
    }
    
    function printSymbols(scope) {
        for(var symbolIndex in scope.symbols) {
            var symbol = scope.symbols[symbolIndex];
            var entry = prefix + ' <span class="success">' + symbol.id + '</span> | <span class="info">' + symbol.type + '</span>';
            log(entry);
        }
    }
    
    printScope(symbolTable.root);
}