Test Cases
==========

Project 1
---------
###Basic empty program
```c
{}$
```
####Output
*   No errors or warnings expected in output

###Declare a variable
```
int a
$
```
####Output
*   No errors or warnings expected in output
*   Symbol a with type T_INT

or
```c
{
    int a
}
$
```
####Output
*   No errors or warnings expected in output
*   Symbol a with type T_INT

###Some Statements
```
{
    P("start of example")
    int a
    char b
    
    a = 1 + 4 + 5
    a = 1 + a
    
    b = "string"
}
$
```
####Output
*   No errors or warnings expected in output
*   Symbol a with type T_INT
*   Symbol b with type T_CHAR

###Lex Errors
```
{
    !@#%^&*()_
}
$
```
####Output
*   Errors:
    *   2 : Unknown token !
    *   2 : Unknown token @
    *   2 : Unknown token #
    *   2 : Unknown token %
    *   2 : Unknown token ^
    *   2 : Unknown token &
    *   2 : Unknown token \*
    *   2 : Unknown token \_

or
```
{
    int #
    char %
}
$
```
####Output
*   Errors:
    *   2 : Unknown token #
    *   3 : Unknown token %

###Parse Errors
```
{
    int 1
    char 42
}
$
```
####Output
*   Errors:
    *   2 : Expected T_CHARACTER, found T_DIGIT
    *   3 : Expected T_CHARACTER, found T_DIGIT

or
```
{
    char b
    b = "this 1s a t35t"
}
$
```
####Output
*   Error:
    *   3 : Expected T_QUOTE, found T_DIGIT

Unfortunately this one requires the first two errors to be fixed before the third error will show.
```
{
    P("start 0f example")
    int a
    char b
    
    a = a + 4 + 5
    a = 1 - a
    
    b = "string"
    $
}
$
```
####Output
*   Errors:
    *   2 : Expected T_QUOTE, found T_DIGIT
    *   6 : Expected T_BRACE_CLOSE, found T_PLUS

Redeclaration error!
```
{
    int a
    a = 1
    a = 5 + a
    
    char a
}
$
```
####Output
*   Error:
    *   6 : Redeclared Identifier a

###Warnings
```
{
    P("this example does not contain a program end symbol")
}
```
####Output
*   Warning:
    *   Warning: Program did not end with $. Remember it next time!

or
```
{
    P("this example has extra code after the end of program symbol")
}
$
P("this is some extra code")
```
####Output
*   Warning:
    *   Warning: Content after end of program symbol ($) ignored.

###Test Cases for Actual Errors I had to Fix
```
a
```
####Output
*   Error:
    *   Last Line : Expected T_EQUALS, found false

and
```
int
```
####Output
*   Error:
    *   Last Line : Expected T_CHARACTER, found false