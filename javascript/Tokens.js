/**
 * @file Houses all Token constants and the Token prototype
 * @author Ryan Sullivan
 * @version 20130502
 */

//-----------------------------------
// All Tokens / Terminals
//-----------------------------------
const
    T_INT             = 'T_INT',            /** @constant {String} T_INT */
    T_STRING          = 'T_STRING',         /** @constant {String} T_STRING */
    T_DIGIT           = 'T_DIGIT',          /** @constant {String} T_DIGIT */
    T_CHARACTER       = 'T_CHARACTER',      /** @constant {String} T_CHARACTER */
    T_BRACE_OPEN      = 'T_BRACE_OPEN',     /** @constant {String} T_BRACE_OPEN */
    T_BRACE_CLOSE     = 'T_BRACE_CLOSE',    /** @constant {String} T_BRACE_CLOSE */
    T_EPSILON         = 'T_EPSILON',        /** @constant {String} T_EPSILON */
    T_PAREN_OPEN      = 'T_PAREN_OPEN',     /** @constant {String} T_PAREN_OPEN */
    T_PAREN_CLOSE     = 'T_PAREN_CLOSE',    /** @constant {String} T_PAREN_CLOSE */
    T_EQUALITY        = 'T_EQUALITY',       /** @constant {String} T_EQUALITY */
    T_EQUALS          = 'T_EQUALS',         /** @constant {String} T_EQUALS */
    T_PRINT           = 'T_PRINT',          /** @constant {String} T_PRINT */
    T_WHILE           = 'T_WHILE',          /** @constant {String} T_WHILE */
    T_IF              = 'T_IF',             /** @constant {String} T_IF */
    T_BOOLEAN         = 'T_BOOLEAN',        /** @constant {String} T_BOOLEAN */
    T_TRUE            = 'T_TRUE',           /** @constant {String} T_TRUE */
    T_FALSE           = 'T_FALSE',          /** @constant {String} T_FALSE */
    T_QUOTE           = 'T_QUOTE',          /** @constant {String} T_QUOTE */
    T_PLUS            = 'T_PLUS',           /** @constant {String} T_PLUS */
    T_MINUS           = 'T_MINUS',          /** @constant {String} T_MINUS */
    T_SPACE           = 'T_SPACE',          /** @constant {String} T_SPACE */
    T_$               = 'T_$',              /** @constant {String} T_$ */
    // Control Tokens
    CT_NEW_LINE       = 'CT_NEW_LINE',      /** @constant {String} CT_NEW_LINE */
    ST_DECLARATION    = 'ST_DECLARATION';   /** @constant {String} ST_DECLARATION */

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
    R_STRING          = /^string/,          /** @constant {Pattern} R_STRING */
    R_DIGIT           = /^[0-9]/,           /** @constant {Pattern} R_DIGIT */
    R_CHARACTER       = /^[a-z]/,           /** @constant {Pattern} R_CHARACTER */
    R_BRACE_OPEN      = /^[{]/,             /** @constant {Pattern} R_BRACE_OPEN */
    R_BRACE_CLOSE     = /^[}]/,             /** @constant {Pattern} R_BRACE_CLOSE */
    R_EPSILON         = /^[]/,              /** @constant {Pattern} R_EPSILON */
    R_PAREN_OPEN      = /^[(]/,             /** @constant {Pattern} R_PAREN_OPEN */
    R_PAREN_CLOSE     = /^[)]/,             /** @constant {Pattern} R_PAREN_CLOSE */
    R_EQUALITY        = /^==/,              /** @constant {Pattern} R_EQUALITY */
    R_EQUALS          = /^[=]/,             /** @constant {Pattern} R_EQUALS */
    R_PRINT           = /^print/,           /** @constant {Pattern} R_PRINT */
    R_WHILE           = /^while/,           /** @constant {Pattern} R_PRINT */
    R_IF              = /^if/,              /** @constant {Pattern} R_IF */
    R_BOOLEAN         = /^boolean/,         /** @constant {Pattern} R_BOOLEAN */
    R_TRUE            = /^true/,            /** @constant {Pattern} R_TRUE */
    R_FALSE           = /^false/,           /** @constant {Pattern} R_FALSE */
    R_QUOTE           = /^["|']/,           /** @constant {Pattern} R_QUOTE */
    R_PLUS            = /^[+]/,             /** @constant {Pattern} R_PLUS */
    R_MINUS           = /^[-]/,             /** @constant {Pattern} R_MINUS */
    R_SPACE           = /^\s/,              /** @constant {Pattern} R_SPACE */
    R_$               = /^[$]/,             /** @constant {Pattern} R_$ */
    R_NEW_LINE        = /^(\n)(\r)?/;       /** @constant {Pattern} R_NEW_LINE */

/**
 * Order of importance to the Lexer
 * 
 * @constant
 * @type {Object}
 */
var Tokens = {
    // Reserved words need to go first, otherwise each
    // character will get identified as T_CHARACTER tokens
    T_INT           : { pattern: R_INT,         length: 3,      name: 'Integer'     },
    T_STRING        : { pattern: R_STRING,      length: 6,      name: 'String'      },
    T_PRINT         : { pattern: R_PRINT,       length: 5,      name: 'Print'       },
    T_WHILE         : { pattern: R_WHILE,       length: 5,      name: 'While'       },
    T_IF            : { pattern: R_IF,          length: 2,      name: 'If'          },
    T_BOOLEAN       : { pattern: R_BOOLEAN,     length: 7,      name: 'Boolean'     },
    T_TRUE          : { pattern: R_TRUE,        length: 4,      name: 'True'        },
    T_FALSE         : { pattern: R_FALSE,       length: 5,      name: 'False'       },
    // Now all other symbols
    T_DIGIT         : { pattern: R_DIGIT,       length: 1,      name: 'Digit'       },
    T_CHARACTER     : { pattern: R_CHARACTER,   length: 1,      name: 'Character'   },
    T_BRACE_OPEN    : { pattern: R_BRACE_OPEN,  length: 1,      name: '{'           },
    T_BRACE_CLOSE   : { pattern: R_BRACE_CLOSE, length: 1,      name: '}'           },
    T_PAREN_OPEN    : { pattern: R_PAREN_OPEN,  length: 1,      name: '('           },
    T_PAREN_CLOSE   : { pattern: R_PAREN_CLOSE, length: 1,      name: ')'           },
    T_EQUALITY      : { pattern: R_EQUALITY,    length: 2,      name: '=='          },
    T_EQUALS        : { pattern: R_EQUALS,      length: 1,      name: '='           },
    T_QUOTE         : { pattern: R_QUOTE,       length: 1,      name: 'Quote'       },
    T_PLUS          : { pattern: R_PLUS,        length: 1,      name: '+'           },
    T_MINUS         : { pattern: R_MINUS,       length: 1,      name: '-'           },
    CT_NEW_LINE     : { pattern: R_NEW_LINE,    length: 1,      name: 'New Line'    }, // must appear before T_SPACE
    
    T_SPACE         : { pattern: R_SPACE,       length: 1,      name: '[Space]'     },
    T_$             : { pattern: R_$,           length: 1,      name: '$'           },
    ST_DECLARATION  : { pattern: false,         length: 0,      name: 'Var Decl'    },
    false           : { name: 'false' }
};

/**
 * Represents a single token
 * 
 * @class
 * @author Ryan Sullivan
 * @version 20130219
 */
var Token = function() {
    this.type   = null; // Any Token defined above
    this.line   = -1;   // The line number it appears on
    this.value  = '';   // The chunk of source code
    
    Object.defineProperty(this, 'name', {
        writeable       : false,
        enumerable      : false,
        get             : function() {
            return Tokens[this.type].name;
        }
    });
}