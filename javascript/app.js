/**
 * @file Initializes page and loads main functions
 * @author Ryan Sullivan
 * @version 20130226
 */

/** @global */
var api,
    lexer,
    parser,
    analysis,
    logLevel,
    continuous,
    SpaceTree;

$(document).ready(init);

/**
 * initializes Morph6502
 */
function init() {
    api = impress();
    api.init();
    setupKeyboardEvents();
    logLevel = 'normal';
    
    // Start animations while everything loads in
    if(window.location.hash == '' || window.location.hash == '#/step-1')
    {
        setTimeout(api.next, 500);
        
        setTimeout(function(){
            api.next();
        }, 2500);
    }
    
    // Format code input box
    $(".lined").linedtextarea();
    
    // Load Lexer
    lexer       = new Lexer();
    parser      = new Parser();
    analysis    = new SemanticAnalysis();
    
    // load graphics library
    initInfoVis();
}

/**
 * Enables all special keyboard events that the interface requires
 */
function setupKeyboardEvents() {
    $('#input').on('keydown', specialKeys);
}

/**
 * Handles keyboard events
 */
function specialKeys(event) {
    const TABKEY = 9;
    
    if(event.keyCode == TABKEY) {
        event.preventDefault();
        this.value += "    ";
    }
}

/**
 * Toggles verbose mode
 */
function setVerbose(event) {
    if(event.checked) {
        logLevel = 'verbose';
    } else {
        logLevel = 'normal';
    }
}

/**
 * Toggles continuous mode
 */
function setContinuous(event) {
    if (event.checked) {
        continuous = setInterval(compile, 500);
    } else {
        clearInterval(continuous);
    }
}

/**
 * Loads a test case into the editor
 */
function loadTest(event) {
    document.getElementById('input').value = Tests[event.id];
}

function initInfoVis() {
    SpaceTree = new $jit.ST({
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
        offsetY : 100,
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
        
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;            
            label.innerHTML = node.name;
            label.onclick = function(){
                SpaceTree.onClick(node.id);
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
}