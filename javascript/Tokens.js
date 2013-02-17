//===================================
// Tokens.js
//-----------------------------------
// Houses all Token constants and
// the Token prototype
//-----------------------------------
// Author: Ryan Sullivan
// Created: 2/16/2013
// Updated: 2/16/2013
//===================================

//-----------------------------------
// All Tokens / Terminals
//-----------------------------------
const
    T_INT             = 'T_INT',
    T_CHAR            = 'T_CHAR',
    T_DIGIT           = 'T_DIGIT',
    T_CHARACTER       = 'T_CHARACTER',
    T_BRACE_OPEN      = 'T_BRACE_OPEN',
    T_BRACE_CLOSE     = 'T_BRACE_CLOSE',
    T_EPSILON         = 'T_EPSILON',
    T_PAREN_OPEN      = 'T_PAREN_OPEN',
    T_PAREN_CLOSE     = 'T_PAREN_CLOSE',
    T_EQUALS          = 'T_EQUALS',
    T_P               = 'T_P', // couldn't resist
    T_QUOTE           = 'T_QUOTE',
    T_PLUS            = 'T_PLUS',
    T_MINUS           = 'T_MINUS',
    T_$               = 'T_$',
    // Control Tokens
    CT_NEW_LINE       = 'CT_NEW_LINE';
    CT_SPACE          = 'CT_SPACE';

//-----------------------------------
// All Tokens / Terminals RegEx
//-----------------------------------
const
    R_INT             = /^int/,
    R_CHAR            = /^char/,
    R_DIGIT           = /^[0-9]/,
    R_CHARACTER       = /^[a-z]/,
    R_BRACE_OPEN      = /^[{]/,
    R_BRACE_CLOSE     = /^[}]/,
    R_EPSILON         = /^[]/, // ???
    R_PAREN_OPEN      = /^[(]/,
    R_PAREN_CLOSE     = /^[)]/,
    R_EQUALS          = /^[=]/,
    R_P               = /^[P]/,
    R_QUOTE           = /^["|']/,
    R_PLUS            = /^[+]/,
    R_MINUS           = /^[-]/,
    R_$               = /^[$]/,
    R_NEW_LINE        = /^[\n]/;
    R_SPACE           = /^[\s]/;

//-----------------------------------
// The Magic Lexer Object
//-----------------------------------
// Order is (somewhat) important
var Tokens = {
    // Reserved words need to go first, otherwise each
    // character will get identified as T_CHARACTER tokens
    T_INT           : { pattern: R_INT,         length: 3 },
    T_CHAR          : { pattern: R_CHAR,        length: 4 },
    // Now all other symbols
    T_DIGIT         : { pattern: R_DIGIT,       length: 1 },
    T_CHARACTER     : { pattern: R_CHARACTER,   length: 1 },
    T_BRACE_OPEN    : { pattern: R_BRACE_OPEN,  length: 1 },
    T_BRACE_CLOSE   : { pattern: R_BRACE_CLOSE, length: 1 },
    // Not sure if we need epsilon here...
 // T_EPSILON       : { pattern: R_EPSILON,     length 0 },
    T_PAREN_OPEN    : { pattern: R_PAREN_OPEN,  length: 1 },
    T_PAREN_CLOSE   : { pattern: R_PAREN_CLOSE, length: 1 },
    T_EQUALS        : { pattern: R_EQUALS,      length: 1 },
    T_P             : { pattern: R_P,           length: 1 },
    T_QUOTE         : { pattern: R_QUOTE,       length: 1 },
    T_PLUS          : { pattern: R_PLUS,        length: 1 },
    T_MINUS         : { pattern: R_MINUS,       length: 1 },
    CT_NEW_LINE     : { pattern: R_NEW_LINE,    length: 1 },
    CT_SPACE        : { pattern: R_SPACE,       length: 1 },
    T_$             : { pattern: R_$,           length: 1 },
    
}

//-----------------------------------
// Token
//-----------------------------------
var Token = function(type, line, value){
    this.type   = type; // Any Token defined above
    this.line   = line; // The line number it appears on
    this.value  = value; // The chunk of source code
}