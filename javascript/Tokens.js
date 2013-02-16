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
    T_DIGIT           = 'T_DIGIT',
    T_CHARACTER       = 'T_CHARACTER',
    T_INT             = 'T_INT',
    T_CHAR            = 'T_CHAR',
    T_BRACE_OPEN      = 'T_BRACE_OPEN',
    T_BRACE_CLOSE     = 'T_BRACE_CLOSE',
    T_EPSILON         = 'T_EPSILON',
    T_PAREN_OPEN      = 'T_PAREN_OPEN',
    T_PAREN_CLOSE     = 'T_PAREN_CLOSE',
    T_EQUALS          = 'T_EQUALS',
    T_P               = 'T_P', // couldn't resist
    T_QUOTE           = 'T_QUOTE',
    T_$               = 'T_$',
    T_PLUS            = 'T_PLUS',
    T_MINUS           = 'T_MINUS';

//-----------------------------------
// All Tokens / Terminals RegEx
//-----------------------------------
const
    R_DIGIT           = /^[0-9]$/,
    R_CHARACTER       = /^[a-zA-Z]$/,
    R_INT             = /^int$/,
    R_CHAR            = /^char$/,
    R_BRACE_OPEN      = /^[{]$/,
    R_BRACE_CLOSE     = /^[}]$/,
    R_EPSILON         = /^[]$/, // ???
    R_PAREN_OPEN      = /^[(]$/,
    R_PAREN_CLOSE     = /^[)]$/,
    R_EQUALS          = /^[=]$/,
    R_P               = /^[P]$/,
    R_QUOTE           = /^["|']$/,
    R_$               = /^[$]$/,
    R_PLUS            = /^[+]$/,
    R_MINUS           = /^[-]$/;

