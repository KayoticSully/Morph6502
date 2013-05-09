/**
 * @file Helper functions to display output to the web interface
 * @author Ryan Sullivan
 * @version 20130416
 */

/**
 * Displays compiler output pane
 */
function displayOutput() {
    $('#productions').addClass('hidden');
    $('#output, #clearOutput').removeClass('hidden');
}

/**
 * Completely clears output and shows productions pane
 */
function clearOutput() {
    $('#productions').removeClass('hidden');
    $('#output, #clearOutput').addClass('hidden');
    $('.lineselect').removeClass('lineselect');
    $('#compiledCode').removeClass('open');
}

/**
 * Only clears output pane and line highlighting
 */
function resetOutput() {
    // reset line highlighting and output pane
    $('.lineselect').removeClass('lineselect');
    $('#output').html('');
}

/**
 * Controls compiler output
 * 
 * @param {String} line A line to add to output list
 * @param {String} type Classes to add to output list item
 * @param {Boolean} verbose Set to true if log should only be shown when verbose output is on. Default false
 */
function log(line, type, verbose) {
    if(verbose === undefined) verbose = false;
    if(type === undefined) type = '';
    
    if((verbose == false) || (verbose == true && logLevel == 'verbose')) {
        var str =   '<li class="' + type + '">' +
                        line +
                    '</li>';
                    
        $('#output').append(str);
        console.log(line);
    }
}

/**
 * Handles the display of errors found during Lexing
 * 
 * @name displayTokenErrors
 * @param {Object} tokenErrors An object with line numbers for keys and the number of errors on that line as values
 */
function highlightErrorLines(tokenErrors) {
    for(lineNumber in tokenErrors) {
        var index = parseInt(lineNumber) - 1
        $('.codelines .lineno:eq(' + index + ')').addClass('lineselect');
    }
    
    displayOutput();
}

function showAST(ast) {
    log("Reticulating Splines");
    // get JSON to load into view
    var json = ast.toJSON();
    // setup SpaceTree
    SpaceTree.loadJSON(json);
    SpaceTree.compute();
    SpaceTree.geom.translate(new $jit.Complex(-200, 0), "current");
    // LOAD!
    SpaceTree.onClick(SpaceTree.root);
    log('<a href="#/show-ast">Display AST</a>');
}


function printSymbolTable(symbolTable) {
    var prefix = '-';
    
    function printScope(scope) {
        //alert('new scope!');
        printSymbols(scope);
        
        log('------------------------------------');
        
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
            var entry = prefix +
                ' <span class="success">' +
                    symbol.id +
                '</span>' +
                    ' | ' +
                '<span class="info">' +
                    symbol.type +
                '</span>' +
                    ' | ' +
                '<span class="info">' +
                    symbol.initialized +
                '</span>' +
                    ' | ' +
                '<span class="info">' +
                    symbol.used +
                '</span>';
            log(entry);
        }
    }
    
    printScope(symbolTable.root);
}