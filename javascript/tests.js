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
    testStatements : "{\n    print(\"start of example\")\n    int a\n    string b\n\n    a = 1 + 4 + 5\n    a = 1 + a\n\n    b = \"string\"\n}\n$",
    testLexError : "{\n    !@#%^&*()_\n}\n$",
    testLexErrorAlt : "{\n    int #\n    string %\n}\n$",
    testParseError : "{\n    int 1\n    string 42\n}\n$",
    testParseErrorAlt : "{\n    string b\n    b = \"this 1s a t35t\"\n}\n$",
    testParseErrorAlt2 : "{\n    print(\"start 0f example\")\n    int a\n    string b\n\n    a = a + 4 + 5\n    a = 1 - a\n\n    b = \"string\"\n    $\n}\n$",
    testRedeclarationError : "{\n    int a\n    a = 1\n    a = 5 + a\n\n    string a\n}\n$",
    testWarningEndSymbol : "{\n    print(\"this example does not contain a program end symbol\")\n}",
    testWarningExtraCode : "{\n    print(\"this example has extra code after the end of program symbol\")\n}\n$\nprint(\"this is some extra code\")",
    testFixedError1 : "a",
    testFixedError2 : "int",
    testScope : "{\n    int a\n    string b\n    {\n        b = \"b\"\n        int c\n        {\n            a = 4\n            c = 2\n            print(a)\n            {\n                print(\"more scope\")\n            }\n            print(c)\n        }\n        print(c)\n    }\n    a = 8\n}\n$",
    testScopeRedeclareError : "{\n    int a\n    {\n        int a\n        {\n            int b\n        }\n        string a\n    }\n}\n$",
    testUndeclaredIdentifier : "{\n    int a\n    a = 5\n    print(b)\n}\n$",
    testTypeMisMatch: "{\n    int a \n    a = 5\n    \n    string b\n    b = \"awesome\"\n    \n    a = b\n}\n$",
    testDeclareBug: "{\n    int a\n    {\n        a = 5\n        string a\n    }\n}\n$",
    testControl1: "{\n    boolean a\n    a = true\n    \n    if (a == true) {\n        print(\"it works\")\n    }\n    \n    if true {\n        print(\"control block\")\n    }\n\n    a = false\n    \n    if(a == true) {\n        print(\"should not print\")\n    }\n}$",
    testBooleanHell: "{\n    boolean a\n    a = ((true == false) == ((1 == 2) == true))\n    \n    if(a == ((5 == 5) == true)) {\n        print(\"boolean hell complete\")\n    }\n}$",
    testInfiniteLoop: "{\n    while true {\n        print(\"loop\")\n    }\n}$"
}