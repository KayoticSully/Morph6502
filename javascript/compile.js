/**
 * @file Controls the flow of compilation. Cleans up input, runs Lexer, runs Parser
 * @author Ryan Sullivan
 * @version 20130225
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
    log('Final Output', 'info');
    log('------------');
    log("Success!", 'success');
    displayOutput();
    return true;
}