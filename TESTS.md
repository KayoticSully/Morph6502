Test Cases
==========

Project 1
---------
###Basic empty program
```
{}$
```
>Lexer Start
>Parser Start
>Success!
> 
>Symbol Table

###Declare a variable
```
int a
$
```
or
```
{
    int a
}
$
```

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

###Lex Errors
```
{
    !@#%^&*()_
}
$
```
or
```
{
    int #
    char %
}
$
```

###Parse Errors
```
{
    int 1
    char 42
}
$
```
or
```
{
    char b
    b = "this 1s a t35t"
}
$
```
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

###Warnings
```
{
    P("this example does not contain a program end symbol")
}
```
or
```
{
    P("this example has extra code after the end of program symbol")
}
$
P("this is some extra code")
```

###Test Cases for Actual Errors I had to Fix
```
a
```
and
```
int
```