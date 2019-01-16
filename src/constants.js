/**
 * constant for the list of components associated with the node
 */
export const COMPONENTS = "__COMPONENTS__";

/**static_render
 * this variable allows the hydration of components
export const STATIC_RENDER = "__STATIC_RENDER__";
*/

/**
 * constant to store the previous vtag
 */
export const PREVIOUS = "__PREVIOUS__";
/**
 *
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
