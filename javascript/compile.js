/**
 * @file Controls the flow of compilation. Cleans up input, runs Lexer, runs Parser
 * @author Ryan Sullivan
 * @version 20130226
 */
//Add event handlers to switch spacetree orientation.
function compile() {
    //----------------------
    // Setup
    //----------------------
    resetOutput();
    
    // First we need to get the input from the textarea
    var input   = document.getElementById('input');
    var source  = trim(input.value);
    
    // stop if there was no input
    if(source == '') {
        log('There was no input to compile.', 'error');
        displayOutput();
        return false;
    }
    
    //----------------------
    // Lexer
    //----------------------
    var tokenStream = lexer.lex(source);
    var tokenErrors = lexer.getErrors();
    
    // Output
    if(tokenErrors.length > 0) {
        highlightErrorLines(tokenErrors);
        return false; // stop execution here
    }
    
    // print out token stream to console
    console.log('Token Stream');
    for(token in tokenStream) {
        console.log(tokenStream[token]);
    }
    
    //----------------------
    // Parser
    //----------------------
    var parseResults = parser.parse(tokenStream);
    var parseErrors = parser.getErrors();
    
    // Output
    if(parseErrors.length > 0) {
        highlightErrorLines(parseErrors);
        return false; // stop execution here
    }
    
    
    //----------------------
    // Final Output
    //----------------------
    log('------------');
    log("Success!", 'success');
    log('------------');
    
    // Display Symbol Table
    var symbolTable = parser.getSymbolTable();
    log('&nbsp;');
    log('Symbol Table', 'info');
    
    printSymbolTable(symbolTable);
    
    displayOutput();
    
    showAST(parser.getAST());
    
    return true;
}

function showAST(ast) {
    var json = ast.toJSON();
    
    
    var st = new $jit.ST({
        //id of viz container element
        injectInto: 'ast',
        //set duration for the animation
        duration: 800,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 50,
        levelsToShow: 4,
	orientation: 'top',
        //enable panning
        Navigation: {
          enable:true,
          panning:true
        },
        
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 25,
            width: 65,
            type: 'rectangle',
            color: '#aaa',
            overridable: true
        },
        
        Edge: {
            type: 'bezier',
            overridable: true
        },
        
        onBeforeCompute: function(node){
            log("Reticulating Splines");
        },
        
        onAfterCompute: function(){
            log('<a href="#/show-ast">Display AST</a>');
        },
        
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;            
            label.innerHTML = node.name;
            label.onclick = function(){
                st.onClick(node.id);
            };
            
            //set label styles
            var style = label.style;
            style.width = 65 + 'px';
            style.height = 25 + 'px';            
            style.cursor = 'pointer';
            style.color = '#333';
            style.fontSize = '13px';
            style.textAlign= 'center';
            style.paddingTop = '5px';
        },
        
        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
            //add some color to the nodes in the path between the
            //root node and the selected node.
            if (node.selected) {
                node.data.$color = "#ff7";
            }
            else {
                delete node.data.$color;
                //if the node belongs to the last plotted level
                if(!node.anySubnode("exist")) {
                    //count children number
                    var count = 0;
                    node.eachSubnode(function(n) { count++; });
                    //assign a node color based on
                    //how many children it has
                    node.data.$color = ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count];                    
                }
            }
        },
        
        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = "#eed";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
    
    st.loadJSON(json);
    st.compute();
    st.geom.translate(new $jit.Complex(-200, 0), "current");
    st.onClick(st.root);
}


function printSymbolTable(symbolTable) {
    var prefix = '-';
    
    function printScope(scope) {
        //alert('new scope!');
        printSymbols(scope);
        
        log('------------------------------------');
        
        prefix += '-';
        for (var scopeIndex in scope.subScopes) {
            var subScope = scope.subScopes[scopeIndex];
            printScope(subScope);
        }
        prefix = prefix.substring(1);
    }
    
    function printSymbols(scope) {
        for(var symbolIndex in scope.symbols) {
            var symbol = scope.symbols[symbolIndex];
            var entry = prefix +
                ' <span class="success">' +
                    symbol.id +
                '</span>' +
                    ' | ' +
                '<span class="info">' +
                    symbol.type +
                '</span>' +
                    ' | ' +
                '<span class="info">' +
                    symbol.initialized +
                '</span>' +
                    ' | ' +
                '<span class="info">' +
                    symbol.used +
                '</span>';
            log(entry);
        }
    }
    
    printScope(symbolTable.root);
}