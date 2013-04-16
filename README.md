M o r p h 6 5 0 2
=================
This is a project for my compilers class.  The main goal is to be able to compile a rather simplistic language into 6502 hex op-codes.  The main parts of the project are a Lexer, a Parser and a Code Generator.

Submodules (Part of Set Up)
----------
This project uses Impress.js for its interface.  I have linked my fork of Impress.js as a submodule.  You need to run `submodule init` and `submodule update` to get this dependency installed.

For more information on Git submodules check out [this article](http://git-scm.com/book/en/Git-Tools-Submodules).  This is my first use of submodules and found that article very helpful to get started.

Documentation
-------------
I am using Google's JSDocs to generate documentation.  These files can be found in the docs folder.

Notes (Project 2)
=================
Known Bugs
----------
*   Variable declarations parse without a space between the type and identifier.  For example `inta` parses just the same as `int a`.
*   Variable declarations will override type of identifiers used before the declaration in the same scope.  For example, if __int a__ is defined in an outter scope, and a child scope assigns a to 5 but then later defines its own string a, the assignment of 5 to a will fail type checking even though it technically is correct.  I'm not sure if I described this bug properly but I included a test called "Declare Bug" that shows the problem.  I do not know how to fix this and just found the issue while writing my test cases.

CST
---
I do not have a CST.  Morph6502 directly builds the AST from the Token Stream during the parse phase.

AST
---
The AST for any successfully compiled program can be viewed by clicking on the "Display AST" link at the end of the output log.  Just noting that incase the log is too long and you have to scroll down.  Its dragable, and expandable.  Pink nodes can be clicked on to expand down.  The darker the node the more levels it has underneath it.  I tried my best to get as many levels to show at once, but wide graphs will only expand down 1 or 2 levels.

Symbol Table
------------
The symbol table will print out towards the end of the log.  New scopes have horizontal lines on top and bottom.  The number of dashes at the front is the scope's depth.  I think it's fairly obvious, but can't hurt to clarify it.

A symbol's record has the following form
```
id | Type | Initialised Boolean | Used Boolean
```

Continuous Compile
-------------------
This is just something I was messing around with.  It works fairly well but the AST won't be useful since its getting re-drawn so quickly.

JSDocs
------
These are not updated to the current project.  I need to reformat some comments before this will update properly.

Notes (Project 1)
=================
T_ Constants
-------------
These are token constants that the lexer will put into the token stream.

CT_ Constants
-------------
These are "Control Token" constants that the lexer will use but not include in the token stream

R_ Constants
-------------
These are the RegEx pattern constants for the corresponding token constants.

Input
-----
Keyboard input behaves as you would expect in the textarea with a single exception.  Tab does indent the current line, but only when there is no code after the cursor.  Otherwise it adds the spaces to the end of the code and drops the cursor there.

Output
------
The output is color coded:
*   Green text is used to identify important symbols and words in the output
*   Blue text is used to provide extra information
*   Orange/Yellow text is used to display warnings. (Along with the word "Warning:")
*   Red text is used to display errors in the format "Line Number : Error Message"
*   Black text is used for formatting

Line numbers will also be highlighted in red if an error appears on that line.

Other :)
--------
*   The symbol table is printed after all other output and will not print if there have been errors
*   I did my best to catch multiple errors at once in the parse phase.  Sometimes a line is skipped when an error appears on the previous line.
*   All of my test cases are loadable through the links on the left hand side of the page.
*   Most if not all of the animations are done in CSS3, you challenged me... but I didn't want to use jQuery (for that).  CSS3 animations are actually much easier to use!
*   Fun Fact: The compiler can parse up to about 5200 token before chrome crashes.