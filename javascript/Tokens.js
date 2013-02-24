/**
 * @file Houses all Token constants and the Token prototype
 * @author Ryan Sullivan
 * @version 20130223
 */

//-----------------------------------
// All Tokens / Terminals
//-----------------------------------
const
    T_INT             = 'T_INT',            /** @constant {String} T_INT */
    T_CHAR            = 'T_CHAR',           /** @constant {String} T_CHAR */
    T_DIGIT           = 'T_DIGIT',          /** @constant {String} T_DIGIT */
    T_CHARACTER       = 'T_CHARACTER',      /** @constant {String} T_CHARACTER */
    T_BRACE_OPEN      = 'T_BRACE_OPEN',     /** @constant {String} T_BRACE_OPEN */
    T_BRACE_CLOSE     = 'T_BRACE_CLOSE',    /** @constant {String} T_BRACE_CLOSE */
    T_EPSILON         = 'T_EPSILON',        /** @constant {String} T_EPSILON */
    T_PAREN_OPEN      = 'T_PAREN_OPEN',     /** @constant {String} T_PAREN_OPEN */
    T_PAREN_CLOSE     = 'T_PAREN_CLOSE',    /** @constant {String} T_PAREN_CLOSE */
    T_EQUALS          = 'T_EQUALS',         /** @constant {String} T_EQUALS */
    T_P               = 'T_P',              /** @constant {String} T_P */
    T_QUOTE           = 'T_QUOTE',          /** @constant {String} T_QUOTE */
    T_PLUS            = 'T_PLUS',           /** @constant {String} T_PLUS */
    T_MINUS           = 'T_MINUS',          /** @constant {String} T_MINUS */
    T_$               = 'T_$',              /** @constant {String} T_$ */
    // Control Tokens
    CT_NEW_LINE       = 'CT_NEW_LINE';      /** @constant {String} CT_NEW_LINE */
    CT_SPACE          = 'CT_SPACE';         /** @constant {String} CT_SPACE */

//-----------------------------------
// All Tokens / Terminals RegEx
//-----------------------------------
// RegEx's use the start symbol "^" since
// each regex will be run to find the token
// at the start of the source string.  No
// end symbol "$" is used since there may
// be source code after the symbol.
const
    R_INT             = /^int/,             /** @constant {Pattern} R_INT */
    R_CHAR            = /^char/,            /** @constant {Pattern} R_CHAR */
    R_DIGIT           = /^[0-9]/,           /** @constant {Pattern} R_DIGIT */
    R_CHARACTER       = /^[a-z]/,           /** @constant {Pattern} R_CHARACTER */
    R_BRACE_OPEN      = /^[{]/,             /** @constant {Pattern} R_BRACE_OPEN */
    R_BRACE_CLOSE     = /^[}]/,             /** @constant {Pattern} R_BRACE_CLOSE */
    R_EPSILON         = /^[]/, // ???       /** @constant {Pattern} R_EPSILON */
    R_PAREN_OPEN      = /^[(]/,             /** @constant {Pattern} R_PAREN_OPEN */
    R_PAREN_CLOSE     = /^[)]/,             /** @constant {Pattern} R_PAREN_CLOSE */
    R_EQUALS          = /^[=]/,             /** @constant {Pattern} R_EQUALS */
    R_P               = /^[P]/,             /** @constant {Pattern} R_P */
    R_QUOTE           = /^["|']/,           /** @constant {Pattern} R_QUOTE */
    R_PLUS            = /^[+]/,             /** @constant {Pattern} R_PLUS */
    R_MINUS           = /^[-]/,             /** @constant {Pattern} R_MINUS */
    R_$               = /^[$]/,             /** @constant {Pattern} R_$ */
    R_NEW_LINE        = /^(\n)(\r)?/;       /** @constant {Pattern} R_NEW_LINE */
    R_SPACE           = /^\s/;              /** @constant {Pattern} R_SPACE */

/**
 * Order of importance to the Lexer
 * 
 * @constant
 * @type {Object}
 */
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
 // T_EPSILON       : { pattern: R_EPSILON,     length 0 }, // Not sure if we need epsilon here...
    T_PAREN_OPEN    : { pattern: R_PAREN_OPEN,  length: 1 },
    T_PAREN_CLOSE   : { pattern: R_PAREN_CLOSE, length: 1 },
    T_EQUALS        : { pattern: R_EQUALS,      length: 1 },
    T_P             : { pattern: R_P,           length: 1 },
    T_QUOTE         : { pattern: R_QUOTE,       length: 1 },
    T_PLUS          : { pattern: R_PLUS,        length: 1 },
    T_MINUS         : { pattern: R_MINUS,       length: 1 },
    CT_NEW_LINE     : { pattern: R_NEW_LINE,    length: 1 },
    CT_SPACE        : { pattern: R_SPACE,       length: 1 },
    T_$             : { pattern: R_$,           length: 1 }
}

/**
 * Represents a single token
 * 
 * @class
 * @author Ryan Sullivan
 * @version 20130219
 */
var Token = function(){
    this.type   = null; // Any Token defined above
    this.line   = -1;   // The line number it appears on
    this.value  = '';   // The chunk of source code
}