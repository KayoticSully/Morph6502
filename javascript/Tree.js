/**
 * @file A tree object used in CST's and AST's
 * @author Ryan Sullivan
 * @version 20130226
 * 
 * Based on the modifications by Alan G. Labouseur
 * on the 2009 work by Michael Ardizzone and Tim Smith.
 */

/**
 * Houses a tree used for the AST
 * 
 * @class
 */
var Tree = function() {
    // ----------
    // Attributes
    // ----------
    this.root = null;  // Note the NULL root node of this tree.
    this.cur = {};     // Note the EMPTY current node of the tree we're building.
}

/**
 * Single unit of the Tree
 * 
 * @class
 */
var Node = function(name, token) {
    this.name = name;
    this.token = token;
    this.children = [];
    this.parent = {};
}

/**
* Add a node: kind in {branch, leaf}.
* 
* @param {string} name of node
* @param {kind} branch or leaf
*/
Tree.prototype.addNode = function(name, kind, token) {
    // Construct the node object.
    var node = new Node(name, token);

    // Check to see if it needs to be the root node.
    if ( (this.root == null) || (!this.root) )
    {
        // We are the root node.
        this.root = node;
    }
    else
    {
        // We are the children.
        // Make our parent the CURrent node...
        node.parent = this.cur;
        // ... and add ourselves (via the unfrotunately-named
        // "push" function) to the children array of the current node.
        this.cur.children.push(node);
    }
    
    // If we are an interior/branch node, then...
    if (kind == "branch")
    {
        // ... update the CURrent node pointer to ourselves.
        this.cur = node;
    }
}
/**
* Note that we're done with this branch of the tree...
*/
Tree.prototype.endChildren = function() {
    // ... by moving "up" to our parent node (if possible).
    if ((this.cur.parent !== null) && (this.cur.parent.name !== undefined))
    {
        this.cur = this.cur.parent;
    }
    else
    {
        // TODO: Some sort of error logging.
        // This really should not happen, but it will, of course.
    }
}

/**
* Return a string representation of the tree.
*/
Tree.prototype.toString = function() {
    // Initialize the result string.
    var traversalResult = "";

    // Recursive function to handle the expansion of the nodes.
    function expand(node, depth)
    {
        // Space out based on the current depth so
        // this looks at least a little tree-like.
        for (var i = 0; i < depth; i++)
        {
            traversalResult += "-";
        }

        // If there are no children (i.e., leaf nodes)...
        if (!node.children || node.children.length === 0)
        {
            // ... note the leaf node.
            traversalResult += "[" + node.name + "]";
            traversalResult += "\n";
        }
        else
        {
            // There are children, so note these interior/branch nodes and ...
            traversalResult += "<" + node.name + "> \n";
            // .. recursively expand them.
            for (var i = 0; i < node.children.length; i++)
            {
                expand(node.children[i], depth + 1);
            }
        }
    }
    // Make the initial call to expand from the root.
    expand(this.root, 0);
    // Return the result.
    return traversalResult;
}

/**
* Return a string representation of the tree.
*/
Tree.prototype.toJSON = function() {
    var id = 0;
    function follow(node) {
        var result = {};
        result.id = id++;
        result.name = node.name;
        result.children = [];
        
        for (var index in node.children) {
            result.children.push(follow(node.children[index]));
        }
        
        return result;
    }
    
    return follow(this.root);
}