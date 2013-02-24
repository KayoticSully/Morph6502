/**
 * @file Random functions that are usefull anywhere
 * @author Ryan Sullivan
 * @version 20130223
 */

/**
 * Alan's Trim
 *
 * @param {String} src String to trim
 * @returns {String} src with no whitespace on either side.
 */
function trim(str) // Use a regular expression to remove leading and trailing spaces.
{
    // I removed the whitespace on either side of the OR "|" operator.
    // It was messing up if the only space was a newline character.
    return str.replace(/^\s+|\s+$/g, "");
    /* 
	Huh?  Take a breath.  Here we go:
	- The "|" separates this into two expressions, as in A or B.
	- "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
        - "\s+$" is the same thing, but at the end of the string.
        - "g" makes is global, so we get all the whitespace.
        - "" is nothing, which is what we replace the whitespace with.
    */
}