M o r p h 6 5 0 2
=================
This is a project for my compilers class.  The main goal is to be able to compile a rather simplistic language into 6502 hex op-codes.  The main parts of the project are a Lexer, a Parser and a Code Generator.

Submodules
----------
This project uses Impress.js for its interface.  I have linked my fork of Impress.js as a submodule.  You need to run `submodule init` and `submodule update` to get this dependency installed.

For more information on Git submodules check out [this article](http://git-scm.com/book/en/Git-Tools-Submodules).  This is my first use of submodules and found that article very helpful to get started.

Documentation
-------------
I am using Google's JSDocs to generate documentation.  These files can be found in the docs folder. I'm still getting used to JSDocs so they might not be all to helpful right now.

Notes
=====
T_ Constants
-------------
These are token constants that the lexer will put into the token stream.

CT_ Constants
-------------
These are "Control Token" constants that the lexer will use but not include in the token stream

R_ Constants
-------------
These are the RegEx pattern constants for the corresponding token constants.