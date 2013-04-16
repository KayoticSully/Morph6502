Project 1
=========
Basic empty program
-------------------
```
{}$
```
####Output
*   No errors or warnings expected in output


Declare a variable
------------------
```
int a
$
```
####Output
*   No errors or warnings expected in output
*   Symbol a with type T_INT

```
{
    int a
}
$
```
####Output
*   No errors or warnings expected in output
*   Symbol a with type T_INT


Some Statements
---------------
```
{
    print("start of example")
    int a
    string b
    
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


Lex Errors
----------
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


Parse Errors
------------
```
{
    int 1
    string 42
}
$
```
####Output
*   Errors:
    *   2 : Expected T_CHARACTER, found T_DIGIT
    *   3 : Expected T_CHARACTER, found T_DIGIT

```
{
    string b
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
    print("start 0f example")
    int a
    string b
    
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
    
    string a
}
$
```
####Output
*   Error:
    *   6 : Redeclared Identifier a


Warnings
--------
```
{
    print("this example does not contain a program end symbol")
}
```
####Output
*   Warning:
    *   Warning: Program did not end with $. Remember it next time!

```
{
    print("this example has extra code after the end of program symbol")
}
$
P("this is some extra code")
```
####Output
*   Warning:
    *   Warning: Content after end of program symbol ($) ignored.


Test Cases for Actual Errors I had to Fix
------------------------------------------
```
a
```
####Output
*   Error:
    *   1 : Undeclared identifier a

and
```
int
```
####Output
*   Error:
    *   1 : Expected T_CHARACTER, found false

    
Scope Test Cases
----------------
```
{
    int a
    string b
    {
        b = "b"
        int c
        {
            a = 4
            c = 2
            print(a)
            {
                print("more scope")
            }
            print(c)
        }
        print(c)
    }
    a = 8
}
$
```
####Output
*   Warning:
    *   Warning: unused symbol b on line 3

```
{
    int a
    {
        int a
        {
            int b
        }
        string a
    }
}
$
```
####Output
*   Error:
    *   8 : Redeclared Identifier a

Other
-----
```
{
    int a
    a = 5
    print(b)
}
$
```
####Output
*   Error:
    *   4 : Undeclared identifier b

```
{
    int a 
    a = 5
    
    string b
    b = "awesome"
    
    a = b
}
$
```
####Output
*   Warning:
    *   Warning: unused symbol a on line 2
*   Error:
    *   8 : Type mis-match. Expected Integer found String

```
{
    int a
    {
        a = 5
        string a
    }
}
$
```
####Output
*   Warning:
    *   Warning: unused symbol a on line 2
    *   Warning: uninitialized symbol a on line 5
    *   Warning: unused symbol a on line 5
*   Error:
    *   4 : Type mis-match. Expected String found Integer