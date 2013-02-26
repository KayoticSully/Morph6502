Test Cases
==========

Project 1
---------
###Basic empty program
```
{}$
```
> No errors or warnings expected in output

###Declare a variable
```
int a
$
```
> No errors or warnings expected in output
> Symbol a with type T_INT

or
```
{
    int a
}
$
```
> No errors or warnings expected in output
> Symbol a with type T_INT

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
> No errors or warnings expected in output
> Symbol a with type T_INT
> Symbol b with type T_CHAR

###Lex Errors
```
{
    !@#%^&*()_
}
$
```
>Errors:
>2 : Unknown token !
>2 : Unknown token @
>2 : Unknown token #
>2 : Unknown token %
>2 : Unknown token ^
>2 : Unknown token &
>2 : Unknown token \*
>2 : Unknown token \_

or
```
{
    int #
    char %
}
$
```
>Errors:
>2 : Unknown token #
>3 : Unknown token %

###Parse Errors
```
{
    int 1
    char 42
}
$
```
>Errors:
>2 : Expected T_CHARACTER, found T_DIGIT
>3 : Expected T_CHARACTER, found T_DIGIT

or
```
{
    char b
    b = "this 1s a t35t"
}
$
```
>Error:
>3 : Expected T_QUOTE, found T_DIGIT

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
>Errors:
>2 : Expected T_QUOTE, found T_DIGIT
>6 : Expected T_BRACE_CLOSE, found T_PLUS

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
>Error:
>6 : Redeclared Identifier a

###Warnings
```
{
    P("this example does not contain a program end symbol")
}
```
>Warning:
>Warning: Program did not end with $. Remember it next time!

or
```
{
    P("this example has extra code after the end of program symbol")
}
$
P("this is some extra code")
```
>Warning:
>Warning: Content after end of program symbol ($) ignored.

###Test Cases for Actual Errors I had to Fix
```
a
```
>Error:
>Last Line : Expected T_EQUALS, found false

and
```
int
```
>Error:
>Last Line : Expected T_CHARACTER, found false