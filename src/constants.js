/**
 * constant for the list of components associated with the node
 */
export const COMPONENTS = "__COMPONENTS__";

/**
 * constant to store the previous vtag
 */
export const PREVIOUS = "__PREVIOUS__";
/**
 * CSS does not change the style based on an iteration since
 * each mutation is a mutation in the sun. instead of this
 * it creates a string style, to generate a single mutation,
 * this string is stored in the node associating it with this constant
 */
export const PREVIOUS_CSS_TEXT = "__PREVIOUS_CSS__";
/**
 * constant to mark the deletion of a node
 */
export const REMOVE = "__REMOVE__";
/**
 * Constant to mark events within a node
 */
export const HANDLERS = "__HANDLERS__";

/**
 * Special properties of virtual dom,
 * these are ignored from the updateProperties process,
 * since it is part of the component's life cycle
 */

export const IGNORE = /^(context|children|(on){1}(Create|Update|Remove)(d){0,1}|xmlns|key|ref)$/;
/**
 *The createClass function uses this constant to define the context prefix
 */
export const CONTEXT = "__CONTEXT__";
