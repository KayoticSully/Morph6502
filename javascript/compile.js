/**
 * @file Controls the flow of compilation. Cleans up input, runs Lexer, runs Parser
 * @author Ryan Sullivan
 * @version 20130219
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
    log('Lexer:');
    var lexerReults = lexer.lex(source);
    var tokenStream = lexerReults.tokens;
    var tokenErrors = lexerReults.errors;
    
    if(tokenErrors.length > 0)
    {
        displayTokenErrors(tokenErrors);
        return false;
    }
    
    // print out token stream to console
    for(token in tokenStream) {
        console.log(tokenStream[token]);
    }
    
    log('Parser:');
    var parseResults = parser.parse(tokenStream);
    
    displayOutput();
    
    return true;
}