M o r p h 6 5 0 2
=================
This is a project for my compilers class.  The main goal is to be able to compile a rather simplistic language into 6502 hex op-codes.  The main parts of the project are a Lexer, a Parser and a Code Generator.

Submodules
----------
This project uses Impress.js for its interface.  I have linked my fork of Impress.js as a submodule.  You need to run `submodule init` and `submodule update` to get this dependency installed.

For more information on Git submodules check out [this article](http://git-scm.com/book/en/Git-Tools-Submodules).  This is my first use of submodules and found that article very helpful to get started.

Documentation
-------------
I am using Google's JSDocs to generate documentation.  These files can be found in the docs folder.

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