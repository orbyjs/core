import { VDom, isVDom } from "./vdom";
import { create, remove, append, replace, root } from "./dom";
export { h, isVDom } from "./vdom";

/**
 * Master is the mark to store the previous state
 * and if the node is controlled by one or more components
 */
export const MASTER = "__master__";
/**
 * Each time a component is removed from the dom,
 * the property is marked as true
 */
export const REMOVE = "__remove__";
/**
 * Special properties of virtual dom,
 * these are ignored from the diffProps process,
 * since it is part of the component's life cycle
 */
export const IGNORE = ["children", "create", "remove", "context", "state"];
/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {VDom} next - the next state of the node
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [child]  - the ancestor of the node
 * @param {Object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @returns {HTMLElement} - The current node
 */
export function render(next, parent, child, context, isSvg) {
    return diff(parent, child, next, context, isSvg);
}
/**
 * Gets the node's status mark
 * @param {HTMLElement} [base]
 * @return {object} - returns an object since the property associated
 *                    with the master in the whole diff is decomposed
 */
export function getMaster(base) {
    return (base && base[MASTER]) || {};
}
/**
 *
 * @param {Function} component  - Function that controls the node
 * @param {*} [currentState] - The initial state of the component
 * @param {Boolean} [isSvg] - Create components for a group of svg
 * @return {HTMLElement} - Returns the current component node
 */
export function createComponent(component, currentState, isSvg) {
    return function update(parent, base, props, context) {
        return (base = render(
            component(
                props,
                {
                    /**
                     * send a new status to update, to render the view
                     * @param {*} - New state
                     */
                    set: state => {
                        if (base[REMOVE]) return;
                        currentState = state;
                        base = update(parent, base, props, context);
                    },
                    get: () => currentState
                },
                context
            ),
            parent,
            base,
            context,
            isSvg
        ));
    };
}
/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [node]  - the ancestor of the node
 * @param {VDom} next - the next state of the node
 * @param {Object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @returns {HTMLElement} - The current node
 */

export function diff(parent, node, next, context = {}, isSvg) {
    next = isVDom(next) ? next : new VDom("", {}, [next || ""]);

    let base = node,
        { prev = new VDom(), components = new Map() } = getMaster(base),
        component,
        isCreate,
        addContext = next.props.context;

    context = addContext ? { ...context, ...addContext } : context;

    isSvg = next.tag === "svg" || isSvg;

    if (typeof next.tag === "function") {
        component = next.tag;
        if (!components.has(component)) {
            components.set(
                component,
                createComponent(component, next.props.state, isSvg)
            );
        }
        next = next.clone(prev.tag || (isSvg ? "g" : ""));
    }

    let children = next.props.children;

    if (next.tag !== prev.tag) {
        base = create(next.tag, isSvg);
        if (node) {
            if (!component && next.tag !== "") {
                let length = children.length;
                while (node.firstChild) {
                    if (!length--) break;
                    append(base, node.firstChild);
                }
            }
            replace(parent, base, node);
            emitRemove(node);
        } else {
            append(parent, base);
        }
        isCreate = true;
        next.emit("create", base);
    }
    if (component && components.has(component)) {
        return components.get(component)(parent, base, next.props, context);
    } else if (!next.tag) {
        if (prev.props.children[0] !== next.props.children[0]) {
            base.textContent = next.props.children[0];
        }
    } else {
        if (isCreate || next.emit("update", next.props, base) !== false) {
            diffProps(base, prev.props, next.props, isSvg);
            let childNodes = Array.from(root(base).childNodes),
                length = Math.max(childNodes.length, children.length);
            for (let i = 0; i < length; i++) {
                if (children[i]) {
                    diff(base, childNodes[i], children[i], context, isSvg);
                } else {
                    if (childNodes[i]) {
                        emitRemove(childNodes[i]);
                        remove(base, childNodes[i]);
                    }
                }
            }
        }
    }
    base[MASTER] = {
        prev: component ? getMaster(base).prev : next,
        components
    };

    next.emit(isCreate ? "created" : "updated", base);

    return base;
}
/**
 * Update or delete the attributes and events of a node
 * @param {HTMLElement} node - Node to assign changes
 * @param {Object} prev - Previous status of attributes
 * @param {Object} next - next status of attributes
 * @param {Boolean} [isSvg] - If it belongs to svg tree
 */
export function diffProps(node, prev, next, isSvg) {
    let prevKeys = Object.keys(prev),
        nextKeys = Object.keys(next).filter(
            key => prevKeys.indexOf(key) === -1
        ),
        keys = prevKeys.concat(nextKeys);

    for (let i = 0; i < keys.length; i++) {
        let prop = keys[i];

        if (prev[prop] === next[prop] || IGNORE.indexOf(prop) > -1) continue;

        let isFnPrev = typeof prev[prop] === "function",
            isFnNext = typeof next[prop] === "function";

        if (isFnPrev || isFnNext) {
            if (isFnPrev) node.removeEventListener(prop, prev[prop]);
            if (isFnNext) node.addEventListener(prop, next[prop]);
        } else if (prop in next) {
            if ((prop in node && !isSvg) || (isSvg && prop === "style")) {
                if (prop === "style") {
                    if (typeof next[prop] === "object") {
                        let prevStyle = prev[prop] || {},
                            nextStyle = next[prop];
                        for (let prop in nextStyle) {
                            if (prevStyle[prop] !== nextStyle[prop]) {
                                if (prop[0] === "-") {
                                    node.setProperty(prop, nextStyle[prop]);
                                } else {
                                    node.style[prop] = nextStyle[prop];
                                }
                            }
                        }
                        next[prop] = { ...prevStyle, ...nextStyle };
                    } else {
                        node.style.cssText = next[prop];
                    }
                } else {
                    node[prop] = next[prop];
                }
            } else {
                isSvg
                    ? node.setAttributeNS(null, prop, next[prop])
                    : node.setAttribute(prop, next[prop]);
            }
        } else {
            node.removeAttribute(prop);
        }
    }
}
/**
 * Issues the deletion of node and its children
 * @param {HTMLElement} base
 */
export function emitRemove(base) {
    let { prev = new VDom() } = getMaster(base),
        children = base.childNodes;
    base[REMOVE] = true;
    prev.emit("remove", base);
    for (let i = 0; i < children.length; i++) {
        emitRemove(children[i]);
    }
    prev.emit("removed", base);
}
