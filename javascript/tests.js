/**
 * @file All of the test cases that can be loaded
 * @author Ryan Sullivan
 * @version 20130226
 */

/**
 * Holds all the test cases to auto-load.  Whitespace is important
 * @constant
 */
const Tests = {
    testEmpty : "{}$",
    testDeclareVariable : "int a\n$",
    testDeclareVariableAlt : "{\n    int a\n}\n$",
    testStatements : "{\n    P(\"start of example\")\n    int a\n    char b\n\n    a = 1 + 4 + 5\n    a = 1 + a\n\n    b = \"string\"\n}\n$",
    testLexError : "{\n    !@#%^&*()_\n}\n$",
    testLexErrorAlt : "{\n    int #\n    char %\n}\n$",
    testParseError : "{\n    int 1\n    char 42\n}\n$",
    testParseErrorAlt : "{\n    char b\n    b = \"this 1s a t35t\"\n}\n$",
    testParseErrorAlt2 : "{\n    P(\"start 0f example\")\n    int a\n    char b\n\n    a = a + 4 + 5\n    a = 1 - a\n\n    b = \"string\"\n    $\n}\n$",
    testRedeclarationError : "{\n    int a\n    a = 1\n    a = 5 + a\n\n    char a\n}\n$",
    testWarningEndSymbol : "{\n    P(\"this example does not contain a program end symbol\")\n}",
    testWarningExtraCode : "{\n    P(\"this example has extra code after the end of program symbol\")\n}\n$\nP(\"this is some extra code\")",
    testFixedError1 : "a",
    testFixedError2 : "int",
}